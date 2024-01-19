const { upSwipe } = require("../通用功能/模拟滑动");
const { simulationClick } = require("../通用功能/模拟点击");


// sendCommment("我这个账号给我69w都不卖");
comment("我这个账号给我69w都不卖");



// 发布评论内容
function sendCommment(inputMessage) {
    let inputText = className('EditText').findOne(3000);;
    if (inputText != null) {
        // 设置输入焦点
        inputText.click();
        sleep(random(1000, 2000));
        // 输入内容
        inputText.setText(inputMessage);
        sleep(random(1000, 2000));
        // 显示没有输入，先返回关闭软键盘
        back();

        // 点击发布按钮
        let sendButton = className('TextView').text('发送').findOne(3000);
        if (sendButton != null) {
            simulationClick(sendButton);
            log("评论成功：" + inputMessage);
            sleep(random(1000, 2000));
        }
        else {
            log('没有找到发布按钮');
        }
    }
}

// 评论视频
function comment(backupInput, needOthersComment) {
    // 进入评论 - 没有评论的过滤掉
    let commendButton = className('ImageView').descStartsWith('评论').visibleToUser().findOne(3000);
    if (commendButton != null) {
        simulationClick(commendButton);
        sleep(random(2000, 3000));

        // 上滑
        upSwipe();
        sleep(random(1000, 2000));

        let realMessage = backupInput;
        // 获取评论内容
        if (needOthersComment) {
            let othersComment = id('content').findOne(3000);
            if (othersComment != null) {
                let othersCommentText = othersComment.text();
                // 随机确定使用备份还是复制来的内容
                realMessage = random(0, 1) >= 0.45 ? backupInput : othersCommentText;
            }
        }
        // 添加随机表情包结尾
        let count = random(1, 5);
        for (let i = 0; i < count; i++) {
            realMessage += "[看]";
        }
        sleep(1000);
        sendCommment(realMessage);

        // 退出评论页面
        back();
        sleep(random(1000, 2000));
    }
    else {
        log('获取评论按钮失败')
        log(commendButton);
    }
}