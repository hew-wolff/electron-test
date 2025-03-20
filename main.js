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

//const videoFilename = 'temp_video.mp4'
const videoFilename = 'temp_video.webm'

const saveFile = (arrayBuffer) => {
  console.log('data: ' + JSON.stringify(arrayBuffer))
  console.log(`app got ArrayBuffer with ${arrayBuffer.byteLength} bytes`)
  let buffer = Buffer.from(arrayBuffer)
  let videoPath = path.join(__dirname, videoFilename)
    /*
  open(videoPath, 'w', (err, fd) => {
    if (err) {
      throw err
    }

    try {
      console.log('writing file')
      writeSync(fd, buffer)
      console.log('closing file')
      closeSync(fd)
    } catch (err) {
      closeSync(fd)
      throw err
    }
  })
    */
  // TODO try UInt8Array
  writeFile(videoPath, buffer, (err) => {
    if (err) {
      throw err
    }
    console.log('saved file')
  })
}

app.whenReady().then(() => {
  ipcMain.handle('saveFile', (_event, arrayBuffer) => saveFile(arrayBuffer))

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

/*
const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
Pass it to main process via "context bridge" to be written to a file.
//var file = new File([blob], "file_name", {lastModified: 1534584790000});

buffer = Buffer.from(ab)
//fs.rmSync(path, { force: true })
fs.open(path, 'w', (err, fd) => {
  if (err) throw err;

  try {
    fs.writeSync(fd, buffer);
    fs.closeSync(fd);
  } catch (err) {
    fs.closeSync(fd);
    throw err;
  }
});
*/
