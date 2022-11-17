//node src/videoUtils.js
const fs = require("fs")
const path = require("path")
const util = require("node:util")
const exec = util.promisify(require("node:child_process").exec)
const Konva = require("konva")

const frameLength = 6

const loadKonvaImage = (url) => {
    return new Promise((res) => {
        Konva.Image.fromURL(url,res)
    })
}

console.log(loadKonvaImage())