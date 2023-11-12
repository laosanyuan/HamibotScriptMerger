import pytest
from src.parser.ast_parser import AstParser
from src.generater.script_generater import ScriptGenerater


def test_get_functions():
    js_code = """
function add(x, y) {
return x + y;
}

var result = add(3, 5);
console.log(result);
"""
    parser = AstParser(js_code)
    ast = parser.get_funtions()

    generater = ScriptGenerater()
    js = generater.generater(ast)

    assert ast[0].type == 'FunctionDeclaration'
    assert ast[0].id.name == 'add'


def test_get_requires():
    js_code = """
const { greet, farewell } = require('./my-functions1');
const { greet, farewell } = require('./my-functions2');
const { greet, farewell } = require('./my-functions3');

function add(x, y) {
return x + y;
}

var result = add(3, 5);
console.log(result);
"""
    parser = AstParser(js_code)
    ast = parser.get_requires()

    assert len(ast) == 3

