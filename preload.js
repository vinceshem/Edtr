const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  printPreview: (html) => ipcRenderer.send('print-preview', html)
});