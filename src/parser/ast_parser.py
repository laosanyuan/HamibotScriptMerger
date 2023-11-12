import esprima
from esprima.nodes import *


class AstParser(object):
    def __init__(self, file_name: str) -> None:
        """
        Args:
            script (str): js文本
        """
        with open(file_name, 'r') as file:
            script = file.read()
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

    # def get_funtions(self, functions: list) -> list:
    #     results = []
    #     for item in self._ast.body:
    #         if item.type == 'FunctionDeclaration' and item.id.name in functions:
    #             function_calls = set()
    #             self.find_called_functions(item, function_calls)
    #             results.append(item)

    #     return results

    def get_used_functions(self, function_names: set, function_ast: set) -> set:
        all_functions = self.get_funtions()

        for item in all_functions:
            if item.id.name in function_names:
                if item in function_ast:
                    continue
                function_ast.add(item)
                function_calls = set()
                self.find_called_functions(item, function_calls)
                self.get_used_functions(function_calls, function_ast)

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

    def find_called_functions(self, ast, functions_call):
        if isinstance(ast, Module) or isinstance(ast, Script) or isinstance(ast, BlockStatement):
            self.find_called_functions(ast.body, functions_call)
        elif isinstance(ast, ExpressionStatement):
            self.find_called_functions(ast.expression, functions_call)
        elif isinstance(ast, FunctionDeclaration):
            functions_call.add(ast.id.name)
            self.find_called_functions(ast.body, functions_call)
            self.find_called_functions(ast.params, functions_call)
        elif isinstance(ast, CallExpression):
            self.find_called_functions(ast.arguments, functions_call)
            functions_call.add(ast.callee.name)
        elif isinstance(ast, list):
            for item in ast:
                self.find_called_functions(item, functions_call)
        elif isinstance(ast, VariableDeclaration):
            self.find_called_functions(ast.declarations, functions_call)
        else:
            pass
