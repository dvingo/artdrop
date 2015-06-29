var srcDir = require('../config').srcDir
export default {
  iconPath: (name) => `/${srcDir}/images/icons/${name}`,
  surfacePath: (name) => `/${srcDir}/images/surfaces/${name}`,
  toA: (list) => Array.prototype.slice.call(list, 0)
}
