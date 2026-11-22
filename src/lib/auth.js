// fixmath/src/lib/auth.js
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';
import { jwt } from 'better-auth/plugins';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.MONGODB_DB || 'fixmate');

const strip = u =>
  String(u || '')
    .trim()
    .replace(/\/+$/, '');
const withProtocol = u => (u && !/^https?:\/\//.test(u) ? `https://${u}` : u);

const appUrl =
  strip(process.env.NEXT_PUBLIC_APP_URL) ||
  strip(withProtocol(process.env.VERCEL_PROJECT_PRODUCTION_URL)) ||
  'http://localhost:3000';
const baseURL = strip(process.env.BETTER_AUTH_URL) || appUrl;

// Every origin that may call BetterAuth: your production domain, localhost, the current
// Vercel deployment and anything listed in TRUSTED_ORIGINS (comma separated).
const trustedOrigins = [
  ...new Set(
    [
      appUrl,
      baseURL,
      'http://localhost:3000',
      withProtocol(process.env.VERCEL_URL),
      withProtocol(process.env.VERCEL_BRANCH_URL),
      ...(process.env.TRUSTED_ORIGINS || '').split(','),
    ]
      .map(strip)
      .filter(Boolean),
  ),
];

// The Express server (port 5000) verifies every token against this exact origin,
// so issuer and audience are set explicitly instead of relying on defaults.
const tokenOrigin = new URL(baseURL).origin;

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },

  // Optional Google login: turned on only when both Google keys are set in .env.local
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'customer',
        input: true,
      },
      phone: { type: 'string', required: false, input: true },
      area: { type: 'string', required: false, input: true },
      bio: { type: 'string', required: false, input: true },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Server-side rule: only 'customer' or 'technician' can be chosen at sign up.
        // Anything else (including 'admin') becomes 'customer'.
        before: async user => {
          const role = user.role === 'technician' ? 'technician' : 'customer';
          return { data: { ...user, role } };
        },
      },
      update: {
        // `role` is an input field (needed at sign up), so without this a logged-in user
        // could call BetterAuth's update-user endpoint and make THEMSELVES admin.
        // Roles are changed only by the admin API on the Express server.
        before: async data => {
          const { role, ...safe } = data;
          return { data: safe };
        },
      },
    },
  },

  plugins: [
    // Issues the JWT that the Express server verifies (verifyToken middleware).
    // JWKS endpoint: <BETTER_AUTH_URL>/api/auth/jwks
    jwt({
      // BetterAuth normally signs a JWT on EVERY getSession() call (layouts, pages).
      // A bad key in the jwks collection then crashes every page. The token is still
      // created when the client asks for it (authClient.token()), which is all we need.
      disableSettingJwtHeader: true,
      // Local and production share one database but may use different secrets. Without
      // encryption the stored key never depends on BETTER_AUTH_SECRET, so the
      // "Failed to decrypt private key" error cannot come back.
      jwks: { disablePrivateKeyEncryption: true },
      jwt: {
        issuer: tokenOrigin,
        audience: tokenOrigin,
        expirationTime: '7d',
        definePayload: ({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role ?? 'customer',
        }),
      },
    }),
    nextCookies(), // keep last
  ],
});
