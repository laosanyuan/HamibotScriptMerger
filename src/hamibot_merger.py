import argparse
from parser.dependency_parser import DependencyParser
from parser.ast_parser import AstParser
from generater.script_generater import ScriptGenerater


def merge(input: str, output: str) -> None:
    """合并代码

    Args:
        input (str): 入口文件路径
        output (str): 生成文件路径
    """
    main_parser = AstParser(input)
    ast = main_parser.get_script()

    # 获取依赖关系
    dependency_parser = DependencyParser(input)
    maps = dependency_parser.parse_file()
    functions = set()
    for key, value in maps.items():
        parser = AstParser(key)
        parser.get_called_functions(value, functions)

    for func in functions:
        ast.append(func)

    # 生成合并后脚本
    script_generater = ScriptGenerater(output)
    script_generater.generate_code(ast)


if __name__ == '__main__':
    parameters = argparse.ArgumentParser()

    # 添加位置参数
    parameters.add_argument('input', type=str, help='入口函数文件')
    parameters.add_argument('output', type=str, help='生成文件路径')

    args = parameters.parse_args()

    merge(args.input_js, args.output_js)
