// 模拟点击控件
function simulationClick(rect) {
    try {
        let left = rect.bounds().left;
        let right = rect.bounds().right;
        let top = rect.bounds().top;
        let bottom = rect.bounds().bottom;

        let offsetX = (right - left) * 0.2;
        let offsetY = (bottom - top) * 0.2;

        let x = random(left + offsetX, right - offsetX);
        let y = random(top + offsetY, bottom - offsetY);

        click(x, y);
    }
    catch (err) {
        log(rect);
        toastLog("随机点击失败:" + err);
    }
}

// 按坐标点击
function coordClick(left, top, right, bottom) {
    let offsetX = (right - left) * 0.2;
    let offsetY = (bottom - top) * 0.2;

    let x = random(left + offsetX, right - offsetX);
    let y = random(top + offsetY, bottom - offsetY);

    click(x, y);
}