const express = require("express");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.static("public"));

const path = require("path");
const parentDir = path.dirname(process.cwd());
const sampleDataPath = path.join(parentDir, "data-processor", "data", "sample.json");
if (!fs.existsSync(sampleDataPath)) {
    throw "You should run data processor first";
}

const parentImagePath = path.join(parentDir, "data-processor", "data", "dataset", "image");
/*
*
* Routes
*
* */
app.get("/", (req, resp) => {
    resp.sendFile("index.html");
});

app.get("/sample-json", (req, resp) => {
    resp.json(JSON.parse(fs.readFileSync(sampleDataPath)));
});

app.get("/image/:name", (req, resp) => {
    resp.sendFile(path.join(parentImagePath, req.params.name));
});

const PORT = process.env.PORT || 2023;

app.listen(PORT, (err) => {
    if (err) {
        console.log("Cannot start server.");
        console.log(err);
    } else {
        console.log(`Server started at port ${PORT}`)
    }
});