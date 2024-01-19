// 以下脚本由“HamibotScriptMerger”打包合成。
// 项目地址：https://github.com/laosanyuan/HamibotScriptMerger
// 如在使用中发现任何问题，欢迎提issue。

var window = floaty.rawWindow();
var maxCommentTimes = 0;
var maxCollectTimes = 0;
var commentTags = [];
var commentList = [];
var needOthersComment = false;
var runMode = '收藏+评论';
var favoritesMap = {};
try {
    resolveConfig();
    unlock();
    sleep(1000);
    app.launchApp('抖音');
    sleep(3000);
    backToHome();
    ui.run(() => window.run_status.setText('开始运行'));
    checkDialog();
    let commentTimes = 0;
    let collectTimes = 0;
    while (commentTimes < maxCommentTimes || collectTimes < maxCollectTimes) {
        checkDialog();
        let targetTags = getVideoTags();
        toast(targetTags);
        if (targetTags != null && targetTags.length > 0) {
            if (maxCommentTimes > commentTimes) {
                for (let j = 0; j < targetTags.length; j++) {
                    if (commentTags.indexOf(targetTags[j]) >= 0) {
                        ui.run(() => window.run_status.setText('找到评论目标tag:' + targetTags[j]));
                        let index = Math.floor(random(0, commentList.length - 1));
                        comment(commentList[index], needOthersComment);
                        commentTimes++;
                        ui.run(() => window.comment_count.setText(commentTimes.toString()));
                        sleep(random(1000, 2000));
                        break;
                    }
                }
            }
            if (maxCollectTimes > collectTimes) {
                for (let i = 0; i < targetTags.length; i++) {
                    let isCollected = false;
                    for (let key in favoritesMap) {
                        let tmpTags = favoritesMap[key];
                        if (tmpTags.indexOf(targetTags[i]) >= 0) {
                            ui.run(() => window.run_status.setText('找到收藏目标tag:' + targetTags[i]));
                            sleep(1500);
                            let collectResult = collect(key);
                            if (collectResult == 1) {
                                collectTimes++;
                                isCollected = true;
                                ui.run(() => window.collect_count.setText(collectTimes.toString()));
                            } else if (collectResult == -1) {
                                collectTimes = 100000;
                                toastLog('收藏失败\u16512结束后续收藏流程');
                            }
                            if (isCollected == true) {
                                sleep(random(2000, 3000));
                                break;
                            }
                        }
                    }
                    if (isCollected == true) {
                        break;
                    }
                }
            }
        }
        sleep(1500);
        ui.run(() => window.run_status.setText('正在切换视频'));
        upSwipe();
        sleep(random(1000, 2500));
        ui.run(() => window.run_status.setText('正在获取有效tag'));
    }
} catch (err) {
    log(err);
    errorAlert();
} finally {
    ui.run(() => window.run_status.setText('结束流程\u16512等待程序关闭'));
    sleep(5000);
    home();
    threads.shutDownAll();
}
function comment(backupInput, needOthersComment) {
    let commendButton = className('ImageView').descStartsWith('评论').visibleToUser().findOne(3000);
    if (commendButton != null) {
        simulationClick(commendButton);
        sleep(random(2000, 3000));
        upSwipe();
        sleep(random(1000, 2000));
        let realMessage = backupInput;
        if (needOthersComment) {
            let othersComment = id('content').findOne(3000);
            if (othersComment != null) {
                let othersCommentText = othersComment.text();
                realMessage = random(0, 1) >= 0.45 ? backupInput : othersCommentText;
            }
        }
        let count = random(1, 5);
        for (let i = 0; i < count; i++) {
            realMessage += '[看]';
        }
        sleep(1000);
        sendCommment(realMessage);
        back();
        sleep(random(1000, 2000));
    } else {
        log('获取评论按钮失败');
        log(commendButton);
    }
}
function checkDialog() {
    let upgradeDialog = text('检测到更新').findOne(3000);
    if (upgradeDialog != null) {
        let cancelUpgrade = text('以后再说').findOne(3000);
        if (cancelUpgrade != null) {
            simulationClick(cancelUpgrade);
            toastLog('关闭检测到升级弹窗');
        } else {
            throw new Error('处理更新弹窗失败');
        }
    }
    let friendDialog = text('朋友推荐').findOne(3000);
    if (friendDialog != null) {
        let closeFriendDialog = className('ImageView').desc('关闭').findOne(3000);
        if (closeFriendDialog != null) {
            simulationClick(closeFriendDialog);
            toastLog('关闭朋友推荐弹窗');
        } else {
            throw new Error('处理朋友推荐弹窗失败');
        }
    }
    let tiredDialog = text('已到达你设置的休息时间').findOne(3000);
    if (text('已到达你设置的休息时间').findOne(3000) != null) {
        let cancelTiredButton = text('忽略提醒').findOne(3000);
        if (cancelTiredButton != null) {
            simulationClick(cancelTiredButton);
            toastLog('关闭休息提醒');
        } else {
            throw new Error('关闭休息提醒失败');
        }
    }
}
function errorAlert() {
    for (let i = 0; i < 3; i++) {
        sleep(500);
        device.vibrate(200);
    }
}
function resolveConfig() {
    maxCommentTimes = parseInt(hamibot.env['maxCommentTimes']);
    maxCollectTimes = parseInt(hamibot.env['maxCollectTimes']);
    commentTags = hamibot.env['comment_tags'].split(' ');
    commentList = hamibot.env['comment_list'].split('\n');
    needOthersComment = hamibot.env['need_others_comment'] == '是';
    runMode = hamibot.env['mode_select'];
    if (runMode == 'collect') {
        maxCommentTimes = 0;
    }
    if (runMode == 'comment') {
        maxCollectTimes = 0;
    }
    let tmpMaps = hamibot.env['collect_tags'];
    let lines = tmpMaps.split('\n');
    let colonRegex = /[:：]/;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var match = line.match(colonRegex);
        if (!match) {
            continue;
        }
        var colonIndex = match.index;
        var key = line.substring(0, colonIndex).trim();
        var value = line.substring(colonIndex + 1).trim().split(' ');
        favoritesMap[key] = value;
    }
}
function getVideoTags() {
    let result = [];
    let title = className('TextView').textContains('#').visibleToUser().findOne(3000);
    if (title != null) {
        let strs = title.text().split('#');
        if (strs.length > 1) {
            for (let i = 1; i < strs.length; i++) {
                result.push(strs[i].trim());
            }
        }
    }
    return result;
}
function bezierCreate(x1, y1, x2, y2, x3, y3, x4, y4) {
    let bezierPoints = [];
    let t = 0;
    let step = 0.05;
    while (t <= 1) {
        let x = Math.pow(1 - t, 3) * x1 + 3 * Math.pow(1 - t, 2) * t * x2 + 3 * (1 - t) * Math.pow(t, 2) * x3 + Math.pow(t, 3) * x4;
        let y = Math.pow(1 - t, 3) * y1 + 3 * Math.pow(1 - t, 2) * t * y2 + 3 * (1 - t) * Math.pow(t, 2) * y3 + Math.pow(t, 3) * y4;
        bezierPoints.push([
            x,
            y
        ]);
        t += step;
    }
    return bezierPoints;
}
function upSwipe() {
    let width = device.width;
    if (width <= 0) {
        width = 1080;
    }
    let height = device.height;
    if (height <= 0) {
        height = 1920;
    }
    let sx = random(width / 3, width * 2 / 3);
    let sy = random(height * 7 / 10, height * 8 / 10);
    let ex = random(width / 3, width * 2 / 3);
    let ey = random(height * 2 / 10, height * 3 / 10);
    randomSwipe(sx, sy, ex, ey);
}
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
    } catch (err) {
        log(rect);
        toastLog('随机点击失败:' + err);
    }
}
function backToHome() {
    let homeTab = desc('首页\u16512按钮').visibleToUser().findOne(3000);
    for (let i = 0; i < 10; i++) {
        if (homeTab != null) {
            simulationClick(homeTab);
            toastLog('返回首页');
            return;
        } else {
            back();
            sleep(random(2000, 3000));
            homeTab = desc('首页\u16512按钮').visibleToUser().findOne(3000);
        }
    }
    toastLog('返回首页失败');
}
function sendCommment(inputMessage) {
    let inputText = className('EditText').findOne(3000);
    ;
    if (inputText != null) {
        inputText.click();
        sleep(random(1000, 2000));
        inputText.setText(inputMessage);
        sleep(random(1000, 2000));
        back();
        let sendButton = className('TextView').text('发送').findOne(3000);
        if (sendButton != null) {
            simulationClick(sendButton);
            log('评论成功\u16520' + inputMessage);
            sleep(random(1000, 2000));
        } else {
            log('没有找到发布按钮');
        }
    }
}
function collect(name) {
    try {
        let collectButton = className('LinearLayout').descStartsWith('未选中').visibleToUser().findOne(3000);
        if (collectButton != null) {
            simulationClick(collectButton);
            sleep(500, 1000);
            let rootView = id('root_view').visibleToUser().findOne(3000);
            if (rootView != null) {
                let toastBottom = rootView.bounds().top - 35;
                let toastTop = toastBottom - 120;
                let toastLeft = 100;
                let toastRight = 500;
                log(rootView);
                coordClick(toastLeft, toastTop, toastRight, toastBottom);
                sleep(random(1000, 2000));
                let collectDialog = text('选择收藏夹').findOne(3000);
                if (collectDialog != null) {
                    let lastName = '';
                    while (true) {
                        let names = className('TextView').visibleToUser().find();
                        names.pop();
                        let count = names.length;
                        if (names.length == 0 || names[count - 1].text() == lastName) {
                            break;
                        }
                        sleep(random(1000, 2000));
                        for (let i = 0; i < count; i++) {
                            if (names[i].text() == name) {
                                simulationClick(names[i]);
                                sleep(random(2000, 3000));
                                return 1;
                            }
                        }
                        lastName = names[count - 1].text();
                        let listControl = className('androidx.recyclerview.widget.RecyclerView').findOne(3000);
                        if (listControl != null) {
                            let horiCenter = (listControl.bounds().right - listControl.bounds().left) / 2;
                            let top = listControl.bounds().top + 200;
                            let bottom = listControl.bounds().bottom - 250;
                            sleep(random(1500, 2000));
                            randomSwipe(horiCenter, bottom, horiCenter, top);
                        }
                    }
                } else {
                    let tmpCollectButton1 = className('LinearLayout').descStartsWith('未选中').visibleToUser().findOne(3000);
                    let tmpCollectButton2 = className('LinearLayout').descStartsWith('已选中').visibleToUser().findOne(3000);
                    if (tmpCollectButton1 != null && tmpCollectButton2 == null) {
                        toastLog('点击收藏失败\u16512进行重试');
                        return collect(name);
                    } else {
                        toastLog('没有发现添加收藏夹选项,可能已经被限制');
                        back();
                        sleep(1000);
                        return -1;
                    }
                }
            }
        } else {
            log('没有找到收藏入口按钮\u16512本次不再重试');
        }
    } catch (err) {
        log('收藏异常');
        log(err);
        let collectDialog = text('选择收藏夹').visibleToUser().findOne(3000);
        if (collectDialog != null) {
            back();
            sleep(1000);
        }
    }
    let cancelCollectButton = className('LinearLayout').descStartsWith('已选中').visibleToUser().findOne(3000);
    if (cancelCollectButton != null) {
        simulationClick(cancelCollectButton);
    }
    return 0;
}
function coordClick(left, top, right, bottom) {
    let offsetX = (right - left) * 0.2;
    let offsetY = (bottom - top) * 0.2;
    let x = random(left + offsetX, right - offsetX);
    let y = random(top + offsetY, bottom - offsetY);
    click(x, y);
}
function randomSwipe(sx, sy, ex, ey) {
    var leaveMax = 150;
    var timeMin = 300;
    var timeMax = 600;
    var time = [
        0,
        random(timeMin, timeMax)
    ];
    let centerX = (sx + ex) / 2;
    let centerY = (sy + ey) / 2;
    cx1 = centerX + random(0, leaveMax);
    cy1 = centerY + random(0, leaveMax);
    cx2 = centerX - random(0, leaveMax);
    cy2 = centerY - random(0, leaveMax);
    let track = bezierCreate(sx, sy, cx1, cy1, cx2, cy2, ex, ey);
    gestures(time.concat(track));
}
function unlock() {
    if (!device.isScreenOn()) {
        device.wakeUp();
        sleep(1000);
        device.wakeUp();
        sleep(1000);
        swipe(500, 2000, 500, 1000, 210);
    }
}