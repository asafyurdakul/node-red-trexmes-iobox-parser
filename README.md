# node-red-trexmes-iot-iobox

This is a [Node-Red][1] package parses the data produced by the IoT-IoBox hardware developed by [Mert Software & Electronics][2] 

# Install

Run the following command in the root directory of your Node-RED install

    npm install node-red-trexmes-iobox-parser

# Usage
Input, counter and cycle values to be viewed are selected from the editing interface. 

**Transfer only changed values :** With this selection box, the ports whose values have changed are sent to the output. 

**Single output:** It is ensured that the port values are sent to a single output.

Node output numbers are formed dynamically depending on the selections.

# Requirements

The package currently requires [Node.js 18.16][1] or higher.

# Authors

[Asaf Yurdakul][4]

[1]:http://nodered.org
[2]:https://mertyazilim.com.tr/
[4]:https://github.com/asafyurdakul

