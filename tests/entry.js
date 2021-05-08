/* eslint-disable security/detect-non-literal-require */
import { entry } from './constants';

export default require(entry);
module.exports = require(entry);
