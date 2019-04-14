import Axios from "axios";
import { getLocalForage, setLocalForage } from "./localForage";

// 跳转到主页
export function gotoStoreHome(vue) {
  vue.$router.push({
    path: "/store/home"
  });
}
// 跳转到图书详情页
export function gotoBookDetail(vue, book) {
  vue.$router.push({
    path: "/store/detail",
    query: {
      fileName: book.fileName,
      category: book.categoryText
    }
  });
}

// 下载电子书
export function download(book, onsuccess, onerr, onprogress) {
  // 如果没有传入第四个参数,默认为第三个参数
  if (!onprogress) {
    onprogress = onerr;
    onerr = null;
  }
  return Axios.create({
    // 基础路由,axios在发起请求时默认会使用这个前缀
    baseURL: process.env.VUE_APP_EPUB_URL, // 本地速度太快了,所以改用线上接口
    // baseURL: process.env.VUE_APP_EPUB2_URL, // 线上接口
    method: "get",
    responseType: "blob",
    timeout: 180 * 1000,
    // onDownloadProgress是一个axios提供的API,会不断执行
    // 这是我们把我们在下载过程中需要进行的函数传递进来,就可以得到下载过程
    // 这里把 toast 组件显示下载百分比封装成一个函数并且传递进来并且不断调用
    onDownloadProgress: progressEvent => {
      // progressEvent是api提供的参数,里面有进度相关数据
      if (onprogress) {
        onprogress(progressEvent);
      }
    }
  })
    .get(`${book.categoryText}/${book.fileName}.epub`)
    .then(res => {
      // console.log(res);
      // 下载的数据res中的data属性是一个 Blob对象
      let blob = new Blob([res.data]); // 可以使用 epubjs 直接打开
      // 把下载的数据中的 blob 对象通过localForage保存
      setLocalForage(
        // 键是书名,键值是blob对象,还有两个回调函数
        book.fileName,
        blob,
        () => onsuccess(book),
        err => onerr(err)
      );
    })
    .catch(err => {
      if (onerr) onerr(err);
    });
}

// 添加一本书
export function AddToShelf(list) {
  list.push({
    id: -1,
    type: 3
  });
  return list;
}
// 删除书
export function removeFromShelf(list) {
  return list.filter(item => item.type != 3);
}

// 显示图书详情页
export function showBookDetail(vue, book) {
  vue.$router.push({
    path: "/store/detail",
    query: {
      fileName: book.fileName,
      category: book.categoryText
    }
  });
}

export const categoryList = {
  ComputerScience: 1,
  SocialSciences: 2,
  Economics: 3,
  Education: 4,
  Engineering: 5,
  Environment: 6,
  Geography: 7,
  History: 8,
  Laws: 9,
  LifeSciences: 10,
  Literature: 11,
  Biomedicine: 12,
  BusinessandManagement: 13,
  EarthSciences: 14,
  MaterialsScience: 15,
  Mathematics: 16,
  MedicineAndPublicHealth: 17,
  Philosophy: 18,
  Physics: 19,
  PoliticalScienceAndInternationalRelations: 20,
  Psychology: 21,
  Statistics: 22
};

export const flapCardList = [
  // 每个圆的位置
  {
    r: 255,
    g: 102,
    old: 102, // 这个值是用来改变的 变深变浅
    b: 159,
    imgLeft: "url(" + require("@/assets/images/gift-left.png") + ")",
    imgRight: "url(" + require("@/assets/images/gift-right.png") + ")",
    backgroundSize: "50% 50%",
    zIndex: 100,
    rotateDegree: 0 // 转动的角度
  },
  {
    r: 74,
    g: 171,
    old: 171,
    b: 255,
    imgLeft: "url(" + require("@/assets/images/compass-left.png") + ")",
    imgRight: "url(" + require("@/assets/images/compass-right.png") + ")",
    backgroundSize: "50% 50%",
    zIndex: 99,
    rotateDegree: 0
  },
  {
    r: 255,
    g: 198,
    old: 198,
    b: 102,
    imgLeft: "url(" + require("@/assets/images/star-left.png") + ")",
    imgRight: "url(" + require("@/assets/images/star-right.png") + ")",
    backgroundSize: "50% 50%",
    zIndex: 98,
    rotateDegree: 0
  },
  {
    r: 255,
    g: 102,
    old: 102,
    b: 159,
    imgLeft: "url(" + require("@/assets/images/heart-left.png") + ")",
    imgRight: "url(" + require("@/assets/images/heart-right.png") + ")",
    backgroundSize: "50% 50%",
    zIndex: 97,
    rotateDegree: 0
  },
  {
    r: 59,
    g: 201,
    old: 201,
    b: 22,
    imgLeft: "url(" + require("@/assets/images/crown-left.png") + ")",
    imgRight: "url(" + require("@/assets/images/crown-right.png") + ")",
    backgroundSize: "50% 50%",
    zIndex: 96,
    rotateDegree: 0
  }
];

export function getCategoryName(id) {
  switch (id) {
    case 1:
      return "ComputerScience";
    case 2:
      return "SocialSciences";
    case 3:
      return "Economics";
    case 4:
      return "Education";
    case 5:
      return "Engineering";
    case 6:
      return "Environment";
    case 7:
      return "Geography";
    case 8:
      return "History";
    case 9:
      return "Laws";
    case 10:
      return "LifeSciences";
    case 11:
      return "Literature";
    case 12:
      return "Biomedicine";
    case 13:
      return "BusinessandManagement";
    case 14:
      return "EarthSciences";
    case 15:
      return "MaterialsScience";
    case 16:
      return "Mathematics";
    case 17:
      return "MedicineAndPublicHealth";
    case 18:
      return "Philosophy";
    case 19:
      return "Physics";
    case 20:
      return "PoliticalScienceAndInternationalRelations";
    case 21:
      return "Psychology";
    case 22:
      return "Statistics";
  }
}

export function categoryText(category, vue) {
  switch (category) {
    case 1:
      return vue.$t("category.computerScience");
    case 2:
      return vue.$t("category.socialSciences");
    case 3:
      return vue.$t("category.economics");
    case 4:
      return vue.$t("category.education");
    case 5:
      return vue.$t("category.engineering");
    case 6:
      return vue.$t("category.environment");
    case 7:
      return vue.$t("category.geography");
    case 8:
      return vue.$t("category.history");
    case 9:
      return vue.$t("category.laws");
    case 10:
      return vue.$t("category.lifeSciences");
    case 11:
      return vue.$t("category.literature");
    case 12:
      return vue.$t("category.biomedicine");
    case 13:
      return vue.$t("category.businessandManagement");
    case 14:
      return vue.$t("category.earthSciences");
    case 15:
      return vue.$t("category.materialsScience");
    case 16:
      return vue.$t("category.mathematics");
    case 17:
      return vue.$t("category.medicineAndPublicHealth");
    case 18:
      return vue.$t("category.philosophy");
    case 19:
      return vue.$t("category.physics");
    case 20:
      return vue.$t("category.politicalScienceAndInternationalRelations");
    case 21:
      return vue.$t("category.psychology");
    case 22:
      return vue.$t("category.statistics");
  }
}
