import argparse
import os
from file_service import FileService

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    # 添加位置参数
    parser.add_argument('input_js', type=str, help='入口函数文件')
    parser.add_argument('output_js', type=str, help='生成文件路径')

    args = parser.parse_args()

    input_js = args.input_js
    output_js = args.output_js

    fileService = FileService(input_js)
    fileService.parse_file()

    # 提取目录路径
    directory = os.path.dirname(output_js)

    # 如果目录不存在，就创建它
    if not os.path.exists(directory):
        os.makedirs(directory)

    with open(output_js, 'w') as file:
        # 在文件中写入内容
        file.write('Hello, World!')

    pass
