// Import parts of electron to use
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const url = require("url");

let mainWindow;
let dev = false;

if (
	process.defaultApp ||
	/[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
	/[\\/]electron[\\/]/.test(process.execPath)
) {
	dev = true;
}

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 700,
		frame: false,
		show: false,
		minHeight: 200,
		minWidth: 350
	});

	let indexPath;
	if (dev && process.argv.indexOf("--noDevServer") === -1) {
		indexPath = url.format({
			protocol: "http:",
			host: "localhost:4000",
			pathname: "index.html",
			slashes: true
		});
	} else {
		indexPath = url.format({
			protocol: "file:",
			pathname: path.join(__dirname, "dist", "index.html"),
			slashes: true
		});
	}

	mainWindow.loadURL(indexPath);

	mainWindow.once("ready-to-show", () => {
		mainWindow.show();

		if (dev) {
			mainWindow.webContents.openDevTools();
		}
	});

	mainWindow.on("closed", function() {
		mainWindow = null;
	});
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on("open-file-dialog", function(event) {
	dialog.showOpenDialog(
		{ properties: ["openFile"], filters: [{ name: "Important Fixes", extensions: ["txt"] }] },
		openPath => {
			if (openPath) event.sender.send("selected-file", openPath);
		}
	);
});
