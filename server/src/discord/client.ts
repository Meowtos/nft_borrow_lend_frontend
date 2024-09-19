import { Client, IntentsBitField } from "discord.js";
export const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
    ]
});
(async () => {
    await client.login(process.env.DISCORD_BOT_TOKEN);
    client.on("ready", async (c) => {
        console.log(`[discord]: ${c.user.tag} is ready!!`);
    })
})()