var srcDir = require('../config').srcDir
export default {
  iconPath: (name) => `/${srcDir}/images/icons/${name}`,
  surfacePath: (name) => `/${srcDir}/images/surfaces/${name}`,
  toA: (list) => Array.prototype.slice.call(list, 0),
  isInvalidEditStep: (validSteps, step, layerStep) => {
    var retVal = false
    if (!validSteps.contains(step)) { retVal = true}
    if (layerStep != null &&
        (layerStep !== 'images' || layerStep !== 'colors')) {
      retVal = true
    }
    return retVal
  }
}
