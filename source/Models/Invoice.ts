import Connection from "../Core/Connection.js";
import { CONF_PAYXE_API_EMAIL, CONF_PAYXE_API_PASSWORD } from "../Boot/Config.js";

export default class Invoice
{
    async store(data: {}): Promise<void>
    {
        try {
            const api = new Connection();
            const options = {
                headers: {
                    email: CONF_PAYXE_API_EMAIL,
                    password: CONF_PAYXE_API_PASSWORD,
                }
            }

            const response = await api.post(`/invoices`, data, options);
            return response.data;
        } catch (error: any) {
            if(error.response) {
                return error.response.data;
            }
        }
    }

    async wallets(id: string)
    {
        try {
            const api = new Connection();
            const options = {
                headers: {
                    email: CONF_PAYXE_API_EMAIL,
                    password: CONF_PAYXE_API_PASSWORD,
                }
            }

            const response = await api.get(`/wallets/${id}`, options);
            return response.data;
        } catch (error: any) {
            if(error.response) {
                return error.response.data;
            }
        }
    }
}