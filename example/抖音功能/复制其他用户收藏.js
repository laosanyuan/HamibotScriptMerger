const { upSwipe, randomSwipe } = require("../通用功能/模拟滑动");
const { simulationClick } = require("../通用功能/模拟点击");



let targets = ['肉腿', '牛仔短裤', '眼镜', '牛仔裤', '瑜伽裤', 'cos', 'Jk']//, '黄色战袍', '运动短裤', '颜值', '包tun', '甜妹', '萝莉', '国风旗袍']

loopCollect('短裤');

// 复制用户所有收藏夹 - 前提已切换到对方收藏页
function copyUserCollects(targetList) {
    let complateList = [];
    let lastName = "";
    let bottomCounter = 0;
    while (true) {
        sleep(random(1000, 2000));
        let listUnfollow = text('关注').indexInParent(2).visibleToUser().find();
        let listFollow = text('已关注').indexInParent(2).visibleToUser().find();
        let collectList = listUnfollow.concat(listFollow);
        if (collectList.length > 0) {
            for (let i = collectList.length - 1; i >= 0; i--) {
                try {
                    let favorite = collectList[i].parent().child(0);

                    if (favorite != null) {
                        // 判断是否到结尾
                        let favoriteTitle = favorite.text();
                        log(favoriteTitle)
                        if (i == collectList.length - 1) {
                            if (lastName == favoriteTitle) {
                                bottomCounter++;
                                break;
                            }
                            else {
                                lastName = favoriteTitle;
                            }
                        }

                        // 比较是否在目标列表
                        if (targetList.indexOf(favoriteTitle) >= 0
                            && complateList.indexOf(favoriteTitle) < 0) {
                            simulationClick(favorite);
                            sleep(random(2000, 3000));
                            // 循环处理收藏
                            if (!loopCollect(favoriteTitle)) {
                                log("复制受限制,结束复制")
                                return;
                            }
                            sleep(random(1000, 2000));
                            complateList.push(favoriteTitle);
                        }
                    }
                }
                catch (err) {
                    log(err);
                }
            }
        }

        if (bottomCounter >= 5) {
            log("收藏夹复制结束");
            return;
        }

        // 上滑继续
        upSwipe();
        sleep(random(1000, 2000));
    }
}

// 循环复制一个收藏夹
function loopCollect(name) {
    try {
        // 复制多了有限制,改为只复制第一页,不再向下翻页
        let video = className('TextView').visibleToUser().descStartsWith("点赞数").findOne(3000);
        // 数据错误
        if (video == null) {
            return;
        }

        // 进入第一个视频，通过滑动获取后续视频
        simulationClick(video);
        sleep(random(2000, 3000));
        let collectResult = copyCollect(name);
        sleep(random(1000, 2000));
        back();
        sleep(random(2500, 3500));

        if (!collectResult) {
            // 受限,停止脚本执行
            return false;
        }

        log('复制完成:' + name);
    }
    catch (err) {
        log('循环复制收藏异常');
        log(err);
        return false;
    }
    finally {
        back();
    }
    return true;
}

// 复制单个收藏夹 0:正常, 1:遇到已收藏, -1:受限
function copyCollect(name) {
    try {
        let lastVideo = "";
        while (true) {
            let collectButton = className("LinearLayout").descStartsWith("未选中").visibleToUser().findOne(3000);
            if (collectButton != null) {
                simulationClick(collectButton);
                let addFlag = text('善语结善缘，恶言伤人心').findOne(3000);
                if (addFlag != null) {
                    // 点击收藏选项 此处位置结果为模拟计算，点击可能会失败
                    sleep(1000);
                    let top = addFlag.parent().bounds().top - 100;
                    let right = addFlag.bounds().right;
                    click(right, top);
                    sleep(random(1000, 2000));

                    // 是否点击成功
                    let collectDialog = text("选择收藏夹").findOne(3000);
                    if (collectDialog != null) {
                        let lastName = "";
                        while (true) {
                            let names = className('TextView').visibleToUser().find();

                            // 移除新建收藏夹
                            names.pop();

                            let count = names.length;
                            if (names.length == 0 || names[count - 1].text() == lastName) {
                                // 无效或已到结尾
                                break;
                            }

                            sleep(random(1000, 2000));
                            // 寻找目标收藏夹
                            for (let i = 0; i < count; i++) {
                                if (names[i].text() == name) {
                                    simulationClick(names[i]);
                                    sleep(random(1000, 2000));
                                    break;
                                }
                            }
                            lastName = names[count - 1].text();

                            // 上滑翻页
                            let listControl = className('androidx.recyclerview.widget.RecyclerView').findOne(3000);
                            if (listControl != null) {
                                let horiCenter = (listControl.bounds().right - listControl.bounds().left) / 2;
                                let top = listControl.bounds().top + 200;
                                let bottom = listControl.bounds().bottom - 250;
                                sleep(random(1500, 2000));
                                randomSwipe(horiCenter, bottom, horiCenter, top);
                            }
                        }
                    }
                    else {
                        toastLog("没有发现添加收藏夹选项,可能已经被限制");
                        back();
                        sleep(1000);
                        return false;
                    }
                }
            }
            else {
                // 比对是否到达视频末尾 当前已复制，并且与上一个视频相同
                let currentVideo = getVideoFlag();
                if (lastVideo == currentVideo) {
                    back();
                    sleep(1000);
                    break;
                }
                else {
                    lastVideo = currentVideo;
                }
            }

            // 上滑
            sleep(1000)
            upSwipe();
            sleep(random(1000, 2000));
        }
    }
    catch (err) {
        log('收藏异常')
        log(err);
        // 是否点击成功
        let collectDialog = text("选择收藏夹").visibleToUser().findOne(3000);
        if (collectDialog != null) {
            back();
            sleep(1000)
        }
    }
    return true;
}

// 获取视频标识
function getVideoFlag() {
    let result = "";

    let authorName = id('title').visibleToUser().findOne(3000);
    if (authorName != null) {
        result += authorName.text();
    }

    let timeStr = descStartsWith('发布时间').visibleToUser().findOne(3000);
    if (timeStr != null) {
        result += timeStr.text();
    }

    let titleStr = id('desc').visibleToUser().findOne(3000);
    if (titleStr != null) {
        result += titleStr.text();
    }

    return result;
}