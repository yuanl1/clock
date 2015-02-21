#!/bin/bash

NODE=/opt/node/bin/node
SERVER_JS_FILE=/home/pi/Projects/Clock/app.js
USER=pi
OUT=/home/pi/nodejs.log

case "$1" in

start)
        echo "starting node: $NODE $SERVER_JS_FILE"
        sudo -u $USER $NODE $SERVER_JS_FILE > $OUT 2> $OUT &
        ;;

stop)
        killall $NODE
        ;;

*)
        echo "usage: (start, stop)"
esac

exit 0

