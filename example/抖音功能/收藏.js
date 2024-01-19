const { randomSwipe } = require("../通用功能/模拟滑动");
const { simulationClick, coordClick } = require("../通用功能/模拟点击");

collect('腰臀比');



// 收藏到收藏夹 0:失败，1:成功，-1：已受限
function collect(name) {
    try {
        let collectButton = className("LinearLayout").descStartsWith("未选中").visibleToUser().findOne(3000);
        if (collectButton != null) {
            simulationClick(collectButton);
            sleep(500, 1000);
            let rootView = id('root_view').visibleToUser().findOne(3000);
            if (rootView != null) {
                // 选择收藏夹弹窗位置根据底部菜单栏模拟计算得到，可能会存在错误
                let toastBottom = rootView.bounds().top - 35;
                let toastTop = toastBottom - 120;
                let toastLeft = 100;
                let toastRight = 500;
                log(rootView);
                coordClick(toastLeft, toastTop, toastRight, toastBottom);
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
                                sleep(random(2000, 3000));
                                return 1;
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
                    let tmpCollectButton1 = className("LinearLayout").descStartsWith("未选中").visibleToUser().findOne(3000);
                    let tmpCollectButton2 = className("LinearLayout").descStartsWith("已选中").visibleToUser().findOne(3000);
                    if (tmpCollectButton1 != null && tmpCollectButton2 == null) {
                        toastLog('点击收藏失败，进行重试');
                        return collect(name);
                    }
                    else {
                        toastLog("没有发现添加收藏夹选项,可能已经被限制");
                        back();
                        sleep(1000);
                        return -1;
                    }
                }
            }
        }
        else {
            // 不是被限制，这种情况可以继续收藏
            log('没有找到收藏入口按钮，本次不再重试');
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

    // 失败后取消收藏
    let cancelCollectButton = className("LinearLayout").descStartsWith("已选中").visibleToUser().findOne(3000);
    if (cancelCollectButton != null) {
        simulationClick(cancelCollectButton)
    }
    return 0;
}