export function px2rem(px){
    let ratio = 375 / 10;
    return px / ratio 
}

// 根据当前屏幕rem缩放比例算出真实大小
export function realPx(px){
    let maxWidth = window.innerWidth > 500? 500 : window.innerWidth
    return px * (maxWidth / 375)
}