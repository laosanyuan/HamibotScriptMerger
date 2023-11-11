import esprima
import escodegen


class AstParser(object):
    def __init__(self, script: str) -> None:
        """
        Args:
            script (str): js文本
        """
        self._script = script
        self._ast = esprima.parseScript(script)

    def parser(self):
        ast = esprima.parseScript(self._script)
        generated_code = escodegen.generate(ast)
        return generated_code

    def get_funtions(self) -> list:
        """获取函数列表

        Returns:
            list: 函数ast
        """
        results = []
        for item in self._ast.body:
            if item.type == 'FunctionDeclaration':
                results.append(item)
        return results
