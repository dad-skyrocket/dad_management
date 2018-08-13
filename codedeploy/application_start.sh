#!/bin/bash

pushd /opt/frontend/dad_management/dad-management-client
yarn build > build.log 2>&1
popd
