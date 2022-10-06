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
/**
 * ステータス設定
 */
const setstatus = (pre, act) => {
    if (!pre) pre = "online";
    if (!act) act = "";
    client.user.setPresence({ activities: [{ name: act }], status: pre });
    let discord_connent_status = document.getElementById("discord-connent-status");
    if (act) act = act + ": ";
    document.getElementById("discord-bot-ct-status").innerHTML = act;
    switch (client.user.presence.status) {
        case PresenceUpdateStatus.Online: {
            discord_connent_status.innerHTML = "オンライン";
            document.documentElement.style.setProperty("--discord-status-color-back", "rgb(125, 255, 125)");
            document.documentElement.style.setProperty("--discord-status-color-border", "rgb(125, 200, 125)");
            break;
        }
        case PresenceUpdateStatus.Idle: {
            discord_connent_status.innerHTML = "離席中";
            document.documentElement.style.setProperty("--discord-status-color-back", "rgb(255 220 0)");
            document.documentElement.style.setProperty("--discord-status-color-border", "rgb(175 150 0)");
            break;
        }
        case PresenceUpdateStatus.DoNotDisturb: {
            discord_connent_status.innerHTML = "取り込み中";
            document.documentElement.style.setProperty("--discord-status-color-back", "rgb(255, 50, 50)");
            document.documentElement.style.setProperty("--discord-status-color-border", "rgb(175, 0, 0)");
            break;
        }
        case PresenceUpdateStatus.Invisible: {
            discord_connent_status.innerHTML = "オンライン状態を隠す";
            document.documentElement.style.setProperty("--discord-status-color-back", "rgb(220, 220, 220)");
            document.documentElement.style.setProperty("--discord-status-color-border", "rgb(150, 150, 150)");
            break;
        }
        case PresenceUpdateStatus.Offline: {
            discord_connent_status.innerHTML = "オフライン";
            document.documentElement.style.setProperty("--discord-status-color-back", "rgb(220, 220, 220)");
            document.documentElement.style.setProperty("--discord-status-color-border", "rgb(150, 150, 150)");
            break;
        }
    };
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
    SlashCommandBuilder,
    PresenceUpdateStatus,
    DMChannel
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
const { _ } = require("utils");
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
    console.log(oldChannel);
    console.log(newChannel);
});
client.on("debug", async message => {
    console.log("debug");
    console.log(message);
    if (message.match(/Heartbeat acknowledged, latency of/)) {
        const ping0 = message.split(" of ");
        const ping = ping0[1].slice(0, -1);
        document.getElementById("discord-connent-ping").innerHTML = ping;
    };
});
client.on("emojiCreate", async emoji => {
    console.log("emojiCreate");
    console.log(emoji);
});
client.on("emojiDelete", async emoji => {
    console.log("emojiDelete");
    console.log(emoji);
});
client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
    console.log("emojiUpdate");
    console.log(oldEmoji);
    console.log(newEmoji);
});
client.on("error", async error => {
    console.log("error");
    console.log(error);
});
client.on("guildBanAdd", async ban => {
    console.log("guildBanAdd");
    console.log(ban);
});
client.on("guildBanRemove", async ban => {
    console.log("guildBanRemove");
    console.log(ban);
});
client.on("guildCreate", async guild => {
    console.log("guildCreate");
    console.log(guild);
});
client.on("guildDelete", async guild => {
    console.log("guildDelete");
    console.log(guild);
});
client.on("guildIntegrationsUpdate", async guild => {
    console.log("guildIntegrationsUpdate");
    console.log(guild);
});
client.on("guildMemberAdd", async member => {
    console.log("guildMemberAdd");
    console.log(member);
});
client.on("guildMemberAvailable", async member => {
    console.log("guildMemberAvailable");
    console.log(member);
});
client.on("guildMemberRemove", async member => {
    console.log("guildMemberRemove");
    console.log(member);
});
client.on("guildMemberUpdate", async (oldMember, newMember) => {
    console.log("guildMemberUpdate");
    console.log(oldMember);
    console.log(newMember);
});
client.on("guildMembersChunk", async (members, guild, data) => {
    console.log("guildMembersChunk");
    console.log(members);
    console.log(guild);
    console.log(data);
});
client.on("guildScheduledEventCreate", async guildScheduledEvent => {
    console.log("guildScheduledEventCreate");
    console.log(guildScheduledEvent);
});
client.on("guildScheduledEventDelete", async guildScheduledEvent => {
    console.log("guildScheduledEventDelete");
    console.log(guildScheduledEvent);
});
client.on("guildScheduledEventUpdate", async (oldGuildScheduledEvent, newGuildScheduledEvent) => {
    console.log("guildScheduledEventUpdate");
    console.log(oldGuildScheduledEvent);
    console.log(newGuildScheduledEvent);
});
client.on("guildScheduledEventUserAdd", async guildScheduledEvent => {
    console.log("guildScheduledEventUserAdd");
    console.log(guildScheduledEvent);
});
client.on("guildScheduledEventUserRemove", async guildScheduledEvent => {
    console.log("guildScheduledEventUserRemove");
    console.log(guildScheduledEvent);
});
client.on("guildUnavailable", async guild => {
    console.log("guildUnavailable");
    console.log(guild);
});
client.on("guildUpdate", async (oldGuild, newGuild) => {
    console.log("guildUpdate");
    console.log(oldGuild);
    console.log(newGuild);
});
client.on("interactionCreate", async interaction => {
    console.log("interactionCreate");
    console.log(interaction);
});
client.on("invalidated", async () => {
    console.log("invalidated");
});
client.on("inviteCreate", async invite => {
    console.log("inviteCreate");
    console.log(invite);
});
client.on("inviteDelete", async invite => {
    console.log("inviteDelete");
    console.log(invite);
});
client.on("messageCreate", async message => {
    console.log("messageCreate");
    console.log(message);
});
client.on("messageDelete", async message => {
    console.log("messageDelete");
    console.log(message);
});
client.on("messageDeleteBulk", async (messages, channel) => {
    console.log("messageDeleteBulk");
    console.log(messages);
    console.log(channel);
});
client.on("messageReactionAdd", async (reaction, user) => {
    console.log("messageReactionAdd");
    console.log(reaction);
    console.log(user);
});
client.on("messageReactionRemove", async (reaction, user) => {
    console.log("messageReactionRemove");
    console.log(reaction);
    console.log(user);
});
client.on("messageReactionRemoveAll", async (message, reactions) => {
    console.log("messageReactionRemoveAll");
    console.log(message);
    console.log(reactions);
});
client.on("messageReactionRemoveEmoji", async reaction => {
    console.log("messageReactionRemoveEmoji");
    console.log(reaction);
});
client.on("messageUpdate", async (oldMessage, newMessage) => {
    console.log("messageUpdate");
    console.log(oldMessage);
    console.log(newMessage);
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
    document.getElementById("discord-bot-discriminator").innerHTML = "#" + client.user.discriminator;
    setstatus(PresenceUpdateStatus.Online, "にゃー");
    let num = 0;
    document.getElementsByClassName("top-interface")[0].addEventListener("click", () => {
        if (num == 4) num = 0;
        switch (num) {
            case 0: setstatus(PresenceUpdateStatus.Online, "にゃー"); break;
            case 1: setstatus(PresenceUpdateStatus.Idle, "なんであぁぁぁ"); break;
            case 2: setstatus(PresenceUpdateStatus.DoNotDisturb); break;
            case 3: setstatus(PresenceUpdateStatus.Invisible); break;
        }
        num++;
    });
    (await client.users.cache.get("835789352910716968").createDM()).messages.fetch().then(messages => messages.map(message => {
        console.log(message.author.username + ": " + message.content);
    }));
    client.guilds.cache.map(guild => {
        let sidebar = document.getElementById("sidebar");
        let div = document.createElement("div");
        div.className = "server-icon";
        let img = document.createElement("img");
        img.src = guild.iconURL();
        img.className = "server-icon";
        let name = document.createElement("div");
        name.innerHTML = guild.name;
        name.className = "server-name";
        div.appendChild(img);
        div.appendChild(name);
        sidebar.appendChild(div);
    });
});
client.on("roleCreate", async role => {
    console.log("roleCreate");
    console.log(role);
});
client.on("roleDelete", async role => {
    console.log("roleDelete");
    console.log(role);
});
client.on("roleUpdate", async (oldRole, newRole) => {
    console.log("roleUpdate");
    console.log(oldRole);
    console.log(newRole);
});
client.on("shardDisconnect", async (closeEvent, shardId) => {
    console.log("shardDisconnect");
    console.log(closeEvent);
    console.log(shardId);
});
client.on("shardError", async error => {
    console.log("shardError");
    console.log(error);
});
client.on("shardReady", async (shardId, unavailableGuids) => {
    console.log("shardReady");
    console.log(shardId);
    console.log(unavailableGuids);
});
client.on("shardReconnecting", async shardId => {
    console.log("shardReconnecting");
    console.log(shardId);
});
client.on("shardResume", async (shardId, replayedEvents) => {
    console.log("shardResume");
    console.log(shardId);
    console.log(replayedEvents);
});
client.on("stageInstanceCreate", async stageInstance => {
    console.log("stageInstanceCreate");
    console.log(stageInstance);
});
client.on("stageInstanceDelete", async stageInstance => {
    console.log("stageInstanceDelete");
    console.log(stageInstance);
});
client.on("stageInstanceUpdate", async (oldStageInstance, newStageInstance) => {
    console.log("stageInstanceUpdate");
    console.log(oldStageInstance);
    console.log(newStageInstance);
});
client.on("stickerCreate", async sticker => {
    console.log("stickerCreate");
    console.log(sticker);
});
client.on("stickerDelete", async sticker => {
    console.log("stickerDelete");
    console.log(sticker);
});
client.on("stickerUpdate", async (oldSticker, newSticker) => {
    console.log("stickerUpdate");
    console.log(oldSticker);
    console.log(newSticker);
});
client.on("threadCreate", async (thread, newlyCreated) => {
    console.log("threadCreate");
    console.log(thread);
    console.log(newlyCreated);
});
client.on("threadDelete", async thread => {
    console.log("threadDelete");
    console.log(thread);
});
client.on("threadListSync", async (threads, guild) => {
    console.log("threadListSync");
    console.log(threads);
    console.log(guild);
});
client.on("threadMemberUpdate", async (oldMember, newMember) => {
    console.log("threadMemberUpdate");
    console.log(oldMember);
    console.log(newMember);
});
client.on("threadMembersUpdate", async (addedMembers, removedMembers, thread) => {
    console.log("threadMembersUpdate");
    console.log(addedMembers);
    console.log(removedMembers);
    console.log(thread);
});
client.on("threadUpdate", async (oldThread, newThread) => {
    console.log("dathreadUpdatethreadUpdateta");
    console.log(oldThread);
    console.log(newThread);
});
client.on("typingStart", async typing => {
    console.log("typingStart");
    console.log(typing);
});
client.on("userUpdate", async (oldUser, newUser) => {
    console.log("userUpdate");
    console.log(oldUser);
    console.log(newUser);
});
client.on("voiceStateUpdate", async (oldState, newState) => {
    console.log("voiceStateUpdate");
    console.log(oldState);
    console.log(newState);
});
client.on("warn", async message => {
    console.log("warn");
    console.log(message);
});
client.on("webhookUpdate", async channel => {
    console.log("webhookUpdate");
    console.log(channel);
});
client.login(process.env.token2);
addEventListener("load", () => {
});