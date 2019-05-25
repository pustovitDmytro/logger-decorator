# logger-decorator
**logger-decorator** provides a unified and simple approach for class and function logging.

[![Version][badge-vers]][npm]
[![Dependencies][badge-deps]][npm]
[![Vulnerabilities][badge-vuln]](https://snyk.io/)
[![Build Status][badge-tests]][travis]
[![Coverage Status][badge-coverage]](https://coveralls.io/github/pustovitDmytro/logger-decorator?branch=master)
[![License][badge-lic]][github]

## Table of Contents
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)


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

The package provides simple decorator, so you can simply wrap functions or classes with it or use [@babel/plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators) in case you love to complicate things.

The recommended way for using 'logger-decorator' is to build own decorator singleton inside the app.
```
  import Decorator from 'logger-decorator';
  const decorator = new Decorator(config);
```

### Configuration

Config must be a JavaScript ```Object``` with  the following attributes:
  * **logger** - logger, which build decorator will use, *console* by default
  * **name** - the app name, to include in all logs, could be omitted.
  
Next values could also be passed to constructor config, but are customizable from ```decorator(custom)``` invokation:
  * **timestamp** - if set to true timestamps will be added to all logs.
  * **level** - default log-level, pay attention then logger must support it as ```logger.level(data)```, *info* by default
  * **paramsSanitizer** - function to sanitize input parametrs from sensitive or redundant data, see [sanitizers](##sanitizers) for more details, by default [dataSanitizer](##sanitizers).
  * **resultSanitizer** - output data sanitizer, by default [dataSanitizer](##sanitizers)
  * **errorSanitizer** - error sanitizer, by default [simpleSanitizer](##sanitizers)
  * **contextSanitizer** - function context sanitizer, if ommited, no context will be logged.


### Functions

To decorate a function with ```logger-decorator``` the next approach can be applied:

```javascript
  import Decorator from 'logger-decorator';
  
  const decorator = new Decorator({ logger });
  const decorated = decorator()(function sum(a, b) {
      return a + b;
  });

  const res = decorated(5, 8); // res === 13
  /*
      logger will print:
      { method: 'sum', params: '[ 5, 8 ]', result: '13' }
  */
``` 

or, with async functions:

```javascript
const log = new Decorator({ logger });
const decorated = log({ methodName })(sumAsync);

await decorated(5, 8); // 13
```

Besides ```methodName``` any of the  ```timestamp, level, paramsSanitizer, resultSanitizer, errorSanitizer, contextSanitizer``` can be transferred to ```log(customConfig)``` and will replace global values.

### Classes

To embed logging for all class methods follow next approach:

```javascript
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

When needed, the decorator can be applied to a specific class method. It is also possible to use multiple decorators at once:

```javascript
    const decorator = new Decorator({ logger, contextSanitizer: data => ({ base: data.base }) }); // level info by default

    @decorator({ level: 'verbose', contextSanitizer: data => data.base })
    class Calculator {
        base = 10;
        _secret = 'x0Hdxx2o1f7WZJ';
        @decorator() // default contextSanitizer have been used
        sum(a, b) {
            return a + b + this.base;
        }
    }

    const calculator = new Calculator();
    calculator.sum(5, 7); // 22
 /*
      next two logs will appear:

      1) level: 'info':
          { params: '[ 5, 7 ]', result: '22', context: { base: 10 } }
      
      2) level: 'verbose':
          { params: '[ 5, 7 ]', result: '22', context: 10 }
  */
    }
```

### Sanitizers

*Sanitizer* is a function, that recieves data as first argument, and returns sanitized data.
default *logger-decorator* sanitizers are:

* ```simpleSanitizer``` - default [inspect](https://nodejs.org/api/util.html#util_util_inspect_object_options) function
* ```dataSanitizer``` - firstly replace all values with key ```%password%``` replaced to ```***```, and then ```simpleSanitizer```.


## Contribute

Make the changes to the code and tests and then commit to your branch. Be sure to follow the commit message conventions.

Commit message summaries must follow this basic format:
```
  Tag: Message (fixes #1234)
```

The Tag is one of the following:
* **Fix** - for a bug fix.
* **Update** - for a backwards-compatible enhancement.
* **Breaking** - for a backwards-incompatible enhancement.
* **Docs** - changes to documentation only.
* **Build** - changes to build process only.
* **New** - implemented a new feature.
* **Upgrade** - for a dependency upgrade.

The message summary should be a one-sentence description of the change. The issue number should be mentioned at the end.




[npm]: https://www.npmjs.com/package/logger-decorator
[github]: https://github.com/pustovitDmytro/logger-decorator
[travis]: https://travis-ci.org/pustovitDmytro/logger-decorator
[coveralls]: https://coveralls.io/github/pustovitDmytro/logger-decorator?branch=master
[badge-deps]: https://img.shields.io/david/pustovitDmytro/logger-decorator.svg
[badge-tests]: https://img.shields.io/travis/pustovitDmytro/logger-decorator.svg
[badge-vuln]: https://img.shields.io/snyk/vulnerabilities/npm/logger-decorator.svg?style=popout
[badge-vers]: https://img.shields.io/npm/v/logger-decorator.svg
[badge-lic]: https://img.shields.io/github/license/pustovitDmytro/logger-decorator.svg
[badge-coverage]: https://coveralls.io/repos/github/pustovitDmytro/logger-decorator/badge.svg?branch=master