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

  // TODO fix bug: first attempt at recording gets 0 bytes.
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).
    then((stream) => {
        console.log('got stream')
        //mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
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

    //const blob = new Blob(chunks, { type: 'video/mp4' })
    const blob = new Blob(chunks, { type: 'video/webm' })
    console.log(`got blob with ${blob.size} bytes`)
    const arrayBuffer = await blob.arrayBuffer();      
    window.main.saveFile(arrayBuffer)
  }

  recordStart.disabled = false
  recordEnd.disabled = true
}

initialize()
