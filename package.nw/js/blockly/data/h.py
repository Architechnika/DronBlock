import os

f = open("result.txt", "wb")
un = open("union.js", "wb")
exc = open("except.txt", "r")
ex = [x for x in exc]


def func(dir):
    for i in os.listdir(dir):
        file_path = dir + "\\" + str(i)
        print(file_path)
        if (file_path + '\n') in ex:
            continue

        if os.path.isdir(file_path):
            func(file_path)
        elif file_path != ".\\union.js" and file_path.split('.')[-1] == "js":
            if os.stat(file_path).st_size:
                un.write(open(file_path, "rb").read() + b'\n')
            f.write(file_path.encode("utf-8") + b'\n')

func(os.curdir)


