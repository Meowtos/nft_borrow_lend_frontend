import { EmbedBuilder, TextChannel } from "discord.js";
import { client } from "./client";
export const sendDm = async(embed: EmbedBuilder, userId: string) => {
    try {
        const user = await client.users.fetch(userId);
        if (user) {
            user.send({ embeds: [embed] });
        }
    } catch (error) {
        console.log(error);
    }
}

export const sendListing = async(embed: EmbedBuilder) => {
    try {
        const channel = client.channels.cache.get(process.env.LISTING_CHANNEL_ID as string) as TextChannel;
        if (channel) {
            channel.send({ embeds: [embed] });
        }
    } catch (error) {
        console.log(error);
    }
}