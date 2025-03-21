const initialize = () => {
  console.log('init');
  const recordStart = document.querySelector('.recordStart')
  const recordEnd = document.querySelector('.recordEnd')
  const videoElement = document.querySelector('.video')

  recordStart.disabled = true
  recordEnd.disabled = true

  const newMediaRecorder = (mimeType) => {
    if (!(navigator.mediaDevices?.getUserMedia)) {
      console.log("getUserMedia not supported on your browser!")
      return undefined
    }
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).
      then((stream) => {
        console.log('got stream')
        mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });
        console.log('MediaRecorder: ' + JSON.stringify(mediaRecorder));
        console.log('mimeType: ' + JSON.stringify(mediaRecorder.mimeType));
        mediaRecorder.ondataavailable = async (e) => {
          console.log('recorder got data')
          await displayVideo(e.data)
        }
        return mediaRecorder
    }).
    catch((err) => {
      console.error(`The following getUserMedia error occurred: ${err}`)
      recordStart.disabled = false
      recordEnd.disabled = true

      return undefined
    })
  }

  // Seems to work better than MP4.
  const mimeType = 'video/webm'
  const mimeTypeFileExtension = 'webm'
  let mediaRecorder = newMediaRecorder(mimeType);

  recordStart.onclick = () => {
    recordStart.disabled = true
    recordEnd.disabled = false
    //chunks = []
    mediaRecorder.start()
    console.log('recorder started: ' + mediaRecorder.state)
  }

  recordEnd.onclick = async () => {
    recordStart.disabled = false
    recordEnd.disabled = true
    mediaRecorder.stop()
    console.log('recorder stopped: ' + mediaRecorder.state)
  }

  const displayVideo = async (chunk) => {
    const blob = new Blob([chunk], { type: mimeType })
    console.log(`got blob with ${blob.size} bytes`)
    const arrayBuffer = await blob.arrayBuffer()
    window.main.saveFile(arrayBuffer, mimeTypeFileExtension)

    videoElement.src = URL.createObjectURL(blob)
    videoElement.load()
  }

  recordStart.disabled = false
  recordEnd.disabled = true
}

initialize()
