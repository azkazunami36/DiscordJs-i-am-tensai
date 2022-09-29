//練習でここから自作モジュール
import { output, emojichange } from "./cseout.js";
//ここまで
output("startup");
import net from "net"; const bclient = new net.Socket();
import dotenv from "dotenv"; dotenv.config();
import fs from "fs";
import events from "events";
import proc from "child_process";
import path from "path";
import log4js from "log4js";
import readline from "readline";
import ytdl from "ytdl-core";
import {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    BaseChannel,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    ChannelType,
    SlashCommandBuilder
} from "discord.js";
import {
    entersState,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    getVoiceConnections,
    VoiceConnection,
    StreamType,
    AudioPlayerStatus
} from "@discordjs/voice";
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
const basedata = {
    commandlist: [
        new SlashCommandBuilder()
            .setName("add")
            .setDescription("URLを指定して、動画を追加します！")
            .addStringOption(option => option
                .setName("url")
                .setDescription("URLを入力しましょう！")
            )
        ,
        new SlashCommandBuilder()
            .setName("play")
            .setDescription("あなたが居るVCに参加し、音楽をぶちまけます！")
        ,
        new SlashCommandBuilder()
            .setName("stop")
            .setDescription("不本意ながら、VCから抜けて音楽を止めます...")
        ,
        new SlashCommandBuilder()
            .setName("skip")
            .setDescription("もしも今曲を再生していて、リストに複数の曲があれば切り替えます～")
        ,
        new SlashCommandBuilder()
            .setName("volume")
            .setDescription("音量を調節します！")
            .addNumberOption(option => option
                .setName("vol")
                .setDescription("0～100の間で入力をしてくださいっ(^-^)/")
            )
    ]
};
var dynamic = {
    connection: "", //接続や切断を管理/ytplay用
    stream: "", //ストリーム？/ytplay用
    resource: "",
    vilist: [], //プレイリスト機能に使用する。URLを入れる予定/ytplay用
    playing: false
};
output("etc", "あなたのNode.jsのバージョンは" + process.version + "です。");
output("etc", "本プログラムのDiscord.js動作推奨バージョンはv14.3.0です。");
const token = process.env.token;
if (!token) {
    output("nottoken");
    process.exit(0);
};
client.on("ready", async () => {
    output("ready", client.user.tag);
    client.user.setPresence({
        activities: [{
            name: "がちってるコード"
        }],
        status: "online"
    });
    client.application.commands.set(basedata.commandlist, "926965020724691005");
});
client.on("messageCreate", async message => {
    if (message.author.bot) return;
    output("gettext", message.content, message.author.username, message.author.discriminator);
    if (message.content == "テスト") {
        message.reply("なんだと！？");
    };
});
client.on("messageUpdate", async (oldmessage, newmessage) => {
});
client.on("messageDelete", async message => {
});
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
    output("getcommand", interaction.commandName, interaction.member.user.username, interaction.member.user.discriminator);

    switch (interaction.commandName) {
        case "add":
            const url = interaction.options.getString("url");
            if (!ytdl.validateURL(url)) return interaction.reply("`" + url + "`が理解できませんでした..."); //ytdlがURL解析してくれるらしい
            dynamic.vilist.push({ url: url, username: interaction.user.username });
            var embedtext = new EmbedBuilder()
                .setTitle("現在の再生リスト")
                .setDescription("このリスト内のものを上から順に再生します。");
            for (let i = 0; i != dynamic.vilist.length; i++) {
                embedtext.addFields({ name: (i + 1) + "本目", value: "```" + "追加者: " + dynamic.vilist[i].username + "\nURL: " + dynamic.vilist[i].url + "```" });
            };
            interaction.reply({
                content: "追加ができました！",
                embeds: [embedtext]
            });
            output("listdata", dynamic.vilist);
            break;
        case "play":
            if (dynamic.playing) return interaction.reply("既に再生をしています。");
            if (!interaction.member.voice.channel) return message.reply(message.author.username + "さんがボイスチャットにいません...\n入ってからまたやってみてくださいね！");
            output("listdata", dynamic.vilist);
            if (!dynamic.vilist[0]) return interaction.reply("プレイリストが空です...`add [URL]`でプレイリストに追加してください！");
            dynamic.connection = joinVoiceChannel({ //うまく説明はできないけど、ボイスチャンネル参加
                adapterCreator: interaction.guild.voiceAdapterCreator, //わからん
                channelId: interaction.member.voice.channel.id, //VoiceChannelを設定
                guildId: interaction.guildId, //サーバーIDを設定
                selfDeaf: true //多分スピーカーミュート
            });
            ytplay();
            interaction.reply({
                content: "再生を開始します。プレイ中リンク:`" + dynamic.vilist[0].url + "`",
                embeds: [
                    new EmbedBuilder()
                        .setTitle("状態")
                        .setDescription("現在再生中のものを表示します。")
                        .addFields(
                            { name: "URL", value: dynamic.vilist[0].url },
                            { name: "追加者", value: dynamic.vilist[0].username }
                        )
                ]
            });
            break;
        case "stop":
            if (!dynamic.playing) return interaction.reply("現在、音楽を再生していません。後で実行してください。");
            dynamic.stream.destroy(); //ストリームの切断？わからん
            dynamic.connection.destroy(); //VCの切断
            interaction.reply("再生を停止します。");
            dynamic.playing = false;
            break;
        case "skip":
            if (!dynamic.playing) return interaction.reply("現在、音楽を再生していません。後で実行してください。");
            dynamic.stream.destroy(); //ストリームの切断？わからん
            output("listdata", dynamic.vilist);
            if (dynamic.vilist[0]) {
                ytplay();
            } else {
                interaction.reply("うまく動作ができていません。エラーの可能性がありますので、この状態になるまでの動きを\n`あんこかずなみ36#5008`にお伝えください。ログには記録済みです。");
            };
            break;
        case "volume":
            if (!dynamic.playing) return interaction.reply("現在、音楽を再生していません。後で実行してください。");
            const volumes = interaction.options.getNumber("vol") / 100;
            console.log(dynamic.resource.volume.volume);
            console.log(volumes);
            dynamic.resource.volume.volume = volumes;
            interaction.reply({
                content: "音量が変更されました。",
                embeds: [
                    new EmbedBuilder()
                        .setTitle("状態")
                        .setDescription("現在の音量を表示します。")
                        .addFields(
                            { name: "音量", value: volumes }
                        )
                ]
            });
            break;
    };
});
const ytplay = async () => {
    var url;
    if (dynamic.vilist[1]) {
        url = dynamic.vilist[0].url;
        dynamic.vilist.shift();
    } else {
        url = dynamic.vilist[0].url;
    };
    output("listdata", dynamic.vilist);
    var player = createAudioPlayer(); //多分音声を再生するためのもの
    dynamic.connection.subscribe(player); //connectionにplayerを登録？
    dynamic.stream = ytdl(ytdl.getURLVideoID(url), { //ストリームを使うらしいけど、意味わからない
        filter: format => format.audioCodec === 'opus' && format.container === 'webm', //webm？ opus？ しらね(いやwebmとかopusとかは知ってる)
        quality: 'highest', //わからん
        highWaterMark: 32 * 1024 * 1024, //わからん
    });
    dynamic.resource = createAudioResource(dynamic.stream, { inputType: StreamType.WebmOpus, inlineVolume: true }); //多分streamのデータを形式とともに入れる？
    dynamic.resource.volume.setVolume(0.05);

    player.play(dynamic.resource); //再生
    dynamic.playing = true;
    await entersState(player, AudioPlayerStatus.Playing, 10 * 1000);
    await entersState(player, AudioPlayerStatus.Idle, 24 * 60 * 60 * 1000);
    ytplay();
};

output("connecting");
client.login(token);