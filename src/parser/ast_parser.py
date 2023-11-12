import esprima


class AstParser(object):
    def __init__(self, script: str) -> None:
        """
        Args:
            script (str): js文本
        """
        self._script = script
        self._ast = esprima.parseScript(script)

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

    def get_requires(self) -> list:
        """获取引用语句

        Returns:
            list: 引用语句
        """
        results = []
        for item in self._ast.body:
            if item.type == 'VariableDeclaration' and item.kind == 'const':
                if len(item.declarations) == 1:
                    declaration = item.declarations[0]
                    if declaration.type == 'VariableDeclarator' and declaration.init.callee.name == 'require':
                        results.append(item)

        return results

    def except_requires(self) -> list:
        """获取不包含require语句的其他内容

        Returns:
            list: 
        """
        results = []
        for item in self._ast.body:
            if item.type == 'VariableDeclaration' and item.kind == 'const':
                if len(item.declarations) == 1:
                    declaration = item.declarations[0]
                    if declaration.type == 'VariableDeclarator' and declaration.init.callee.name == 'require':
                        continue
            results.append(item)

        return results
