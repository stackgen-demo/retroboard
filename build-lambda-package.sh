#!/bin/bash

set -e

rm -rf build
mkdir -p build
root_dir=$(pwd)

# package api
cd functions/api || exit
tempdir=$(mktemp -d -t retroboard-api)
cp -r ./*.py requirements.txt "$tempdir"
cd "$tempdir" || exit
mkdir package
pip3 install -r requirements.txt --target package --platform manylinux2014_x86_64 --only-binary=:all:
cd package || exit
zip -r ../api.zip .
cd ..
zip -g api.zip ./*.py requirements.txt

mv "$tempdir"/api.zip "$root_dir"/build/

# package email-summary
cd "$root_dir"/functions/email-summary || exit
zip -r "$root_dir"/build/email-summary.zip ./*.py

# package slack-alerts
cd "$root_dir"/functions/slack-alerts || exit
zip -r "$root_dir"/build/slack-alerts.zip ./*.py

# package app
cd "$root_dir"/app || exit
npm run build
zip -r "$root_dir"/build/app.zip ./out/*
