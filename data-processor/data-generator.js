const fs = require("fs");
const {rawDataPath, dataPath, jsonDataSetPath} = require("./constants");
const path = require("path")



const files = fs.readdirSync(rawDataPath);

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
    let id = 1;
    files.map(file => JSON.parse(fs.readFileSync(path.join(rawDataPath, file))))
        .forEach(({drawings}) => {
            for(let label in drawings) {
                fs.writeFileSync(path.join(jsonDataSetPath, `${id++}.json`), JSON.stringify(drawings[label], null, 3));
            }
        });
    console.log("ok");
}
//generateJsonDataSet();

function generateImageFiles() {
    
}
