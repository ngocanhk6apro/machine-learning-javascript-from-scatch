const PathUtils = Object.freeze({
    getPathCount: (paths) => paths.length,
    getPointCount : (paths) => paths.flatMap(it => [...it]).length,
    getWidth : (paths) => {
        const points = paths.flat();
        const x = points.map(p => p[0]);
        const min = Math.min(...x);
        const max = Math.max(...x);
        return max - min;
    },
    getHeight : (paths) => {
        const points = paths.flat();
        const y = points.map(p => p[1]);
        const min = Math.min(...y);
        const max = Math.max(...y);
        return max - min;
    }
});

if (typeof module !== "undefined") {
    module.exports = PathUtils;
}