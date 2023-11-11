
import escodegen
from esprima import nodes


class ScriptGenerater(object):
    def __init__(self):
        pass

    def generater(self, functions:list):
        ast = nodes.Script(functions)
        generated_code = escodegen.generate(ast)
        return generated_code
