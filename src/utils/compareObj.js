export function compare(objA, objB) {

  function isObj(object) {
    return object && typeof (object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
  }

  function isArray(object) {
    return object && typeof (object) == 'object' && object.constructor == Array;
  }

  function getLength(object) {
    var count = 0;
    for (var i in object) count++;
    return count;
  }

  function CompareObj(objA, objB, flag) {
    for (var key in objA) {
      if (!flag) //跳出整个循环
        break;
      if (!objB.hasOwnProperty(key)) {
        flag = false;
        break;
      }
      if (!isArray(objA[key])) { //子级不是数组时,比较属性值
        if (objB[key] != objA[key]) {
          flag = false;
          break;
        }
      } else {
        if (!isArray(objB[key])) {
          flag = false;
          break;
        }
        var oA = objA[key],
          oB = objB[key];
        if (oA.length != oB.length) {
          flag = false;
          break;
        }
        for (var k in oA) {
          if (!flag) //这里跳出循环是为了不让递归继续
            break;
          flag = CompareObj(oA[k], oB[k], flag);
        }
      }
    }
    return flag;
  }

  if (!isObj(objA) || !isObj(objB)) return false; //判断类型是否正确
  if (getLength(objA) != getLength(objB)) return false; //判断长度是否一致
  return CompareObj(objA, objB, true); //默认为true
}
