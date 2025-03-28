import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Cria uma instância do servidor MCP
const server = new McpServer({
    name: "sakamoto",
    version: "1.0.0",
});

// Adiciona uma ferramenta de adição
server.tool("add", { a: z.number(), b: z.number() },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }],
    })
);

// Inicia o servidor utilizando o transporte stdio
const transport = new StdioServerTransport();
await server.connect(transport);
