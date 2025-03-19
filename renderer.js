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

const openCamera = () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.")
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).
      then((stream) => {
        console.log('got stream')
      }).
      catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`)
      })
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
}

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

  recordStart.onclick = () => {
    recordStart.disabled = true
    recordEnd.disabled = false
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true }).
      then((stream) => {
        console.log('got stream')
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
        mediaRecorder.start();
        console.log(mediaRecorder.state)
        console.log("recorder started")
      }).
      catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`)
        recordStart.disabled = false
        recordEnd.disabled = true
      })
  }

  recordEnd.onclick = () => {
    recordStart.disabled = false
    recordEnd.disabled = true
    mediaRecorder.stop();
    console.log(mediaRecorder.state);
    console.log("recorder stopped");

    const blob = new Blob(chunks, { type: "video/mp4" })
    console.log(`got blob with ${blob.size} bytes`)
  }

  recordStart.disabled = false
  recordEnd.disabled = true
}

initialize()

//openCamera()
