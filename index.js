const { Client, GatewayIntentBits } = require("discord.js");
const redis = require("redis");
const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Channel- und Rollen-IDs
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

// Redis-Client Setup
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});
redisClient.connect();

client.on("ready", () => {
  console.log(`✅ Bot ist online als ${client.user.tag}`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (!oldState.channel && newState.channel) {
    const userId = newState.member.id;
    const now = Date.now();

    // Redis-Key für cooldown pro User
    const redisKey = `cooldown_${userId}`;

    const lastPing = await redisClient.get(redisKey);
    if (lastPing && now - parseInt(lastPing) < COOLDOWN_SECONDS * 1000) {
      return; // Cooldown aktiv, nichts tun
    }

    let textChannel;
    let roleId;

    if (newState.channel.id === MASTER_VOICE_CHANNEL_ID_1) {
      textChannel = newState.guild.channels.cache.get(TEXT_CHANNEL_ID_1);
      roleId = ROLE_ID_1;
    } else if (newState.channel.id === MASTER_VOICE_CHANNEL_ID_2) {
      textChannel = newState.guild.channels.cache.get(TEXT_CHANNEL_ID_2);
      roleId = ROLE_ID_2;
    } else if (newState.channel.id === MASTER_VOICE_CHANNEL_ID_3) {
      textChannel = newState.guild.channels.cache.get(TEXT_CHANNEL_ID_3);
      roleId = ROLE_ID_3;
    } else {
      return;
    }

    if (textChannel) {
      textChannel.send(`<@&${roleId}> 🎮 ${newState.member.user.tag} sucht Mitspieler!`);
      await redisClient.set(redisKey, now.toString());
    }
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.channel.id === CODES_CHANNEL_ID) {
    message.channel.send(`<@&${CODES_ROLE_ID}>`);
  }

  if (message.channel.id === NEWS_CHANNEL_ID) {
    message.channel.send(`<@&${NEWS_ROLE_ID}>`);
  }
});

client.login(process.env.TOKEN);

// Express HTTP Server für Railway
express().get("/", (req, res) => res.send("Ich bin online!")).listen(process.env.PORT || 3000, () => {
  console.log(`HTTP-Server läuft auf Port ${process.env.PORT || 3000}`);
});
