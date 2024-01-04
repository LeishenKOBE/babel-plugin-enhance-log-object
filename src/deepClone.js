// 函数拷贝
const copyObj = (obj) => {
  const isObj = typeof obj == "object" && obj !== null;
  if (!isObj) {
    return obj;
  }
  let newObj = null;
  // 判断是否需要继续进行递归
  if (isObj) {
    newObj = obj instanceof Array ? [] : {};
    // 进行下一层递归克隆
    for (let i in obj) {
      newObj[i] = copyObj(obj[i]);
    }
  } else {
    newObj = obj;
  }
  return newObj;
};

module.exports = copyObj;
