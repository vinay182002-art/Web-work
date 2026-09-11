/**
 * Authentication boundary for the future Supabase Auth adapter.
 * Keep email/Google credentials server-managed; never place provider secrets
 * in the browser bundle.
 */
export const auth = {
  async getCurrentUser() {
    return null;
  },
  async signInWithEmail() {
    throw new Error('Supabase Auth is not configured in this local foundation.');
  },
  async signInWithGoogle() {
    throw new Error('Supabase Auth is not configured in this local foundation.');
  },
  async signOut() {
    return undefined;
  }
};
