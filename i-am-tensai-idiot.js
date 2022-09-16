const basedata = require('./i-am-tensai-idiot.json'),
    fs = require('fs');
consoleout(basedata.base.start, "sys"); //ログ
const net = require('net'),
    bouyomiclient = new net.Socket(),
    BCStop = () => bouyomiclient.destroy(),
    events = require("events"),
    proc = require('child_process'),
    path = require('path'),
    log4js = require('log4js'),
    readline = require('readline'),
    dotenv = require('dotenv'),
    dotenvreq = dotenv.config(),
    { Client, GatewayIntentBits, Partials, EmbedBuilder, BaseChannel, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js'),
    client = new Client({
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
    }),
    scommand = [
        {
            name: "joinv",
            description: "ボイスチャンネルに参加し、音楽を再生できるようになる予定です。"
        },
        {
            name: "stopbot",
            description: "かずなみだけが使える、僕を止めるコマンドです。"
        },
        {
            name: "help",
            description: "僕のヘルプが表示されます！"
        },
        {
            name: "serverinfomation",
            description: "サーバーのルールや、説明などを表示します！"
        },
        {
            name: "changereaction",
            description: "チャットに反応するかどうがを切り替えます！",
            options: [{
                type: ApplicationCommandOptionType.String,
                name: "反応設定",
                description: "チャットに反応するかどうがを切り替えます！",
                required: true,
                choices: [
                    {
                        name: "True",
                        value: "true"
                    },
                    {
                        name: "False",
                        value: "false"
                    }
                ]
            }]
        },
        {
            name: "changereply",
            description: "チャットに返信するかどうがを切り替えます！",
            options: [{
                type: ApplicationCommandOptionType.String,
                name: "返信設定",
                description: "チャットに返信するかどうがを切り替えます！",
                required: true,
                choices: [
                    {
                        name: "True",
                        value: "true"
                    },
                    {
                        name: "False",
                        value: "false"
                    }
                ]
            }]
        }
    ];
var savedata = JSON.parse(fs.readFileSync(path.resolve(__dirname, "save-i-am-tensai-idiot.json"))),
    botstatus, args, nowTime, progda,
    emojion = savedata.emojion, chatreplyon = savedata.chatreplyon;

consoleout(basedata.text.etc.msg2[0] + require('discord.js').version + basedata.text.etc.msg2[1], "sys"); //ログ
consoleout(basedata.text.etc.msg8[0] + process.version + basedata.text.etc.msg8[1], "sys"); //ログ
if (require('discord.js').version == basedata.base.discordjsversion) { consoleout(basedata.text.etc.msg3, "sys"); } else { consoleout(basedata.text.etc.msg4[0] + basedata.base.discordjsversion + basedata.text.etc.msg4[1] + basedata.base.discordjsversion + basedata.text.etc.msg4[2], "err"); };
consoleout(basedata.base.connect, "sys"); //ログ

client.once('ready', async () => {
    consoleout(basedata.text.serifmsg.msg4[0] + client.user.tag + basedata.text.serifmsg.msg4[1], "sys");
    for (let i = 0; (basedata.base.cacheID - 1) > i; i++) {
        try {
            client.channels.cache.get(basedata.base.cacheID[i]).messages.fetch({ limit: 100 });
        } catch (e) { console.log(e.message); };
    };
    new Promise(function (resolve, reject) {
        try {
            statusUpdate();
            interval1 = setInterval(() => {
                statusUpdate();
                resolve();
            }, 2400000);
        } catch (e) {
            reject();
        };
    });
    client.application.commands.set(scommand, '926965020724691005');
});
async function statusUpdate() {
    if (basedata.base.status == "1") {
        botstatus = "online";
    } else if (basedata.base.status == "2") {
        botstatus = "idle";
    } else if (basedata.base.status == "3") {
        botstatus = "dnd";
    } else if (basedata.base.status == "4") {
        botstatus = "invisible";
    };
    client.user.setPresence({
        activities: [{
            name: basedata.base.playgame
        }],
        status: botstatus
    });
    consoleout(basedata.text.etc.msg5, "sys");
};
function consoleout(msg, state) {
    nowTime =
        ('0000' + new Date().getFullYear()).slice(-4) + '年' +
        ('00' + (new Date().getMonth() + 1)).slice(-2) + '月' +
        ('00' + new Date().getDate()).slice(-2) + '日' +
        ('00' + new Date().getHours()).slice(-2) + '時' +
        ('00' + new Date().getMinutes()).slice(-2) + '分' +
        ('00' + new Date().getSeconds()).slice(-2) + '秒'; //時間取得でふ。ログの記録に使いまふ

    if (state == "chasys") {
        progda = ":" + basedata.color.yellow + basedata.statuscode.c1
    } else if (state == "sys") {
        progda = ":" + basedata.color.yellow + basedata.statuscode.c2
    } else if (state == "chat") {
        progda = ":" + basedata.color.yellow + basedata.statuscode.c3
    } else if (state == "voice") {
        progda = ":" + basedata.color.yellow + basedata.statuscode.c4
    } else if (state == "err") {
        progda = ":" + basedata.color.red + basedata.statuscode.c5
    } else if (state == "bou") {
        progda = ":" + basedata.color.yellow + basedata.statuscode.c6
    };
    console.log(basedata.color.magenta + nowTime + basedata.color.white + progda + basedata.color.white + basedata.base.spacecolon + msg);
    let savelog = basedata.color.magenta + nowTime + basedata.color.white + progda + basedata.color.white + basedata.base.spacecolon + msg;
    savelog = savelog.replace(/[[0-9]{2,}m/g, "");
    savelog = savelog.replace(/\u001b/g, " ");
    fs.appendFile('logs.txt', savelog + '\n', (err) => {
        if (err) throw err;
    });
};
function errordata(data001, data002, data003, data004, data005) {
    if (data001.match('is not a function')) {
        var text001 = data001.replace(' is not a function', basedata.errormsg.translate1)
    } else if (data001.match('Cannot read properties of undefined')) {
        var text001 = data001.replace('Cannot read properties of undefined', basedata.errormsg.translate2);
    } else if (data001.match('Cannot access' && 'before initialization')) {
        var text001 = data001.replace('Cannot access ', basedata.errormsg.translate3);
        var text001 = text001.replace(' before initialization', basedata.errormsg.translate3_2);
    } else if (data001.match('Request to use token, but token was unavailable to the client.')) {
        var text001 = data001.replace('Request to use token, but token was unavailable to the client.', basedata.errormsg.translate4);
    } else if (data001.match('is not defined')) {
        var text001 = data001.replace('is not defined', basedata.errormsg.translate5);
    } else {
        var text001 = data001
    }

    if (data002 === "ok") {
        var logtext = text001 + basedata.errormsg.msg1 + data003;
    } else if (data002 === "ignore") {
        var logtext = text001 + basedata.errormsg.msg2 + data003;
    } else if (data002 === "risk") {
        var logtext = text001 + basedata.errormsg.msg3 + data003;
    } else if (data002 === "caveat") {
        var logtext = text001 + basedata.errormsg.msg4 + data003;
    } else {
        var logtext = text001;
    }
    var ermsg = " ファイル:" + data004 + " 行:" + data005;
    consoleout(logtext + ermsg, "err")
};
function stopbots() {
    savedata.emojion = emojion;
    savedata.chatreplyon = chatreplyon;
    setTimeout(() => {
        consoleout(basedata.text.etc.msg1, "sys");
        clearInterval(interval1);
        fs.writeFileSync(
            path.resolve(__dirname, "save-i-am-tensai-idiot.json"),
            JSON.stringify(savedata, null, '  '),
            "utf-8"
        );
        client.destroy();
        consoleout(basedata.text.etc.msg7, "sys");
    }, 400);
};
function bouyomisend(da, user, server) {
    if (user == "あんこかずなみ36") {
        var config = basedata.bouyomiconfig.user.kazu;
        consoleout("棒読みちゃんの声:かずなみ", "bou");
    } else if (user == "ちびはな") {
        var config = basedata.bouyomiconfig.user.hana;
        consoleout("棒読みちゃんの声:はな", "bou");
    } else if (user == "はる会長！🌟⚽🎮") {
        var config = basedata.bouyomiconfig.user.haru;
        consoleout("棒読みちゃんの声:はる会長", "bou");
    } else if (user == "腐り気味") {
        var config = basedata.bouyomiconfig.user.kusa;
        consoleout("棒読みちゃんの声:煽り気味", "bou");
    } else if (user == "F1anlixychironexer-喰種") {
        var config = basedata.bouyomiconfig.user.flan;
        consoleout("棒読みちゃんの声:F1anlixychironexer", "bou");
    } else {
        if (server == "926965020724691005") {
            var config = basedata.bouyomiconfig.SumWaveServer;
            consoleout("棒読みちゃんの声:かずなみサバ", "bou");
        } else if (server == "925831567652323379") {
            var config = basedata.bouyomiconfig.harukaityoServer;
            consoleout("棒読みちゃんの声:はるとサバ", "bou");
        };
    };

    bouyomiclient.connect('50001', 'localhost', function () {
        var iCommand = new Buffer.alloc(2);
        iCommand.writeInt16LE(1, 0);
        bouyomiclient.write(iCommand);
        var iSpeed = new Buffer.alloc(2);
        iSpeed.writeInt16LE(config.Speed, 0);
        bouyomiclient.write(iSpeed);
        var iTone = new Buffer.alloc(2);
        iTone.writeInt16LE(config.Tone, 0);
        bouyomiclient.write(iTone);
        var iVolume = new Buffer.alloc(2);
        iVolume.writeInt16LE(config.Volume, 0);
        bouyomiclient.write(iVolume);
        var iVoice = new Buffer.alloc(2);
        iVoice.writeInt16LE(config.Voice, 0);
        bouyomiclient.write(iVoice);
        var bCode = new Buffer.alloc(1);
        bCode.writeInt8(0, 0);
        bouyomiclient.write(bCode);
        var bMessage = new Buffer.from(da, 'utf8');
        var iLength = new Buffer.alloc(4);
        iLength.writeInt32LE(bMessage.length, 0); //文字列のbyte配列の長さ
        bouyomiclient.write(iLength);
        bouyomiclient.write(bMessage);

        bouyomiclient.end();
    });
};
bouyomiclient.on('error', () => {
    consoleout("棒読みちゃんが起動されていません。", "bou");
    bouyomiclient.destroy();
});
bouyomiclient.on('close', () => {
    bouyomiclient.end();
});
function commandconfig(command) {
    if (command === "joinv") {
        var msgtxt1 = 'ボイスチャンネルに参加し、音楽を再生します。';
        var msgtxt2 = '';
        var statusd = 'join_voice';
        var statsoption = 'false';
        var cId = '';
        var sId = '';

    } else if (command === "stopbot") {
        var msgtxt1 = 'かずなみかどうか認証してから僕は止まりますのでお待ちを！';
        var msgtxt2 = '';
        var statusd = 'stop';
        var statsoption = 'stats';
        var cId = '';
        var sId = '';

    } else if (command === "help") {
        var msgtxt1 = 'ヘルプを表示しますね！amを使用し、続きにそのコマンドを打つこと！';
        var msgtxt2 = '';
        var statusd = 'help';
        var statsoption = 'false';
        var cId = '';
        var sId = '';

    } else if (command === "serverinfomation") {
        var msgtxt1 = 'サーバーのルールや、説明などを記載します！';
        var msgtxt2 = '';
        var statusd = 'help';
        var statsoption = 'false';
        var cId = '';
        var sId = '';

    } else if (command === "changereaction") {
        if (emojion == true) {
            var msgtxt1 = 'チャットにリアクションするのをやめますね！';
        } else {
            var msgtxt1 = 'チャットにリアクションするようにしますね！';
        }
        var msgtxt2 = '';
        var statusd = 'emojichange';
        var statsoption = 'false';
        var cId = '';
        var sId = '';

    } else if (command === "changereply") {
        if (chatreplyon == true) {
            var msgtxt1 = 'チャットに反応するのをやめますね！';
        } else {
            var msgtxt1 = 'チャットに反応するようにしますね！';
        }
        var msgtxt2 = '';
        var statusd = 'replychange';
        var statsoption = 'false';
        var cId = '';
        var sId = '';

    } else {
        var msgtxt1 = command + 'というコマンドはないですね....am.helpって打ってみてくださいm_ _m';
        var msgtxt2 = '';
        var statusd = 'send2';
        var statsoption = 'false';
        var cId = '';
        var sId = '';
        //------amを使用するコマンドコーナーここまで------
    }
    return [msgtxt1, msgtxt2, statusd, statsoption, cId, sId];
};
function chattextreplace(datas, ID) {
    var ctda = datas;
    ctda = ctda.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    ctda = ctda.replace(/\r?\n/g, " ");
    var embase = basedata.emojiname.emojibase;
    var eSumWaveServer = basedata.emojiname.SumWaveServer;
    for (let i = 0; i < eSumWaveServer.length; i++) {
        var bro = new RegExp("<:" + eSumWaveServer[i].ID + ":" + "[0-9]{17,}>", 'g');
        ctda = ctda.replace(bro, embase + eSumWaveServer[i].name);
    };
    var mebase = basedata.mentionsname.mentionbase;
    var mSumWaveServer = basedata.mentionsname.SumWaveServer;
    for (let i = 0; i < mSumWaveServer.length; i++) {
        var bro = new RegExp("<@" + mSumWaveServer[i].ID + ">", 'g');
        ctda = ctda.replace(bro, mebase + mSumWaveServer[i].name);
    };
    return ctda;
};
function emojireplace(datas, ID) {
    var ctda = datas;
    ctda = ctda.replace(/\r?\n/g, " ");
    var embase = basedata.emojiname.emojibase;
    var eSumWaveServer = basedata.emojiname.SumWaveServer;
    for (let i = eSumWaveServer.length - 1; i > (0 - 1); i--) {
        var bro = new RegExp(eSumWaveServer[i].ID, 'g');
        ctda = ctda.replace(bro, embase + eSumWaveServer[i].name);
    };
    return ctda;
};
client.on('messageCreate', message => {
    try {
        if (message.author.bot) return; //BOTのメッセージには反応しない
        var chatxt = chattextreplace(message.content, message.guild);//ディスコで送ったチャット内容をchatxtに突っ込みまふ
        var my_mentions = message.mentions.users.has(client.user.id) || message.mentions.roles.some(r => [client.user.username].includes(r.name)) ? true : false;
        var chattype = message.channel.type;
        var chatid = message.channelId;
        var serverID = message.guild;
        if (serverID === 'null') {
            var serverid = 'DM'
        } else {
            var serverid = serverID;
        };
        consoleout(basedata.color.green + message.author.username + basedata.color.white + basedata.base.spacecolon + basedata.color.cyan + chatxt + basedata.color.white + basedata.text.serifmsg.msg2[0] + message.author.discriminator, "chat");
        consoleout(basedata.text.serifmsg.msglocation[0] + chattype + basedata.text.serifmsg.msglocation[1] + serverid + basedata.text.serifmsg.msglocation[2] + chatid, "chat");
        bouyomisend(chatxt, message.author.username, serverid);
        //この仕組みは、「msgintext」の中にテキスト内容を入れ、「status」内の値がsendの場合、メッセージが送信される仕組みです。バカなりに作りましたよ^^ ほかにも停止したりヘルプしたりなんでも
        //---------ここの中に入力で反応する文を入力-----------------

        if (message.channel.type === 0) {
            var msgtxt1 = 'どういうこと？僕バグってるかm;@[;';
            var msgtxt2 = '';
            var statusd = 'false';
            var statsoption = 'false';
            var cId = '';
            var sId = '';

            if (message.content.startsWith(basedata.base.prefix) && "4" != basedata.base.status) {
                //------amを使用するコマンドコーナー------
                var command = chatxt;
                args = message.content.slice(basedata.base.prefix.length).trim().split(/ +/g);
                command = args.shift().toLowerCase();
                var output = commandconfig(command);
                var msgtxt1 = output[0];
                var msgtxt2 = output[1];
                var statusd = output[2];
                var statsoption = output[3];
                var cId = output[4];
                var sId = output[5];
            }
            if (emojion == true) {
                if (chatxt.match(/ぴえん|ピエン|pien|構って|かまって|構う|かまう|🥺/)) {
                    var msgtxt1 = '🥺';
                    var msgtxt2 = '';
                    var statusd = 'emoji';
                    var statsoption = 'false';
                    var cId = '';
                    var sId = '';

                } else if (chatxt.match(/うえーん|なく|泣く|うぇーん|悲しい|痛い|悲しい|さみしい|寂しい|嫌い|😭/)) {
                    var msgtxt1 = '😭';
                    var msgtxt2 = '';
                    var statusd = 'emoji';
                    var statsoption = 'false';
                    var cId = '';
                    var sId = '';


                } else if (chatxt.match(/やったー|ヤッター|嬉しい|うれしい|登場|とうじょう|発売|はつばい|いいこと|良いこと|😆/)) {
                    var msgtxt1 = '😆';
                    var msgtxt2 = '';
                    var statusd = 'emoji';
                    var statsoption = 'false';
                    var cId = '';
                    var sId = '';
                }
            }
            if (chatreplyon == true) {
                if (chatxt.match(/hello|nice|idiot/)) {
                    var msgtxt1 = '何て書いてあるのー？気になるなー()';
                    var msgtxt2 = '';
                    var statusd = 'send';
                    var statsoption = 'false';
                    var cId = '';
                    var sId = '';

                } else if (chatxt.match(/天才|てんさい|すごい|ばか/)) {
                    var msgtxt1 = '天才？';
                    var msgtxt2 = '';
                    var statusd = 'send';
                    var statsoption = 'false';
                    var cId = '';
                    var sId = '';

                } else if (chatxt.match('かずなみに送信')) {
                    var msgtxt1 = chatext.split('かずなみに送信 ');
                    var msgtxt2 = '';
                    var statusd = 'sendDM';
                    var statsoption = 'false';
                    var cId = 835789352910716968
                    var sId = '';

                } else if (my_mentions || chatxt === '天才バカ') {
                    var msgtxt1 = 'ん？';
                    var msgtxt2 = 'なんかようか？';
                    var statusd = 'send';
                    var statsoption = 'send';
                    var cId = '';
                    var sId = '';
                }

                if (chatxt.match(/招待URLを作って|招待URL作成して|招待URL作って|招待リンク作って|招待リンクを作って|招待リンクを作成して/)) {
                    var msgtxt1 = 'https://discord.gg/WEJGnEMhJJ じゃん！';
                    var msgtxt2 = 'コピペしてねぇ！';
                    var statusd = 'send';
                    var statsoption = 'send';
                    var cId = '';
                    var sId = '';
                }
            }
        } else if (message.channel.type === 1 && "4" != basedata.base.status) {
            //文字列複数
            var txt1 = ["初めまして！", "こんちは", "こんちはー", "こんにちは", "こんにちはー", "こんばんは", "こんばんはー", "こんばんにちは", "おはよう", "おはよ", "どうも", "おはこんばんにちは", "おはようございます", "こんちゃ", "おは", "おっは", "おっはー", "やっほー", "ヤッホ", "ヤッホー", "どーも", "ども", "どーもー", "どうもー", "やほ", "やほー", "やほう", "やほぅ", "こンンちはー"],
                txt2 = ["あ", "い", "う", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "た", "ち", "つ", "て", "な", "に", "ぬ", "ね", "の"],
                txt3 = ["ありがと", "ありがとう", "うれしい", "嬉しい", "どうも", "ありがとね", "ありがと！", "ありがとう！", "うれしい！", "嬉しい！", "どうも！", "ありがとうね！", "ありがとね！"],
                txt4 = ["ねむい", "つかれた", "だるい", "眠い", "疲れた", "怠い", "眠いな"],
                txt5 = ["ひま", "なんかひま", "ひまだね", "暇だね", "暇だなー", "ひまだなー", "設定してなかったんかい", "することない", "ひまだ", "暇だ", "暇", "すごい", "やばい", "凄い", "なんか暇", "暇だー", "暇だー！", "ひまだー！", "ひまだー", "やることないな", "することないな", "やることない", "なんかしたい", "まあそゆこと！", "なんかしたいな", "げーむしたい", "ゲームしたい", "どうでもいい", "どうにかしたい", "どうにかしたいな", "どうしよ", "どうしよう", "さみし", "さみしい", "寂し", "寂しい", "うわぁーつかれたー", "うわぁー疲れたー", "うわぁーっ疲れたーぁ"],
                txt6 = ["ねむくない？", "ねむい？", "眠い？", "眠くない？", "ちょいねむ？", "眠いの？", "ねむいの？", "ねむいかんじ？", "眠い感じ？", "そっち眠い？", "そっちねむい？", "そっちねむめ？", "そっち眠め？"],
                txt7 = ["おやすみ", "おやすみなさい", "おやすみなさーい", "じゃあおやすみ", "寝るね", "寝ます", "ねます", "寝るかも", "ねるかも"],
                txt8 = ["あれー", " げきおこぷんぷんまる", "あれれ", "あれれー？", "あれれぇ", "あれれぇ？", "あれれぇ...", "あれれー", "あれ？", "ありゃ", "ありゃ？", "あれれ？", "ありゃりゃ", "あれぇ", "あれぇ？"],
                txt9 = ["ねようかな", "ねようかなー"]

            var smsg1 = ["確かに", "それな～", "それ思う", "うんうん", "うん...", "わお", "それなぁ", "確かに", "それな～", "それ思う", "うんうん", "うん...", "わお", "それなぁ"]
            var smsg2 = ["ちょっとだけね", "もうやばいかもw", "まぁね", "バリ眠い..", "うーんあんまかな", "そうかなぁ", "すこしあるな", "死にそうな感じです()", "そこまで", "もう寝てます", "さっき起きたばっかだけれど(実は)", "そっちが思ってる以上に元気よ", "わお"]
            var smsg3 = ["なんだー？", "なんだなんだー？", "うーん？"]
            var smsg4 = ["僕にはなんとも...", "まぁまぁ...", "どうしようもないなぁ", "しょうがないと思うよ！"]
            var smsg5 = ["やってみたいなぁ", "あーあのなんか面白いやつね～", "聞いたことある....", "おお", "なんだそれはっっっ", "あったまーにそれやってるかも！()"]
            var smsg6 = ["今回ばかりは慰めてあげるよ...", "どうしたの？", "大丈夫...？", "何かあったの...？", "まずは、深呼吸からだね"]
            //文字列複数終わり

            if (chatxt.match(/wwwwwwwwwwwwwwww/)) {
                var msgtxt1 = 'そんなおもろい？w';
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/wwwww/)) {
                var msgtxt1 = '笑がおおいぜ。兄貴';
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/ww|あはは/)) {
                var msgtxt1 = 'ｗｗｗｗ';
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt === "w") {
                var msgtxt1 = '(笑) 笑うことあった？';
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt === "そんなわけ") {
                var msgtxt1 = 'いやぜったいそうだ！';
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/テスト|テスト！/)) {
                var msgtxt1 = 'わお！りょーかい';
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt === "うん") {
                var msgtxt1 = 'そっか';
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt === "教えてあげる") {
                var msgtxt1 = 'ふぅーん';
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt === "fuck you") {
                var msgtxt1 = 'ふぅーん';
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt === "Fuck you") {
                var msgtxt1 = 'ふぅーん';
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt === "Fuck You") {
                var msgtxt1 = 'ふぅーん';
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt === "生きてる？") {
                var msgtxt1 = '多分！';
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt.match("治してくれる")) {
                var msgtxt1 = 'それって...';
                var msgtxt2 = '神様...？';
                var statusd = 'send';
                var statsoption = 'send2';
                var cId = '';
                var sId = '';

            } else if (chatxt.match("暴言なの")) {
                var msgtxt1 = 'それって...';
                var msgtxt2 = '本当...？';
                var statusd = 'send';
                var statsoption = 'send2';
                var cId = '';
                var sId = '';

            } else if (chatxt.match("://")) {
                var msgtxt1 = 'リンクを含んでるみたい...';
                var msgtxt2 = 'なんて言っていいかわかんないや';
                var statusd = 'send';
                var statsoption = 'send2';
                var cId = '';
                var sId = '';

            } else if (chatxt.match("辞書買ったら")) {
                var msgtxt1 = '金欠なんだ...';
                var msgtxt2 = 'PCほすぃ';
                var statusd = 'send';
                var statsoption = 'send2';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/スプラ|マイクラ|フォトナ|ゲーム/)) {
                var msgdata = Math.floor(Math.random() * smsg5.length);
                var msgtxt1 = smsg5[msgdata];
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt.match("かずなみ")) {
                var msgtxt1 = '聞き覚えがあるな...';
                var msgtxt2 = 'まぁ多分どうでもいいことだろうけど';
                var statusd = 'send';
                var statsoption = 'send2';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/すごい/)) {
                var msgtxt1 = 'それって...';
                var msgtxt2 = '天才...？';
                var statusd = 'send';
                var statsoption = 'send2';
                var cId = '';
                var sId = ''

            } else if (chatxt.match(/私分かる|僕分かる|自分分かる|俺分かる|みんなわかる|私は分かる|僕は分かる|自分は分かる|俺は分かる|みんなはわかる/)) {
                var msgtxt1 = '僕には到底理解できない領域なのかも...';
                var msgtxt2 = '';
                var statusd = 'send2';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/ちがう|あってない|違う|不正解|大好きじゃない/)) {
                var msgtxt1 = 'あれれ...';
                var msgtxt2 = '';
                var statusd = 'send2';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/そうそう|あってる|正解|大好き/)) {
                var msgtxt1 = 'やった！？';
                var msgtxt2 = '';
                var statusd = 'send2';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/痛い|悲しい|苦しい/)) {
                var msgdata = Math.floor(Math.random() * smsg6.length);
                var msgtxt1 = smsg6[msgdata];
                var msgtxt2 = '';
                var statusd = 'send2';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/[0-9]は？/)) {
                if (chatxt.indexOf("足す") != -1) {
                    var msgdata = chatxt.replace("は？", "")
                    var msgdata = msgdata.split('足す')
                    var msgdata1 = Number(msgdata[0]) - Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) + Number(msgdata[1])
                } else if (chatxt.indexOf("引く") != -1) {
                    var msgdata = chatxt.replace("は？", "")
                    var msgdata = msgdata.split('引く')
                    var msgdata1 = Number(msgdata[0]) + Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) - Number(msgdata[1])
                } else if (chatxt.indexOf("掛ける") != -1) {
                    var msgdata = chatxt.replace("は？", "")
                    var msgdata = msgdata.split('掛ける')
                    var msgdata1 = Number(msgdata[0]) + Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) * Number(msgdata[1])
                } else if (chatxt.indexOf("割る") != -1) {
                    var msgdata = chatxt.replace("は？", "")
                    var msgdata = msgdata.split('割る')
                    var msgdata1 = Number(msgdata[0]) + Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) / Number(msgdata[1])

                } else if (chatxt.indexOf("たす") != -1) {
                    var msgdata = chatxt.replace("は？", "")
                    var msgdata = msgdata.split('たす')
                    var msgdata1 = Number(msgdata[0]) - Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) + Number(msgdata[1])
                } else if (chatxt.indexOf("ひく") != -1) {
                    var msgdata = chatxt.replace("は？", "")
                    var msgdata = msgdata.split('ひく')
                    var msgdata1 = Number(msgdata[0]) + Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) - Number(msgdata[1])
                } else if (chatxt.indexOf("かける") != -1) {
                    var msgdata = chatxt.replace("は？", "")
                    var msgdata = msgdata.split('かける')
                    var msgdata1 = Number(msgdata[0]) + Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) * Number(msgdata[1])
                } else if (chatxt.indexOf("わる") != -1) {
                    var msgdata = chatxt.replace("は？", "")
                    var msgdata = msgdata.split('わる')
                    var msgdata1 = Number(msgdata[0]) + Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) / Number(msgdata[1])

                } else if (chatxt.indexOf("+") != -1) {
                    var msgdata = chatxt.replace("は？", "")
                    var msgdata = msgdata.split('+')
                    var msgdata1 = Number(msgdata[0]) - Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) + Number(msgdata[1])
                } else if (chatxt.indexOf("-") != -1) {
                    var msgdata = chatxt.replace("は？", "")
                    var msgdata = msgdata.split('-')
                    var msgdata1 = Number(msgdata[0]) + Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) - Number(msgdata[1])
                } else if (chatxt.indexOf("÷") != -1) {
                    var msgdata = chatxt.replace("は？", "")
                    var msgdata = msgdata.split('÷')
                    var msgdata1 = Number(msgdata[0]) + Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) / Number(msgdata[1])
                } else if (chatxt.indexOf("×") != -1) {
                    var msgdata = chatxt.replace("は？", "")
                    var msgdata = msgdata.split('×')
                    var msgdata1 = Number(msgdata[0]) - Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) * Number(msgdata[1])
                } else if (chatxt.indexOf("x") != -1) {
                    var msgdata = chatxt.replace("は？", "")
                    var msgdata = msgdata.split('x')
                    var msgdata1 = Number(msgdata[0]) - Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) * Number(msgdata[1])
                }
                if (msgdata1 == NaN || msgdata2 == NaN || msgdata1 == undefined || msgdata2 == undefined) {
                    var msgtxt1 = "うーん....";
                    var msgtxt2 = "その問題はよくわからない...(そもそも計算じゃない....のかも)";
                    var statusd = 'send2';
                    var statsoption = 'send2';
                    var cId = '';
                    var sId = '';
                } else {
                    var msgtxt1 = "えっと...答えは" + String(msgdata1) + "かな...？";
                    var msgtxt2 = "うーんちがう...あぁ！" + String(msgdata2) + "か！";
                    var statusd = 'send2';
                    var statsoption = 'send2';
                    var cId = '';
                    var sId = '';
                }
                consoleout(msgdata, "sys")

            } else if (chatxt.match(/[0-9]=/)) {
                if (chatxt.indexOf("+") != -1) {
                    var msgdata = chatxt.replace("=", "")
                    var msgdata = msgdata.split('+')
                    var msgdata1 = Number(msgdata[0]) - Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) + Number(msgdata[1])
                } else if (chatxt.indexOf("-") != -1) {
                    var msgdata = chatxt.replace("=", "")
                    var msgdata = msgdata.split('-')
                    var msgdata1 = Number(msgdata[0]) + Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) - Number(msgdata[1])
                } else if (chatxt.indexOf("÷") != -1) {
                    var msgdata = chatxt.replace("=", "")
                    var msgdata = msgdata.split('÷')
                    var msgdata1 = Number(msgdata[0]) + Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) / Number(msgdata[1])
                } else if (chatxt.indexOf("×") != -1) {
                    var msgdata = chatxt.replace("=", "")
                    var msgdata = msgdata.split('×')
                    var msgdata1 = Number(msgdata[0]) - Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) * Number(msgdata[1])
                } else if (chatxt.indexOf("x") != -1) {
                    var msgdata = chatxt.replace("=", "")
                    var msgdata = msgdata.split('x')
                    var msgdata1 = Number(msgdata[0]) - Number(msgdata[1])
                    var msgdata2 = Number(msgdata[0]) * Number(msgdata[1])
                }
                consoleout(msgdata, "sys")
                if (msgdata1 == NaN || msgdata2 == NaN || msgdata1 == undefined || msgdata2 == undefined) {
                    var msgtxt1 = "うーん....";
                    var msgtxt2 = "その問題はよくわからない...(そもそも計算じゃない....のかも)";
                    var statusd = 'send2';
                    var statsoption = 'send2';
                    var cId = '';
                    var sId = '';
                } else {
                    var msgtxt1 = "えっと...答えは" + String(msgdata1) + "かな...？";
                    var msgtxt2 = "あっちがう...あぁ！" + String(msgdata2) + "か！";
                    var statusd = 'send2';
                    var statsoption = 'send2';
                    var cId = '';
                    var sId = '';
                }

            } else if (txt1.includes(chatxt)) {
                var msgtxt1 = chatxt;
                var msgtxt2 = 'おばかさんーー(ごめん)';
                var statusd = 'send';
                var statsoption = 'send';
                var cId = '';
                var sId = '';

            } else if (txt2.includes(chatxt)) {
                var msgtxt1 = chatxt;
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (txt3.includes(chatxt)) {
                var msgtxt1 = 'わお、そんなお礼言われることしたかな';
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (txt4.includes(chatxt)) {
                var msgtxt1 = 'ねるとよくなるよ';
                var msgtxt2 = 'きっとね';
                var statusd = 'send';
                var statsoption = 'send2';
                var cId = '';
                var sId = '';

            } else if (txt5.includes(chatxt)) {
                var msgdata = Math.floor(Math.random() * smsg1.length);
                var msgtxt1 = smsg1[msgdata];
                var msgtxt2 = '';
                var statusd = 'send2';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (txt6.includes(chatxt)) {
                var msgdata = Math.floor(Math.random() * smsg2.length);
                var msgtxt1 = smsg2[msgdata];
                var msgtxt2 = '';
                var statusd = 'send2';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (txt7.includes(chatxt)) {
                var msgtxt1 = 'おやすみなさーい';
                var msgtxt2 = '自分も寝るかな～多分';
                var statusd = 'send2';
                var statsoption = 'send2';
                var cId = '';
                var sId = '';

            } else if (txt8.includes(chatxt)) {
                var msgdata = Math.floor(Math.random() * smsg3.length);
                var msgtxt1 = smsg3[msgdata];
                var msgtxt2 = '';
                var statusd = 'send2';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/ひどい|どうして|なんで|ひどー/)) {
                var msgdata = Math.floor(Math.random() * smsg4.length);
                var msgtxt1 = smsg4[msgdata];
                var msgtxt2 = '';
                var statusd = 'send2';
                var statsoption = 'false';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/あっ|あーっ|ん？|おお|ほう|ちょ|おい|ねぇ|天才さん/)) {
                var msgtxt1 = 'ん？';
                var msgtxt2 = 'どうしたの？';
                var statusd = 'send';
                var statsoption = 'send';
                var cId = '';
                var sId = '';

            } else if (my_mentions || chatxt.match(/てんさい|天才/)) {
                var msgtxt1 = 'はーぁい';
                var msgtxt2 = 'なんやねーん';
                var statusd = 'send';
                var statsoption = 'send';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/やめて|とめて|やめよ/)) {
                var msgtxt1 = 'なんでよ';
                var msgtxt2 = 'っていうかなにをやめんねん';
                var statusd = 'send';
                var statsoption = 'send';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/お腹すいた|なんか食べたい|おなかすいた|おなかへった|おなか減った|お腹へった|お腹減った/)) {
                var msgtxt1 = '自分も何か食べたいなぁ';
                var msgtxt2 = 'とりあえずチョコだ！';
                var statusd = 'send';
                var statsoption = 'send';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/ばか|ばーか|しね|ぼけ|ざこ|くず|あほ|バーカ|バカ|馬鹿|アホ|安保|阿保|市ね|死ね/)) {
                var msgtxt1 = 'あーっ！';
                var msgtxt2 = 'ぼーげんだーめだ！';
                var statusd = 'send';
                var statsoption = 'send';
                var cId = '';
                var sId = '';

            } else if (chatxt.match(/猫|ねこ|にゃ～ん|にゃぁ|にゃあ|にゃー|にゃお|にゃお～ん|にゃおーん|にゃおぉん|にゃーっ|にゃん|にゃにゃ|しゃー|にゃおん|ニャン|ニャー|ニャーン|ニャニャ|ニャオーン|ニャオォン/)) {
                var msgtxt1 = 'にゃお～ん！';
                var msgtxt2 = '';
                var statusd = 'send';
                var statsoption = 'false';
                var cId = '';
                var sId = '';


            } else if (chatxt === "stopbot") {
                var msgtxt1 = '落ちまぁーす';
                var msgtxt2 = 'やめとけ';
                var statusd = 'stopdm';
                var statsoption = 'stopdm';
                var cId = '';
                var sId = '';

            } else {
                var msgtxt1 = 'どゆことよ';
                var msgtxt2 = '「' + chatxt + '」の意味が理解できるようになるまでお待ち～';
                var statusd = 'send';
                var statsoption = 'send2';
                var cId = '';
                var sId = '';
            };

        } else if (message.channel.type === 11) {
            var msgtxt1 = 'どういうこと？僕バグってるかm;@[;';
            var msgtxt2 = '';
            var statusd = 'false';
            var statsoption = 'false';
            var cId = '';
            var sId = '';

        } else if (message.channel.type === 'GUILD_PUBLIC_THREAD') {
            var msgtxt1 = 'どういうこと？僕バグってるかm;@[;';
            var msgtxt2 = '';
            var statusd = 'false';
            var statsoption = 'false';
            var cId = '';
            var sId = '';
        };
        //------------------------ここまで---------------------------
        ProgramMainProsess01(statusd, statsoption, msgtxt1, msgtxt2, message, cId, sId, chatxt)
    } catch (error) {
        errordata(error.message, 'caveat', '7', error.fileName, error.lineNumber)
    }
});
client.on('messageUpdate', (oldMessage, newMessage) => {
    if (oldMessage.author.bot) return; //BOTのメッセージには反応しない
    if (oldMessage.content === newMessage.content) return; //編集内容が同等な場合反応しない
    var oldchatxt = chattextreplace(oldMessage.content, oldMessage.guild);//ディスコで送ったチャット内容をchatxtに突っ込みまふ
    var chatxt = chattextreplace(newMessage.content, newMessage.guild);//ディスコで送ったチャット内容をchatxtに突っ込みまふ
    var chattype = newMessage.channel.type;
    var chatid = newMessage.channelId;
    var serverID = newMessage.guild;
    if (serverID === 'null') {
        var serverid = 'DM'
    } else {
        var serverid = serverID;
    };
    consoleout(basedata.color.green + newMessage.author.username + basedata.color.white + basedata.base.spacecolon + basedata.text.serifmsg.msg5[0], "chat");
    consoleout(basedata.text.serifmsg.msg5[1] + basedata.color.magenta + oldchatxt, "chat");
    consoleout(basedata.text.serifmsg.msg5[2] + basedata.color.cyan + chatxt, "chat");
    consoleout(basedata.text.serifmsg.msglocation[0] + chattype + basedata.text.serifmsg.msglocation[1] + serverid + basedata.text.serifmsg.msglocation[2] + chatid, "chat");
    bouyomisend(chatxt, newMessage.author.username, serverid);
});
client.on('messageDelete', message => {
    if (message.author.bot) return; //BOTのメッセージには反応しない
    var chatxt = chattextreplace(message.content, message.guild);//ディスコで送ったチャット内容をchatxtに突っ込みまふ
    var my_mentions = message.mentions.users.has(client.user.id) || message.mentions.roles.some(r => [client.user.username].includes(r.name)) ? true : false;
    var chattype = message.channel.type;
    var chatid = message.channelId;
    var serverID = message.guild;
    if (serverID === 'null') {
        var serverid = 'DM'
    } else {
        var serverid = serverID;
    };
    consoleout(basedata.color.green + message.author.username + basedata.color.white + basedata.base.spacecolon + basedata.color.cyan + chatxt + basedata.color.white + basedata.text.serifmsg.msg6[0], "chat");
    consoleout(basedata.text.serifmsg.msglocation[0] + chattype + basedata.text.serifmsg.msglocation[1] + serverid + basedata.text.serifmsg.msglocation[2] + chatid, "chat");
    bouyomisend(chatxt, message.author.username, serverid);
});
client.on('messageReactionAdd', (MessageReaction, User) => {
    if (MessageReaction.message.author.bot) return; //BOTのメッセージには反応しない
    var chatxt = chattextreplace(MessageReaction.message.content, MessageReaction.message.guild);
    var Reaction = emojireplace(MessageReaction.emoji.name, MessageReaction.message.guild)
    var chattype = MessageReaction.message.channel.type;
    var chatid = MessageReaction.message.channelId;
    var serverID = MessageReaction.message.guild;
    var chatname = MessageReaction.message.author.username
    var chatname2 = User.username
    if (serverID === 'null') {
        var serverid = 'DM'
    } else {
        var serverid = serverID;
    };
    if (chatname == chatname2) {
        chatname = "自分"
    }
    consoleout(basedata.color.green + chatname2 + basedata.color.white + basedata.base.spacecolon + basedata.color.yellow + chatname + basedata.color.white + basedata.text.serifmsg.msg7[0] + Reaction + basedata.text.serifmsg.msg7[1], "chat");
    consoleout(basedata.text.serifmsg.msg7[2] + basedata.color.cyan + chatxt, "chat");
    consoleout(basedata.text.serifmsg.msglocation[0] + chattype + basedata.text.serifmsg.msglocation[1] + serverid + basedata.text.serifmsg.msglocation[2] + chatid, "chat");
    bouyomisend(chatname2 + basedata.text.serifmsg.msg7[4] + Reaction + basedata.text.serifmsg.msg7[3], chatname2, serverid);
});
client.on('messageReactionRemove', (MessageReaction, User) => {
    if (MessageReaction.message.author.bot) return; //BOTのメッセージには反応しない
    var chatxt = chattextreplace(MessageReaction.message.content, MessageReaction.message.guild);
    var Reaction = emojireplace(MessageReaction.emoji.name, MessageReaction.message.guild)
    var chattype = MessageReaction.message.channel.type;
    var chatid = MessageReaction.message.channelId;
    var serverID = MessageReaction.message.guild;
    var chatname = MessageReaction.message.author.username
    var chatname2 = User.username
    if (serverID === 'null') {
        var serverid = 'DM'
    } else {
        var serverid = serverID;
    };
    if (chatname == chatname2) {
        chatname = "自分"
    }
    consoleout(basedata.color.green + chatname2 + basedata.color.white + basedata.base.spacecolon + basedata.color.yellow + chatname + basedata.color.white + basedata.text.serifmsg.msg7[5] + Reaction + basedata.text.serifmsg.msg7[6], "chat");
    consoleout(basedata.text.serifmsg.msg7[2] + basedata.color.cyan + chatxt, "chat");
    consoleout(basedata.text.serifmsg.msglocation[0] + chattype + basedata.text.serifmsg.msglocation[1] + serverid + basedata.text.serifmsg.msglocation[2] + chatid, "chat");
    bouyomisend(chatname2 + basedata.text.serifmsg.msg7[4] + Reaction + basedata.text.serifmsg.msg7[7], chatname2, serverid);
});
client.on('typingStart', Typeing => {
    if (Typeing.user.bot) return;
    consoleout(Typeing.user.username + "が入力中... 場所:" + Typeing.channel.type + " サーバーID:" + Typeing.channel.guildId + " チャンネルID:" + Typeing.channel.id, "chat");
});
function useridmessages01(id) {
    user1 = client.users.cache.get(id)
    user1.sendTyping()
    setTimeout(() => {
        user1.send(msg1);//送信
    }, 400)
    consoleout(basedata.text.serifmsg.msg1[0] + basedata.color.cyan + chatxt + basedata.color.white + basedata.text.serifmsg.msg1[1] + basedata.color.yellow + msg1 + basedata.color.white + basedata.text.serifmsg.msg1[2], "chat")
    logtext1 = serifstats1;//状態確認文
};
function ProgramMainProsess01(stats1, stats2, msg1, msg2, chatext, cId, sId, chatxt) {
    try {
        var logtext1 = "false"
        var logtext2 = "false"
        //ここからは、ステータスやオプションの状態をもとに、チャットデータやセリフなどを受け取り送信や計算、返事などをおこないます。
        if (stats1 === "send") {
            chatext.channel.sendTyping()
            setTimeout(() => {
                chatext.channel.send(msg1);//送信
            }, 400)
            consoleout(basedata.text.serifmsg.msg1[0] + basedata.color.cyan + chatxt + basedata.color.white + basedata.text.serifmsg.msg1[1] + basedata.color.yellow + msg1 + basedata.color.white + basedata.text.serifmsg.msg1[2], "chat")
            logtext1 = basedata.text.statusserif.msg1;//状態確認文
        } else if (stats1 === "send2") {
            chatext.channel.sendTyping()
            setTimeout(() => {
                chatext.channel.send(msg1);//送信
            }, 900)
            consoleout(basedata.text.serifmsg.msg1[0] + basedata.color.cyan + chatxt + basedata.color.white + basedata.text.serifmsg.msg1[1] + basedata.color.yellow + msg1 + basedata.color.white + basedata.text.serifmsg.msg1[2], "chat")
            logtext1 = basedata.text.statusserif.msg1;//状態確認文

        } else if (stats1 === "sendDM") {
            useridmessages01('835789352910716968')

        } else if (stats1 === "emojichange") {
            if (emojion == true) {
                emojion = false
            } else {
                emojion = true
            }
            chatext.channel.sendTyping()
            setTimeout(() => {
                chatext.channel.send(msg1);//送信
            }, 400)
            logtext1 = basedata.text.statusserif.msg10;//状態確認文

        } else if (stats1 === "replychange") {
            if (chatreplyon == true) {
                chatreplyon = false
            } else {
                chatreplyon = true
            }
            chatext.channel.sendTyping()
            setTimeout(() => {
                chatext.channel.send(msg1);//送信
            }, 400)
            logtext1 = basedata.text.statusserif.msg11;//状態確認文

        } else if (stats1 === "emoji") {
            chatext
                .react(msg1)
            logtext1 = basedata.text.statusserif.msg9;//状態確認文

        } else if (stats1 === "false") {//当てはまらない場合、ifをする
            logtext1 = basedata.text.statusserif.msg2;//状態確認文

        } else if (stats1 === "stop") {//当てはまらない場合、ifをする
            chatext.channel.sendTyping()
            setTimeout(() => {
                chatext.channel.send(msg1);//送信
            }, 400)
            consoleout(basedata.text.serifmsg.msg1[0] + basedata.color.cyan + chatxt + basedata.color.white + basedata.text.serifmsg.msg1[1] + basedata.color.yellow + msg1 + basedata.color.white + basedata.text.serifmsg.msg1[2], "chat")
            logtext1 = basedata.text.statusserif.msg3;//状態確認文
            setTimeout(() => {
                if (chatext.author.id === "835789352910716968") {//かずなみかを確認する
                    chatext.channel.sendTyping()
                    setTimeout(() => {
                        chatext.channel.send(basedata.text.serif.msg5);//送信
                        setTimeout(() => {
                            stopbots();
                        }, 500);//時間指定して、そのあとDiscordからbotを切断する
                    }, 400)
                } else {//当てはまらない場合、
                    chatext.channel.sendTyping()
                    setTimeout(() => {
                        chatext.channel.send(basedata.text.serif.msg5);//送信
                    }, 400)
                }
            }, 3000);;//時間指定

        } else if (stats1 === "stopdm") {//当てはまらない場合、ifをする
            if (chatid === '963015455780532234') {
                chatext.channel.sendTyping()
                setTimeout(() => {
                    chatext.channel.send(msg1);//送信
                }, 400)
                consoleout(basedata.text.serifmsg.msg1[0] + basedata.color.cyan + chatxt + basedata.color.white + basedata.text.serifmsg.msg1[1] + basedata.color.yellow + msg1 + basedata.color.white + basedata.text.serifmsg.msg1[2], "chat")
                logtext1 = basedata.text.statusserif.msg3;//状態確認文
                setTimeout(() => {
                    stopbots();
                }, 1000);//時間指定して、そのあとDiscordからbotを切断する
            }

        } else if (stats1 === "join_voice") {//当てはまらない場合、ifをする
            logtext1 = basedata.text.statusserif.msg4;//状態確認文
            try {
                chatext.member.voiceChannel(function (connection) {
                    const dispatcher = connection.playFile('Gabry Ponte LUMX Prezioso Thunder.mp3');
                    dispatcher.on('end', reason => {
                        connection.disconnect();
                    });
                }).catch(console.log);
            } catch (error) {
                errordata(error.message, "ignore", '', error.fileName, error.lineNumber)
            }

        } else if (stats1 === "help") {//当てはまらない場合、ifをする
            chatext.channel.send(msg1);//送信
            consoleout(basedata.text.serifmsg.msg1[0] + basedata.color.cyan + chatxt + basedata.color.white + basedata.text.serifmsg.msg1[1] + basedata.color.yellow + msg1 + basedata.color.white + basedata.text.serifmsg.msg1[2], "chat")
            logtext1 = basedata.text.statusserif.msg5;//状態確認文
            setTimeout(() => {
                chatext.channel.send({
                    embeds: [{
                        title: basedata.text.embed.page1.name,
                        url: '',
                        fields: [
                            { name: basedata.text.embed.page1.line1.top, value: basedata.text.embed.page1.line1.down },
                            { name: basedata.text.embed.page1.line2.top, value: basedata.text.embed.page1.line2.down },
                            { name: basedata.text.embed.page1.line3.top, value: basedata.text.embed.page1.line3.down },
                            { name: basedata.text.embed.page1.line4.top, value: basedata.text.embed.page1.line4.down },
                            { name: basedata.text.embed.page1.line5.top, value: basedata.text.embed.page1.line5.down },
                            { name: basedata.text.embed.page1.line6.top, value: basedata.text.embed.page1.line6.down, inline: true },
                            { name: basedata.text.embed.page1.line7.top, value: basedata.text.embed.page1.line7.down, inline: true }
                        ],
                        color: 4303284,
                        timestamp: new Date()
                    }]
                });
                chatext.channel.send({
                    embeds: [{
                        title: basedata.text.embed.page2.name,
                        description: basedata.text.embed.page2.description,
                        url: '',
                        fields: [
                            { name: basedata.text.embed.page2.line1.top, value: basedata.text.embed.page2.line1.down },
                            { name: basedata.text.embed.page2.line2.top, value: basedata.text.embed.page2.line2.down },
                            { name: basedata.text.embed.page2.line3.top, value: basedata.text.embed.page2.line3.down }
                        ],
                        color: 4303284,
                        timestamp: new Date()
                    }]
                });
            }, 500);//時間指定

        } else if (stats1 === "server") {//当てはまらない場合、ifをする
            client.guilds.cache.map(guild => guild.name).join()
            chatext.channel.send(msg1);//送信
            consoleout(basedata.text.serifmsg.msg1[0] + basedata.color.cyan + chatxt + basedata.color.white + basedata.text.serifmsg.msg1[1] + basedata.color.yellow + msg1 + basedata.color.white + basedata.text.serifmsg.msg1[2], "chat")
            logtext1 = basedata.text.statusserif.msg5;//状態確認文
            setTimeout(() => {
                chatext.channel.send({
                    embeds: [{
                        title: basedata.text.embed.page1.name,
                        url: '',
                        fields: [
                            { name: basedata.text.embed.page1.line1.top, value: basedata.text.embed.page1.line1.down }
                        ],
                        color: 4303284,
                        timestamp: new Date()
                    }]
                });
            }, 500);//時間指定
        } else if (stats1 === "0") {//当てはまらない場合、ifをする
            logtext1 = basedata.text.statusserif.msg0;//状態確認文

        } else {//当てはまらない場合、
            logtext1 = basedata.text.statusserif.msgerr;//状態確認文
        };

        if (stats2 === "send") {
            setTimeout(() => {
                chatext.channel.sendTyping()
            }, 1000)
            setTimeout(() => {
                chatext.channel.send(msg2);//送信
                consoleout(basedata.text.serifmsg.msg1[0] + basedata.color.cyan + chatxt + basedata.color.white + basedata.text.serifmsg.msg1[1] + basedata.color.yellow + msg2 + basedata.color.white + basedata.text.serifmsg.msg1[2], "chat")
            }, 1500);//時間指定
            logtext2 = basedata.text.statusserif.msg6;//状態確認文

        } else if (stats2 === "send2") {
            if (stats1 === "send") {
                setTimeout(() => {
                    chatext.channel.sendTyping()
                }, 1200)
            } else {
                setTimeout(() => {
                    chatext.channel.sendTyping()
                }, 1800)
            }
            if (stats1 === "send") {
                setTimeout(() => {
                    chatext.channel.send(msg2);//送信
                    consoleout(basedata.text.serifmsg.msg1[0] + basedata.color.cyan + chatxt + basedata.color.white + basedata.text.serifmsg.msg1[1] + basedata.color.yellow + msg2 + basedata.color.white + basedata.text.serifmsg.msg1[2], "chat")
                }, 2500);//時間指定
            } else {
                setTimeout(() => {
                    chatext.channel.send(msg2);//送信
                    consoleout(basedata.text.serifmsg.msg1[0] + basedata.color.cyan + chatxt + basedata.color.white + basedata.text.serifmsg.msg1[1] + basedata.color.yellow + msg2 + basedata.color.white + basedata.text.serifmsg.msg1[2], "chat")
                }, 3000);//時間指定
            }
            logtext2 = basedata.text.statusserif.msg6;//状態確認文

        } else if (stats2 === "false") {//当てはまらない場合、
            logtext2 = "";//ログ

        } else if (stats2 === "stats") {//当てはまらない場合、
            logtext2 = basedata.text.statusserif.msg7;//状態確認文

        } else if (stats2 === "stopdm") {//当てはまらない場合、ifをする
            if (chatid !== '963015455780532234') {
                setTimeout(() => {
                    chatext.channel.sendTyping()
                }, 1200)
                setTimeout(() => {
                    chatext.channel.send(msg2);//送信
                    consoleout(basedata.text.serifmsg.msg1[0] + basedata.color.cyan + chatxt + basedata.color.white + basedata.text.serifmsg.msg1[1] + basedata.color.yellow + msg2 + basedata.color.white + basedata.text.serifmsg.msg1[2], "chat")
                }, 2500);//時間指定
                logtext1 = basedata.text.statusserif.msg8;//状態確認文
            } else {
                logtext2 = ''
            }

        } else {//当てはまらない場合、
            logtext2 = basedata.text.statusserif.msgerr;//ログ
        };
        consoleout(basedata.text.serifmsg.msg3[0] + stats1 + basedata.text.serifmsg.msg3[1] + logtext1, "chasys")
        consoleout(basedata.text.serifmsg.msg3[2] + stats2 + basedata.text.serifmsg.msg3[1] + logtext2, "chasys")
    } catch (error) {
        errordata(error.message, 'caveat', '8', error.fileName, error.lineNumber)
    }
};
client.on('voiceStateUpdate', (oldState, newState) => {
    try {
        consoleout(basedata.text.voiceserif.msg1, "voice")
        var oldVC = oldState.channelId
        var newVC = newState.channelId
        var oldUSname = oldState.member.user.tag
        var newUSname = newState.member.user.tag

        if (oldVC === null && newVC !== null) {
            var vcid = oldState.channelId;
            var serverID = oldState.guild;
            if (serverID === 'null') {
                var serverid = 'DM'
            } else {
                var serverid = serverID;
            };
            consoleout(basedata.color.green + oldUSname + basedata.color.white + basedata.base.spacecolon + basedata.text.voiceserif.msg2 + basedata.text.voiceserif.msg4[0] + serverid + basedata.text.voiceserif.msg4[1] + vcid, "voice")
            var talkrole1 = oldState.guild.roles.cache.find(role => role.name === 'vctalk')
            oldState.guild.members.resolve(user).roles.add(talkrole1)
        } else if (oldVC !== null && newVC === null) {
            var vcid = newState.channelId;
            var serverID = newState.guild;
            if (serverID === 'null') {
                var serverid = 'DM'
            } else {
                var serverid = serverID;
            };
            consoleout(basedata.color.green + newUSname + basedata.color.white + basedata.base.spacecolon + basedata.text.voiceserif.msg3 + basedata.text.voiceserif.msg4[0] + serverid + basedata.text.voiceserif.msg4[1] + vcid, "voice")
        }
    } catch (error) {
        errordata(error.message, 'caveat', '9', error.fileName, error.lineNumber)
    }

});
client.on('interactionCreate', (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName == 'testcommand') {
        interaction.reply("返信完了！いえい！");
    };
});
client.login(process.env.KAZUNAMI_BOT_TOKEN);