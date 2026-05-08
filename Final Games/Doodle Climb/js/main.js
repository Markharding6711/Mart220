const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 820,
    height: 1400,
    minWidth: 820,
    minHeight: 1000,
    resizable: true,
    center: true,
    autoHideMenuBar: true,
    backgroundColor: "#87ceeb",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile(path.join(__dirname, "index.html"));
}

ipcMain.on("quit-app", () => {
  app.quit();
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});