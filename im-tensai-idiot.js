//練習でここから自作モジュール
import { output, emojichange } from "./cseout.js";
//ここまで
output("startup");
const basedata = {};
import net from "net"; const bclient = new net.Socket();
import dotenv from "dotenv"; dotenv.config();
import fs from "fs";
import events from "events";
import proc from "child_process";
import path from "path";
import log4js from "log4js";
import readline from "readline";
import {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    BaseChannel,
    ApplicationCommandType,
    ApplicationCommandOptionType
} from "discord.js";
const client = new Client({
    partials: [Partials.Channel],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});
output("etc", "あなたのNode.jsのバージョンは" + process.version + "です。");
output("etc", "本プログラムのDiscord.js動作推奨バージョンはv14.3.0です。");
const token = process.env.token;
if (!token) {
    output("nottoken");
    process.exit(0);
};
client.on("ready", () => {
    output("ready", client.user.tag);
    client.user.setPresence({
        activities: [{
            name: "がちってるコード"
        }],
        status: "online"
    });
});
client.on("messageCreate", message => {
    if (message.author.bot) return;
    output("gettext", message.content, message.author.username, message.author.discriminator);
    if (message.content == "テスト") {
        message.reply("なんだと！？");
    };
});
client.on("messageUpdate", (oldmessage, newmessage) => {
});
client.on("messageDelete", message => {
});
client.on("interactionCreate", interaction => {
});

output("connecting");
client.login(token);