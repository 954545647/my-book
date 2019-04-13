import Storage from "web-storage-cache";

// 新增一个对象
const localStorage = new Storage();

// 设置
export function setLocalStorage(key, value) {
  // 第三个参数还可以传入过期时间
  return localStorage.set(key, value);
}

// 获取
export function getLocalStorage(key) {
  return localStorage.get(key);
}

// 删除
export function removeLocalStorage(key) {
  return localStorage.delete(key);
}
// 全部清空
export function deleteLocalStorage() {
  return localStorage.clear();
}

// 给每一本书都新建一个存储 存储每一本书的信息
export function setBookObject(fileName, key, value) {
  // 如果本地已经存储了书籍信息
  let book = getLocalStorage(`${fileName}-info`);
  if (!book) {
    book = {};
  }
  book[key] = value;
  // 如果本地不存在书籍信息的话,就将传入的信息传入当前书籍中
  setLocalStorage(`${fileName}-info`, book);
}

// 获取书籍信息
export function getBookObject(fileName, key) {
  let book = getLocalStorage(`${fileName}-info`);
  if (!book) {
    return null;
  } else {
    return book[key];
  }
}

// 获取历史搜索内容
export function getHistorySeach(fileName) {
  return getBookObject(fileName, "historySearch");
}
// 获取历史搜索内容
export function setHistorySearch(fileName, key) {
  let result = getHistorySeach(fileName)
    ? [].concat(getHistorySeach(fileName))
    : [];
  if (key!=='') {
    result.push(key);
    return setBookObject(fileName, "historySearch", result);
  }
}

// 设置选中书籍信息

export function saveBookShelf(shelf) {
  return setLocalStorage('shelf', shelf)
}

export function getBookShelf() {
  return getLocalStorage('shelf')
}


// 设置字体
export function setFontFamily(fileName, font) {
  return setBookObject(fileName, "fontFamily", font);
}

// 获取字体
export function getFontFamily(fileName) {
  return getBookObject(fileName, "fontFamily");
}

export function getHome() {
  return getLocalStorage("home");
}

export function setHome(home) {
  return setLocalStorage("home", home, 1800);
}

// 获取默认国际语言
export function getLocale() {
  return getLocalStorage("locale");
}
// 设置国际语言
export function setLocale(locale) {
  return setLocalStorage("locale", locale);
}
// 获取章节定位信息
export function getLocation(fileName) {
  return getBookObject(fileName, "location");
}
// 设置章节定位信息
export function setLocation(fileName, location) {
  setBookObject(fileName, "location", location);
}

// 获取书签数组
export function getBookmark(fileName) {
  return getBookObject(fileName, "bookmark");
}
// 设置书签数组
export function setBookmark(fileName, bookmark) {
  setBookObject(fileName, "bookmark", bookmark);
}
// 获取阅读时间
export function getReadTime(fileName) {
  return getBookObject(fileName, "time");
}
// 设置阅读时间
export function setReadTime(fileName, theme) {
  setBookObject(fileName, "time", theme);
}

export function getProgress(fileName) {
  return getBookObject(fileName, "progress");
}

export function setProgress(fileName, progress) {
  setBookObject(fileName, "progress", progress);
}

export function getNavigation(fileName) {
  return getBookObject(fileName, "navigation");
}

export function setNavigation(fileName, navigation) {
  setBookObject(fileName, "navigation", navigation);
}

export function getMetadata(fileName) {
  return getBookObject(fileName, "metadata");
}

export function setMetadata(fileName, metadata) {
  setBookObject(fileName, "metadata", metadata);
}
// 获取书籍封面
export function getCover(fileName) {
  return getBookObject(fileName, "cover");
}
// 设置书籍封面信息
export function setCover(fileName, cover) {
  setBookObject(fileName, "cover", cover);
}

export function getTheme(fileName) {
  return getBookObject(fileName, "theme");
}

export function setTheme(fileName, theme) {
  setBookObject(fileName, "theme", theme);
}

export function getFontSize(fileName) {
  return getBookObject(fileName, "fontSize");
}

export function setFontSize(fileName, fontSize) {
  setBookObject(fileName, "fontSize", fontSize);
}
