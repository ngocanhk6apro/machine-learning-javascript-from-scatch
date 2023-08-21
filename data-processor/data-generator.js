const fs = require("fs");
const {rawDataPath, dataPath, jsonDataSetPath, imageDataSetPath, dataSetPath} = require("./constants");
const path = require("path");
const { createCanvas } = require("canvas");
const {showProgress} = require("./progress-reporter");
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext("2d");
const cliProgress = require('cli-progress');

if (!fs.existsSync(dataSetPath)) {
    fs.mkdirSync(dataSetPath);
}

const files = fs.readdirSync(rawDataPath);
const total = files.length * 8;

function generateSampleFile() {
    let id = 1;
    const mergedFiles = files.map((file) => JSON.parse(fs.readFileSync(path.join(rawDataPath, file))))
        .flatMap(({session, student, drawings}) => Object.keys(drawings).map(key => ({
            id: id++,
            label: key,
            student_name: student,
            student_id: session
        })));

    fs.writeFileSync(path.join(dataPath, "sample.json"), JSON.stringify(mergedFiles, null, 3));
}
//generateSampleFile();

function generateJsonDataSet() {
    if (!fs.existsSync(jsonDataSetPath)) {
        fs.mkdirSync(jsonDataSetPath);
    }

    let id = 1;
    files.map(file => JSON.parse(fs.readFileSync(path.join(rawDataPath, file))))
        .forEach(({drawings}) => {
            for(let label in drawings) {
                fs.writeFileSync(path.join(jsonDataSetPath, `${id++}.json`), JSON.stringify(drawings[label], null, 3));
                showProgress(id, total);
            }
        });
    console.log("ok");
}
//generateJsonDataSet();

function drawImage(paths = []) {
    for(let idx = 0; idx < paths.length; idx++) {
        drawPath(paths[idx])
    }
    const buffer = canvas.toBuffer("image/png");
    clearCanvas();
    return buffer;
}

function clearCanvas() {
    ctx.clearRect(0, 0, 400, 400);
}

function drawPath(path = []) {
    ctx.strokeStyle="black";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(...path[0]);
    for (let idx=1; idx < path.length; idx++) {
        ctx.lineTo(...path[idx]);
    }
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
}

function generateImageFiles() {
    if (!fs.existsSync(imageDataSetPath)) {
        fs.mkdirSync(imageDataSetPath);
    }

    let id = 1;
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(total, id);
    files.map(file => JSON.parse(fs.readFileSync(path.join(rawDataPath, file))))
        .forEach(({drawings}) => {
            for(let label in drawings) {
                const image = drawImage(drawings[label]);
                fs.writeFileSync(path.join(imageDataSetPath, `${id++}.png`), image);
                //showProgress(id, total);
                progressBar.update(id);
            }
        });
    progressBar.stop();
}
generateImageFiles();