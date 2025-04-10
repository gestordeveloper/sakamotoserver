import Connection from "../Core/Connection.js";
import { CONF_VAPZAP_API_URL } from "../Boot/Config.js";

export default class Vapzap
{
    async text(instance: string, apikey: string, data: {}): Promise<void>
    {
        try {
            const api = new Connection(CONF_VAPZAP_API_URL);
            const options = {
                headers: {
                    apikey: apikey
                }
            }

            const response = await api.post(`/message/sendText/${instance}`, data, options);
            return response.data;
        } catch (error: any) {
            if(error.response) {
                return error.response.data;
            }
        }
    }
}