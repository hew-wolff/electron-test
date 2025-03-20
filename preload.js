const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('main', {
    /*
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
*/
  saveFile: (n, arrayBuffer) => ipcRenderer.invoke('saveFile', n, arrayBuffer)
  // we can also expose variables, not just functions
})
