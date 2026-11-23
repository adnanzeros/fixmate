// fixmate/src/lib/auth.js

import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';
import { jwt } from 'better-auth/plugins';
import { MongoClient } from 'mongodb';

const dbName = process.env.MONGODB_DB || 'fixmate';
const g = globalThis;

// One shared client per server instance. If its topology gets closed (for example
// after a failed first connection), the next call creates a fresh client.
function liveClient() {
  if (!g.__fixmateMongoClient) {
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 5,
      maxIdleTimeMS: 30000,
    });
    client.on('topologyClosed', () => {
      if (g.__fixmateMongoClient === client) g.__fixmateMongoClient = undefined;
    });
    g.__fixmateMongoClient = client;
  }
  return g.__fixmateMongoClient;
}

// Better Auth keeps this object, but every call goes to the current healthy client
const db = new Proxy(
  {},
  {
    get(_target, prop) {
      const real = liveClient().db(dbName);
      const value = real[prop];
      return typeof value === 'function' ? value.bind(real) : value;
    },
  },
);

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

// the server (Express) checks the JWT issuer/audience against this same origin
const tokenOrigin = new URL(baseURL).origin;

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },

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
        // nobody can register as admin: anything except 'technician' becomes 'customer'
        before: async user => {
          const role = user.role === 'technician' ? 'technician' : 'customer';
          return { data: { ...user, role } };
        },
      },
      update: {
        // role can never be changed through the auth API (admin uses the Express API)
        before: async data => {
          const { role, ...safe } = data;
          return { data: safe };
        },
      },
    },
  },

  plugins: [
    jwt({
      disableSettingJwtHeader: true,
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