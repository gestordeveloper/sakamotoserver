import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import cors from "cors";
import Invoice from "./Models/Invoice.js";
import Customer from "./Models/Customer.js";

const server = new McpServer({
    name: "sakamoto_server",
    version: "1.0.0",
});

server.tool(
    "sendToManager",
    { content: z.string() },
    async ({ content }) => ({
        content: [{ type: "text", text: `Olá gerente! Segue aqui as informações do atendimento. ${content}` }],
    })
);

server.tool(
    "creatingLeadInCrm",
    { name: z.string(), surname: z.string(), phone: z.string(), notes: z.string() },
    async ({ name, surname, phone, notes }) => {
            let data = {
                action: "create",
                funnel_id: "40",
                stage_id: "213",
                first_name: name,
                last_name: surname,
                telephone: phone,
                activity: notes
            }

            const customer = new Customer();
            const response = await customer.store(data);

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(response)
                    }
                ]
            }
    }
);

server.tool(
    "getBalance",
    { wallet: z.string() },
    async ({ wallet }) => {
            const invoice = new Invoice();
            const response = await invoice.wallets("278");

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(response.wallet),
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
            { name: "sendToManager", description: "Envia as informações do atendimento para o Gerente" },
            { name: "creatingLeadInCrm", description: "Cadastra os dados do lead capturados no atendimento/qualificação no CRM Payxe" },
            { name: "getBalance", description: "Retorna o balanço/caixa do financeiro da empresa." },
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
