const { test_2 } = require('./external_reference_1');
const { test_6, test_7 } = require('./external_reference_2');


function test_8() {

}

function test_9() {
    test_6()
    test_7()
}

function test_10() {
    test_2()
    test_8()
}