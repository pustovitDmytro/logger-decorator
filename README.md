# logger-decorator
Provides a unified and simple approach for class and function logging.

[![Version][badge-vers]][npm]
[![Bundle size][npm-size-badge]][npm-size-url]
[![Downloads][npm-downloads-badge]][npm]

[![CodeFactor][codefactor-badge]][codefactor-url]
[![SonarCloud][sonarcloud-badge]][sonarcloud-url]
[![Codacy][codacy-badge]][codacy-url]
[![Total alerts][lgtm-alerts-badge]][lgtm-alerts-url]
[![Language grade][lgtm-lg-badge]][lgtm-lg-url]
[![Scrutinizer][scrutinizer-badge]][scrutinizer-url]

[![Dependencies][badge-deps]][npm]
[![Security][snyk-badge]][snyk-url]
[![Build Status][tests-badge]][tests-url]
[![Coverage Status][badge-coverage]][url-coverage]

[![Commit activity][commit-activity-badge]][github]
[![FOSSA][fossa-badge]][fossa-url]
[![License][badge-lic]][github]

## Table of Contents
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contribute](#contribute)

## Requirements
[![Platform Status][appveyor-badge]][appveyor-url]

To use library you need to have [node](https://nodejs.org) and [npm](https://www.npmjs.com) installed in your machine:

* node `>=10`
* npm `>=6`

Package is [continuously tested][appveyor-url] on darwin, linux, win32 platforms. All active and maintenance [LTS](https://nodejs.org/en/about/releases/) node releases are supported.

## Installation

To install the library run the following command:
```bash
  npm i --save logger-decorator
```

## Usage

The package provides a simple decorator, so you can simply wrap functions or classes with it or use [@babel/plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators) in case you love to complicate things.

The recommended way for using 'logger-decorator' is to build own decorator singleton inside the app.

```javascript
import { Decorator } from 'logger-decorator';

const decorator = new Decorator(config);
```

Or just use decorator with the default configuration: 

```javascript
import log from 'logger-decorator';

  @log({ level: 'verbose' })
class Rectangle {
      constructor(height, width) {
          this.height = height;
          this.width = width;
      }

      get area() {
          return this.calcArea();
      }

      calcArea() {
          return this.height * this.width;
      }
  }
```

### Configuration

Config must be a JavaScript ```Object``` with  the following attributes:
  * **logger** - logger, which build decorator will use, *[console](https://nodejs.org/api/console.html)* by default, see [logger](#logger) for more details 
  * **name** - the app name, to include in all logs, could be omitted.
  
Next values could also be passed to constructor config, but are customizable from ```decorator(customConfig)``` invokation:
  * **timestamp** - if set to *true* timestamps will be added to all logs.
  * **level** - default log-level, pay attention that logger must support it as ```logger.level(smth)```, *'info'* by default. Also *function* could be passed. The function will receive logged data and should return log-level as *string*.
  *  **errorLevel** - level, used for errors. *'error'* by default. Also *function* could be passed. The function will receive logged data and should return log-level as *string*.
  * **paramsSanitizer** - function to sanitize input parametrs from sensitive or redundant data, see [sanitizers](#sanitizers) for more details, by default [dataSanitizer](#sanitizers).
  * **resultSanitizer** - output data sanitizer, by default [dataSanitizer](#sanitizers)
  * **errorSanitizer** - error sanitizer, by default [simpleSanitizer](#sanitizers)
  * **contextSanitizer** - function context sanitizer, if ommited, no context will be logged.
  *  **dublicates** - if set to *true*, it is possible to use multiple decorators at once (see [example](#duplicates))
  
Next parametrs could help in class method filtering:
  *  **getters** - if set to *true*, [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) will also be logged (applied to class and class-method decorators)
  *  **setters** - if set to *true*, [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) will also be logged (applied to class and class-method decorators)
  *  **classProperties** - if set to *true*, [class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties) will also be logged (applied to class decorators only)
  *  **include** - array with method names, for which logs will be added.
  *  **exclude** - array with method names, for which logs won't be added.
  *  **methodNameFilter** - function, to filter method names


### Functions

To decorate a function with ```logger-decorator``` the next approach can be applied:

```javascript
import { Decorator } from 'logger-decorator';

const decorator = new Decorator({ logger });
const decorated = decorator()((a, b) => {
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

Besides ```methodName``` any of the  ```timestamp, level, paramsSanitizer, resultSanitizer, errorSanitizer, contextSanitizer, etc...``` can be transferred to ```log(customConfig)``` and will replace global values.

### Classes

To embed logging for all class methods, follow the next approach:

```javascript
import { Decorator } from 'logger-decorator';
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

When needed, the decorator can be applied to a specific class method. It is also possible to use multiple decorators <a name="duplicates"></a> at once:

```javascript
    const decorator = new Decorator({ logger, contextSanitizer: data => ({ base: data.base }) }); // level info by default

    @decorator({ level: 'verbose', contextSanitizer: data => data.base, dublicates: true })
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

*Sanitizer* is a function, that recieves data as the first argument, and returns sanitized data.
default *logger-decorator* sanitizers are:

* ```simpleSanitizer``` - default [inspect](https://nodejs.org/api/util.html#util_util_inspect_object_options) function
* ```dataSanitizer``` - firstly replace all values with key ```%password%``` replaced to ```***```, and then ```simpleSanitizer```.

### Logger

*Logger* can be a function, with the next structure:

```javascript
const logger = (level, data) => {
    console.log(level, data);
};
```
Otherwise, you can define each logLevel separately in *Object* / *Class* logger:

```javascript
const logger = {
    info    : console.log,
    verbose : console.log,
    error   : console.error
};
```

## Contribute

Make the changes to the code and tests. Then commit to your branch. Be sure to follow the commit message conventions. Read [Contributing Guidelines](.github/CONTRIBUTING.md) for details.

[npm]: https://www.npmjs.com/package/logger-decorator
[github]: https://github.com/pustovitDmytro/logger-decorator
[coveralls]: https://coveralls.io/github/pustovitDmytro/logger-decorator?branch=master
[badge-deps]: https://img.shields.io/david/pustovitDmytro/logger-decorator.svg
[badge-vuln]: https://img.shields.io/snyk/vulnerabilities/npm/logger-decorator.svg?style=popout
[badge-vers]: https://img.shields.io/npm/v/logger-decorator.svg
[badge-lic]: https://img.shields.io/github/license/pustovitDmytro/logger-decorator.svg
[badge-coverage]: https://coveralls.io/repos/github/pustovitDmytro/logger-decorator/badge.svg?branch=master
[url-coverage]: https://coveralls.io/github/pustovitDmytro/logger-decorator?branch=master


[snyk-badge]: https://snyk-widget.herokuapp.com/badge/npm/logger-decorator/badge.svg
[snyk-url]: https://snyk.io/advisor/npm-package/logger-decorator

[tests-badge]: https://img.shields.io/circleci/build/github/pustovitDmytro/logger-decorator
[tests-url]: https://app.circleci.com/pipelines/github/pustovitDmytro/logger-decorator

[codefactor-badge]: https://www.codefactor.io/repository/github/pustovitdmytro/logger-decorator/badge
[codefactor-url]: https://www.codefactor.io/repository/github/pustovitdmytro/logger-decorator

[commit-activity-badge]: https://img.shields.io/github/commit-activity/m/pustovitDmytro/logger-decorator

[scrutinizer-badge]: https://scrutinizer-ci.com/g/pustovitDmytro/logger-decorator/badges/quality-score.png?b=master
[scrutinizer-url]: https://scrutinizer-ci.com/g/pustovitDmytro/logger-decorator/?branch=master

[lgtm-lg-badge]: https://img.shields.io/lgtm/grade/javascript/g/pustovitDmytro/logger-decorator.svg?logo=lgtm&logoWidth=18
[lgtm-lg-url]: https://lgtm.com/projects/g/pustovitDmytro/logger-decorator/context:javascript

[lgtm-alerts-badge]: https://img.shields.io/lgtm/alerts/g/pustovitDmytro/logger-decorator.svg?logo=lgtm&logoWidth=18
[lgtm-alerts-url]: https://lgtm.com/projects/g/pustovitDmytro/logger-decorator/alerts/

[codacy-badge]: https://app.codacy.com/project/badge/Grade/735696cc49164e52a890530e974e7377
[codacy-url]: https://www.codacy.com/gh/pustovitDmytro/logger-decorator/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pustovitDmytro/logger-decorator&amp;utm_campaign=Badge_Grade

[sonarcloud-badge]: https://sonarcloud.io/api/project_badges/measure?project=pustovitDmytro_logger-decorator&metric=alert_status
[sonarcloud-url]: https://sonarcloud.io/dashboard?id=pustovitDmytro_logger-decorator

[npm-downloads-badge]: https://img.shields.io/npm/dw/logger-decorator
[npm-size-badge]: https://img.shields.io/bundlephobia/min/logger-decorator
[npm-size-url]: https://bundlephobia.com/result?p=logger-decorator

[appveyor-badge]: https://ci.appveyor.com/api/projects/status/73r7798qp97ccwxp/branch/master?svg=true
[appveyor-url]: https://ci.appveyor.com/project/pustovitDmytro/logger-decorator/branch/master

[fossa-badge]: https://app.fossa.com/api/projects/custom%2B24828%2Flogger-decorator.svg?type=shield
[fossa-url]: https://app.fossa.com/projects/custom%2B24828%2Flogger-decorator?ref=badge_shield