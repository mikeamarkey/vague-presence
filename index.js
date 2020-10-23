(async () => {
  const size = 8
  const frameSize = '100px'
  const speed = 1000

  async function initStream() {
    const canvas = document.getElementById('canvas')
    canvas.width = canvas.height = size
    canvas.style.width = canvas.style.height = frameSize
    const context = canvas.getContext('2d')

    const video = document.createElement('video')
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { width: { exact: size }, height: { exact: size } }
    })
    video.srcObject = stream
    video.onloadedmetadata = () => video.play()

    window.setInterval(() => {
      context.drawImage(video, 0, 0, size, size)
    }, speed)
  }

  function init() {
    initStream()
  }

  window.addEventListener('load', init, false)
})()
