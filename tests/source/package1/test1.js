const { testFunction3 } = require('./test2');

function testFunction1() {
    testFunction3();
    testFunction2();
}

function testFunction2() {
    function_1();
    function_2();
}

function function_1() {
    let tmp = function_3();
}

function function_4(params) {

}