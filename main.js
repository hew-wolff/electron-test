const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

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

const saveFile = (n, arrayBuffer) => {
  console.log('n: ' + JSON.stringify(n))
  console.log('data: ' + JSON.stringify(arrayBuffer))
  console.log(`app got ArrayBuffer with ${arrayBuffer.byteLength} bytes`)
/*
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
}

app.whenReady().then(() => {
  ipcMain.handle('saveFile', (_event, n, arrayBuffer) => saveFile(n, arrayBuffer))

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
