const initialize = async () => {
  console.log('init')
  const startButton = document.querySelector('.recordingStart')
  const endButton = document.querySelector('.recordingEnd')
  const recordingLabel = document.querySelector('.recordingLabel')
  const videoElement = document.querySelector('.video')

  const newMediaRecorder = async (mimeType, mimeTypeFileExtension) => {
    let result        
    if (!(navigator.mediaDevices?.getUserMedia)) {
      console.log("getUserMedia not supported on your browser!")
      return undefined
    }
    console.log('get stream')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      console.log('got stream')
      result = new MediaRecorder(stream, { mimeType: mimeType })
      console.log('mimeType: ' + JSON.stringify(result.mimeType))
      // We get one event with all the data when the recorder stops.
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

  // WEBM seems to work better than MP4.
  const mediaRecorder = await newMediaRecorder('video/webm', 'webm')

  startButton.onclick = () => {
    updateForRecording(true)
    mediaRecorder.start()
    console.log('recorder started: ' + mediaRecorder.state)
  }

  endButton.onclick = async () => {
    updateForRecording(false)
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

  const updateForRecording = (recording) => {
    if (recording) {
      recordingLabel.innerText = 'Recording'
      recordingLabel.style.color = 'red'
      startButton.disabled = true
      endButton.disabled = false
    } else {
      recordingLabel.innerText = 'Record'
      recordingLabel.style.color = 'black'
      startButton.disabled = false
      endButton.disabled = true
    }
  }

  updateForRecording(false)
}

initialize()
