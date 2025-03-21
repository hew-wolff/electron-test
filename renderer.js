const initialize = async () => {
  console.log('init')
  const recordStart = document.querySelector('.recordStart')
  const recordEnd = document.querySelector('.recordEnd')
  const videoElement = document.querySelector('.video')

  const newMediaRecorder = async (mimeType, mimeTypeFileExtension) => {
    let result        
    if (!(navigator.mediaDevices?.getUserMedia)) {
      console.log("getUserMedia not supported on your browser!")
      return undefined
    }
    console.log('get stream')
    try {
      let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log('got stream')
      result = new MediaRecorder(stream, { mimeType: mimeType })
      console.log('MediaRecorder: ' + JSON.stringify(result))
      console.log('mimeType: ' + JSON.stringify(result.mimeType))
      result.ondataavailable = async (e) => {
        console.log('recorder got data')
        await displayVideo(e.data, mimeType, mimeTypeFileExtension)
      }
    } catch (err) {
      console.error(`The following getUserMedia error occurred: ${err}`)
      return undefined
    }
    return result
  }

  // Seems to work better than MP4.
  const mediaRecorder = await newMediaRecorder('video/webm', 'webm')

  recordStart.onclick = () => {
    recordStart.disabled = true
    recordEnd.disabled = false
    mediaRecorder.start()
    console.log('recorder started: ' + mediaRecorder.state)
  }

  recordEnd.onclick = async () => {
    recordStart.disabled = false
    recordEnd.disabled = true
    mediaRecorder.stop()
    console.log('recorder stopped: ' + mediaRecorder.state)
  }

  const displayVideo = async (chunk, mimeType, mimeTypeFileExtension) => {
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
