import os

total_line_num = 0  # 总行数
total_file_num = 0  # 总文件数
avg_file_num = 0    # 平均行数
max_line_num = 0    # 最大行数
min_line_num = 999999    # 最小行数

for base_path, folder_list, file_list in os.walk('D:\Project\IDEA\MediaPlatformManagerSystem\src'):

    total_file_num += len(file_list)
    # 遍历文件列表
    for file_name in file_list:
        # 文件路径
        file_path = os.path.join(base_path, file_name)
        # 获取文件后缀，根据需要根据后缀进行文件排除
        file_ext = file_path.rsplit('.', maxsplit=1)
        # 不是py文件,排除
        if file_ext[1] != 'vue' and file_ext[1] != 'js' and file_ext[1] != 'css' and file_ext[1] != 'java':
            continue
        # py文件数加一
        total_file_num += 1
        count = 0
        with open(file_path, 'rb') as f:
            for line in f:
                # 根据需要是否去除空格
                line = line.strip()
                if not line:
                    continue
                # 根据需要是否去除注释
                if line.startswith(b'#'):
                    continue
                count += 1
        total_line_num += count
        max_line_num = count if count > max_line_num else max_line_num
        min_line_num = count if count < min_line_num else min_line_num
print('vue文件总行数：', total_line_num)
print('总文件数：', total_file_num)
print('最多行数：', max_line_num)
print('最小总行数：', min_line_num)
print('平均行数：', total_line_num / total_file_num)
