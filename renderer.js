/*
const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`
*/
/*
const func = async () => {
  const response = await window.versions.ping()
  console.log(response)
}

func()
*/

const initialize = () => {
  console.log('init');
  const recordStart = document.querySelector('.recordStart')
  const recordEnd = document.querySelector('.recordEnd')

  recordStart.disabled = true
  recordEnd.disabled = true

  if (!(navigator.mediaDevices?.getUserMedia)) {
    console.log("getUserMedia not supported on your browser!")
    return
  }

  let mediaRecorder;
  let chunks = [];

  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).
    then((stream) => {
        console.log('got stream')
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data)
        }
    }).
    catch((err) => {
      console.error(`The following getUserMedia error occurred: ${err}`)
      recordStart.disabled = false
      recordEnd.disabled = true
    })

  recordStart.onclick = () => {
    recordStart.disabled = true
    recordEnd.disabled = false
    mediaRecorder.start()
    console.log(mediaRecorder.state)
    console.log("recorder started")
  }

  recordEnd.onclick = async () => {
    recordStart.disabled = false
    recordEnd.disabled = true
    mediaRecorder.stop()
    console.log(mediaRecorder.state)
    console.log("recorder stopped")

    const blob = new Blob(chunks, { type: "video/mp4" })
    console.log(`got blob with ${blob.size} bytes`)
    const arrayBuffer = await blob.arrayBuffer();      
    window.main.saveFile(33, arrayBuffer)
  }

  recordStart.disabled = false
  recordEnd.disabled = true
}

initialize()
