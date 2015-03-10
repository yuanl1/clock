#!/bin/bash
##################################################################
# A Project of TNET Services, Inc
#
# Title:     WiFi_Check
# Author:    Kevin Reed (Dweeber)
#            dweeber.dweebs@gmail.com
# Project:   Raspberry Pi Stuff
#
# Copyright: Copyright (c) 2012 Kevin Reed <kreed@tnet.com>
#            https://github.com/dweeber/WiFi_Check
#
# Purpose:
#
# Script checks to see if WiFi has a network IP and if not
# restart WiFi
#
# Uses a lock file which prevents the script from running more
# than one at a time.  If lockfile is old, it removes it
#
# Instructions:
#
# o Install where you want to run it
# o cp wifi_check.sh /usr/local/bin
# o chmod 755 /usr/local/bin/WiFi_Check
# o Add to crontab
# o crontab -e
#
# Run Every 5 mins - Seems like ever min is over kill unless
# this is a very common problem.  If once a min change */5 to *
# once every 2 mins */5 to */2 ...
#
# */5 * * * * /usr/local/bin/wifi_check.sh
#
##################################################################
# Settings
# Where and what you want to call the Lockfile
lockfile='/var/run/wifi_check.pid'
# Which Interface do you want to check/fix
wlan='wlan0'
##################################################################

# Set the path
export PATH="/sbin:/bin"

echo
echo "Starting WiFi check for $wlan"
date
echo

# Check to see if there is a lock file
if [ -e $lockfile ]; then
    # A lockfile exists... Lets check to see if it is still valid
    pid=`cat $lockfile`
    if kill -0 &>1 > /dev/null $pid; then
        # Still Valid... lets let it be...
        #echo "Process still running, Lockfile valid"
        exit 1
    else
        # Old Lockfile, Remove it
        #echo "Old lockfile, Removing Lockfile"
        rm $lockfile
    fi
fi
# If we get here, set a lock file using our current PID#
#echo "Setting Lockfile"
echo $$ > $lockfile

# We can perform check
echo "Performing Network check for $wlan"
if ifconfig $wlan | grep -q "inet addr:" ; then
    echo "Network is Okay"
else
    echo "Network connection down! Attempting reconnection."
    ifdown $wlan
    sleep 5
    ifup --force $wlan
    ifconfig $wlan | grep "inet addr"
fi

echo
echo "Current Setting:"
ifconfig $wlan | grep "inet addr:"
echo

# Check is complete, Remove Lock file and exit
#echo "process is complete, removing lockfile"
rm $lockfile
exit 0

##################################################################
# End of Script
##################################################################
