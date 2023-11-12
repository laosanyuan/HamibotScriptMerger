import argparse
from parser.dependency_parser import DependencyParser
from parser.ast_parser import AstParser
from generater.script_generater import ScriptGenerater

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    # 添加位置参数
    parser.add_argument('input_js', type=str, help='入口函数文件')
    parser.add_argument('output_js', type=str, help='生成文件路径')

    args = parser.parse_args()

    input_js = args.input_js
    output_js = args.output_js

    # 获取依赖关系
    dependency_parser = DependencyParser(input_js)
    dependency_parser.parse_file()
    ast_functions = set()
    for key, value in dependency_parser.maps.items():
        parser = AstParser(key)
        parser.get_used_functions(value, ast_functions)

    # 生成合并后脚本
    script_generater = ScriptGenerater(output_js)
    script_generater.generater(list(ast_functions))
