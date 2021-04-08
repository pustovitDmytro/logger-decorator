module.exports = process.env.BUILD !== '0'
    ? require('../lib')
    : require('../src');

