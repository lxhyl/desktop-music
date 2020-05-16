#!/bin/bash
git add .
git commit -m "$1"
git remote add origin git@github.com:zpfnb/desktop-music.git
git pull origin master
git push -u origin master


