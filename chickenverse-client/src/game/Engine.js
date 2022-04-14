export default class Game {
    constructor({ canvas }) {
        this.canvas = canvas.current;
        this.ctx = canvas.getContext("2d");
    }
}
