from markdownify import markdownify as md
from datetime import datetime
import os
import shutil

# Settings
Algorithm = "Array / String"




current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S%z')
current_folder_name = "zen_article"

with open(f"{current_folder_name}/leetcode.html", "r", encoding="utf-8") as page:
    html = page.read()

markdown_text = md(html=html)


# 대괄호 안의 내용 추출
title = markdown_text[markdown_text.find('[') + 1:markdown_text.find(']')]

# 대괄호 이후의 내용 제거
body = ""
try:
  body = markdown_text.split('Hint')[1]
except IndexError:
  body = markdown_text.split('Companies')[1]

clean_body = body.split('---')[0]

# ** 제거
clean_body = clean_body.replace("**Input:**", "Input:")
clean_body = clean_body.replace("**Output:**", "Output:")
clean_body = clean_body.replace("**Explanation:**", "Explanation:")
article_text = f"""

---
title: "{title}"
description: Top Interview 150 - {Algorithm}
date: {current_time}+0900
image: cover/algorithm.png
categories:
  - Algorithm/LeetCode
tags:
  - {Algorithm}
---

## Description

[문제 링크]()

{clean_body}

## 풀이

## 코드

```python


```

"""


folder_path = f"./content/post/algorithm/leetcode/{title}"
os.makedirs(folder_path)

with open(f"{folder_path}/index.md", "w", encoding="utf-8") as f:
    f.write(article_text)

print("done")