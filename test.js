const { app, BrowserWindow } = require("electron");

let mainWindow; //ウィンドウ管理
//準備が整うと動作
app.on("ready", () => {
    //以下ウィンドウ生成
    mainWindow = new BrowserWindow({ width: 1200, height: 800, webPreferences: { preload: require("path").join(__dirname, "index.js"), nodeIntegration: true, contextIsolation: false } });
    mainWindow.loadFile("index.html"); //読み込むhtmlファイル
    mainWindow.on("closed", () => { mainWindow = null; }); //ウィンドウが閉じられると...
});
app.on("activate", () => { }); //ウィンドウがアクティブになったとき
app.on("window-all-closed", () => { app.quit(); console.log("all closed"); }); //全てのウィンドウが閉じられると動作