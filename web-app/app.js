const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.static("public"));

/*
*
* Routes
*
* */
app.get("/", (req, resp) => {
    resp.sendFile("index.html");
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