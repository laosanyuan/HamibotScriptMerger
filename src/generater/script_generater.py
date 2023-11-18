
import escodegen
from esprima import nodes
import os


class ScriptGenerater(object):
    def __init__(self, file_name: str):
        self.file_name = file_name
        # 提取目录路径
        directory = os.path.dirname(file_name)
        # 如果目录不存在，就创建它
        if not os.path.exists(directory):
            os.makedirs(directory)

    def generate_code(self, functions: list):
        """根据ast生成代码

        Args:
            functions (list): 脚本ast
        """
        ast = nodes.Script(functions)
        generated_code = escodegen.generate(ast)

        title = """// 以下脚本由“HamibotScriptMerger”打包合成。
// 项目地址：https://github.com/laosanyuan/HamibotScriptMerger
// 如在使用中发现任何问题，欢迎提issue。

"""
        # 在文件中写入内容
        with open(self.file_name, 'w', encoding='utf-8') as file:
            file.write(title + generated_code,)
