import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import cors from "cors";

const server = new McpServer({
    name: "sakamoto_server",
    version: "1.0.0",
});

server.tool(
    "hello",
    { name: z.string() },
    async ({ name }) => ({
        content: [{ type: "text", text: `Olá ${name}, muito prazer!` }],
    })
);

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        credentials: false,
    })
);

app.get("/", (req, res) => {
    res.json({
        name: "Sakamoto Server",
        version: "1.0.0",
        status: "running",
        endpoints: {
            "/": "Server information (this response)",
            "/sse": "Server-Sent Events endpoint for MCP connection",
            "/messages": "POST endpoint for MCP messages",
        },
        tools: [
            { name: "hello", description: "Faz uma saudação calorosa" },
        ],
    });
});

let transport: SSEServerTransport;

app.get("/sse", async (req, res) => {
    transport = new SSEServerTransport("/messages", res);
    await server.connect(transport);
});

app.post("/messages", async (req, res) => {
    await transport.handlePostMessage(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`MCP SSE Sakamoto Server running on port ${PORT}`);
});
