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
import util from "node:util"; const wait = util.promisify(setTimeout);
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
            .setName("voice")
            .setDescription("ボイスチャンネルで音楽などを流せます！")
            .addSubcommand(subcommand => subcommand
                .setName("add")
                .setDescription("URLを指定して、動画を追加します！")
                .addStringOption(option => option
                    .setName("url")
                    .setDescription("URLを入力しましょう！")
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("play")
                .setDescription("あなたが居るVCに参加し、音楽をぶちまけます！")
            )
            .addSubcommand(subcommand => subcommand
                .setName("stop")
                .setDescription("不本意ながら、VCから抜けて音楽を止めます...")
            )
            .addSubcommand(subcommand => subcommand
                .setName("volume")
                .setDescription("音量を調節します！")
                .addNumberOption(option => option
                    .setName("vol")
                    .setDescription("0～100の間で入力をしてくださいっ(^-^)/")
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("status")
                .setDescription("voiceコマンドで利用するステータスの全状況を表示しますっ")
            )
            .addSubcommand(subcommand => subcommand
                .setName("skip")
                .setDescription("強制的に次の曲にします！")
            )
        ,
        new SlashCommandBuilder()
            .setName("help")
            .setDescription("僕のヘルプが表示されます！")
        ,
        new SlashCommandBuilder()
            .setName("change")
            .setDescription("botの反応とかいろいろな機能をオンオフできます！")
            .addBooleanOption(option => option
                .setName("reaction")
                .setDescription("メッセージにリアクションするかどうかを切り替えますよ～")
            )
            .addBooleanOption(option => option
                .setName("reply")
                .setDescription("メッセージに返信するかどうかを切り替えますよ～")
            )
            .addStringOption(option => option
                .setName("statusd")
                .setDescription("一覧を選択し、ステータスを切り替えます。")
                .addChoices(
                    { name: "オンライン", value: "online" },
                    { name: "離席中", value: "idle" },
                    { name: "取り込み中", value: "dnd" },
                    { name: "オフライン", value: "invisible" }
                )
            )
            .addStringOption(option => option
                .setName("statustext")
                .setDescription("ステータスに設定する文を入力します。")
            )
    ]
};
let dynamic = {
    connection: "", //接続や切断を管理/ytplay用
    stream: "", //ストリーム/ytplay用
    resource: "", //プレイヤーの管理をするやつ？音量変更に使用
    vilist: [], //プレイリスト機能に使用する。URLを入れる/ytplay用
    playing: false, //再生中かどうかを判断
    playmeta: {
        name: "",
        url: "", 
        title: "", 
        time: "", 
        thumbnails: ""
    },
    volumes: 50, //音量を設定
    reaction: false,
    reply: false,
    activities: {
        activities: [{
            name: "がちってるコード"
        }],
        status: "online"
    }
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
    client.user.setPresence(dynamic.activities);
    client.application.commands.set(basedata.commandlist, process.env.guildId);
});
client.on("messageCreate", async message => {
    if (message.author.bot) return;
    let outc = message.content;
    let intc = outc.match(/<@[0-9]{17,}>/g);
    if (intc != null) for (let i = 0; i != intc.length; i++) {
        let intt = intc[i].match(/[0-9]{17,}/g)[0];
        outc = outc.replace(new RegExp("<@" + intt + ">"), "\u001b[33m" + client.users.cache.get(intt).username + "\u001b[36m");
    };
    output("gettext", outc, message.author.username, message.author.discriminator);
    const my_mentions = message.mentions.users.has(client.user.id) || message.mentions.roles.some(r => [client.user.username].includes(r.name)) ? true : false;
    if (dynamic.reply) {
        if (my_mentions || message.content == "天才ばか" || message.content == "天才バカ") {
            message.channel.sendTyping();
            await wait(3500);
            message.reply("まさか...呼んでくれた！？");

        } else if (message.content.match(/招待URLを作って|招待URL作成して|招待URL作って|招待リンク作って|招待リンクを作って|招待リンクを作成して/)) {
            message.channel.sendTyping();
            await wait(1500);
            message.reply("https://discord.gg/WEJGnEMhJJ じゃん！");
            await wait(200);
            message.channel.sendTyping();
            await wait(2000);
            message.reply("コピペしてねぇ！");

        } else if (message.content.match(/hello|nice|idiot/)) {
            message.channel.sendTyping();
            await wait(4000);
            message.reply("何て書いてあるのー？気になるなー()");

        } else if (message.content.match(/天才|てんさい|すごい|ばか/)) {
            message.channel.sendTyping();
            await wait(1000);
            message.reply("天才？");

        } else if (message.content == "テスト") {
            message.channel.sendTyping();
            await wait(2000);
            message.reply("なんだと！？");
        };
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
        case "voice":
            switch (interaction.options.getSubcommand()) {
                case "add":
                    const url = interaction.options.getString("url");
                    if (!ytdl.validateURL(url)) return interaction.reply("`" + url + "`が理解できませんでした..."); //ytdlがURL解析してくれるらしい
                    const videoid = ytdl.getURLVideoID(url);
                    interaction.deferReply();
                    let uname = interaction.user.username;
                    let titled, times, timem = 0, thumbnails;
                    await ytdl.getInfo(url).then(info => {
                      titled = info.player_response.videoDetails.title;
                      times = info.player_response.videoDetails.lengthSeconds;
                      let th = info.player_response.videoDetails.thumbnail.thumbnails[0].url;
                      thumbnails = th.split("?")[0];
                      for (timem; times > 59; timem++) times -= 60;
                    });
                    dynamic.vilist.push({ url: videoid, username: uname, title: titled, time: timem + "分" + times + "秒", thumbnails: thumbnails });
                    interaction.editReply(await voicestatus(0, 1, 0, 2, "追加ができました！"));
                    break;
                case "play":
                    if (dynamic.playing) return interaction.reply("既に再生をしています。");
                    if (!interaction.member.voice.channel) return message.reply(message.author.username + "さんがボイスチャットにいません...\n入ってからまたやってみてくださいね！");
                    if (!dynamic.vilist[0]) return interaction.reply("プレイリストが空です...`add [URL]`でプレイリストに追加してください！");
                    dynamic.connection = joinVoiceChannel({ //うまく説明はできないけど、ボイスチャンネル参加
                        adapterCreator: interaction.guild.voiceAdapterCreator, //わからん
                        channelId: interaction.member.voice.channel.id, //VoiceChannelを設定
                        guildId: interaction.guildId, //サーバーIDを設定
                        selfDeaf: true //多分スピーカーミュート
                    });
                    ytplay();
                    interaction.reply(await voicestatus(1, 1, 1, 1, "曲の再生を始めます！"));
                    break;
                case "stop":
                    if (!dynamic.playing) return interaction.reply("現在、音楽を再生していません。後で実行してください。");
                    dynamic.stream.destroy(); //ストリームの切断
                    dynamic.connection.destroy(); //VCの切断
                    dynamic.playmeta.name = "";
                    dynamic.playmeta.url = "";
                    dynamic.playmeta.title = "";
                    interaction.reply(await voicestatus(0, 1, 0, 0, "曲を止めました...(´・ω・｀)"));
                    dynamic.playing = false;
                    break;
                case "skip":
                    if (!dynamic.playing) return interaction.reply("現在、音楽を再生していません。後で実行してください。");
                    dynamic.stream.destroy(); //ストリームの切断
                    if (dynamic.vilist[0]) {
                        ytplay();
                        interaction.reply((await voicestatus(1, 1, 1, 1, "次の曲を再生しますねぇ")));
                    } else {
                        interaction.reply("うまく動作ができていません。エラーの可能性がありますので、この状態になるまでの動きを\n`あんこかずなみ36#5008`にお伝えください。ログには記録済みです。");
                    };
                    break;
                case "volume":
                    let volumes = (interaction.options.getNumber("vol"));
                    if (volumes < 0) {
                        volumes = 0;
                    } else if (volumes > 100) {
                        volumes = 100;
                    };
                    if (dynamic.playing) dynamic.resource.volume.volume = volumes / 100;
                    dynamic.volumes = volumes;
                    interaction.reply(await voicestatus(0, 0, 1, 0, "音量を変更しました！"));
                    break;
                case "status":
                    interaction.reply((await voicestatus(1, 1, 1, 1, "現在のすべての状態を表示しまーすっ")));
            };
            break;
        case "change":
            let type = {
                reaction: interaction.options.getBoolean("reaction"),
                reply: interaction.options.getBoolean("reply"),
                statusd: interaction.options.getString("statusd"),
                statustext: interaction.options.getString("statustext")
            };

            let change;
            if (type.reaction != null) {
                dynamic.reaction = type.reaction;
                change += "\n" + "reaction: " + dynamic.reaction;
            };
            if (type.reply != null) {
                dynamic.reply = type.reply;
                change += "\n" + "reply: " + dynamic.reply;
            };
            if (type.statusd != null) {
                if (type.statusd != "online" && type.statusd != "idle" && type.statusd != "dnd" && type.statusd != "invisible") return;
                dynamic.activities.status = type.statusd;
                change += "\n" + "statusd: " + dynamic.activities.status;
            };
            if (type.statustext != null) {
                dynamic.activities.activities[0].name = type.statustext;
                change += "\n" + "statustext: " + dynamic.activities.activities[0].name;
            };
            client.user.setPresence(dynamic.activities);

            if (change != null) {
                interaction.reply({
                    content: "以下の内容を変更しました。",
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("変更内容")
                            .setDescription("表示されているものが変更内容です。")
                            .addFields(
                                { name: "一覧", value: "```" + change + "```" }
                            )
                    ]
                });
            } else {
                interaction.reply("変更内容がありませんでした....\nもう一度やり直しましょう！");
            };
            break;
        case "help":
            interaction.reply("様々なヘルプを表示します！");
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("ヘルプ")
                        .setDescription("どういう動きをするかや、コマンドの一覧を表示します！")
                        .addFields({ name: ":one: /voice", value: "ボイスチャンネルで音楽などを流せます！\n`add [URL]` URLを指定して、動画を追加します！\n`play` あなたが居るVCに参加し、音楽をぶちまけます！\n`stop` VCから抜けて音楽を止めます...\n`volume`0～100の間で入力をしてくださいっ(^-^)/" })
                        .addFields({ name: ":two: /change", value: "botの反応とかいろいろな機能をオンオフできます！\n`reaction [True/False]` メッセージにリアクションするかどうかを切り替えますよ～\n`reply` メッセージに返信するかどうかを切り替えますよ～\n`statusd` オンラインからオフラインなど、様々なステータスに変更できます！\n`statustext [Text]` ステータスの名前を設定できます！" })
                        .addFields({ name: ":three: /help", value: "" })
                        .addFields({ name: ":YouTube:", value: "[あんこかずなみ36](https://www.youtube.com/channel/UCOBiNYsubLw-zAOqg74jUww)", inline: true })
                        .addFields({ name: ":YouTube Live:", value: "[あんこかずなみ36ずっとライブ](https://www.youtube.com/channel/UCPAjnCNTKQ7XaJ8PWTDpsvw)", inline: true })
                        .addFields({ name: "返信など...", value: "僕は特定の文字が入ったチャットに反応を見せることがあります！\n色々喋ったりしてみましょうっ\nこの機能は`/change`コマンドで切り替えることが可能です。" })
                        .setColor(4303284)
                        .setTimestamp()
                ]
            });
            break;
    };
});
client.on("messageReactionAdd", (MessageReaction, User) => {
});
client.on("messageReactionRemove", (MessageReaction, User) => {
});
const ytplay = async () => {
    if (dynamic.vilist[0]) {
        dynamic.playmeta.url = dynamic.vilist[0].url;
        dynamic.playmeta.name = dynamic.vilist[0].username;
        dynamic.playmeta.title = dynamic.vilist[0].title;
        dynamic.playmeta.time = dynamic.vilist[0].time;
        dynamic.playmeta.thumbnails = dynamic.vilist[0].thumbnails;
        dynamic.vilist.shift();
    };
    let player = createAudioPlayer(); //多分音声を再生するためのもの
    dynamic.connection.subscribe(player); //connectionにplayerを登録？
    dynamic.stream = ytdl(dynamic.playmeta.url, { //ytdlで音声をダウンロードする
        filter: format => format.audioCodec === 'opus' && format.container === 'webm', //多分これで音声だけ抽出してる
        quality: "highest", //品質
        highWaterMark: 32 * 1024 * 1024, //メモリキャッシュする量
    });
    dynamic.resource = createAudioResource(dynamic.stream, { inputType: StreamType.WebmOpus, inlineVolume: true }); //多分streamのデータを形式とともに入れる？
    dynamic.resource.volume.setVolume(dynamic.volumes / 100); //音量調節

    player.play(dynamic.resource); //再生
    dynamic.playing = true;
    await entersState(player, AudioPlayerStatus.Playing, 10 * 1000);
    await entersState(player, AudioPlayerStatus.Idle, 24 * 60 * 60 * 1000);
    ytplay();
};
const voicestatus = async (p, l, v, t, content) => {
    let vilist = "";
    let viplay = "```タイトル: " + dynamic.playmeta.title + "\n動画時間: " + dynamic.playmeta.time + "\nURL: https://youtu.be/" + dynamic.playmeta.url + "\n追加者: " + dynamic.playmeta.name + "```";
    for (let i = 0; i != dynamic.vilist.length; i++) {
        vilist += (i + 1) + "本目";
        if (i == 0) vilist += "(次再生されます。)";
        vilist += "\n```タイトル: " + dynamic.vilist[i].title + "\n動画時間: " + dynamic.vilist[i].time + "\nURL: https://youtu.be/" + dynamic.vilist[i].url + "\n追加者: " + dynamic.vilist[i].username + "```";
    };
    if (!dynamic.vilist[0]) vilist = "リストの内容はありません。";
    if (!dynamic.playing) viplay = "現在再生されていません。";
    let embed = new EmbedBuilder().setTitle("状態");
    let description = "主に";
    if (p == 1) {
        embed.addFields({ name: "再生中の曲の詳細", value: viplay });
        if (description != "主に") description += "、";
        description += "再生中の曲";
    };
    if (l == 1) {
        embed.addFields({ name: "再生リスト", value: vilist });
        if (description != "主に") description += "、";
        description += "再生リスト";
    };
    if (v == 1) {
        embed.addFields({ name: "音量", value: String(dynamic.volumes) + "%" });
        if (description != "主に") description += "、";
        description += "音量";
    };
    if (t == 1 && dynamic.playing) {
        embed.setThumbnail(dynamic.playmeta.thumbnails);
    };
    if (t == 1 && !dynamic.playing || t == 2) {
        embed.setThumbnail(dynamic.vilist[dynamic.vilist.length - 1].thumbnails);
    };
    description += "を表示します。";
    if (p == 1 && l == 1 && v == 1) description = "全ての状態を表示します。";
    embed.setDescription(description);
    return { content: content, embeds: [embed] };
};

output("connecting");
client.login(token);