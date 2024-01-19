
getVideoFlag();

// 获取视频tags
function getVideoTags() {
    let result = [];
    let title = className("TextView").textContains("#").visibleToUser().findOne(3000);
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