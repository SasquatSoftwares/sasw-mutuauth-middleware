#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# The path to the zip file
ZIP_FILE="$SCRIPT_DIR/setup.zip"

# Service name to be installed
NAME="mutuauth-middleware"

# The destination directory
DEST_DIR="/opt/$NAME"

# Create the destination directory
mkdir -p $DEST_DIR

# Unzip the zip file into the destination directory
unzip -o "$ZIP_FILE" -d "$DEST_DIR"

#cp ./dist/final/$NAME $DEST_DIR
#cp ./settings.json $NAME
#cp ./license.key $DEST_DIR

# Create logs file
mkdir -p $DEST_DIR/logs

# create a systemd service file
echo "[Unit]
Description=Sasquat Softwarews Mutual Authentication Middleware

[Service]
ExecStart=$DEST_DIR/$NAME
Restart=always
User=root
Group=root
Environment=PATH=$DEST_DIR:/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=$DEST_DIR/

[Install]
WantedBy=multi-user.target" > /etc/systemd/system/$NAME.service

# reload systemd, enable and start the service
systemctl daemon-reload
systemctl enable $NAME.service
journalctl -u $NAME.service -n 10 --no-pager

#systemctl start $NAME.service
#sleep 2
#systemctl status $NAME.service

echo "Install complete."
echo "Opening settings.json file for editing..."

# Check if 'nano' command is available
if command -v nano &> /dev/null
then
    EDITOR="nano"
else
    EDITOR="vi"
fi

# Open the settings.json file for editing with the chosen editor
$EDITOR $DEST_DIR/settings.json