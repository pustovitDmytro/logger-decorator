/* eslint-disable security/detect-non-literal-require */
import { entry } from './constants';

const m = require(entry);

export default m.default;

const { Decorator, sanitizeRegexp } = m;

export { Decorator, sanitizeRegexp };
