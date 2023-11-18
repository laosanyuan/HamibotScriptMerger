from .ast_parser import AstParser
import os


class DependencyParser(object):
    def __init__(self, file: str, parsed_dict: dict = None) -> None:
        """
        Args:
            file (str): 文件路径
            parsed_dict (dict, optional): 逐层传递下来的解析标记字典. Defaults to None.
        """
        self.entry_file = file
        self.maps = {}
        self.ast_parser = AstParser(self.entry_file)
        if parsed_dict == None:
            self.parsed_dict = {}
        else:
            self.parsed_dict = parsed_dict

    def parse_file(self) -> dict:
        """从入口脚本解析文件

        Returns:
            dict: 文件-函数 映射关系
        """
        functions = self.ast_parser.get_called_functions_with_script()
        simplest_maps = {}
        self._parse_dependencies_with_name(simplest_maps, functions, None)
        return simplest_maps

    def parse_simplest_dependencies(self, function_name: str) -> dict:
        """获取函数的最简依赖

        Args:
            function_name (str): 函数名称

        Returns:
            dict: 依赖关系字典
        """
        simplest_maps = {}

        # 已解析过的函数不再解析，避免循环处理
        if self.entry_file in self.parsed_dict and function_name in self.parsed_dict[self.entry_file]:
            return simplest_maps
        else:
            self._record_parsed_func(function_name)

        # 当前函数所有调用到的函数名
        called_functions = self.ast_parser.get_called_functions_with_function(
            function_name)

        simplest_maps[self.entry_file] = set()
        simplest_maps[self.entry_file].add(function_name)
        self._parse_dependencies_with_name(
            simplest_maps, called_functions, function_name)
        return simplest_maps

    def _parse_dependencies_with_name(self, simplest_maps: dict, called_functions: list, function_name: str = None) -> None:
        """根据函数名称解析依赖关系

        Args:
            simplest_maps (dict): 文件-函数映射字典
            called_functions (list): 被调桉树列表
            function_name (str, optional): 入口函数名. Defaults to None.
        """
        # 检查自身引用
        internal_functions = self.ast_parser.get_funtions()
        for function in internal_functions:
            tmp_function_name = function.id.name
            if tmp_function_name in called_functions and tmp_function_name != function_name:
                simplest_maps[self.entry_file].add(tmp_function_name)

        # 检查依赖引用
        requires = self.ast_parser.get_requires()
        if len(requires) > 0:
            for require in requires:
                # 获取依赖文件名
                tmp_file_name = require.declarations[0].init.arguments[0].value
                tmp_file_name = os.path.normpath(os.path.join(
                    os.path.dirname(self.entry_file), tmp_file_name)) + '.js'
                for function in require.declarations[0].id.properties:
                    if function.key.name in called_functions:
                        tmp_function_name = function.key.name
                        if tmp_file_name in simplest_maps:
                            if tmp_function_name not in simplest_maps[tmp_file_name]:
                                simplest_maps[tmp_file_name].add(
                                    tmp_function_name)
                        else:
                            simplest_maps[tmp_file_name] = set()
                            simplest_maps[tmp_file_name].add(tmp_function_name)

        # 递归获取数据
        self._extend_dependencies(simplest_maps, function_name)

    def _extend_dependencies(self, simplest_maps: dict, function_name: str = None) -> None:
        """根据已有函数映射向外递归扩展获取

        Args:
            simplest_maps (dict): 已有函数映射字典
            function_name (str, optional): 入口函数名称. Defaults to None.
        """
        for file, function_list in list(simplest_maps.items()):
            dependency_parser = DependencyParser(file, self.parsed_dict)
            for func in list(function_list):
                # 自身不递归
                if file == self.entry_file and func == function_name:
                    continue
                tmp_maps = dependency_parser.parse_simplest_dependencies(func)
                for tmp_map_name, tmp_map_list in tmp_maps.items():
                    if tmp_map_name in simplest_maps:
                        for tmp_function in list(tmp_map_list):
                            if tmp_function in simplest_maps[file]:
                                continue
                            simplest_maps[tmp_map_name].add(tmp_function)
                    else:
                        simplest_maps[tmp_map_name] = tmp_map_list

    def _record_parsed_func(self, func: str) -> None:
        """记录链路上已完成解析函数

        Args:
            func (str): 函数名
        """
        if self.entry_file in self.parsed_dict:
            if func not in self.parsed_dict[self.entry_file]:
                self.parsed_dict[self.entry_file].append(func)
        else:
            self.parsed_dict[self.entry_file] = [func]
