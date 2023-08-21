class ProgressReporter {
    static #formatPercent(number) {
        return (number * 100).toFixed(2) + "%";
    }

    static showProgress(currentVal, total) {
        process.stdout.clearLine(-1);
        process.stdout.cursorTo(0);
        const percent = ProgressReporter.#formatPercent((currentVal/total));
        process.stdout.write(`${currentVal}/${total} (${percent})`);
    }
}

module.exports = ProgressReporter;