const { simulationClick } = require("../通用功能/模拟点击");


backToHome();



// 返回首页
function backToHome() {
    let homeTab = desc('首页，按钮').visibleToUser().findOne(3000);

    for (let i = 0; i < 10; i++) {
        if (homeTab != null) {
            simulationClick(homeTab);
            toastLog('返回首页');
            return;
        }
        else {
            back();
            sleep(random(2000, 3000));
            homeTab = desc('首页，按钮').visibleToUser().findOne(3000);
        }
    }

    toastLog("返回首页失败");
}

