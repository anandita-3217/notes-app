const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 550,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    // Add these properties for a cuter window
    transparent: false,
    frame: false,
    roundedCorners: true,
    backgroundColor: '#fef8ff'
  });
  
  win.removeMenu();
  win.loadFile("index.html");
  
  ipcMain.on("load-page", (event, page) => {
    win.loadFile(page);
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
// Add these lines to your existing ipcMain handlers
ipcMain.on("minimize-window", () => {
    win.minimize();
  });
ipcMain.on("maximize-window", () => {
    win.maximize();
  });
  
  ipcMain.on("close-window", () => {
    win.close();
  });