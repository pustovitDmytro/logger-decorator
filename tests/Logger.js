export default class Logger {
    constructor({ levels = [ 'info', 'verbose', 'error' ] } = {}) {
        this.stack = {};
        levels.forEach(level => {
            this.stack[level] = [];
            this[level] = this._buildLevel(level);
        });
    }
    _buildLevel = level => arg => {
        this.stack[level].push(arg);
    }

    stdout = level => {
        return this.stack[level];
    }
}
