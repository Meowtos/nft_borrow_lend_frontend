import { Snowflake, DMChannel, User, APIEmbed } from "discord.js"
import axios, { AxiosResponse } from "axios"
import { BOT_TOKEN } from "./env"
export const discord_api = axios.create({
    baseURL: "https://discord.com/api/v10",
    timeout: 3000,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Authorization",
        Authorization: `Bot ${BOT_TOKEN}`,
    },
})

export const getUser = async(user_id: Snowflake) => {
    return (await discord_api.get(
        `/users/${user_id}`,
    )) as AxiosResponse<User>
}
export const createDM = async(recipient_id: Snowflake) => {
    return (await discord_api.post(
        `/users/@me/channels`,
        { recipient_id },
    )) as AxiosResponse<DMChannel>
}

export const createEmbedMessage = async(channel_id: Snowflake, embeds: APIEmbed[]) => {
    return (await discord_api.post(
        `/channels/${channel_id}/messages`,
        { content:"Octos", embeds },
        {
            headers: { "Content-Type": "multipart/form-data" }
        }
    )); 
}