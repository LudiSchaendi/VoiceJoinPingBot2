const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`✅ Bot ist online als ${client.user.tag}`);
});

client.login(process.env.TOKEN);

express().get("/", (req, res) => res.send("Ich bin online!")).listen(process.env.PORT || 3000);
