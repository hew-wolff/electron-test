const { contextBridge, ipcRenderer } = require('electron')

// Allow file saving from the renderer.
contextBridge.exposeInMainWorld('main', {
  saveFile: (arrayBuffer, filenameExtension) => ipcRenderer.invoke('saveFile', arrayBuffer, filenameExtension)
})
