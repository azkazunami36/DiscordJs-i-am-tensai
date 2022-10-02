/**
 * `outstate`は、入力の手間を省くために使用します。
 */
const outState = {
    /**
     * Botを起動する際に使用します。
     */
    Startup: "startup",
    /**
     * BotをDiscordに接続する際に使用します。
     */
    Connecting: "connecting",
    /**
     * BotがDiscordに接続された際に使用します。
     */
    Ready: "ready",
    /**
     * `messageCreate`にてメッセージを受け取った際に使用します。
     */
    GetText: "gettext",
    /**
     * チャット等の送信者を表示する際に使用します。
     */
    GetName: "getname",
    /**
     * チャットなどの送信場所を表示する際に使用します。
     */
    GetLocation: "getlocation",
    /**
     * `interactionCreate`にてコマンドを受け取った際に使用します。
     */
    GetCommand: "getcommand",
    /**
     * `interactionCreate`にてサブコマンドを受け取った際に使用します。
     */
    GetSubCommand: "getsubcommand",
    /**
     * ありのままのデータをログに出力する際に使用します。
     */
    Raw: "raw",
    /**
     * Discordに使用するトークンの存在が確認できなかった場合に使用します。
     * 現在は使用できません。
     */
    NotToken: "nottoken",
    /**
     * エラーが発生した際に使用します。
     */
    Error: "error",
    /**
     * この中にない機能を使用する場合に使用します。
     */
    NaN: "etc"
}
/**
* - コンソール出力用関数です。
* @param set - `outState`を使用し、機能を選択します。
* @param text1 - 入力用1
* @param text2 - 入力用2
* @param text3 - 入力用3
*/
const output = async (set, text1, text2, text3) => {
    let black = "\u001b[30m";
    let red = "\u001b[31m";
    let green = "\u001b[32m";
    let yellow = "\u001b[33m";
    let blue = "\u001b[34m";
    let magenta = "\u001b[35m";
    let cyan = "\u001b[36m";
    let white = "\u001b[37m";
    //時間取得でふ。ログの記録に使いまふ
    let nowTime =
        magenta +
        ('0000' + new Date().getFullYear()).slice(-4) + '年' +
        ('00' + (new Date().getMonth() + 1)).slice(-2) + '月' +
        ('00' + new Date().getDate()).slice(-2) + '日' +
        ('00' + new Date().getHours()).slice(-2) + '時' +
        ('00' + new Date().getMinutes()).slice(-2) + '分' +
        ('00' + new Date().getSeconds()).slice(-2) + '秒' +
        white;
    let color, type, out = "", space = "", raw = false;
    switch (set) {
        case "startup":
            type = "system";
            color = yellow;
            out = "モジュールを取得中...";
            break;
        case "connecting":
            type = "system";
            color = yellow;
            out = "接続しています...";
            break;
        case "ready":
            type = "system";
            color = yellow;
            out = text1 + "の準備が完了しました。";
            break;
        case "gettext":
            type = "chat";
            color = yellow;
            try { out += cyan + text1.replace(/\r?\n/g, " ") + white + "を入力しました。"; } catch (e) { output(outState.Error, e) };
            break;
        case "getcommand":
            type = "command";
            color = yellow;
            try {
                out += "コマンド: " + cyan + text1.replace(/\r?\n/g, " ") + white + "が入力されました。";
            } catch (e) { output(outState.Error, e) };
            break;
        case "getsubcommand":
            type = "command";
            color = yellow;
            try {
                out += "サブコマンド :" + cyan + text1.replace(/\r?\n/g, " ") + white + " オプション:" + text2;
            } catch (e) { output(outState.Error, e) };
            break;
        case "getname":
            type = "author";
            color = yellow;
            out += "送信者: " + green + text1 + "#" + text2 + white;
            break;
        case "getlocation":
            type = "location";
            color = yellow;
            try {
                let servicetype = "";
                if (text1 == ChannelType.GuildText) servicetype = "GuildText";
                if (text1 == ChannelType.DM) servicetype = "DM";
                if (text1 == ChannelType.GuildVoice) servicetype = "GuildVoice";
                if (text1 == ChannelType.GroupDM) servicetype = "GroupDM";
                if (text1 == ChannelType.GuildCategory) servicetype = "GuildCategory";
                if (text1 == ChannelType.GuildAnnouncement) servicetype = "GuildAnnouncement";
                if (text1 == ChannelType.AnnouncementThread) servicetype = "AnnouncementThread";
                if (text1 == ChannelType.PublicThread) servicetype = "PublicThread";
                if (text1 == ChannelType.PrivateThread) servicetype = "PrivateThread";
                if (text1 == ChannelType.GuildStageVoice) servicetype = "GuildStageVoice";
                if (text1 == ChannelType.GuildDirectory) servicetype = "GuildDirectory";
                if (text1 == ChannelType.GuildForum) servicetype = "GuildForum";
                out += "受信エリア サービス: " + green + servicetype + white + " サーバーID: " + green + text2 + white + " チャンネルID: " + green + text3 + white;
            } catch (e) { output(outState.Error, e) };
            break;
        case "nottoken":
            type = "error";
            color = red;
            out = "トークンが空でした。「.env」を作成し、トークンを設定してください。";
            break;
        case "etc":
            type = "c-log";
            color = yellow;
            out = text1;
            break;
        case "listdata":
            type = "data";
            color = green;
            try {
                out = "jsonデータは以下です。:";
                if (text1.length > 1) {
                    for (let i = 0; text1.length != i; i++) {
                        out += " " + green + text1[i] + white + " ";
                        if ((i + 1) != text1.length) {
                            out += ",";
                        };
                    };
                } else {
                    out += " " + green + text1 + white + " ";
                };
            } catch (e) { output(outState.Error, e) };
            break;
        case "error":
            type = "error";
            color = red;
            out = "エラーです... => " + text1;
            break;
        default:
            type = "unknown";
            color = yellow;
            out = text1 + set;
            break;
    };
    for (let i = 0; i < (9 - type.length); i++) {
        space += " ";
    };
    console.log(nowTime + ":" + color + type + space + white + ": " + out);
};
/**
 * VoiceStatus用`embed`を作成する関数です。
 * @param p 
 * 1番目
 *  - 再生中の曲を表示するかどうかを決めます。
 *       - 0で非表示(以下略
 *       - 1で表示(以下略
 * @param l 
 * 2番目
  * - 再生リストを表示するかどうかを決めます。
 * @param v 
 * 3番目
 * - 音量を表示するかどうかを決めます。
 * @param r 
 * 4番目
 * - リピート状態を表示するかどうかを決めます。
 * @param t 
 * 5番目
 * - サムネイルを表示するかどうかを決めます。
 *      - 1でプレイ中のサムネイルを表示
 *      - 2でプレイリストの最後のサムネイルを表示
 * @param content - メッセージ内容を入力します。
 * @returns {*} - 出力
 */
const voicestatus = async (playdescription, playlist, volumedescription, repertstatus, thumbnaildescription, content, guildid, channelid) => {
    let vilist, viplay, embed, description;
    try {
        embed = new EmbedBuilder().setTitle("状態");
        description = "主に";
        if (playdescription == 1) {
            viplay =
                "```タイトル: " + dynamic.voice[guildid][channelid].playing.title +
                "\n動画時間: " + (await timeString(dynamic.voice[guildid][channelid].playing.time)) +
                "\nURL: https://youtu.be/" + dynamic.voice[guildid][channelid].playing.url +
                "\n追加者: " + dynamic.voice[guildid][channelid].playing.username + "```";
            if (dynamic.voice[guildid].playing != channelid) viplay = "現在再生されていません。";

            embed.addFields({ name: "再生中の曲の詳細", value: viplay });
            if (description != "主に") description += "、";
            description += "再生中の曲";
        };
        if (playlist == 1) {
            vilist = "";
            for (let i = 0; i != dynamic.voice[guildid][channelid].playlist.length; i++) {
                vilist += (i + 1) + "本目";
                if (i == 0) vilist += "(次再生されます。)";
                vilist +=
                    "\n```タイトル: " + dynamic.voice[guildid][channelid].playlist[i].title +
                    "\n動画時間: " + (await timeString(dynamic.voice[guildid][channelid].playlist[i].time)) +
                    "\nURL: https://youtu.be/" + dynamic.voice[guildid][channelid].playlist[i].url +
                    "\n追加者: " + dynamic.voice[guildid][channelid].playlist[i].username + "```";
            };
            if (!dynamic.voice[guildid][channelid].playlist[0]) vilist = "リストの内容はありません。";

            embed.addFields({ name: "再生リスト", value: vilist });
            if (description != "主に") description += "、";
            description += "再生リスト";
        };
        if (volumedescription == 1) {
            embed.addFields({ name: "音量", value: String(dynamic.voice[guildid][channelid].volumes) + "%" });
            if (description != "主に") description += "、";
            description += "音量";
        };
        if (repertstatus == 1) {
            let type = "";
            if (dynamic.voice[guildid][channelid].repeat == 0) type = "オフ";
            if (dynamic.voice[guildid][channelid].repeat == 1) type = "リピート";
            if (dynamic.voice[guildid][channelid].repeat == 2) type = "１曲リピート";
            embed.addFields({ name: "リピート状態", value: type });
            if (description != "主に") description += "、";
            description += "リピート状態";
        }
        if (thumbnaildescription == 1 && dynamic.voice[guildid].playing == channelid) {
            embed.setThumbnail(dynamic.voice[guildid][channelid].playing.thumbnails);
        } else if (thumbnaildescription == 1 && dynamic.voice[guildid].playing != channelid || thumbnaildescription == 2) {
            if (dynamic.voice[guildid][channelid].playlist[0]) embed.setThumbnail(dynamic.voice[guildid][channelid].playlist[dynamic.voice[guildid][channelid].playlist.length - 1].thumbnails);
        };
        description += "を表示します。";
        if (playdescription == 1 && playlist == 1 && volumedescription == 1 && repertstatus == 1) description = "全ての状態を表示します。";
        embed.setDescription(description);
    } catch (e) { output(outState.Error, e); };
    return { content: content, embeds: [embed] };
};
/**
 * 秒のデータを文字列として置き換えます。
 * @param seconds - 秒数を入力します。
 * @returns - 時間、分、秒が組み合わさった文字列を出力します。
 */
const timeString = async seconds => {
    let minutes = 0, hour = 0, timeset = "";
    try {
        for (minutes; seconds > 59; minutes++) seconds -= 60;
        for (hour; minutes > 59; hour++) minutes -= 60;
        if (hour != 0) timeset += hour + "時間";
        if (minutes != 0) timeset += minutes + "分";
        if (seconds != 0) timeset += seconds + "秒";
    } catch (e) { output(outState.Error, e); };
    return timeset;
};
/**
 * 
 * @param {*} num 
 * ```js
 * [num1, num2]
 * ```
 * - 計算する文字列を入力します。
 * @param {*} type
 * - `0`: 足し算をします。
 * - `1`: 引き算をします。
 * - `2`: 掛け算をします。
 * - `3`: 割り算をします。
 * @returns - 結果をNumberで出力します。
 */
const calcstring = (num, type) => {
    let output;
    try {
        switch (type) {
            case 0: output = Number(num[0]) + Number(num[1]); break;
            case 1: output = Number(num[0]) - Number(num[1]); break;
            case 2: output = Number(num[0]) * Number(num[1]); break;
            case 3: output = Number(num[0]) / Number(num[1]); break;
        };
    } catch (e) { output(outState.Error, e); };
    return output;
};
//ここまで
output(outState.Startup);
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
import { decycle } from "json-cyclic";
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
/**
 * - 変動しない値を扱います。
 */
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
                .addChannelOption(option => option
                    .setName("voicechannel")
                    .setDescription("追加するVCを指定します！(しないでもokですっ！")
                    .addChannelTypes(ChannelType.GuildVoice)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("play")
                .setDescription("あなたが居るVCに参加し、音楽をぶちまけます！")
                .addChannelOption(option => option
                    .setName("voicechannel")
                    .setDescription("再生するVCを指定します！(しないでもokですっ！")
                    .addChannelTypes(ChannelType.GuildVoice)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("stop")
                .setDescription("不本意ながら、VCから抜けて音楽を止めます...")
                .addChannelOption(option => option
                    .setName("voicechannel")
                    .setDescription("停止するVCを指定します！(しないでもokですっ！")
                    .addChannelTypes(ChannelType.GuildVoice)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("volume")
                .setDescription("音量を調節します！")
                .addNumberOption(option => option
                    .setName("vol")
                    .setDescription("0～100の間で入力をしてくださいっ(^-^)/")
                    .setRequired(true)
                )
                .addChannelOption(option => option
                    .setName("voicechannel")
                    .setDescription("音量を調節するVCを指定します！(しないでもokですっ！")
                    .addChannelTypes(ChannelType.GuildVoice)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("status")
                .setDescription("voiceコマンドで利用するステータスの全状況を表示しますっ")
                .addChannelOption(option => option
                    .setName("voicechannel")
                    .setDescription("ステータスを確認するVCを指定します！(しないでもokですっ！")
                    .addChannelTypes(ChannelType.GuildVoice)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("skip")
                .setDescription("強制的に次の曲にします！")
                .addChannelOption(option => option
                    .setName("voicechannel")
                    .setDescription("スキップするVCを指定します！(しないでもokですっ！")
                    .addChannelTypes(ChannelType.GuildVoice)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("repeat")
                .setDescription("再生リストの内容を維持して、曲のリピートをします！")
                .addNumberOption(option => option
                    .setName("type")
                    .setDescription("オンオフを切り替えましょうっ")
                    .addChoices(
                        { name: "オフ", value: 0 },
                        { name: "リピート", value: 1 },
                        { name: "１曲リピート", value: 2 }
                    )
                    .setRequired(true)
                )
                .addChannelOption(option => option
                    .setName("voicechannel")
                    .setDescription("リピートするVCを指定します！(しないでもokですっ！")
                    .addChannelTypes(ChannelType.GuildVoice)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("remove")
                .setDescription("statusで見る再生リストの中から選んで削除しますっ")
                .addNumberOption(option => option
                    .setName("number")
                    .setDescription("リストの番号を入力しましょっ！")
                    .setRequired(true)
                )
                .addChannelOption(option => option
                    .setName("voicechannel")
                    .setDescription("削除するVCを指定します！(しないでもokですっ！")
                    .addChannelTypes(ChannelType.GuildVoice)
                )
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
        ,
        new SlashCommandBuilder()
            .setName("console")
            .setDescription("botのコンソールにデータを出力します！")
            .addStringOption(option => option
                .setName("select")
                .setDescription("この一覧から出力したいデータを選択します！")
                .addChoices(
                    { name: "voice", value: "voice" },
                    { name: "reaction", value: "reaction" },
                    { name: "reply", value: "reply" },
                    { name: "activities", value: "activities" },
                    { name: "全て", value: "dynamic" }
                )
                .setRequired(true)
            )
    ]
};
/**
 * 変動する値を扱います。
 */
let dynamic = {
    /**
     * 音楽再生用に使用する
     */
    voice: {},
    /**
     * リアクション反応設定
     */
    reaction: false,
    /**
     * チャット反応設定
     */
    reply: false,
    /**
     * Botのステータス
     */
    activities: {
        activities: [{
            /**
             * ステータス名
             */
            name: "がちってるコード"
        }],
        /**
         * オンラインステータス
         */
        status: "online"
    }
};
output(outState.NaN, "あなたのNode.jsのバージョンは" + process.version + "です。");
output(outState.NaN, "本プログラムのDiscord.js動作推奨バージョンはv14.3.0です。");
const token = process.env.token;
if (!token) {
    output(outState.NotToken);
    process.exit(0);
};
client.on("ready", async () => {
    try {
        output(outState.Ready, client.user.tag);
        client.user.setPresence(dynamic.activities);
        await client.guilds.cache.get(process.env.guildId).commands.set([]);
        await wait(5000);
        client.application.commands.set(basedata.commandlist, process.env.guildId);
    } catch (e) { output(outState.Error, e); };
});
client.on("messageCreate", async message => {
    try {
        if (message.author.bot) return;
        let outc = message.content;
        let intc = outc.match(/<@[0-9]{17,}>/g);
        if (intc != null) for (let i = 0; i != intc.length; i++) {
            let intt = intc[i].match(/[0-9]{17,}/g)[0];
            outc = outc.replace(new RegExp("<@" + intt + ">"), "\u001b[33m" + client.users.cache.get(intt).username + "\u001b[36m");
        };
        output(outState.GetText, outc);
        output(outState.GetName, message.author.username, message.author.discriminator);
        output(outState.GetLocation, message.channel.type, message.guildId, message.channelId);
        const my_mentions = message.mentions.users.has(client.user.id) || message.mentions.roles.some(r => [client.user.username].includes(r.name)) ? true : false;
        switch (message.channel.type) {
            case ChannelType.GuildText:
                try {
                    if (dynamic.reply) {
                        if (my_mentions || message.content == "天才ばか" || message.content == "天才バカ") {
                            message.channel.sendTyping();
                            await wait(3500);
                            message.reply("まさか...呼んでくれた！？");

                        } else if (message.content.match(/招待URLを作って|招待URL作成して|招待URL作って|招待リンク作って|招待リンクを作って|招待リンクを作成して/)) {
                            message.channel.sendTyping();
                            await wait(1500);
                            message.reply("https://discord.gg/WEJGnEMhJJ じゃん！");
                            await wait(600);
                            message.channel.sendTyping();
                            await wait(1600);
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
                        } else if (message.content.match(/ぴえん|ピエン|pien|構って|かまって|構う|かまう|🥺/)) {
                            message.react("🥺");
                        } else if (message.content.match(/うえーん|なく|泣く|うぇーん|悲しい|痛い|悲しい|さみしい|寂しい|嫌い|😭/)) {
                            message.react("😭");
                        } else if (message.content.match(/やったー|ヤッター|嬉しい|うれしい|登場|とうじょう|発売|はつばい|いいこと|良いこと|😆/)) {
                            message.react("😆");
                        };
                    };
                } catch (e) {
                    output(outState.Error, e);
                    message.reply("ごめんなさい...エラーが発生しちゃって、うまく動きませんでした...m_ _m\n治るまでそのやつはうまく行かないかもです...")
                };
                break;
            case ChannelType.DM:
                try {
                    message.channel.sendTyping();
                    await wait(500)
                    if (message.content.match(/wwwwwwwwwwwwwwww/)) {
                        await wait(3000);
                        message.reply("そんなおもろい？w");
                    } else if (message.content.match(/wwwww/)) {
                        await wait(3000);
                        message.reply("笑がおおいぜ。兄貴");
                    } else if (message.content.match(/ww|あはは/)) {
                        await wait(1000);
                        message.reply("ｗｗｗｗ");
                    } else if (message.content == "w") {
                        await wait(3000);
                        message.reply("(笑) 笑うことあった？");
                    } else if (message.content == "そんなわけ") {
                        await wait(3000);
                        message.reply("いやぜったいそうだ！");
                    } else if (message.content.match(/テスト|テスト！/)) {
                        await wait(3000);
                        message.reply("わお！りょーかい");
                    } else if (message.content == "うん") {
                        await wait(2000);
                        message.reply("そっか");
                    } else if (message.content == "教えてあげる" || message.content == "fuck you" || message.content == "Fuck you" || message.content == "Fuck You") {
                        await wait(1000);
                        message.reply("ふぅーん");
                    } else if (message.content == "生きてる？") {
                        await wait(3000);
                        message.reply("多分！");
                    } else if (message.content.match("治してくれる")) {
                        await wait(200);
                        message.reply("それって...");
                        await wait(200);
                        message.channel.sendTyping();
                        await wait(3000);
                        message.reply("神様...？");
                    } else if (message.content.match("暴言なの")) {
                        await wait(200);
                        message.reply("それって...");
                        await wait(200);
                        message.channel.sendTyping();
                        await wait(3000);
                        message.reply("本当...？");
                    } else if (message.content.match("://")) {
                        await wait(3000);
                        message.reply("リンクを含んでるみたい...");
                        await wait(200);
                        message.channel.sendTyping();
                        await wait(3000);
                        message.reply("なんて言っていいかわかんないや");
                    } else if (message.content.match("辞書買ったら")) {
                        await wait(3000);
                        message.reply("金欠なんだ...");
                        await wait(200);
                        message.channel.sendTyping();
                        await wait(2000);
                        message.reply("PCほすぃ");
                    } else if (message.content.match(/スプラ|マイクラ|フォトナ|ゲーム/)) {
                        let smsg = ["やってみたいなぁ", "あーあのなんか面白いやつね～", "聞いたことある....", "おお", "なんだそれはっっっ", "あったまーにそれやってるかも！()"];
                        await wait(4000);
                        message.reply(smsg[Math.floor(Math.random() * smsg.length)]);
                    } else if (message.content.match("かずなみ")) {
                        await wait(3000);
                        message.reply("聞き覚えがあるな...");
                        await wait(200);
                        message.channel.sendTyping();
                        await wait(3000);
                        message.reply("まぁ多分どうでもいいことだろうけど");
                    } else if (message.content.match(/すごい/)) {
                        await wait(200);
                        message.reply("それって...");
                        await wait(200);
                        message.channel.sendTyping();
                        await wait(3000);
                        message.reply("天才...？");
                    } else if (message.content.match(/私分かる|僕分かる|自分分かる|俺分かる|みんなわかる|私は分かる|僕は分かる|自分は分かる|俺は分かる|みんなはわかる/)) {
                        await wait(5000);
                        message.reply("僕には到底理解できない領域なのかも...");
                    } else if (message.content.match(/ちがう|あってない|違う|不正解|大好きじゃない/)) {
                        await wait(3000);
                        message.reply("あれれ...");
                    } else if (message.content.match(/そうそう|あってる|正解|大好き/)) {
                        await wait(2000);
                        message.reply("やった！？");
                    } else if (message.content.match(/痛い|悲しい|苦しい/)) {
                        let smsg = ["今回ばかりは慰めてあげるよ...", "どうしたの？", "大丈夫...？", "何かあったの...？", "まずは、深呼吸からだね"];
                        await wait(3500);
                        message.reply(smsg[Math.floor(Math.random() * smsg.length)]);
                    } else if (message.content.match(/[0-9]は？/) || message.content.match(/[0-9]=/)) {
                        let outtext, out1, out2, text;
                        if (message.content.match(/[0-9]は？/)) text = message.content.replace("は？", "");
                        if (message.content.match(/[0-9]=/)) text = message.content.replace("=", "");
                        if (text.indexOf("足す") != -1) {
                            outtext = text.split('足す');
                            out1 = 1; out2 = 0;
                        } else if (text.indexOf("たす") != -1) {
                            outtext = text.split('たす');
                            out1 = 1; out2 = 0;
                        } else if (text.indexOf("+") != -1) {
                            outtext = text.split('+');
                            out1 = 1; out2 = 0;

                        } else if (text.indexOf("引く") != -1) {
                            outtext = text.split('引く');
                            out1 = 0; out2 = 1;
                        } else if (text.indexOf("ひく") != -1) {
                            outtext = text.split('ひく');
                            out1 = 0; out2 = 1;
                        } else if (text.indexOf("-") != -1) {
                            outtext = text.split('-');
                            out1 = 0; out2 = 1;

                        } else if (text.indexOf("掛ける") != -1) {
                            outtext = text.split('掛ける');
                            out1 = 0; out2 = 2;
                        } else if (text.indexOf("かける") != -1) {
                            outtext = text.split('かける');
                            out1 = 0; out2 = 2;
                        } else if (text.indexOf("×") != -1) {
                            outtext = text.split('×');
                            out1 = 0; out2 = 2;
                        } else if (text.indexOf("x") != -1) {
                            outtext = text.split('x');
                            out1 = 0; out2 = 2;

                        } else if (text.indexOf("割る") != -1) {
                            outtext = text.split('割る');
                            out1 = 0; out2 = 3;
                        } else if (text.indexOf("わる") != -1) {
                            outtext = text.split('わる');
                            out1 = 0; out2 = 3;
                        } else if (text.indexOf("÷") != -1) {
                            outtext = text.split('÷');
                            out1 = 0; out2 = 3;
                        };
                        if (outtext == NaN || text == NaN || out1 == NaN || out2 == NaN || outtext == undefined || text == undefined || out1 == undefined || out2 == undefined) {
                            await wait(2000);
                            message.reply("うーん....");
                            await wait(600);
                            message.channel.sendTyping();
                            await wait(3000);
                            message.reply("その問題はよくわからない...(計算だと思ってたけど、そもそも計算じゃない....のかも)");
                        } else {
                            await wait(4000);
                            message.reply("えっと...答えは" + String(calcstring(outtext, out1)) + "かな...？");
                            await wait(2000);
                            message.channel.sendTyping();
                            await wait(2500);
                            message.reply("あっ！違った！" + String(calcstring(outtext, out2)) + "だ！");
                        };
                    } else if (["初めまして！", "こんちは", "こんちはー", "こんにちは", "こんにちはー", "こんばんは", "こんばんはー", "こんばんにちは", "おはよう", "おはよ", "どうも", "おはこんばんにちは", "おはようございます", "こんちゃ", "おは", "おっは", "おっはー", "やっほー", "ヤッホ", "ヤッホー", "どーも", "ども", "どーもー", "どうもー", "やほ", "やほー", "やほう", "やほぅ", "こンンちはー"].includes(message.content)) {
                        await wait(3000);
                        message.reply(message.content);
                        await wait(200);
                        message.channel.sendTyping();
                        await wait(3000);
                        message.reply("おばかさんーー(ごめん)");
                    } else if (["あ", "い", "う", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "た", "ち", "つ", "て", "な", "に", "ぬ", "ね", "の"].includes(message.content)) {
                        await wait(1000);
                        message.reply(message.content);
                    } else if (["ありがと", "ありがとう", "うれしい", "嬉しい", "どうも", "ありがとね", "ありがと！", "ありがとう！", "うれしい！", "嬉しい！", "どうも！", "ありがとうね！", "ありがとね！"].includes(message.content)) {
                        await wait(4000);
                        message.reply("わお、そんなお礼言われることしたかな");
                    } else if (["ねむい", "つかれた", "だるい", "眠い", "疲れた", "怠い", "眠いな"].includes(message.content)) {
                        await wait(3000);
                        message.reply("ねるとよくなるよ");
                        await wait(1000);
                        message.channel.sendTyping();
                        await wait(1500);
                        message.reply("きっとね");
                    } else if (["ひま", "なんかひま", "ひまだね", "暇だね", "暇だなー", "ひまだなー", "設定してなかったんかい", "することない", "ひまだ", "暇だ", "暇", "すごい", "やばい", "凄い", "なんか暇", "暇だー", "暇だー！", "ひまだー！", "ひまだー", "やることないな", "することないな", "やることない", "なんかしたい", "まあそゆこと！", "なんかしたいな", "げーむしたい", "ゲームしたい", "どうでもいい", "どうにかしたい", "どうにかしたいな", "どうしよ", "どうしよう", "さみし", "さみしい", "寂し", "寂しい", "うわぁーつかれたー", "うわぁー疲れたー", "うわぁーっ疲れたーぁ"].includes(message.content)) {
                        let smsg = ["確かに", "それな～", "それ思う", "うんうん", "うん...", "わお", "それなぁ", "確かに", "それな～", "それ思う", "うんうん", "うん...", "わお", "それなぁ"];
                        await wait(3000);
                        message.reply(smsg[Math.floor(Math.random() * smsg.length)]);
                    } else if (["ねむくない？", "ねむい？", "眠い？", "眠くない？", "ちょいねむ？", "眠いの？", "ねむいの？", "ねむいかんじ？", "眠い感じ？", "そっち眠い？", "そっちねむい？", "そっちねむめ？", "そっち眠め？"].includes(message.content)) {
                        let smsg = ["ちょっとだけね", "もうやばいかもw", "まぁね", "バリ眠い..", "うーんあんまかな", "そうかなぁ", "すこしあるな", "死にそうな感じです()", "そこまで", "もう寝てます", "さっき起きたばっかだけれど(実は)", "そっちが思ってる以上に元気よ", "わお"];
                        await wait(3000);
                        message.reply(smsg[Math.floor(Math.random() * smsg.length)]);
                    } else if (["おやすみ", "おやすみなさい", "おやすみなさーい", "じゃあおやすみ", "寝るね", "寝ます", "ねます", "寝るかも", "ねるかも"].includes(message.content)) {
                        await wait(3000);
                        message.reply("おやすみなさーい");
                        await wait(200);
                        message.channel.sendTyping();
                        await wait(3000);
                        message.reply("自分も寝るかな～多分");
                    } else if (["あれー", " げきおこぷんぷんまる", "あれれ", "あれれー？", "あれれぇ", "あれれぇ？", "あれれぇ...", "あれれー", "あれ？", "ありゃ", "ありゃ？", "あれれ？", "ありゃりゃ", "あれぇ", "あれぇ？"].includes(message.content)) {
                        let smsg = ["なんだー？", "なんだなんだー？", "うーん？"];
                        await wait(3000);
                        message.reply(smsg[Math.floor(Math.random() * smsg.length)]);
                    } else if (message.content.match(/ひどい|どうして|なんで|ひどー/)) {
                        let smsg = ["僕にはなんとも...", "まぁまぁ...", "どうしようもないなぁ", "しょうがないと思うよ！"];
                        await wait(3000);
                        message.reply(smsg[Math.floor(Math.random() * smsg.length)]);
                    } else if (message.content.match(/あっ|あーっ|ん？|おお|ほう|ちょ|おい|ねぇ|天才さん/)) {
                        await wait(1000);
                        message.reply("ん？");
                        await wait(200);
                        message.channel.sendTyping();
                        await wait(3000);
                        message.reply("どうしたの？");
                    } else if (my_mentions || message.content.match(/てんさい|天才/)) {
                        await wait(3000);
                        message.reply("はーぁい");
                        await wait(200);
                        message.channel.sendTyping();
                        await wait(3000);
                        message.reply("なんやねーん");
                    } else if (message.content.match(/やめて|とめて|やめよ/)) {
                        await wait(3000);
                        message.reply("なんでよ");
                        await wait(200);
                        message.channel.sendTyping();
                        await wait(3000);
                        message.reply("っていうかなにをやめんねん");
                    } else if (message.content.match(/お腹すいた|なんか食べたい|おなかすいた|おなかへった|おなか減った|お腹へった|お腹減った/)) {
                        await wait(3000);
                        message.reply("自分も何か食べたいなぁ");
                        await wait(200);
                        message.channel.sendTyping();
                        await wait(3000);
                        message.reply("とりあえずチョコだ！");
                    } else if (message.content.match(/ばか|ばーか|しね|ぼけ|ざこ|くず|あほ|バーカ|バカ|馬鹿|アホ|安保|阿保|市ね|死ね/)) {
                        await wait(100);
                        message.reply("あーっ！");
                        await wait(200);
                        message.channel.sendTyping();
                        await wait(2000);
                        message.reply("ぼーげんだーめだ！");
                    } else if (message.content.match(/猫|ねこ|にゃ～ん|にゃぁ|にゃあ|にゃー|にゃお|にゃお～ん|にゃおーん|にゃおぉん|にゃーっ|にゃん|にゃにゃ|しゃー|にゃおん|ニャン|ニャー|ニャーン|ニャニャ|ニャオーン|ニャオォン/)) {
                        await wait(1500);
                        message.reply("にゃお～ん！");
                    } else {
                        message.reply("あっごめん...実は...");
                        await wait(200);
                        message.channel.sendTyping();
                        await wait(3000);
                        message.reply("「" + message.content + "」の意味が僕にはわからなかった...後で勉強してくるから、その意味が分かったらしっかり答えるねっ");
                    };
                } catch (e) {
                    output(outState.Error, e);
                    await wait(1500);
                    message.reply("ごめんね...今ねエラーになっちゃった...");
                    await wait(1600);
                    message.channel.sendTyping();
                    await wait(4000);
                    message.reply("ほんとごめん...なんでエラーになったのか分からないけど...時間があるときに治してみるねっ！")
                };
        };
    } catch (e) { output(outState.Error, e); };
});
client.on("messageUpdate", async (oldmessage, newmessage) => {
    try {
    } catch (e) { output(outState.Error, e); };
});
client.on("messageDelete", async message => {
    try {
    } catch (e) { output(outState.Error, e); };
});
client.on("interactionCreate", async interaction => {
    try {
        if (!interaction.isChatInputCommand()) return;
        output(outState.GetCommand, interaction.commandName);
        output(outState.GetName, interaction.member.user.username, interaction.member.user.discriminator);
        output(outState.GetLocation, interaction.channel.type, interaction.guildId, interaction.channelId);

        switch (interaction.commandName) {
            case "voice":
                if (!dynamic.voice[interaction.guildId]) {
                    dynamic.voice[interaction.guildId] = {
                        connection: "",
                        stream: "",
                        resource: "",
                        playing: ""
                    };
                };
                const uservoice = String(interaction.member.voice.channel).replace("<#", "").replace(">", "");
                const voicechannel = String(interaction.options.getChannel("voicechannel")).replace("<#", "").replace(">", "");
                let voiceid = "";
                if (uservoice != "null") voiceid = uservoice;
                if (voicechannel != "null") voiceid = voicechannel;
                if (!dynamic.voice[interaction.guildId][voicechannel] && voicechannel != "null") {
                    dynamic.voice[interaction.guildId][voicechannel] = {
                        repeat: 0,
                        volumes: 50,
                        playing: {
                            url: "",
                            username: "",
                            title: "",
                            time: "",
                            thumbnails: ""
                        },
                        playlist: [],
                        selected: true
                    };
                };
                if (!dynamic.voice[interaction.guildId][uservoice] && uservoice != "null") {
                    dynamic.voice[interaction.guildId][uservoice] = {
                        repeat: 0,
                        volumes: 50,
                        playing: {
                            url: "",
                            username: "",
                            title: "",
                            time: "",
                            thumbnails: ""
                        },
                        playlist: [],
                        selected: false
                    };
                };
                switch (interaction.options.getSubcommand()) {
                    case "add":
                        const url = interaction.options.getString("url");
                        output(outState.GetSubCommand, "url", url);
                        if (!uservoice && !voicechannel) return interaction.reply(interaction.member.user.username + "さんがボイスチャットにいません...\n入ってからまたやってみてくださいね！");
                        if (!ytdl.validateURL(url)) return interaction.reply("`" + url + "`が理解できませんでした..."); //ytdlがURL解析してくれるらしい
                        const videoid = ytdl.getURLVideoID(url);
                        interaction.deferReply();
                        let uname = interaction.user.username;
                        let titled, time, thumbnails;
                        await ytdl.getInfo(url).then(info => {
                            titled = info.player_response.videoDetails.title;
                            time = info.player_response.videoDetails.lengthSeconds;
                            let th = info.player_response.videoDetails.thumbnail.thumbnails[0].url;
                            thumbnails = th.split("?")[0];
                        });
                        dynamic.voice[interaction.guildId][voiceid].playlist.push({ url: videoid, username: uname, title: titled, time: time, thumbnails: thumbnails });
                        interaction.editReply(await voicestatus(0, 1, 0, 0, 2, "追加ができました！", interaction.guildId, voiceid));
                        break;
                    case "play":
                        output(outState.GetSubCommand, "play");
                        if (!uservoice && !voicechannel) return interaction.reply(interaction.member.user.username + "さんがボイスチャットにいません...\n入ってからまたやってみてくださいね！");
                        if (dynamic.voice[interaction.guildId].playing == voiceid) return interaction.reply("既にVC再生をしています。");
                        if (dynamic.voice[interaction.guildId].playing) return interaction.reply("既に別のVCで再生をしています。");
                        if (!dynamic.voice[interaction.guildId][voiceid].playlist[0]) return interaction.reply("プレイリストが空です...`add [URL]`でプレイリストに追加してください！");
                        dynamic.voice[interaction.guildId].connection = joinVoiceChannel({ //うまく説明はできないけど、ボイスチャンネル参加
                            adapterCreator: interaction.guild.voiceAdapterCreator, //わからん
                            channelId: uservoice, //VoiceChannelを設定
                            guildId: interaction.guildId, //サーバーIDを設定
                            selfDeaf: true //多分スピーカーミュート
                        });
                        ytplay(interaction.guildId, voiceid);
                        interaction.reply(await voicestatus(1, 1, 1, 1, 1, "曲の再生を始めます！", interaction.guildId, voiceid));
                        break;
                    case "stop":
                        output(outState.GetSubCommand, "stop");
                        if (!uservoice && !voicechannel) return interaction.reply(interaction.member.user.username + "さんがボイスチャットにいません...\n入ってからまたやってみてくださいね！");
                        if (dynamic.voice[interaction.guildId].playing != voiceid) return interaction.reply("現在、音楽を再生していません。後で実行してください。");
                        dynamic.voice[interaction.guildId].stream.destroy(); //ストリームの切断
                        dynamic.voice[interaction.guildId].connection.destroy(); //VCの切断
                        dynamic.voice[interaction.guildId].playing = null;
                        interaction.reply(await voicestatus(0, 1, 0, 0, 0, "曲を止めました...(´・ω・｀)", interaction.guildId, voiceid));
                        break;
                    case "skip":
                        output(outState.GetSubCommand, "skip");
                        if (dynamic.voice[interaction.guildId].playing != voiceid) return interaction.reply("現在、音楽を再生していません。後で実行してください。");
                        dynamic.voice[interaction.guildId].stream.destroy(); //ストリームの切断
                        interaction.reply((await voicestatus(1, 1, 1, 1, 1, "次の曲を再生しますねぇ", interaction.guildId, voiceid)));
                        ytplay(interaction.guildId, voiceid);
                        break;
                    case "volume":
                        let volumes = (interaction.options.getNumber("vol"));
                        output(outState.GetSubCommand, "volume", volumes);
                        if (!uservoice && !voicechannel) return interaction.reply(interaction.member.user.username + "さんがボイスチャットにいません...\n入ってからまたやってみてくださいね！");
                        if (volumes < 0) {
                            volumes = 0;
                        } else if (volumes > 100) {
                            volumes = 100;
                        };
                        if (dynamic.voice[interaction.guildId].playing == voiceid) dynamic.voice[interaction.guildId].resource.volume.volume = volumes / 100;
                        dynamic.voice[interaction.guildId][voiceid].volumes = volumes;
                        interaction.reply(await voicestatus(0, 0, 1, 0, 0, "音量を変更しました！", interaction.guildId, voiceid));
                        break;
                    case "status":
                        output(outState.GetSubCommand, "status");
                        interaction.reply((await voicestatus(1, 1, 1, 1, 1, "現在のすべての状態を表示しまーすっ", interaction.guildId, voiceid)));
                        break;
                    case "repeat":
                        const type = interaction.options.getNumber("type");
                        if (!uservoice && !voicechannel) return interaction.reply(interaction.member.user.username + "さんがボイスチャットにいません...\n入ってからまたやってみてくださいね！");
                        output(outState.GetSubCommand, "repeat", type);
                        dynamic.voice[interaction.guildId][voiceid].repeat = type;
                        interaction.reply(await voicestatus(0, 0, 0, 1, 0, "リピート状態を変更しましたっ！", interaction.guildId, voiceid));
                        break;
                    case "remove":
                        const number = interaction.options.getNumber("number");
                        if (!uservoice && !voicechannel) return interaction.reply(interaction.member.user.username + "さんがボイスチャットにいません...\n入ってからまたやってみてくださいね！");
                        output(outState.GetSubCommand, "remove", number);
                        if (!dynamic.voice[interaction.guildId][voiceid].playlist[0]) return interaction.reply("プレイリストが空です...`add [URL]`でプレイリストに追加してください！");
                        if (number > dynamic.vilist.length || number < 1) return interaction.reply("受け取った値がよろしくなかったようです...もう一度やり増しましょう...！");
                        dynamic.voice[interaction.guildId][voiceid].playlist.splice((number - 1));
                        interaction.reply(await voicestatus(0, 1, 0, 0, 0, "削除しました～", interaction.guildId, voiceid));
                        break;
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
            case "console":
                if (interaction.user.id != "835789352910716968") return interaction.reply({ content: "このコマンドはかずなみさんにしか実行できません...( ˊ•̥  ̯ •̥`)", ephemeral: true });
                const datanames = interaction.options.getString("select");
                await interaction.deferReply();
                let json = {};
                if (datanames == "dynamic") {
                    json = dynamic;
                    if (Object.keys(json.voice)[0]) {
                        for (let i = 0; Object.keys(json.voice).length != i; i++) {
                            json.voice[Object.keys(json.voice)[i]].connection = {};
                            json.voice[Object.keys(json.voice)[i]].stream = {};
                            json.voice[Object.keys(json.voice)[i]].resource = {};
                        };
                    };
                } else {
                    json = dynamic[datanames];
                    if (datanames == "voice") {
                        if (Object.keys(json)[0]) {
                            for (let i = 0; Object.keys(json).length != i; i++) {
                                json[Object.keys(json)[i]].connection = {};
                                json[Object.keys(json)[i]].stream = {};
                                json[Object.keys(json)[i]].resource = {};
                            };
                        };
                    };
                };

                fs.writeFile("dataOutput.json", JSON.stringify(decycle(json), null, "\t"), e => { if (e) throw e; });
                interaction.editReply(datanames + "のデータを出力しました！出力ファイルを確認しましょう！")
                break;
        };
    } catch (e) { output(outState.Error, e); };
});
client.on("messageReactionAdd", (MessageReaction, User) => {
    try {
    } catch (e) { output(outState.Error, e); };
});
client.on("messageReactionRemove", (MessageReaction, User) => {
    try {
    } catch (e) { output(outState.Error, e); };
});

const ytplay = async (guildId, voiceid) => {
    try {
        if (dynamic.voice[guildId][voiceid].playlist[0]) {
            dynamic.voice[guildId][voiceid].playing = dynamic.voice[guildId][voiceid].playlist[0];
            if (dynamic.voice[guildId][voiceid].repeat != 2) dynamic.voice[guildId][voiceid].playlist.shift();
            if (dynamic.voice[guildId][voiceid].repeat == 1) dynamic.voice[guildId][voiceid].playlist.push(dynamic.voice[guildId][voiceid].playing);
        };
        dynamic.voice[guildId].playing = voiceid;
        let player = createAudioPlayer(); //多分音声を再生するためのもの
        dynamic.voice[guildId].connection.subscribe(player); //connectionにplayerを登録？
        dynamic.voice[guildId].stream = ytdl(dynamic.voice[guildId][voiceid].playing.url, { //ytdlで音声をダウンロードする
            filter: format => format.audioCodec === 'opus' && format.container === 'webm', //多分これで音声だけ抽出してる
            quality: "highest", //品質
            highWaterMark: 32 * 1024 * 1024, //メモリキャッシュする量
        });
        try {
            dynamic.voice[guildId].resource = createAudioResource(dynamic.voice[guildId].stream, { inputType: StreamType.WebmOpus, inlineVolume: true }); //多分streamのデータを形式とともに入れる？
            dynamic.voice[guildId].resource.volume.setVolume(dynamic.voice[guildId][voiceid].volumes / 100); //音量調節

            player.play(dynamic.voice[guildId].resource); //再生
            await entersState(player, AudioPlayerStatus.Playing); //再生が始まるまでawaitで待機
            await entersState(player, AudioPlayerStatus.Idle); //再生リソースがなくなる(再生が終わる)まで待機
            ytplay(guildId, voiceid);
        } catch (e) {
            dynamic.voice[guildId].stream.destroy();
            dynamic.voice[guildId].connection.destroy();
            dynamic.voice[guildId].playing = null;
            output(outState.Error, e);
        };
    } catch (e) { output(outState.Error, e); };
}

output(outState.Connecting);
client.login(token);