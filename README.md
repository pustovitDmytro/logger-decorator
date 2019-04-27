# logger-decorator
**logger-decorator** provides a unified and simple approach for class and function logging.

[![Version][badge-vers]][npm]
[![Dependencies][badge-deps]][npm]
[![Vulnerabilities][badge-vuln]](https://snyk.io/)
[![Build Status][badge-tests]][travis]
[![License][badge-lic]][github]

## Table of Contents
  - [Motivation](#motivation)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)

## Motivation
Winston has it's own console transport, but if you will try to use it in the browser, you will find out its inconvenience. You can't access native browser console levels (ex. verbose), so it is impossible to filter those levels using browser console.

## Requirements
To use library you need to have [node](https://nodejs.org) and [npm](https://www.npmjs.com) installed in your machine:

* node `6.0+`
* npm `3.0+`

## Installation

To install the library run following command
```
npm i --save logger-decorator
```

## Usage

The package provides simple decorator so you can simply wrap functions or classes with it or use [@babel/plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators)

### Functions
To decorate a function with ```logger-decorator``` try next:

```
  import Decorator from 'logger-decorator';
  const log = new Decorator();
  const decorated = log()(
    function sum(a, b) {
        return a + b;
    }
  );
  decorated(5, 8);
``` 

or, with async functions:

```
const decorated = log()(sumAsync);
await decorated(5, 8);
```

### Classes
To embed logging for all class methods follow next approach:

```
import Decorator from 'logger-decorator';
const log = new Decorator();

@log()
class MyClass {
    constructor(config) { // construcor will be ommited
        this.config = config;
    }

    _run(a, b) { // methods, started with underscore will be ommited
        return a + b + 10;
    }

    async run(a, b) { // will be decorated
        const result = this._run(a, b);
        return result * 2;
    }
```

[npm]: https://www.npmjs.com/package/logger-decorator
[github]: https://github.com/pustovitDmytro/logger-decorator
[travis]: https://travis-ci.org/pustovitDmytro/logger-decorator
[badge-deps]: https://img.shields.io/david/pustovitDmytro/logger-decorator.svg
[badge-tests]: https://img.shields.io/travis/pustovitDmytro/logger-decorator.svg
[badge-vuln]: https://img.shields.io/snyk/vulnerabilities/npm/logger-decorator.svg?style=popout
[badge-vers]: https://img.shields.io/npm/v/logger-decorator.svg
[badge-lic]: https://img.shields.io/github/license/pustovitDmytro/logger-decorator.svg