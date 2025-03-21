const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const { open, writeSync, closeSync, writeFile } = require('node:fs')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

const saveFile = (arrayBuffer, filenameExtension) => {
  console.log('data: ' + JSON.stringify(arrayBuffer))
  console.log(`app got ArrayBuffer with ${arrayBuffer.byteLength} bytes`)
  const buffer = Buffer.from(arrayBuffer)
  const filename = 'temp_video.' + filenameExtension
  const videoPath = path.join(__dirname, filename)
  // TODO try UInt8Array
  writeFile(videoPath, buffer, (err) => {
    if (err) {
      throw err
    }
    console.log('saved file')
  })
}

app.whenReady().then(() => {
    ipcMain.handle('saveFile', (_event, arrayBuffer, filenameExtension) => saveFile(arrayBuffer, filenameExtension))

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })    
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
