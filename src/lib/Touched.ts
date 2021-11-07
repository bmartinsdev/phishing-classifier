export class TouchedJs {
    element;
    moving;
    finished;
    startPos;
    currentPos;

    constructor(element, options = {}) {
        this.element = element;
        for (const [option, value] of Object.entries(options)) {
            this[option] = value;
        }
        document.addEventListener('touchstart', this.handleStart, false);
        document.addEventListener('mousedown', this.handleStart, false);
        document.addEventListener('touchmove', this.handleMove, false);
        document.addEventListener('mousemove', this.handleMove, false);
        document.addEventListener('touchend', this.handleEnd, false);
        document.addEventListener('mouseup', this.handleEnd, false);
    }

    handleMove = (e) => {
        if (!this.moving) return;

        this.currentPos = {
            x: e.clientX - this.startPos.x,
            y: e.clientY - this.startPos.y
        }

        this.element.dispatchEvent(new CustomEvent('pan', { bubbles: true, cancelable: true, detail: { e, pos: this.currentPos } }));
    }

    handleStart = (e) => {
        if (e.target !== this.element) return;

        this.moving = true;
        this.finished = false;
        this.startPos = {
            x: e.clientX,
            y: e.clientY
        }

        this.element.dispatchEvent(new CustomEvent('start', { bubbles: true, cancelable: true, detail: e }));
    }

    handleEnd = (e) => {
        this.moving = false;
        this.finished = true;

        this.element.dispatchEvent(new CustomEvent('end', { bubbles: true, cancelable: true, detail: e }));
    }

}