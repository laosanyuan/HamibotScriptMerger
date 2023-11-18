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
        """获取所有函数列表

        Returns:
            list: 函数ast
        """
        results = []
        for item in self._ast.body:
            if item.type == 'FunctionDeclaration':
                results.append(item)
        return results

    def get_used_functions(self, function_names: set, function_asts: set) -> None:
        """获取被引用到的函数

        Args:
            function_names (set): 入口函数名
            function_ast (set): 函数ast

        Returns:
            set: 依赖函数ast集合
        """
        all_functions = self.get_funtions()

        for item in all_functions:
            if item.id.name in function_names:
                if item in function_asts:
                    continue
                function_asts.add(item)
                function_calls = set()
                self._find_called_functions(item, function_calls)
                self.get_used_functions(function_calls, function_asts)

    def get_used_functions_with_name(self, function_name: str):
        function_asts = set()
        all_functions = self.get_funtions()
        for item in all_functions:
            if item.id.name == function_name:
                self._find_called_functions(item, function_asts)

        if function_name in function_asts:
            function_asts.remove(function_name)

        return function_asts

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

    def _find_called_functions(self, ast: Node, functions_call: set):
        """递归获取被调用到的函数名

        Args:
            ast (Node): 语句ast
            functions_call (set): 函数名集合
        """
        try:
            if isinstance(ast, Module) or isinstance(ast, Script) or isinstance(ast, BlockStatement):
                self._find_called_functions(ast.body, functions_call)
            elif isinstance(ast, ExpressionStatement):
                self._find_called_functions(ast.expression, functions_call)
            elif isinstance(ast, FunctionDeclaration):
                functions_call.add(ast.id.name)
                self._find_called_functions(ast.body, functions_call)
                self._find_called_functions(ast.params, functions_call)
            elif isinstance(ast, CallExpression):
                self._find_called_functions(ast.arguments, functions_call)
                if ast.callee.name == None:
                    self._find_called_functions(ast.callee, functions_call)
                else:
                    functions_call.add(ast.callee.name)
            elif isinstance(ast, list):
                for item in ast:
                    self._find_called_functions(item, functions_call)
            elif isinstance(ast, VariableDeclaration):
                self._find_called_functions(ast.declarations, functions_call)
            elif isinstance(ast, IfStatement):
                self._find_called_functions(ast.consequent, functions_call)
                self._find_called_functions(ast.alternate, functions_call)
                self._find_called_functions(ast.test, functions_call)
            elif isinstance(ast, WhileStatement) or isinstance(ast, DoWhileStatement):
                self._find_called_functions(ast.body, functions_call)
                self._find_called_functions(ast.test, functions_call)
            elif isinstance(ast, VariableDeclarator):
                self._find_called_functions(ast.init, functions_call)
            elif isinstance(ast, ForInStatement) or isinstance(ast, ForOfStatement):
                self._find_called_functions(ast.body, functions_call)
                self._find_called_functions(ast.left, functions_call)
                self._find_called_functions(ast.right, functions_call)
            elif isinstance(ast, ComputedMemberExpression) or isinstance(ast, StaticMemberExpression):
                self._find_called_functions(ast.object, functions_call)
            elif isinstance(ast, BinaryExpression) or isinstance(ast, AssignmentExpression):
                self._find_called_functions(ast.left, functions_call)
                self._find_called_functions(ast.right, functions_call)
            elif isinstance(ast, ForStatement):
                self._find_called_functions(ast.test, functions_call)
                self._find_called_functions(ast.init, functions_call)
                self._find_called_functions(ast.body, functions_call)
            elif isinstance(ast, ReturnStatement):
                self._find_called_functions(ast.argument, functions_call)
            elif isinstance(ast, TryStatement):
                self._find_called_functions(ast.handler, functions_call)
                self._find_called_functions(ast.block, functions_call)
                self._find_called_functions(ast.finalizer, functions_call)
            elif isinstance(ast, CatchClause):
                self._find_called_functions(ast.body, functions_call)
                self._find_called_functions(ast.param, functions_call)
            else:
                pass
        except Exception as e:
            print(e)
