#!/bin/bash

yarn
if [ "$?" != "0" ]; then
    yum install -y yarn
fi

pushd /opt/frontend/dad_management/dad-management-client
yarn install
popd
