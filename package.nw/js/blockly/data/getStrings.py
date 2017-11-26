import re
import os

# ["'][А-Яа-я\s\\n\.(),1-9]*["']

# pattern1 = """['][А-Яа-я\\s\\\n\\.(),1-9"]*[']"""
# pattern2 = """["][А-Яа-я\\s\\\n\\.(),1-9']*["]"""

pattern1 = "['][^']*[']"
pattern2 = '["][^"]*["]'

strings = {}
# pattern = """["'][а-яА-Я\s\\\]+["'][а-яА-Я\s\\\]*["']*"""
print(pattern1)
print(pattern2)
out = open("out.txt", 'wb')


def func(dir):
    for file in os.listdir(dir):
        file_path = dir + "/" + file
        if os.path.isdir(file_path):
            func(file_path)
        elif os.path.splitext(file_path)[1] == ".js":
            res = open(file_path, "r", encoding="utf8").read()
            # print(res)
            result1 = re.findall(pattern1, res)
            result2 = re.findall(pattern2, res)
            result = result1 + result2
            # print(result)
            list = []
            for i in result:
                if re.search("[А-Яа-я]", i):
                    # print("--------------------------------------")
                    print(i)
                    print("--------------------------------------")
                    list.append(i)
            if len(list):
                strings[file_path] = list
				


func(os.curdir)
for key in strings:
    out.write(("\n" + key + "\n").encode("utf-8"))
    for val in strings[key]:
        out.write((val + "\n").encode())
