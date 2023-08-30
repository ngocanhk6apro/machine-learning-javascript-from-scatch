class GraphUtils {
    static #distanceBetween(point1, point2) {
        const [x1, y1] = point1;
        const [x2, y2] = point2;
        return Math.sqrt(this.#squared(x1 - x2) + this.#squared(y1 - y2));
    }

    static #squared(number) {
        return Math.pow(number, 2)
    }

    static getNearestPointIndex(targetPoint, points) {
        let minDist=Number.MAX_SAFE_INTEGER;
        let nearestIndex=0;

        for(let i=0;i<points.length;i++){
            const point=points[i];
            const distance= GraphUtils.#distanceBetween(targetPoint,point);

            if(distance < minDist){
                minDist= distance;
                nearestIndex=i;
            }
        }
        return nearestIndex;
    }
}

if (typeof module !== "undefined") {
    module.exports = GraphUtils;
}