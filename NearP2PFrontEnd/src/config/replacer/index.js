/**
 * webpack-theme-color-replacer disposition
 * webpack-theme-color-replacer is an efficient theme color replacement plug-in that enables dynamic theme switching while the system is running.
 * But there are some scenarios that we need to do webpack-theme-color-replacer Configure rules to meet our individual needs
 *
 * @cssResolve: cssProcessing rules, in webpack-theme-color-replacer Extract You need to replace the theme color css after this rule is applied. Generally in
 *              webpack-theme-color-replacer The default rules are not used when our requirements are not met.
 */
const cssResolve = require('./resolve.config')
module.exports = {cssResolve}
