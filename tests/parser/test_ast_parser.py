from src.parser.ast_parser import AstParser


def test_get_used_functions_assign_state():
    parser = AstParser('./tests/source/syntax_case/assign.js')
    results = set()
    parser.get_used_functions('testFunction1', results)

    assert len(results) == 4


def test_get_used_functions_do_while_state():
    parser = AstParser('./tests/source/syntax_case/do_while.js')
    results = set()
    parser.get_used_functions('testFunction1', results)

    assert len(results) == 4


def test_get_used_functions_for_in_state():
    parser = AstParser('./tests/source/syntax_case/for_in.js')
    results = set()
    parser.get_used_functions('testFunction1', results)

    assert len(results) == 5


def test_get_used_functions_for_of_state():
    parser = AstParser('./tests/source/syntax_case/for_of.js')
    results = set()
    parser.get_used_functions('testFunction1', results)

    assert len(results) == 4


def test_get_used_functions_for_state():
    parser = AstParser('./tests/source/syntax_case/for.js')
    results = set()
    parser.get_used_functions('testFunction1', results)

    assert len(results) == 5


def test_get_used_functions_if_state():
    parser = AstParser('./tests/source/syntax_case/if.js')
    results = set()
    parser.get_used_functions('testFunction1', results)

    assert len(results) == 7


def test_get_used_functions_operation_state():
    parser = AstParser('./tests/source/syntax_case/operation.js')
    results = set()
    parser.get_used_functions('testFunction1', results)

    assert len(results) == 9


def test_get_used_functions_return_state():
    parser = AstParser('./tests/source/syntax_case/return.js')
    results = set()
    parser.get_used_functions('testFunction1', results)

    assert len(results) == 2


def test_get_used_functions_try_catch_state():
    parser = AstParser('./tests/source/syntax_case/try_catch.js')
    results = set()
    parser.get_used_functions('testFunction1', results)

    assert len(results) == 4


def test_get_used_functions_while_state():
    parser = AstParser('./tests/source/syntax_case/while.js')
    results = set()
    parser.get_used_functions('testFunction1', results)

    assert len(results) == 4
