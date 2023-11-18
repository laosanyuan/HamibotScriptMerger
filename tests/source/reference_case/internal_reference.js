
// 内部依赖：test_2/test3/test_4/test_5/test_6
function test_1() {
    test_2();
    test_3();
    unknown_1();
    test_4(test_5(), unknown_2());
}

function test_2() {
    unknown_3();
}

function test_3() {
    test_4();
}

function test_4() {
    test_6()
    unknown_4()
}

function test_5() {
}

function test_6() {
}

function test_7() {
}