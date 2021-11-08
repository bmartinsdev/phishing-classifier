export class TouchedJs {
    element;
    moving;
    startPos;

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
        const pos = this.getPos(e);

        this.element.dispatchEvent(new CustomEvent('pan', { bubbles: true, cancelable: true, detail: { e, pos } }));
    }

    handleStart = (e) => {
        if (e.target !== this.element) return;
        this.moving = true;
        const pos = this.getPos(e);
        this.startPos = pos;

        this.element.dispatchEvent(new CustomEvent('start', { bubbles: true, cancelable: true, detail: { e, pos } }));
    }

    handleEnd = (e) => {
        this.moving = false;

        this.element.dispatchEvent(new CustomEvent('end', { bubbles: true, cancelable: true, detail: { e } }));
    }

    getPos(e) {
        if (e instanceof TouchEvent) {
            return {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            }
        } else {
            return {
                x: e.clientX,
                y: e.clientY
            }
        }
    }
}