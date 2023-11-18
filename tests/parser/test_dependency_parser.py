from src.parser.dependency_parser import DependencyParser


def test_parse_simplest_dependencies_internal_reference_1():
    """内部依赖
    """
    js_path = 'tests/source/reference_case/internal_reference.js'
    parser = DependencyParser(js_path)
    result = parser.parse_simplest_dependencies('test_1')

    assert len(result) == 1
    assert len(result[js_path]) == 6
    assert 'test_1' in result[js_path]
    assert 'test_2' in result[js_path]
    assert 'test_3' in result[js_path]
    assert 'test_4' in result[js_path]
    assert 'test_5' in result[js_path]
    assert 'test_6' in result[js_path]


def test_parse_simplest_dependencies_internal_reference_2():
    js_path = 'tests/source/reference_case/internal_reference.js'
    parser = DependencyParser(js_path)
    result = parser.parse_simplest_dependencies('test_7')

    assert len(result) == 1
    assert len(result[js_path]) == 1
    assert 'test_7' in result[js_path]


def test_parse_simplest_dependencies_external_nested_dependency_success():
    """外部嵌套依赖
    """
    js_path = 'tests/source/reference_case/external_reference_1.js'
    parser = DependencyParser(js_path)
    result = parser.parse_simplest_dependencies('test_1')

    assert len(result) == 3

    functions = ['test_1', 'test_3', 'test_7', 'test_8']
    for names in result.values():
        for name in names:
            assert name in functions
            functions.remove(name)


def test_parse_simplest_dependencies_external_circular_dependency_success():
    """外部环依赖
    """
    js_path = 'tests\\source\\reference_case\\external_reference_1.js'
    parser = DependencyParser(js_path)
    result = parser.parse_simplest_dependencies('test_2')

    assert len(result) == 3

    functions = ['test_2', 'test_4', 'test_5', 'test_6', 'test_7', 'test_9']
    for names in result.values():
        for name in names:
            assert name in functions
            functions.remove(name)
