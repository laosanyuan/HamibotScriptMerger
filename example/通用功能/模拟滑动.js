
upSwipe();

// 上滑
function upSwipe() {
    let width = device.width;
    if(width<=0){
        width = 1080;
    }
    let height = device.height;
    if(height<=0){
        height = 1920;
    }

    let sx = random(width / 3, width * 2 / 3);
    let sy = random(height * 7 / 10, height * 8 / 10);
    let ex = random(width / 3, width * 2 / 3);
    let ey = random(height * 2 / 10, height * 3 / 10);
    randomSwipe(sx, sy, ex, ey);
}

// 下滑
function downSwipe() {
    let width = device.width;
    if(width<=0){
        width = 1080;
    }
    let height = device.height;
    if(height<=0){
        height = 1920;
    }

    let ex = random(width / 3, width * 2 / 3);
    let ey = random(height * 7 / 10, height * 8 / 10);
    let sx = random(width / 3, width * 2 / 3);
    let sy = random(height * 2 / 10, height * 3 / 10);
    randomSwipe(sx, sy, ex, ey);
}

// 随机滑动
function randomSwipe(sx, sy, ex, ey) {
    //设置控制点极限距离
    var leaveMax = 150;
    //设置随机滑动时长范围
    var timeMin = 300;
    var timeMax = 600;
    var time = [0, random(timeMin, timeMax)];

    let centerX = (sx + ex) / 2;
    let centerY = (sy + ey) / 2;

    cx1 = centerX + random(0, leaveMax);
    cy1 = centerY + random(0, leaveMax);
    cx2 = centerX - random(0, leaveMax);
    cy2 = centerY - random(0, leaveMax);

    let track = bezierCreate(sx, sy, cx1, cy1, cx2, cy2, ex, ey);

    gestures(time.concat(track));
}

/**
 * 四点生成贝塞尔曲线
 *
 * 传入值：四点坐标
 * 返回值：曲线数组
 */
function bezierCreate(x1, y1, x2, y2, x3, y3, x4, y4) {
    let bezierPoints = [];
    let t = 0;
    let step = 0.05;
    while (t <= 1) {
        let x = Math.pow(1 - t, 3) * x1 + 3 * Math.pow(1 - t, 2) * t * x2 + 3 * (1 - t) * Math.pow(t, 2) * x3 + Math.pow(t, 3) * x4;
        let y = Math.pow(1 - t, 3) * y1 + 3 * Math.pow(1 - t, 2) * t * y2 + 3 * (1 - t) * Math.pow(t, 2) * y3 + Math.pow(t, 3) * y4;

        bezierPoints.push([x, y]);
        t += step;
    }
    return bezierPoints;
}
