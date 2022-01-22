const {cssResolve} = require('../config/replacer')
// Fix the css results extracted by the webpack-theme-color-replacer plug-in
function resolveCss(output, srcArr) {
  let regExps = []
  // Extract all regular configurations in the resolve configuration
  Object.keys(cssResolve).forEach(key => {
    let isRegExp = false
    let reg = {}
    try {
      reg = eval(key)
      isRegExp = reg instanceof RegExp
    } catch (e) {
      isRegExp = false
    }
    if (isRegExp) {
      regExps.push([reg, cssResolve[key]])
    }
  })

  // Go heavy
  srcArr = dropDuplicate(srcArr)

  // dispose css
  let outArr = []
  srcArr.forEach(text => {
    // Convert to a css object
    let cssObj = parseCssObj(text)
    // Depending on the selector matching configuration, if the match is successful, css is processed by configuration
    if (cssResolve[cssObj.selector] != undefined) {
      let cfg = cssResolve[cssObj.selector]
      if (cfg) {
        outArr.push(cfg.resolve(text, cssObj))
      }
    } else {
      let cssText = ''
      // If the match is not successful, test for a matching regular configuration, and if there is a configuration that corresponds to the regular configuration
      for (let regExp of regExps) {
        if (regExp[0].test(cssObj.selector)) {
          let cssCfg = regExp[1]
          cssText = cssCfg ? cssCfg.resolve(text, cssObj) : ''
          break
        }
        // If it does not match to the regular, set cssText to the default css (i.e. not processed)
        cssText = text
      }
      if (cssText != '') {
        outArr.push(cssText)
      }
    }
  })
  output = outArr.join('\n')
  return output
}

// The array goes heavy
function dropDuplicate(arr) {
  let map = {}
  let r = []
  for (let s of arr) {
    if (!map[s]) {
      r.push(s)
      map[s] = 1
    }
  }
  return r
}

/**
 * Resolve the css object from a string
 * @param cssText
 * @returns {{
 *   name: String,
 *   rules: Array[String],
 *   toText: function
 * }}
 */
function parseCssObj(cssText) {
  let css = {}
  const ruleIndex = cssText.indexOf('{')
  css.selector = cssText.substring(0, ruleIndex)
  const ruleBody = cssText.substring(ruleIndex + 1, cssText.length - 1)
  const rules = ruleBody.split(';')
  css.rules = rules
  css.toText = function () {
    let body = ''
    this.rules.forEach(item => {body += item + ';'})
    return `${this.selector}{${body}}`
  }
  return css
}

module.exports = {resolveCss}
