const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // ✅ must match your actual file name
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);

// ✅ PDF PREVIEW HANDLER (creates a PDF then opens it)
ipcMain.handle("print-preview", async () => {
  if (!mainWindow) return null;

  // Create PDF from the current window
  const pdfData = await mainWindow.webContents.printToPDF({
    printBackground: true,
    marginsType: 1, // default margins
  });

  // Save in temp folder
  const pdfPath = path.join(
    app.getPath("temp"),
    `DTR-Preview-${Date.now()}.pdf`,
  );
  fs.writeFileSync(pdfPath, pdfData);

  // Open PDF in default viewer (this is your "preview")
  await shell.openPath(pdfPath);

  return pdfPath;
});

// macOS behavior
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
