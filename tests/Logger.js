export default class Logger {
    constructor({ levels = [ 'info', 'verbose', 'error' ] } = {}) {
        this.stack = {};
        this.levels = levels;
        this.init();
    }

    init() {
        for (const level of this.levels) {
            this.stack[level] = [];
            this[level] = this._buildLevel(level);
        }
    }

    clear() {
        for (const level of this.levels) {
            this.stack[level] = [];
        }
    }

    _buildLevel = level => arg => {
        this.stack[level].push(arg);
    };

    stdout = level => {
        return this.stack[level];
    };
}
