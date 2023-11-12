
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

    def generater(self, functions: list):
        ast = nodes.Script(functions)
        generated_code = escodegen.generate(ast)
        # 在文件中写入内容
        with open(self.file_name, 'w') as file:
            file.write(generated_code)
