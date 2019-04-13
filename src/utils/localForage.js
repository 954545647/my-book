// 实现 Web 离线存储
import localForage from "localforage";

// 设置
export function setLocalForage(key, data, resolve, reject) {
  localForage
    .setItem(key, data)
    .then(value => {
      if (resolve) resolve(value);
    })
    .catch(function(err) {
      if (reject) reject(err);
    });
}

// 获取
export function getLocalForage(key, resolve) {
  localForage.getItem(key, (err, value) => {
    resolve(err, value);
  });
}

export function removeLocalForage(key, resolve, reject) {
  localForage
    .removeItem(key)
    .then(function() {
      resolve();
    })
    .catch(function(err) {
      reject(err);
    });
}

export function clearLocalForage(resolve, reject) {
  localForage
    .clear()
    .then(function() {
      resolve();
    })
    .catch(function(err) {
      reject(err);
    });
}

// 获取存储的长度
export function lengthLocalForage(cb) {
  localForage
    .length()
    .then(numKey => {
      if (cb) cb(numKey);
      console.log(numKey);
    })
    .catch(function(err) {
      console.log(err);
    });
}

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
