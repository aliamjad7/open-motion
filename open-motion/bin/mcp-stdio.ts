#!/usr/bin/env node
/**
 * OpenMotion MCP stdio entrypoint — boots the shared SQLite store and
 * exposes every OpenMotion tool over the Model Context Protocol's stdio
 * transport, for use as a local MCP server (e.g. from Claude Desktop or
 * any other MCP-compatible client configured to spawn this binary).
 *
 * Mirrors the bootstrap sequence in src/index.ts (dirs + migrations) but
 * skips starting the HTTP server, since stdio clients talk to this process
 * directly over stdin/stdout.
 */
import { ensureDirs } from "../src/db/index.js";
import { migrate } from "../src/db/migrate.js";
import { logger } from "../src/utils/logger.js";
import { createMcpServer } from "../src/mcp/server.js";
import { startStdio } from "../src/mcp/transport-stdio.js";

async function main(): Promise<void> {
  process.on("uncaughtException", (err) => {
    logger.error("uncaughtException", { stack: err?.stack ?? String(err) });
  });
  process.on("unhandledRejection", (reason) => {
    logger.error("unhandledRejection", { reason: String(reason) });
  });

  ensureDirs();
  migrate();

  const server = createMcpServer();
  await startStdio(server);
}

main().catch((err) => {
  logger.error("fatal startup error", { stack: err?.stack ?? String(err) });
  process.exit(1);
});
