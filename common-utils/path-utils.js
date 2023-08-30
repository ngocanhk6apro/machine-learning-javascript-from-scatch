class PathUtils {
    static getPathCount(paths) {
        return paths.length;
    }

    static getPointCount(paths){
        return paths.flatMap(it => [...it]).length;
    }

    static getWidth(paths){
        const points = paths.flat();
        const x = points.map(p => p[0]);
        const min = Math.min(...x);
        const max = Math.max(...x);
        return max - min;
    }

    static getHeight(paths){
        const points = paths.flat();
        const y = points.map(p => p[1]);
        const min = Math.min(...y);
        const max = Math.max(...y);
        return max - min;
    }
}

if (typeof module !== "undefined") {
    module.exports = PathUtils;
}