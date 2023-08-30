const fs = require("fs");
const path = require("path");
const cliProgress = require('cli-progress');
const PathUtils = require("../common-utils/path-utils");
const {rawDataPath, dataPath, jsonDataSetPath, imageDataSetPath, dataSetPath} = require("./constants");
const {showProgress} = require("./progress-reporter");

const { createCanvas } = require("canvas");
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext("2d");

if (!fs.existsSync(dataSetPath)) {
    fs.mkdirSync(dataSetPath);
}

const files = fs.readdirSync(rawDataPath);
const total = files.length * 8;

function generateSampleFile() {
    let id = 1;
    const mergedFiles = files.map((file) => getJSONFromFile(file))
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
    files.map(file => getJSONFromFile(file))
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

    drawBoundingBox(paths);
    const buffer = canvas.toBuffer("image/png");
    clearCanvas();
    return buffer;
}

function drawBoundingBox(paths) {
    const rect = getBoundingBox(paths);
    ctx.strokeStyle="black";
    ctx.lineWidth = 2;
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.stroke();
}

function getBoundingBox(paths) {
    const points = paths.flatMap(path => [...path]);
    const minX = Math.min(...points.map(p => p[0]));
    const minY = Math.min(...points.map(p => p[1]));
    const maxX = Math.max(...points.map(p => p[0]));
    const maxY = Math.max(...points.map(p => p[1]));
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
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

function getJSONFromFile(filePath) {
    const fileContent = fs.readFileSync(path.join(rawDataPath, filePath)).toString();
    return JSON.parse(fileContent);
}

function generateImageFiles() {
    if (!fs.existsSync(imageDataSetPath)) {
        fs.mkdirSync(imageDataSetPath);
    }

    let id = 1;
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(total, id);
    files.map(file => getJSONFromFile(file))
        .forEach(({drawings}) => {
            for(let label in drawings) {
                const image = drawImage(drawings[label]);
                fs.writeFileSync(path.join(imageDataSetPath, `${id++}.png`), image);
                progressBar.update(id);
            }
        });
    progressBar.stop();
}
//generateImageFiles();

const FeatureExtractTypes = Object.freeze({
    PATHS_AND_POINTS_COUNT : 1,
    WIDTH_AND_HEIGHT : 2
});


function extractFeatures(type) {
    console.log("START EXTRACT FEATURES...");
    let id = 1;
    const styles = {
        "car": {
            "color": "gray",
            "text": "🚕"
        },
        "fish": {
            "color": "red",
            "text": "🐠"
        },
        "house": {
            "color": "yellow",
            "text": "🏡"
        },
        "tree": {
            "color": "green",
            "text": "🌲"
        },
        "bicycle": {
            "color": "cyan",
            "text": "🚲"
        },
        "guitar": {
            "color": "blue",
            "text": "🎸"
        },
        "pencil": {
            "color": "magenta",
            "text": "✏"
        },
        "clock": {
            "color": "lightgray",
            "text": "⏰"
        }
    }

    let firstFeatureFunc = () => {};
    let secondFeatureFunc = () => {};

    let featureNames = [];

    if (type === FeatureExtractTypes.PATHS_AND_POINTS_COUNT) {
        firstFeatureFunc = PathUtils.getPathCount;
        secondFeatureFunc = PathUtils.getPathCount;
        featureNames = [
            "Path Count",
            "Point Count"
        ];
    } else if (type === FeatureExtractTypes.WIDTH_AND_HEIGHT) {
        firstFeatureFunc = PathUtils.getWidth;
        secondFeatureFunc = PathUtils.getHeight;
        featureNames = [
            "Width",
            "Height"
        ];
    } else {
        throw "Not found type to extract features";
    }

    const samples = files.map(file => getJSONFromFile(file))
        .flatMap(({drawings}) => Object.keys(drawings).map(drawingObjectName => ({
            id: id++,
            label: drawingObjectName,
            point: [
                firstFeatureFunc(drawings[drawingObjectName]),
                secondFeatureFunc(drawings[drawingObjectName])
            ]
        })));

    fs.writeFileSync(path.join(dataPath, "features.json"), JSON.stringify({
        featureNames,
        samples,
        styles
    }, null, 3));
    console.log("FINISHED!!")
}

function extractPathCountAndPointCountFeatures() {
    extractFeatures(FeatureExtractTypes.PATHS_AND_POINTS_COUNT);
}
//extractPathCountAndPointCountFeatures();

function extractWidthAndHeightFeatures() {
    extractFeatures(FeatureExtractTypes.WIDTH_AND_HEIGHT);
}
extractWidthAndHeightFeatures();
