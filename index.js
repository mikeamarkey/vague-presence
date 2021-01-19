;(async () => {
  const size = 8
  const frameSize = '200px'
  const speed = 200
  const socketUrl = 'ws://localhost:8080'
  let socket = null
  let people = {}

  function init() {
    connectSocket()
    initStream()
  }

  function sendImageData(imageData) {
    if (!socket || socket.readyState >= 2) {
      return
    }
    socket.send(JSON.stringify(imageData))
  }

  async function initStream() {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    canvas.style.width = canvas.style.height = frameSize
    const context = canvas.getContext('2d')

    const video = document.createElement('video')
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { width: { exact: size }, height: { exact: size } },
    })
    video.srcObject = stream
    video.onloadedmetadata = () => video.play()

    window.setInterval(() => {
      context.drawImage(video, 0, 0, size, size)
      sendImageData(context.getImageData(0, 0, size, size))
    }, speed)
  }

  function connectSocket() {
    try {
      socket = new WebSocket(socketUrl)
      socket.onmessage = (message) => {
        people = JSON.parse(message.data)
        for (let key in people) {
          if (people[key] === null) {
            continue
          }

          let person = document.getElementById(key)
          if (!person) {
            person = document.createElement('canvas')
            person.id = key
            person.width = person.height = size
            person.style.width = person.style.height = frameSize
            document.getElementById('people').appendChild(person)
          }
          let context = person.getContext('2d')
          let arr = new Uint8ClampedArray(Object.values(people[key].data))
          let imageData = new ImageData(arr, size, size)
          context.putImageData(imageData, 0, 0)
        }
      }
    } catch (e) {
      console.log('no comprendo', e)
    }
  }

  window.addEventListener('load', init, false)
})()
