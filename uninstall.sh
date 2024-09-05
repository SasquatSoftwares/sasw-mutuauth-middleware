#!/bin/bash

# Service name to be installed
NAME="mutuauth-middleware"

# The destination directory
DEST_DIR="/opt/$NAME"

# stop and disable the service
systemctl stop $NAME.service
systemctl disable $NAME.service

# remove the service file
rm /etc/systemd/system/$NAME.service

# remove the binary
rm -r $DEST_DIR

# reload systemd
systemctl daemon-reload

echo "Uninstall complete."