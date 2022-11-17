require("konva-node")
const path = require("path")
const uuid = require("uuid")


const run = async () => {
  const outputDir = path.join(__dirname,"../tmpVideo")
  const output = path.join(__dirname,`output-video-${uuid.v1()}.mp4`)

  await renderVideo({outputDir,output})
}

run().catch(console.error)