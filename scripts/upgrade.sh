#!/bin/bash

echo 'Checking for updates...'
git pull

echo 'Building docker image...'
docker build -t fallendusk/kalbot:latest .
