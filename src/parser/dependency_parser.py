from parser.ast_parser import AstParser
import os

class DependencyParser(object):
    def __init__(self, file: str) -> None:
        self.entry_file = file
        self.maps = {}

    def parse_file(self):
        return self.parse_dependencies(self.entry_file)

    def parse_dependencies(self, file_name: str):
        parser = AstParser(file_name)
        requires = parser.get_requires()
        if len(requires) > 0:
            for require in requires:
                tmp_file_name = require.declarations[0].init.arguments[0].value
                tmp_file_name = os.path.normpath(os.path.join(
                    os.path.dirname(file_name), tmp_file_name)) + '.js'
                tmp_functions = []
                for function in require.declarations[0].id.properties:
                    tmp_functions.append(function.key.name)

                need_parse = False
                # 保存
                if tmp_file_name in self.maps:
                    for function in tmp_functions:
                        if function not in self.maps[tmp_file_name]:
                            self.maps[tmp_file_name].append(function)
                            need_parse = True
                else:
                    self.maps[tmp_file_name] = tmp_functions
                    need_parse = True

                if need_parse:
                    self.parse_dependencies(tmp_file_name)
