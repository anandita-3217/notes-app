const {contextBridge, ipcRenderer} = require("electron");
contextBridge.executeInMainWorld("electronAPI",{
    loadPage: (page) => ipcRenderer.send("load-page",page),
});