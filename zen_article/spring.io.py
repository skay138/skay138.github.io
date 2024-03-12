from markdownify import markdownify as md
from datetime import datetime
import os
import shutil

# Settings
title = "Accessing Relational Data using JDBC with Spring"
num=4



current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S%z')
current_folder_name = "zen_article"

article_text = f"""
---
title: "[Spring Boot] {title}"
description: 
date: {current_time}+0900
image: cover.png
categories:
  - Backend Studies
tags:
  - Spring Boot
---

## What You Will Build

"""


folder_path = f"./content/post/Spring.io/{num}-{title}"
os.makedirs(folder_path)

with open(f"{folder_path}/index.md", "w", encoding="utf-8") as f:
    f.write(article_text)

shutil.copy(f"{current_folder_name}/springboot.png", f"{folder_path}/cover.png")

print("done")