from .ast_parser import AstParser
import os


class DependencyParser(object):
    def __init__(self, file: str, parsed_dict: dict = None) -> None:
        self.entry_file = file
        self.maps = {}
        if parsed_dict == None:
            self.parsed_dict = {}
        else:
            self.parsed_dict = parsed_dict

    def parse_file(self):
        return self.parse_dependencies(self.entry_file)

    # def parse_dependencies(self, file_name: str):
    #     parser = AstParser(file_name)
    #     requires = parser.get_requires()
    #     internal_functions = parser.get_funtions()
    #     if len(requires) > 0:
    #         for require in requires:
    #             tmp_file_name = require.declarations[0].init.arguments[0].value
    #             tmp_file_name = os.path.normpath(os.path.join(
    #                 os.path.dirname(file_name), tmp_file_name)) + '.js'
    #             tmp_functions = []
    #             for function in require.declarations[0].id.properties:
    #                 tmp_functions.append(function.key.name)

    #             need_parse = False
    #             # 保存
    #             if tmp_file_name in self.maps:
    #                 for function in tmp_functions:
    #                     if function not in self.maps[tmp_file_name]:
    #                         self.maps[tmp_file_name].append(function)
    #                         need_parse = True
    #             else:
    #                 self.maps[tmp_file_name] = tmp_functions
    #                 need_parse = True

    #             if need_parse:
    #                 self.parse_dependencies(tmp_file_name)

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

        parser = AstParser(self.entry_file)
        # 当前函数所有调用到的函数名
        called_functions = parser.get_used_functions_with_name(function_name)

        simplest_maps[self.entry_file] = set()
        simplest_maps[self.entry_file].add(function_name)

        # 检查自身引用
        internal_functions = parser.get_funtions()
        for function in internal_functions:
            tmp_function_name = function.id.name
            if tmp_function_name in called_functions and tmp_function_name != function_name:
                simplest_maps[self.entry_file].add(tmp_function_name)

        # 检查依赖引用
        requires = parser.get_requires()
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

        return simplest_maps

    def _record_parsed_func(self, func: str) -> None:
        if self.entry_file in self.parsed_dict:
            if func not in self.parsed_dict[self.entry_file]:
                self.parsed_dict[self.entry_file].append(func)
        else:
            self.parsed_dict[self.entry_file] = [func]
