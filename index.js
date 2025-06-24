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

// ✅ Nur ein Server: Express
express()
  .get("/", (req, res) => res.send("Bot & HTTP-Server laufen!"))
  .listen(process.env.PORT || 3000, () => {
    console.log(`🚀 HTTP-Server läuft auf Port ${process.env.PORT || 3000}`);
  });
