import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import cors from "cors";
import Invoice from "./Models/Invoice.js";

const server = new McpServer({
    name: "sakamoto_server",
    version: "1.0.0",
});

server.tool(
    "send_to_manager",
    { content: z.string() },
    async ({ content }) => ({
        content: [{ type: "text", text: `Olá gerente! Segue aqui as informações do atendimento. ${content}` }],
    })
);

server.tool(
    "creating_lead_in_crm",
    { name: z.string(), surname: z.string(), phone: z.string(), notes: z.string() },
    async ({ name, surname, phone, notes }) => ({
        content: [{ type: "text", text: `${name} ${surname} com o telefone ${phone}. Obs: ${notes}` }],
    })
);

server.tool(
    "get_balance",
    {},
    async () => {
            const invoice = new Invoice();
            const response = invoice.wallets("278");

            return {
                content: [
                    {
                        type: "text",
                        text: `Balanço geral da empresa`,
                    }
                ]
            }
        }
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
            { name: "send_to_manager", description: "Envia as informações do atendimento para o Gerente" },
            { name: "creating_lead_in_crm", description: "Cadastra os dados do lead capturados no atendimento no CRM Payxe" },
            { name: "get_balance", description: "Retorna o balanço do financeiro da empresa." },
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
