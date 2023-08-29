const express = require("express");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const childProcess = require("child_process");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const parentDir = path.dirname(process.cwd());
const sampleDataPath = path.join(parentDir, "data-processor", "data", "sample.json");
const featuresDataPath = path.join(parentDir, "data-processor", "data", "features.json");

if (!fs.existsSync(sampleDataPath) || !fs.existsSync(featuresDataPath)) {
    throw "You should run data processor first";
}

const parentImagePath = path.join(parentDir, "data-processor", "data", "dataset", "image");
/*
*
* Routes
*
* */
app.get("/", (req, resp) => {
    //resp.sendFile("creator.html");
    resp.sendFile("creator.html", { root: path.join(__dirname, "public")});
});

app.get("/viewer", (req, resp) => {
    resp.sendFile("viewer.html", { root: path.join(__dirname, "public")});
});

app.get("/sample-json", (req, resp) => {
    resp.json(JSON.parse(fs.readFileSync(sampleDataPath).toString()));
});

app.get("/features-json", (req, resp) => {
    resp.json(JSON.parse(fs.readFileSync(featuresDataPath).toString()));
});


app.get("/image/:name", (req, resp) => {
    resp.sendFile(path.join(parentImagePath, req.params.name));
});

const PORT = process.env.PORT || 2023;

let braveProcess = undefined;
process.on("exit", () => {
    braveProcess.close(0);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT signal, shutting down...');
    // Perform cleanup tasks here
    braveProcess.close(0);
    process.exit(0);
});

process.on("uncaughtException", () => {
    braveProcess.close(0);
});

app.listen(PORT, (err) => {
    if (err) {
        console.log("Cannot start server.");
        console.log(err);
    } else {
        console.log(`Server started at port ${PORT}`);
        braveProcess = childProcess.spawn('C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe', ['--new-window', `http://localhost:${PORT}`]);
    }
});