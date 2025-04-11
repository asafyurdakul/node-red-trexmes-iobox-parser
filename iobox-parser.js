/**

Copyright 2023 Asaf Yurdakul and Mert Software & Electronic A.Ş, Bursa Turkiye.

Licensed under the GNU General Public License, Version 3.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.gnu.org/licenses/gpl-3.0.html

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

 **/

module.exports = function(RED) {
    "use strict";
	var oldValues = [];	
	function parseValues(msgout, parsePorts, onlychanged, singleoutput ) {

		if(!Array.isArray(parsePorts)) {
			parsePorts = parsePorts.split(',');
		}
		var strArray = msgout.payload.split('&');		
		var resultParse;
		
		if(!singleoutput) {
			resultParse = new Array(parsePorts.length);
						
			if(!Array.isArray(oldValues)) {				
				oldValues = new Array(parsePorts.length);				
			}			
			if( oldValues.length == 0) {
				oldValues = new Array(parsePorts.length);
			}
			
			var indexResult = 0;
		}
		else {
			resultParse = {};
			if(Array.isArray(oldValues)) {	
				oldValues = {};
			}
		}
		
		for (let index = 0; index < parsePorts.length; index++) {
			const element = parsePorts[index];

			for (var i = 0; i < strArray.length; i++) {
				const item = strArray[i];

				var strArrayEqual = item.split('=');

				if (element.startsWith('INF')) {
					if (strArrayEqual[0] == 'INF') {
						var m = element.replace('INF', '');	
						
						if(!singleoutput) {						
							if ( oldValues[indexResult] == undefined || 
								( (oldValues[indexResult].payload !== strArrayEqual[1][12 - Number(m)]) ||
								  !onlychanged ) )
							{								
								resultParse[indexResult] = { payload : strArrayEqual[1][12 - Number(m)], port : element };
								oldValues[indexResult] = resultParse[indexResult];								
							}
							indexResult++;
						}
						else {	
							if(oldValues["input" + m] !== strArrayEqual[1][12 - Number(m)] || !onlychanged )
							{
								resultParse["input" + m] =  strArrayEqual[1][12 - Number(m)];
								oldValues["input" + m]  = resultParse["input" + m] ;							
							}
						}
								
						break;
					}
				}
				if (element.startsWith('OUT')) {
					if (strArrayEqual[0] == 'OUT') {
						var m = element.replace('OUT', '');	
						
						if(!singleoutput) {
							if ( oldValues[indexResult] == undefined || 
								( (oldValues[indexResult].payload !== strArrayEqual[1][12 - Number(m)]) ||
								  !onlychanged ) )
							{
								resultParse[indexResult] = { payload : strArrayEqual[1][12 - Number(m)], port : element };
								oldValues[indexResult] = resultParse[indexResult];
							}
							indexResult++;
						}
						else {
							if(oldValues["out" + m] !== strArrayEqual[1][12 - Number(m)] || !onlychanged )
							{
								resultParse['out' + m] =  strArrayEqual[1][12 - Number(m)];
								oldValues['out' + m] = resultParse['out' + m];
							}
						}
						
								
						break;
					}
				}
				else if (strArrayEqual[0] == element) {
					
					if(!singleoutput) {
						if ( oldValues[indexResult] == undefined || 
							( (oldValues[indexResult].payload !==  strArrayEqual[1]) ||
							  !onlychanged) )
						{	
							resultParse[indexResult] = { payload : strArrayEqual[1] , port : element };
							oldValues[indexResult] = resultParse[indexResult];
						}
						indexResult++;
					}
					else {
						var m = element.replace('CNT','counter');
						m = m.replace('CYC','cycle');
							
						if(oldValues[m] !== strArrayEqual[1] || !onlychanged ){
							resultParse[m] =  strArrayEqual[1];
							oldValues[m] = resultParse[m];
						}
					}

					break;
				}
			}
		}

		if(singleoutput) {
			/*
			resultParse = resultParse.filter(function( element ) {
			   return element !== undefined;
			});
			*/
			msgout.payload = resultParse;
			return msgout;
			//resultParse = { payload : resultParse }
		}        		
		
		return resultParse;		
	}
	
	function IoBoxParser(n) {
		RED.nodes.createNode(this,n);
        var node = this;

		node.on("input",function(msg) {
            //parsing operation
            var result = parseValues(msg , n.ports, n.onlychanged, n.singleoutput );
            if(n.singleoutput) {
                //console.log(result.payload);
                if(Object.keys(result.payload).length !== 0) {
                    node.send(result);
                }
            }
            else {
                node.send(result);
            }                        
        });			

    }
    RED.nodes.registerType("iobox-parser",IoBoxParser);


}