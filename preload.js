const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('main', {
  saveFile: (arrayBuffer, filenameExtension) => ipcRenderer.invoke('saveFile', arrayBuffer, filenameExtension)
})
