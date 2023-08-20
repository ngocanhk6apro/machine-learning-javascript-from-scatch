class SketchPad {
    #paths = [];
    #ctx;
    #isDrawing = false;
    #canvas;
    #drawFinishedListeners = [];

    constructor(container, size=400) {
        const canvas = document.createElement("canvas");
        canvas.width= size;
        canvas.height= size;
        canvas.setAttribute("id", "canvas");
        container.append(canvas);
        this.#addEventListeners(canvas);
        this.#ctx = canvas.getContext("2d");
        this.#canvas = canvas;
    }

    addDrawFinishListener(listener) {
        if (typeof listener === "function") {
            this.#drawFinishedListeners.push(listener);
        } else {
            console.log("Wrong value for listener.")
        }
    }

    get hasPaths() {
        return this.#paths.length > 0;
    }

    #addEventListeners(canvas) {
        canvas.onmousedown = (evt) => {
            this.#isDrawing = true;
            this.#paths.push([this.#getMouse(evt)]);
        };

        canvas.onmouseup = () => {
            this.#isDrawing = false;
        };

        canvas.onmousemove = (evt) => {
            if (!this.#isDrawing) {
                return;
            }

            const lastPath = this.#paths.at(-1);
            lastPath.push(this.#getMouse(evt));
            this.#redraw(evt);
        };

        canvas.ontouchstart = (evt) => canvas.onmousedown(evt.touches[0]);
        canvas.ontouchmove = (evt) => canvas.onmousemove(evt.touches[0]);
        canvas.ontouchend = () => this.#isDrawing = false;
    }

    undo() {
        this.#paths.pop();
        this.#redraw();
    }

    #redraw() {
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#draw()
    }

    reset() {
        this.#paths = [];
        this.#redraw();
    }

    get paths() {
        return this.#paths;
    }

    #draw() {
        for(let idx = 0; idx <this.#paths.length; idx++) {
            this.#drawPath(this.#paths[idx])
        }

        for(let listener of this.#drawFinishedListeners) {
            listener(this.#paths.length > 0)
        }
    }

    #drawPath(path=[]) {
        this.#ctx.strokeStyle="brown";
        this.#ctx.lineWidth = 2;
        this.#ctx.beginPath();
        this.#ctx.moveTo(...path[0]);
        for (let idx=1; idx < path.length; idx++) {
            this.#ctx.lineTo(...path[idx]);
        }
        this.#ctx.lineCap = "round";
        this.#ctx.lineJoin = "round";
        this.#ctx.stroke();
    }

    #getMouse(evt) {
        const rect = evt.target.getBoundingClientRect();
        return [
            Math.round(evt.clientX - rect.left),
            Math.round(evt.clientY - rect.top)
        ];
    }
}