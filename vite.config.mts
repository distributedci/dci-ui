import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || "/",
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    outDir: "build",
  },
  test: {
    include: ["./**/*.test.ts", "./**/*.test.tsx"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setupTests.ts"],
  },
});
