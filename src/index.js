//node src/index.js
require("konva-node")
const { renderVideo } = require("./renderVideo")
const path = require("path")
// const uuid = require("uuid")


const run = async () => {
  const outputDir = path.join(__dirname,"../tmpVideo")
  const output = path.join(__dirname,`../../tmpVideo/output-video-1.mp4`)

  await renderVideo({outputDir,output})
}

run().catch(console.error)