const path = require("path");

class Constants {
    static #baseDirectory = "./data"

    static get rawDataPath() {
        return path.join(this.#baseDirectory, "raw");
    }

    static get dataPath() {
        return path.join(this.#baseDirectory);
    }

    static get jsonDataSetPath() {
        return path.join(this.#baseDirectory, "dataset", "json");
    }

    static get imageDataSetPath() {
        return path.join(this.#baseDirectory, "dataset", "image");
    }
}

module.exports = Constants;