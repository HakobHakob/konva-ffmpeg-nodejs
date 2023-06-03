const { url } = require("inspector")
const Konva = require("konva")
const { videoWidth, videoHeight, videoFps } = require("./consts.js")
const {
  saveFrame,
  createVideo,
  loadImageAsset,
  makeAnimation,
  combineAnimations,
} = require("./videoUtils")

const renderBackground = (layer) => {
  layer.add(
    new Konva.Rect({
      x: 0,
      y: 0,
      width: videoWidth,
      height: videoHeight,
      fill: "white",
    })
  )
}

const renderText = (layer) => {
  const hello = new Konva.Text({
    align: "center",
    x: -videoWidth,
    width: videoWidth,
    y: 150,
    fontSize: 200,
    fontStyle: "bold",
    text: "Hello",
    fill: "#1E3740",
  })

  const from = new Konva.Text({
    align: "center",
    x: videoWidth,
    width: videoWidth,
    y: 350,
    fontSize: 150,
    fill: "#1E3740",
    text: "from",
  })

  const konva = new Konva.Text({
    align: "center",
    x: 0,
    width: videoWidth,
    y: 500,
    fontSize: 300,
    fontStyle: "bold",
    fill: "#129A74",
    text: "Konva",
    opacity: 0.2,
  })

  layer.add(hello, from, konva)

  return combineAnimations(
    makeAnimation((d) =>
  
    hello.x((d - 1) * videoWidth), {
      startFrame: 0,
      duration: 2 * videoFps,
    }),
    makeAnimation((d) => from.x((1 - d) * videoWidth), {
      startFrame: 1 * videoFps,
      duration: 2 * videoFps,
    }),
    makeAnimation((d) => konva.opacity(d), {
      startFrame: 2.5 * videoFps,
      duration: 1 * videoFps,
    })
  )
}

const renderLogo = async (layer, image) => {
  image.width(videoHeight)
  image.height(videoWidth)
  image.y(0)
  image.x(0)
  image.cache()
  image.opacity(0.1)
  layer.add(image)

  return makeAnimation((d) => image.opacity(d), {
    startFrame: 5 * videoFps,
    duration: 1 * videoFps,
  })
}

const renderVideo = async ({ outputDir, output }) => {
  const stage = new Konva.Stage({
    width: videoWidth,
    height: videoHeight,
  })
  const start = Date.now()
  const frames = 5 * videoFps

  try {
    const layer = new Konva.Layer()
    stage.add(layer)
    const image = await loadImageAsset("../assets/logo.jpg")
    const animate = combineAnimations(
      renderBackground(layer),
      renderText(layer),
      renderLogo(layer, image)
    )

    console.log("generating frames...")
    for (let frame = 0; frame < frames; ++frame) {
      animate(frame)
      layer.draw()
      await saveFrame({ stage, outputDir, frame })
      if ((frame + 1) % videoFps === 0) {
        console.log(`rendered ${(frame + 1) / videoFps} second(s)`)
      }
    }
    
  } finally {
    stage.destroy()
  }

  console.log("creating video")
  createVideo({ fps: videoFps, outputDir, output })
  const time = Date.now() - start
  console.log(`done in ${time} ms. ${(frames * 1000) / (time || 0.01)} FPS`)
}

module.exports = {
  renderVideo,
}
