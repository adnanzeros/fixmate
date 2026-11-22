// lib/auth-client.js
import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';

// No baseURL on purpose: the browser talks to the SAME origin that served the page
// (/api/auth/...). It works on localhost, the production domain and Vercel preview URLs
// without any env variable.
export const authClient = createAuthClient({
  plugins: [jwtClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
