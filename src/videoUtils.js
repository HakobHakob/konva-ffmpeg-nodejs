//node src/videoUtils.js
const fs = require("fs")
const path = require("path")
const execa = require("execa")
const Konva = require("konva")

const frameLength = 6

const loadKonvaImage = (url) => {
  return new Promise((res) => {
    Konva.Image.fromURL(url, res)
  })
}

const loadImageAsset = (filename) => {
  return loadKonvaImage(path.join(__dirname, "../assets", filename))
}

function makeAnimation(callback, { startFrame, duration }) {   
  return (frame) => {
    const thisFrame = frame - startFrame
    if (thisFrame > 0 && thisFrame <= duration) {
      callback(thisFrame / duration)
    }
  }
}

const combineAnimations = (...animations) => {
  return (frame) => {
    for (const animation of animations) {
      if (animation) {
        animation(frame)
      }
    }
  }
}

const saveFrame = async ({ stage, outputDir, frame }) => {
  const data = stage.toDataURL()

  // remove the data header
  const base64Data = data.substring("data:image/png;base64,".length)

  const fileName = path.join(
    outputDir,
    `frame-${String(frame + 1).padStart(frameLength, "0")}.png`
  )

  await fs.promises.writeFile(fileName, base64Data, "base64")
}

const createVideo = ({ fps, outputDir, output }) => {
  execa(
    "ffmpeg",
    [
      "-y",
      "-framerate",
      String(fps),
      "-i",
      `frame-%0${frameLength}d.png`,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      output,
    ],
    { cwd: outputDir }
  )
}

module.exports = {
  saveFrame,
  createVideo,
  loadKonvaImage,
  loadImageAsset,
  makeAnimation,
  combineAnimations,
}
