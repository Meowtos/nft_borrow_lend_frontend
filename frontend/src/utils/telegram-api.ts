import axios, { AxiosResponse } from "axios"
import { TG_BOT_TOKEN } from "./env"
export const telegram_api = axios.create({
    baseURL: "https://api.telegram.org",
    timeout: 3000,
})
export const sendTgMessage = async (chatId: string, photo: string, caption: string) => {
    return (await telegram_api.post(
        `/bot${TG_BOT_TOKEN}/sendPhoto`,
        {
            chat_id: chatId,
            photo,
            caption,
            parse_mode: 'HTML'
        }
    )
    ) as AxiosResponse<any>
}