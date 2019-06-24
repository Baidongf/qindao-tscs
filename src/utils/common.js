export const isEmptyValue = (value) => {
    if (value === '' || value === null || value === undefined) {
        return true
    } else {
        return false
    }
}
export const isNullOrUndefined = (params) => {
  const isUndefined = typeof params === 'undefined'
  const isNull = params === null
  return isUndefined || isNull
}
