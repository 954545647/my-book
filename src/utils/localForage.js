import localForage from "localforage";

// 设置
export function setLocalForage(key, data, resolve, reject) {
  localForage
    .setItem(key, data)
    .then(value => {
      if (resolve) resolve(value);
    })
    .catch(err => {
      if (reject) reject(err);
    });
}

// 获取
// export function getLocalForage(key, resolve, reject) {
//   localForage
//     .getItem(key)
//     .then(value => {
//       if (resolve) resolve(value);
//     })
//     .catch(err => {
//       if (reject) reject(err);
//     });
// }

// // 获取
export function getLocalForage(key, resolve) {
  localForage.getItem(key, (err, value) => {
    if(resolve) resolve(err, value);
  });
}

// 移除
export function removeLocalForage(key, resolve, reject) {
  localForage
    .removeItem(key)
    .then(value => {
      if (resolve) resolve(value);
    })
    .catch(err => {
      if (reject) reject(err);
    });
}

// 清空缓存 重置数据库
export function clearLocalForage(resolve, reject) {
  localForage
    .clear()
    .then(value => {
      if (resolve) resolve(value);
    })
    .catch(err => {
      if (reject) reject(err);
    });
}

// 获取离线仓库中的 key 的数量（即数据仓库的“长度”）
export function lengthLocalForage(resolve) {
  localForage
    .length()
    .then(number => {
      resolve(number);
    })
    .catch(function(err) {
      // 当出错时，此处代码运行
      console.log(err);
    });
}

// 可以存储Ajax返回的二进制数据
export function getAjaxData(url, resolve, reject) {
  req = new XMLHttpRequest();
  req.open("GET", "/photo.jpg", true);
  req.responseType = "arraybuffer";

  req.addEventListener("readystatechange", function() {
    if (req.readyState === 4) {
      // readyState 完成
      localforage
        .setItem("photo", req.response)
        .then(function(image) {
          // 如下为一个合法的 <img> 标签的 blob URI
          var blob = new Blob([image]);
          var imageURI = window.URL.createObjectURL(blob);
        })
        .catch(function(err) {
          // 当出错时，此处代码运行
          console.log(err);
        });
    }
  });
}

// 实现 Web 离线存储
// import localForage from "localforage";

// 设置
// export function setLocalForage(key, data, resolve, reject) {
//   localForage
//     .setItem(key, data)
//     .then(value => {
//       if (resolve) resolve(value);
//     })
//     .catch(function(err) {
//       if (reject) reject(err);
//     });
// }

// // 获取
// export function getLocalForage(key, resolve) {
//   localForage.getItem(key, (err, value) => {
//     resolve(err, value);
//   });
// }

// export function removeLocalForage(key, resolve, reject) {
//   localForage
//     .removeItem(key)
//     .then(function() {
//       resolve();
//     })
//     .catch(function(err) {
//       reject(err);
//     });
// }

// export function clearLocalForage(resolve, reject) {
//   localForage
//     .clear()
//     .then(function() {
//       resolve();
//     })
//     .catch(function(err) {
//       reject(err);
//     });
// }

// // 获取存储的长度
// export function lengthLocalForage(cb) {
//   localForage
//     .length()
//     .then(numKey => {
//       if (cb) cb(numKey);
//       console.log(numKey);
//     })
//     .catch(function(err) {
//       console.log(err);
//     });
// }

export function iteratorLocalForage() {
  localForage
    .iterate(function(value, key, iterationNumber) {
      console.log([key, value]);
    })
    .then(function() {
      console.log("Iteration has completed");
    })
    .catch(function(err) {
      console.log(err);
    });
}

export function support() {
  const indexedDB =
    window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null;
  if (indexedDB) {
    return true;
  } else {
    return false;
  }
}
