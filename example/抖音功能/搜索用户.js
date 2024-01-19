const { simulationClick } = require("../通用功能/模拟点击");


viewUser('33888242971', '收藏');

// 搜索用户进入对方首页切换到对应tab页
function viewUser(uid, tabName) {
    let searchImage = className('Button').desc('搜索').findOne(3000);
    if (searchImage != null) {
        simulationClick(searchImage);
        sleep(random(2000, 3000));

        // 输入搜索内容
        let textEdit = className('EditText').findOne(3000);
        if (textEdit != null) {
            textEdit.setText(uid);
            sleep(random(2000, 3000));
            // 点击搜索
            let searchButton = text('搜索').findOne(3000);
            if (searchButton != null) {
                simulationClick(searchButton);
                sleep(random(1000, 2000));

                // 点击用户文案进入其主页
                let user = desc('用户').findOne(3000);
                if (user != null) {
                    simulationClick(user);
                    sleep(random(2000, 3000));
                    // 切换到收藏tab
                    let collectTab = text(tabName).findOne(3000);
                    simulationClick(collectTab);
                    sleep(random(1000, 2000));
                    return true;
                }
            }
        }
    }
    return false;
}
