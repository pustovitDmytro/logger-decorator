module.exports = process.env.BUILD
    ? require('../lib')
    : require('../src');

