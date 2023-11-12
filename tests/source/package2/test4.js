const { testFunction6, testFunction7 } = require('./test3');
const { testFunction2 } = require('../package1/test1')

function testFunction4() {
    testFunction6();
    privateFunction();
    testFunction2();
}

function testFunction5() {
    testFunction7();
}

function privateFunction1() {

}