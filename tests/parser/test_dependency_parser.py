from src.parser.ast_parser import AstParser


def test_getfunction_map():
    js_code = """
    let profile = text("Profile").visibleToUser().findOne(3000);
    if (profile) {
        simulationClick(profile);
        sleep(random(2000, 5000));

        let follwing = text('Following').visibleToUser().findOne(3000);
        if (follwing) {
            simulationClick(follwing);
            sleep(random(5000, 8000));

            // 翻页20次
            for (let i = 0; i < 20; i++) {
                upSwipe();
                sleep(random(1000, 3000));
            }

            let unfollowCount = 0;
            // 开始取关
            for (let i = 0; i < 100; i++) {
                // 获取当前页面没有回关的人
                let followButtons = text('Following').visibleToUser().find();
                if (followButtons == null || followButtons.length == 0) {
                    // 如果获取未回关用户失败，则开始取关好友
                    followButtons = text('Friends').visibleToUser().find();
                    toastLog('不存在未回关用户，获取互关用户');
                }

                if (followButtons != null && followButtons.length > 0) {
                    for (let i = 0; i < followButtons.length; i++) {
                        simulationClick(followButtons[i]);
                        unfollowCount++;
                        if (unfollowCount >= count) {
                            break;
                        }
                        sleep(random(8000, 15000));
                    }
                    if (unfollowCount >= count) {
                        break;
                    }
                }
                else {
                    // 页面中已经没有可以关注的用户，可能已经翻完
                    toastLog("关注列表已结束");
                    break;
                }

                // 翻页
                upSwipe();
                sleep(random(5000, 8000));
            }
        }
    }

    // 返回foryou
    backToHome();
"""
    parser = AstParser(js_code)
    ast = parser.except_requires()
    pass
