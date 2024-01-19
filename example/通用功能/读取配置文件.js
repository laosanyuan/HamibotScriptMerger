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

resolveConfig();


// 解析配置信息
function resolveConfig() {
    maxCommentTimes = parseInt(hamibot.env['maxCommentTimes']);
    maxCollectTimes = parseInt(hamibot.env['maxCollectTimes']);
    commentTags = hamibot.env['comment_tags'].split(' ');
    commentList = hamibot.env['comment_list'].split('\n');
    needOthersComment = hamibot.env['need_others_comment'] == '是';
    runMode = hamibot.env['mode_select'];

    if (runMode == "collect") {
        // 不评论
        maxCommentTimes = 0;
    }
    if (runMode == "comment") {
        // 不收藏
        maxCollectTimes = 0;
    }

    // 处理收藏夹map
    let tmpMaps = hamibot.env['collect_tags'];
    let lines = tmpMaps.split('\n');
    // 正则表达式匹配冒号，包括中文冒号和英文冒号
    let colonRegex = /[:：]/;

    // 循环处理每一行
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        // 使用正则表达式匹配冒号
        var match = line.match(colonRegex);

        // 如果没有冒号则跳过当前行
        if (!match) {
            continue;
        }

        // 获取冒号的位置
        var colonIndex = match.index;

        // 以冒号分割每一行
        var key = line.substring(0, colonIndex).trim();
        var value = line.substring(colonIndex + 1).trim().split(' ');

        // 存入字典中
        favoritesMap[key] = value;
    }
}
