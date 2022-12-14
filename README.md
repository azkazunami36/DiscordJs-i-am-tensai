# かずなみ用のDiscord Bot
自分用に作成しているbotです。  
自由に使ってもらっても構いませんが、出来れば[かずなみのサーバー](https://discord.gg/WEJGnEMhJJ)に  
入っていただけるとすごくうれしいです！  

### 使い方
2022/09/30更新の説明です。
スラッシュコマンドに対応しています。
- `/voice`を使うと音楽botとしての機能を利用することが出来ます。
    - `add [URL]`は主にYouTubeリンクを入れることで、音楽を聴く準備をすることができます。
    - `play`で`/add`を使用して追加したものを順番に再生します。一番最後のリストまで付くと、それをループします。
    - `stop`で再生を停止します。途中まで再生していたものはそのまま中断され、破棄されます。
    - `skip`で次のものへ行きます。次の曲がない場合は同じものが再生されます。
    - `volume vol[Num]`で音量を０～１００の間で調節することができます。
    - `status`で全ての状態を一気に表示します。
- `/help`でヘルプを表示します。まぁいろいろ
- `/change`で様々な機能をオンオフや変更することができます。
    - `reaction`を変更すると、あなたが送信する一部の特定メッセージにリアクションするかどうかを決められます
    - `reply`を変更すると、あなたが送信する一部の特定メッセージに返信するかどうかを決められます。
    - `statusd`は４つの種類があり、「オンライン」「離席中」「取り込み中」「オフライン」から選ぶことができます。変更するとbotのステータスが変更されます。
    - `statustext`を変更すると、プレイ中の内容を変更することができます。
以上です。

### 使うための下準備
使う前に、まずトークンの設定やbotの設定を整える必要があります。説明がめんどくさいので端折ってるかもしれませんがお許しを...
- 全ファイルをダウンロードし終える
- その後cmd等でそのフォルダまで移動し、`npm ci`を行う。そうすることで全パッケージが自動でダウンロードされます。
- `.env`ファイルを作成し、その中に`token`と`guildid`を追加する
```
token=xxxxxxxxxxxxxxxxxxxxxxxx.xxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxx
guildid=xxxxxxxxxxxxxxxxxx
```
終わりです。はやっ！？まぁその後に`npm run start`で実行ですっ！