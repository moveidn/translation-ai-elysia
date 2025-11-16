// Ambil argument CLI dari Bun.argv
const portArg = Bun.argv.find((a) => a.startsWith("--port="));
const cliPort = portArg ? Number(portArg.split("=")[1]) : undefined;

export const env = {
  ENVIRONMENT: Bun.env.ENVIRONMENT!,
  SUPABASE_URL: Bun.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: Bun.env.SUPABASE_ANON_KEY!,
  DATABASE_URL: Bun.env.DATABASE_URL!,
  OPENAI_API_KEY: Bun.env.OPENAI_API_KEY!,
  OPENAI_API_MARGIN: Bun.env.OPENAI_API_MARGIN!,
  OPENAI_API_FREE_BALANCE: Bun.env.OPENAI_API_FREE_BALANCE!,
  JWT_SECRET: Bun.env.JWT_SECRET ?? "default-secret",

  // PRIORITAS:
  // 1. CLI arg (--port=xxxx)
  // 2. ENV var (Bun.env.PORT)
  // 3. fallback 3000
  PORT: cliPort ?? Number(Bun.env.PORT ?? 3000),
};
