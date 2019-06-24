/**
 * toolbox functions, names after Doraemon
 */

const doraemon = {}

/**
 * deep clone
 * note: cannot handle functions
 * @param {Object} obj object to be deep cloned
 * @return {Object} obj
 */
doraemon.deepClone = (obj) => JSON.parse(JSON.stringify(obj))

/**
 * is true or false
 * @param {Boolean || String} condition
 * @return {Boolean} true or false
*/
doraemon.isTrue = (condition) => condition && condition !== 'false'

doraemon.isBlacklist = (prop) => ['is_black', 'is_Black', 'is_blacklist'].some((key) => doraemon.isTrue(prop[key]))

export default doraemon
