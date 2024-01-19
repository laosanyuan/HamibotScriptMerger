const { unlock } = require('./通用功能/解锁屏幕');
const { resolveConfig } = require('./通用功能/读取配置文件');
const { backToHome } = require('./抖音功能/切换页面');
const { comment } = require('./抖音功能/评论');
const { collect } = require('./抖音功能/收藏');
const { checkDialog } = require('./抖音功能/检查弹窗');
const { upSwipe } = require('./通用功能/模拟滑动');
const { getVideoTags } = require('./抖音功能/获取视频信息');
const { errorAlert } = require('./通用功能/提醒');

// 浮窗
var window = floaty.rawWindow(
    "<vertical padding='10' gravity='left' bg='#80000000'>\
        <horizontal padding='5' gravity='left'>\
            <text textSize='10sp' textColor='#FFFFFF' text='运行状态：' />\
            <text textSize='10sp' textColor='#FF0000' id='run_status' text='准备中' />\
        </horizontal>\
        <horizontal padding='5' gravity='left'>\
            <text textSize='10sp' textColor='#FFFFFF' text='评论数量：' />\
            <text textSize='10sp' textColor='#FF0000' id='comment_count' text='0' />\
        </horizontal>\
        <horizontal padding='5' gravity='left'>\
            <text textSize='10sp' textColor='#FFFFFF' text='收藏数量：' />\
            <text textSize='10sp' textColor='#FF0000' id='collect_count' text='0' />\
        </horizontal>\
    </vertical>"
);

// 最大评论数量
var maxCommentTimes = 0;
// 最大收藏数量
var maxCollectTimes = 0;
// 评论tags
var commentTags = [];
// 评论内容
var commentList = [];
// 是否使用其他用户评论
var needOthersComment = false;
// 运行模式
var runMode = "收藏+评论";
// 收藏tags映射
var favoritesMap = {};

try {
    resolveConfig();
    unlock();
    sleep(1000);
    app.launchApp('抖音');
    sleep(3000);
    backToHome();
    ui.run(() => window.run_status.setText("开始运行"));
    checkDialog();

    let commentTimes = 0;
    let collectTimes = 0;
    while (commentTimes < maxCommentTimes || collectTimes < maxCollectTimes) {
        checkDialog();
        let targetTags = getVideoTags();
        toast(targetTags);
        if (targetTags != null && targetTags.length > 0) {
            // 评论
            if (maxCommentTimes > commentTimes) {
                for (let j = 0; j < targetTags.length; j++) {
                    if (commentTags.indexOf(targetTags[j]) >= 0) {
                        ui.run(() => window.run_status.setText("找到评论目标tag:" + targetTags[j]));
                        // 获取随机评论内容
                        let index = Math.floor(random(0, commentList.length - 1));
                        comment(commentList[index], needOthersComment);
                        commentTimes++;
                        ui.run(() => window.comment_count.setText(commentTimes.toString()));
                        sleep(random(1000, 2000));
                        break;
                    }
                }
            }
            // 收藏
            if (maxCollectTimes > collectTimes) {
                for (let i = 0; i < targetTags.length; i++) {
                    let isCollected = false;
                    for (let key in favoritesMap) {
                        let tmpTags = favoritesMap[key];
                        if (tmpTags.indexOf(targetTags[i]) >= 0) {
                            ui.run(() => window.run_status.setText("找到收藏目标tag:" + targetTags[i]));
                            sleep(1500);
                            let collectResult = collect(key);
                            if (collectResult == 1) {
                                collectTimes++;
                                isCollected = true;
                                ui.run(() => window.collect_count.setText(collectTimes.toString()));
                            }
                            else if (collectResult == -1) {
                                collectTimes = 100000;
                                toastLog("收藏失败，结束后续收藏流程");
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
        ui.run(() => window.run_status.setText("正在切换视频"));
        upSwipe();
        sleep(random(1000, 2500));
        ui.run(() => window.run_status.setText("正在获取有效tag"));
    }
}
catch (err) {
    log(err);
    errorAlert();
}
finally {
    ui.run(() => window.run_status.setText("结束流程，等待程序关闭"));
    sleep(5000);
    home();
    threads.shutDownAll();
}