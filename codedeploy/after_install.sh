#!/bin/bash

yarn
if [ "$?" != "0" ]; then
    yum install -y yarn
fi
