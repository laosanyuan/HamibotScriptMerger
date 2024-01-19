
const { simulationClick } = require('../通用功能/模拟点击');


checkDialog();

// 处理意外弹窗
function checkDialog() {
    // 1.检查升级提示
    let upgradeDialog = text('检测到更新').findOne(3000);
    if (upgradeDialog != null) {
        let cancelUpgrade = text('以后再说').findOne(3000);
        if (cancelUpgrade != null) {
            simulationClick(cancelUpgrade);
            toastLog('关闭检测到升级弹窗');
        }
        else {
            throw new Error('处理更新弹窗失败');
        }
    }

    // 2.朋友推荐
    let friendDialog = text('朋友推荐').findOne(3000);
    if (friendDialog != null) {
        let closeFriendDialog = className('ImageView').desc('关闭').findOne(3000);
        if (closeFriendDialog != null) {
            simulationClick(closeFriendDialog);
            toastLog('关闭朋友推荐弹窗');
        }
        else {
            throw new Error('处理朋友推荐弹窗失败');
        }
    }

    // 3.休息提醒
    let tiredDialog = text('已到达你设置的休息时间').findOne(3000);
    if (text('已到达你设置的休息时间').findOne(3000) != null) {
        let cancelTiredButton = text('忽略提醒').findOne(3000);
        if (cancelTiredButton != null) {
            simulationClick(cancelTiredButton);
            toastLog('关闭休息提醒');
        }
        else {
            throw new Error('关闭休息提醒失败');
        }
    }
}
