const { test_2 } = require('./external_reference_1');
const { test_8, test_9 } = require('./external_reference_3');

function test_3() {
    test_8();
    test_7();
}

function test_4() {

}

function test_5() {
    test_4();
    test_6();
}

function test_6() {
    test_2();
    test_9();
}

function test_7() {

}