#!/bin/bash
echo "operation,response code,latency (ms)"
previous_line=''
while read line;
do
    if [[ $line =~ ([A-Z]+ [^ ]+).*\[([0-9]{3}).*B[^0-9]*([0-9]+)ms\] ]]
    then
        echo "${previous_line:2},${BASH_REMATCH[2]},${BASH_REMATCH[3]}"
    fi
    previous_line=$line
done </tmp/output/newman-result.txt
