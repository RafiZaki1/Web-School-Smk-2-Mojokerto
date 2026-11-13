// Query key auth. Dipakai hook dan invalidasi cache agar tetap konsisten.
export const authKeys = {
  profile: () => ["auth", "profile"] as const,
};
