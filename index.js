const { Client, GatewayIntentBits } = require("discord.js");
const http = require("http");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

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

client.on("ready", () => {
  console.log(`✅ Bot ist online als ${client.user.tag}`);
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (!oldState.channel && newState.channel) {
    const userId = newState.member.id;
    const now = Date.now();

    if (newState.channel.id === MASTER_VOICE_CHANNEL_ID_1) {
      if (cooldowns.has(userId)) {
        const expireTime = cooldowns.get(userId) + COOLDOWN_SECONDS * 1000;
        if (now < expireTime) return;
      }
      const textChannel = newState.guild.channels.cache.get(TEXT_CHANNEL_ID_1);
      textChannel.send(
        `<@&${ROLE_ID_1}> 🎮 ${newState.member.user.tag} sucht Mitspieler!`
      );
      cooldowns.set(userId, now);
    } else if (newState.channel.id === MASTER_VOICE_CHANNEL_ID_2) {
      if (cooldowns.has(userId)) {
        const expireTime = cooldowns.get(userId) + COOLDOWN_SECONDS * 1000;
        if (now < expireTime) return;
      }
      const textChannel = newState.guild.channels.cache.get(TEXT_CHANNEL_ID_2);
      textChannel.send(
        `<@&${ROLE_ID_2}> 🎮 ${newState.member.user.tag} sucht Mitspieler!`
      );
      cooldowns.set(userId, now);
    } else if (newState.channel.id === MASTER_VOICE_CHANNEL_ID_3) {
      if (cooldowns.has(userId)) {
        const expireTime = cooldowns.get(userId) + COOLDOWN_SECONDS * 1000;
        if (now < expireTime) return;
      }
      const textChannel = newState.guild.channels.cache.get(TEXT_CHANNEL_ID_3);
      textChannel.send(
        `<@&${ROLE_ID_3}> 🎮 ${newState.member.user.tag} sucht Mitspieler!`
      );
      cooldowns.set(userId, now);
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

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("✅ Bot läuft & HTTP-Server aktiv!");
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`🌐 HTTP-Server läuft auf Port ${process.env.PORT || 3000}`);
});
