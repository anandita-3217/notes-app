const path = require ("path");
const { app, BrowswerWindow, ipcMain} = require ("electron") ;
const fs = require("fs");
const { contextIsolated } = require("process");

let win;
function createWindow(){
    win = new BrowswerWindow({
        width: 550,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload : path.join(__dirname,"preload.js"),
        },
    });
    win.removeMenu();
    win.loadFile("index.html");
    ipcMain.on("load-page",(event,page) => {
        win.loadFile(page);
    });

}
app.whenReady().then(() => {
    createWindow();
    app.on("activate",() => {
        if (BrowswerWindow.getAllWindows().length === 0){
            createWindow();
        }
    });
});
