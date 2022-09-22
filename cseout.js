export const output = (set, text1, text2, text3) => {
    const black = "\u001b[30m";
    const red = "\u001b[31m";
    const green = "\u001b[32m";
    const yellow = "\u001b[33m";
    const blue = "\u001b[34m";
    const magenta = "\u001b[35m";
    const cyan = "\u001b[36m";
    const white = "\u001b[37m";
    //時間取得でふ。ログの記録に使いまふ
    const nowTime =
        magenta +
        ('0000' + new Date().getFullYear()).slice(-4) + '年' +
        ('00' + (new Date().getMonth() + 1)).slice(-2) + '月' +
        ('00' + new Date().getDate()).slice(-2) + '日' +
        ('00' + new Date().getHours()).slice(-2) + '時' +
        ('00' + new Date().getMinutes()).slice(-2) + '分' +
        ('00' + new Date().getSeconds()).slice(-2) + '秒' +
        white;
    var color, type, out = "", space = "";
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
            out += green + text2 + "#" + text3 + white + "さんが" + cyan + text1 + white + "を入力しました。"; 
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
export const emojichange = text => {
    var q = text.replace(/\r?\n/g, " ");
    var emoji = [
        {
            "ID": "emoji_1",
            "name": "草"
        },
        {
            "ID": "emoji_2",
            "name": "最高"
        },
        {
            "ID": "emoji_3",
            "name": "悲しみ"
        },
        {
            "ID": "emoji_4",
            "name": "おつです。"
        },
        {
            "ID": "emoji_5",
            "name": "了解です。"
        },
        {
            "ID": "emoji_6",
            "name": "なるほど"
        },
        {
            "ID": "emoji_7",
            "name": "それな"
        },
        {
            "ID": "emoji_8",
            "name": "神"
        },
        {
            "ID": "emoji_9",
            "name": "むりせず"
        },
        {
            "ID": "emoji_10",
            "name": "お大事に"
        },
        {
            "ID": "emoji_11",
            "name": "ひえっ"
        },
        {
            "ID": "emoji_12",
            "name": "どんまい"
        },
        {
            "ID": "emoji_13",
            "name": "地獄"
        },
        {
            "ID": "emoji_14",
            "name": "やったね"
        },
        {
            "ID": "emoji_15",
            "name": "それはそう"
        },
        {
            "ID": "emoji_16",
            "name": "わかる"
        },
        {
            "ID": "emoji_17",
            "name": "寝て"
        },
        {
            "ID": "emoji_18",
            "name": "すごい！"
        },
        {
            "ID": "emoji_19",
            "name": "やさしい"
        },
        {
            "ID": "emoji_20",
            "name": "強い"
        },
        {
            "ID": "emoji_21",
            "name": "え？"
        },
        {
            "ID": "emoji_22",
            "name": "無理せず"
        },
        {
            "ID": "emoji_23",
            "name": "ええんやで"
        },
        {
            "ID": "emoji_24",
            "name": "百里ある"
        },
        {
            "ID": "emoji_25",
            "name": "いいね！"
        },
        {
            "ID": "emoji_26",
            "name": "ようこそ"
        },
        {
            "ID": "emoji_27",
            "name": ""
        },
        {
            "ID": "emoji_28",
            "name": "にっこり"
        },
        {
            "ID": "emoji_29",
            "name": ""
        },
        {
            "ID": "emoji_30",
            "name": "わぁい"
        },
        {
            "ID": "emoji_31",
            "name": "池"
        }
    ];
    for (let i = emoji.length - 1; i > (0 - 1); i--) {
        var regexp = new RegExp(emoji[i].ID, 'g');
        q = q.replace(regexp, "絵文字、" + emoji[i].name);
    };
    return q;
};