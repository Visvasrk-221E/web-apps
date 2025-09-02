#!/bin/bash

commit_msg=${1}

#git init
#git remote add origin https://github.com/Visvasrk-221E/web-apps.git

git add .
git commit -m "${commit_msg}"
git push -u origin main

