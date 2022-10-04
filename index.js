/**
 * 棒読みちゃん送信
 */
const bsend = async (text, guildid, userid) => {
    if (bclient.connecting) return;
    let speed, tone, volume, voice;
    if (!text) text = "空のメッセージ";
    bclient.connect("50001", "localhost");
    let Command = new Buffer.allocUnsafe(2);
    Command.writeInt16LE(1, 0);
    bclient.write(Command);
    let Speed = new Buffer.allocUnsafe(2);
    Speed.writeInt16LE(speed, 0);
    bclient.write(Speed);
    let Tone = new Buffer.allocUnsafe(2);
    Tone.writeInt16LE(tone, 0);
    bclient.write(Tone);
    let Volume = new Buffer.allocUnsafe(2);
    Volume.writeInt16LE(volume, 0);
    bclient.write(Volume);
    let Voice = new Buffer.allocUnsafe(2);
    Voice.writeInt16LE(voice, 0);
    bclient.write(Voice);
    let Code = new Buffer.allocUnsafe(1);
    Code.writeInt8(0, 0);
    bclient.write(Code);
    let Message = new Buffer.from(text, "utf8");
    let Length = new Buffer.allocUnsafe(4);
    Length.writeInt32LE(Message.length, 0);
    bclient.write(Length);
    bclient.write(Message);
    bclient.end();
};
//ここまで
const net = require("net"); const bclient = new net.Socket();
const dotenv = require("dotenv").config();
const fs = require("fs");
const events = require("events");
const proc = require("child_process");
const log4js = require("log4js");
const readline = require("readline");
const ytdl = require("ytdl-core");
const util = require("node:util"); const wait = util.promisify(setTimeout);
const { decycle } = require("json-cyclic");
const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    BaseChannel,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    ChannelType,
    SlashCommandBuilder
} = require("discord.js");
const {
    entersState,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    getVoiceConnections,
    VoiceConnection,
    StreamType,
    AudioPlayerStatus
} = require("@discordjs/voice");
const { channel } = require("diagnostics_channel");
const client = new Client({
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User
    ],
    intents: [
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ]
});
bclient.on("error", async e => { if (e) console.error(e) });


client.on("applicationCommandPermissionsUpdate", async data => {
    console.log("applicationCommandPermissionsUpdate");
    console.log(data);
});
client.on("cacheSweep", async message => {
    console.log("cacheSweep");
    console.log(message);
});
client.on("channelCreate", async channel => {
    console.log("channelCreate");
    console.log(channel);
});
client.on("channelDelete", async channel => {
    console.log("channelDelete");
    console.log(channel);
});
client.on("channelPinsUpdate", async (channel, date) => {
    console.log("channelPinsUpdate");
    console.log(channel);
    console.log(date);
});
client.on("channelUpdate", async (oldChannel, newChannel) => {
    console.log("channelUpdate");
});
client.on("debug", async message => {
    console.log("debug");
    console.log(message);
    if (message.match("[WS => Shard 0] Heartbeat acknowledged, latency of ")) {};
});
client.on("emojiCreate", async emoji => {
    console.log("emojiCreate");
});
client.on("emojiDelete", async emoji => {
    console.log("emojiDelete");
});
client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
    console.log("emojiUpdate");
});
client.on("error", async error => {
    console.log("error");
    console.log(error);
});
client.on("guildBanAdd", async ban => {
    console.log("guildBanAdd");
});
client.on("guildBanRemove", async ban => {
    console.log("guildBanRemove");
});
client.on("guildCreate", async guild => {
    console.log("guildCreate");
});
client.on("guildDelete", async guild => {
    console.log("guildDelete");
});
client.on("guildIntegrationsUpdate", async guild => {
    console.log("guildIntegrationsUpdate");
});
client.on("guildMemberAdd", async member => {
    console.log("guildMemberAdd");
});
client.on("guildMemberAvailable", async member => {
    console.log("guildMemberAvailable");
});
client.on("guildMemberRemove", async member => {
    console.log("guildMemberRemove");
});
client.on("guildMemberUpdate", async (oldMember, newMember) => {
    console.log("guildMemberUpdate");
});
client.on("guildMembersChunk", async (members, guild, data) => {
    console.log("guildMembersChunk");
});
client.on("guildScheduledEventCreate", async guildScheduledEvent => {
    console.log("guildScheduledEventCreate");
});
client.on("guildScheduledEventDelete", async guildScheduledEvent => {
    console.log("guildScheduledEventDelete");
});
client.on("guildScheduledEventUpdate", async (oldGuildScheduledEvent, newGuildScheduledEvent) => {
    console.log("guildScheduledEventUpdate");
});
client.on("guildScheduledEventUserAdd", async guildScheduledEvent => {
    console.log("guildScheduledEventUserAdd");
});
client.on("guildScheduledEventUserRemove", async guildScheduledEvent => {
    console.log("guildScheduledEventUserRemove");
});
client.on("guildUnavailable", async guild => {
    console.log("guildUnavailable");
});
client.on("guildUpdate", async (oldGuild, newGuild) => {
    console.log("guildUpdate");
});
client.on("interactionCreate", async interaction => {
    console.log("interactionCreate");
});
client.on("invalidated", async () => {
    console.log("invalidated");
});
client.on("inviteCreate", async invite => {
    console.log("inviteCreate");
});
client.on("inviteDelete", async invite => {
    console.log("inviteDelete");
});
client.on("messageCreate", async message => {
    console.log("messageCreate");
});
client.on("messageDelete", async message => {
    console.log("messageDelete");
});
client.on("messageDeleteBulk", async (messages, channel) => {
    console.log("messageDeleteBulk");
});
client.on("messageReactionAdd", async (reaction, user) => {
    console.log("messageReactionAdd");
});
client.on("messageReactionRemove", async (reaction, user) => {
    console.log("messageReactionRemove");
});
client.on("messageReactionRemoveAll", async (message, reactions) => {
    console.log("messageReactionRemoveAll");
});
client.on("messageReactionRemoveEmoji", async reaction => {
    console.log("messageReactionRemoveEmoji");
});
client.on("messageUpdate", async (oldMessage, newMessage) => {
    console.log("messageUpdate");
});
client.on("presenceUpdate", async (oldPresence, newPresence) => {
    console.log("presenceUpdate");
    console.log(oldPresence);
    console.log(newPresence);
});
client.on("ready", async client => {
    console.log("ready");
    console.log("準備完了");
    document.getElementById("discord-avatar-icon").src = client.user.displayAvatarURL();
    document.getElementById("discord-bot-name").innerHTML = client.user.username;
    let discord_connent_status = document.getElementById("discord-connent-status");
    discord_connent_status.innerHTML = client.user.presence.status;
    document.documentElement.style.setProperty("--discord-status-color-back", "rgb(125, 255, 125)");
    document.documentElement.style.setProperty("--discord-dtatus-color-border", "rgb(125, 200, 125)");
});
client.on("roleCreate", async role => {
    console.log("roleCreate");
});
client.on("roleDelete", async role => {
    console.log("roleDelete");
});
client.on("roleUpdate", async (oldRole, newRole) => {
    console.log("roleUpdate");
});
client.on("shardDisconnect", async (closeEvent, shardId) => {
    console.log("shardDisconnect");
});
client.on("shardError", async error => {
    console.log("shardError");
});
client.on("shardReady", async (shardId, unavailableGuids) => {
    console.log("shardReady");
    console.log(shardId);
    console.log(unavailableGuids);
});
client.on("shardReconnecting", async shardId => {
    console.log("shardReconnecting");
});
client.on("shardResume", async (shardId, replayedEvents) => {
    console.log("shardResume");
});
client.on("stageInstanceCreate", async stageInstance => {
    console.log("stageInstanceCreate");
});
client.on("stageInstanceDelete", async stageInstance => {
    console.log("stageInstanceDelete");
});
client.on("stageInstanceUpdate", async (oldStageInstance, newStageInstance) => {
    console.log("stageInstanceUpdate");
});
client.on("stickerCreate", async sticker => {
    console.log("stickerCreate");
});
client.on("stickerDelete", async sticker => {
    console.log("stickerDelete");
});
client.on("stickerUpdate", async (oldSticker, newSticker) => {
    console.log("stickerUpdate");
});
client.on("threadCreate", async (thread, newlyCreated) => {
    console.log("threadCreate");
});
client.on("threadDelete", async thread => {
    console.log("threadDelete");
});
client.on("threadListSync", async (threads, guild) => {
    console.log("threadListSync");
});
client.on("threadMemberUpdate", async (oldMember, newMember) => {
    console.log("threadMemberUpdate");
});
client.on("threadMembersUpdate", async (addedMembers, removedMembers, thread) => {
    console.log("threadMembersUpdate");
});
client.on("threadUpdate", async (oldThread, newThread) => {
    console.log("dathreadUpdatethreadUpdateta");
});
client.on("typingStart", async typing => {
    console.log("typingStart");
});
client.on("userUpdate", async (oldUser, newUser) => {
    console.log("userUpdate");
    console.log(oldUser);
    console.log(newUser);
});
client.on("voiceStateUpdate", async (oldState, newState) => {
    console.log("voiceStateUpdate");
});
client.on("warn", async message => {
    console.log("warn");
});
client.on("webhookUpdate", async channel => {
    console.log("webhookUpdate");
});
client.login(process.env.token2);
addEventListener("load", () => {
});