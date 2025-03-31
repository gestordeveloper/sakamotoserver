// test-tools.js
import fetch from 'node-fetch';
import Invoice from "./dist/Models/Invoice.js";

// URL do seu servidor local
const baseURL = 'http://localhost:3000/messages';

async function testSendToManager() {
    const payload = {
        tool: "send_to_manager",
        input: {
            content: "O cliente deseja reagendar o atendimento para amanhã às 10h."
        }
    };

    const res = await fetch(baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const json = await res.json();
    console.log("🔹 Resultado send_to_manager:\n", json);
}

async function testCreatingLead() {
    const payload = {
        tool: "creating_lead_in_crm",
        input: {
            name: "Maria",
            surname: "Silva",
            phone: "11987654321",
            notes: "Cliente interessada no plano Premium."
        }
    };

    const res = await fetch(baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const json = await res.json();
    console.log("🔹 Resultado creating_lead_in_crm:\n", json);
}

async function testGetBalance() {
    const payload = {
        tool: "get_balance",
        input: {}
    };

    const res = await fetch(baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const json = await res.json();
    console.log("🔹 Resultado get_balance:\n", json);
}

async function runTests() {
    console.log("⏳ Testando ferramentas MCP...");
    const invoice = new Invoice();
    const response = await invoice.wallets("278");

    console.log(response);

    // await testSendToManager();
    // await testCreatingLead();
    // await testGetBalance();
    console.log("✅ Testes finalizados!");
}

runTests();
