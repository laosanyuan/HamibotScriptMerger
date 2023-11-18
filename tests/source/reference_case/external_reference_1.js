const { test_3, test_5 } = require('./external_reference_2');

// 外部依赖:test_3/test_8/test_7
function test_1() {
    test_3();
}

// 外部依赖：test_5/test_4/test_6/test_9/test_7
function test_2() {
    test_5();
}