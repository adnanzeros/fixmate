// fixmath/src/lib/auth.js
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';
import { jwt } from 'better-auth/plugins';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.MONGODB_DB || 'fixmate');

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const baseURL = process.env.BETTER_AUTH_URL || appUrl;

// The Express server (port 5000) verifies every token against this exact origin,
// so issuer and audience are set explicitly instead of relying on defaults.
const tokenOrigin = new URL(baseURL).origin;

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,

  // Add your production domain here (NEXT_PUBLIC_APP_URL) before deploying
  trustedOrigins: [appUrl, 'http://localhost:3000'],

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
    },
  },

  plugins: [
    // Issues the JWT that the Express server verifies (verifyToken middleware).
    // JWKS endpoint: <BETTER_AUTH_URL>/api/auth/jwks
    jwt({
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