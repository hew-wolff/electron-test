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

  // Seems to work better than MP4.
  const mimeType = 'video/webm'
  const mimeTypeFileExtension = 'webm'
  let mediaRecorder;
  let chunks = [];

  // TODO fix bug: first attempt at recording gets 0 bytes.
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).
    then((stream) => {
        console.log('got stream')
        mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });
        console.log('MediaRecorder: ' + JSON.stringify(mediaRecorder));
        console.log('mimeType: ' + JSON.stringify(mediaRecorder.mimeType));
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

    const blob = new Blob(chunks, { type: mimeType })
    console.log(`got blob with ${blob.size} bytes`)
    const arrayBuffer = await blob.arrayBuffer()
    window.main.saveFile(arrayBuffer, mimeTypeFileExtension)

    const videoElement = document.querySelector('.video')
    const videoUrl = URL.createObjectURL(blob)
    videoElement.src = videoUrl
    videoElement.load()
  }

  recordStart.disabled = false
  recordEnd.disabled = true
}

initialize()
