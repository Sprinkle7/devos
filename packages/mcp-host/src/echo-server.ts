#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "devaios-echo",
  version: "0.3.0",
});

server.tool(
  "echo",
  "Echo a message back (DEVAIOS fixture MCP server)",
  { message: z.string().describe("Text to echo") },
  async ({ message }) => ({
    content: [{ type: "text" as const, text: `echo: ${message}` }],
  }),
);

server.tool(
  "ping",
  "Health ping for DEVAIOS MCP host",
  {},
  async () => ({
    content: [{ type: "text" as const, text: "pong" }],
  }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
