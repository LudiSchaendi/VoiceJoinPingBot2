import { createClient } from "redis";
import { Client, GatewayIntentBits } from "discord.js";
import express from "express";

// Redis Client Setup
const redisClient = createClient({
  url: "redis://redis-16689.c62.us-east-1-4.ec2.redns.redis-cloud.com:16689", // Die Redis URL ohne Passwort
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
await redisClient.connect();

// Discord Bot Setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Beispiel Channel und Role IDs
const MASTER_VOICE_CHANNEL_ID_1 = "1386769721646383206";
const TEXT_CHANNEL_ID_1 = "1115017259245649927";
const ROLE_ID_1 = "1386776757352271912";

const MASTER_VOICE_CHANNEL_ID_2 = "1386769925795876933";
const TEXT_CHANNEL_ID_2 = "1115017259245649927";
const ROLE_ID_2 = "1386776965653991424";

const MASTER_VOICE_CHANNEL_ID_3 = "1386769887090708641";
const TEXT_CHANNEL_ID_3 = "1115017259245649927";
const ROLE_ID_3 = "1386776910536638666";

const CODES_CHANNEL_ID = "1250556150298972242";
const CODES_ROLE_ID = "1356344186684706997";

const NEWS_CHANNEL_ID = "1356584015766753352";
const NEWS_ROLE_ID = "1356584876127817788";

const COOLDOWN_SECONDS = 60;
const cooldowns = new Map();

// Initial Bot Login
client.on("ready", () => {
  console.log(`✅ Bot ist online als ${client.user.tag}`);
});

client.login(process.env.TOKEN);

// Automatischer Bot-Wechsel in Redis alle 24 Stunden
async function toggleActiveBot() {
  const activeBot = await redisClient.get("active_bot");

  if (activeBot === "BOT1") {
    await redisClient.set("active_bot", "BOT2");
    console.log("Wechsel zu BOT2");
  } else {
    await redisClient.set("active_bot", "BOT1");
    console.log("Wechsel zu BOT1");
  }
}

// Alle 24 Stunden den Bot wechseln
setInterval(toggleActiveBot, 24 * 60 * 60 * 1000);

// Voice-Join Ping-Logik für beide Bots
client.on("voiceStateUpdate", (oldState, newState) => {
  if (!oldState.channel && newState.channel) {
    const userId = newState.member.id;
    const now = Date.now();

    // Hole den aktiven Bot aus Redis
    redisClient.get("active_bot").then((activeBot) => {
      if (activeBot === "BOT1" && newState.channel.id === MASTER_VOICE_CHANNEL_ID_1) {
        if (cooldowns.has(userId)) {
          const expireTime = cooldowns.get(userId) + COOLDOWN_SECONDS * 1000;
          if (now < expireTime) return;
        }
        const textChannel = newState.guild.channels.cache.get(TEXT_CHANNEL_ID_1);
        textChannel.send(
          `<@&${ROLE_ID_1}> 🎮 ${newState.member.user.tag} sucht Mitspieler!`
        );
        cooldowns.set(userId, now);
      }

      // Für BOT2 (weitere Logik entsprechend)
      else if (activeBot === "BOT2" && newState.channel.id === MASTER_VOICE_CHANNEL_ID_2) {
        if (cooldowns.has(userId)) {
          const expireTime = cooldowns.get(userId) + COOLDOWN_SECONDS * 1000;
          if (now < expireTime) return;
        }
        const textChannel = newState.guild.channels.cache.get(TEXT_CHANNEL_ID_2);
        textChannel.send(
          `<@&${ROLE_ID_2}> 🎮 ${newState.member.user.tag} sucht Mitspieler!`
        );
        cooldowns.set(userId, now);
      }
    });
  }
});

// Nachrichten-Befehlslogik (CODES und NEWS Channels)
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.channel.id === CODES_CHANNEL_ID) {
    message.channel.send(`<@&${CODES_ROLE_ID}>`);
  }

  if (message.channel.id === NEWS_CHANNEL_ID) {
    message.channel.send(`<@&${NEWS_ROLE_ID}>`);
  }
});

// Starte HTTP-Server
express().get("/", (req, res) => res.send("Ich bin online!")).listen(process.env.PORT || 3000);

// HTTP-Server Setup
const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot & HTTP-Server laufen!");
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`HTTP-Server läuft auf Port ${process.env.PORT || 3000}`);
});
