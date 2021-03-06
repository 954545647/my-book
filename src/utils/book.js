import {realPx} from '@/utils/utils.js';
export const FontSzieList = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
];

export const FONT_FAMILY = [
  { font: "Default" },
  { font: "Cabin" },
  { font: "Days One" },
  { font: "Montserrat" },
  { font: "Tangerine" }
];

export function themeList(vue) {
  return [
    {
      alias: vue.$t("book.themeDefault"), //这是国际化别名
      name: "Default",
      style: {
        body: {
          color: "#4c5059",
          background: "#fff",
          "padding-top": `${realPx(48)}px!important`,
          "padding-bottom": `${realPx(48)}px!important`
        }
      }
    },
    {
      alias: vue.$t("book.themeGold"),
      name: "Grace",
      style: {
        body: {
          color: "#5c5b56",
          background: "#c6c2b6",
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        }
      }
    },
    {
      alias: vue.$t("book.themeEye"),
      name: "Eye",
      style: {
        body: {
          color: "#404c42",
          background: "#a9c1a9",
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        }
      }
    },
    {
      alias: vue.$t("book.themeNight"),
      name: "Night",
      style: {
        body: {
          color: "#cecece",
          background: "#000000",
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        }
      }
    }
  ];
}

// 添加类样式
export function addCss(href) {
  let link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("id", "mine"); // 标记
  link.setAttribute("href", href);
  document.getElementsByTagName("head")[0].appendChild(link);
}

// 删除类样式
export function removeCss(href) {
  // 先获取所有有我们自定义属性的link标签
  let links = document.getElementById("mine");
  if (links) {
    // 如果存在的话就移除样式文件
    links.parentNode.removeChild(links);
  }
}

// 删除全部类样式
// export function removeAllCss() {
//   removeCss(`${process.env.VUE_APP_Resource_Url}/theme/theme_Default.css`);
//   removeCss(`${process.env.VUE_APP_Resource_Url}/theme/theme_eye.css`);
//   removeCss(`${process.env.VUE_APP_Resource_Url}/theme/theme_Grace.css`);
//   removeCss(`${process.env.VUE_APP_Resource_Url}/theme/theme_night.css`);
// }

// 深度扁平化数组
export function flatten(arr) {
  return [].concat(
    ...arr.map(item => {
      return [].concat(item, ...flatten(item.subitems));
    })
  );
}
// 浅度扁平化
// export function flatten(arr) {
//   return arr.map(item => {
//     return [].concat(item, ...flatten(item.subitems));
//   });
// }
