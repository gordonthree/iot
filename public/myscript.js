var viewportWidth = $(window).width();

function addZero(i) {
		if (i < 10) {
				i = "0" + i;
		}
		return i;
}

function noSpaces(i) {
	i = i.replace(/\s+/g, '');
	return i;
}

function isNew(_array, _item) {
	for (var x=0; x<_array.length; x++) {
		if (_array[x]===_item) return true;
	}
	return false;
}

$(document).on("pagebeforecreate",function(){
});

$(document).on("pagecreate",function() {
			var hostName = $("meta[name='deviceip']").attr("content");
			var macAddr = $("meta[name='devicemac']").attr("content");
			var raw0,raw1,raw2;
			var sw1label, sw2label, sw3label, sw4label;
			var nodeName;
			var diagCount = 0, rawCount = 0;
			var sendUpdate=true;
			
			/*The user has WebSockets!!! */

			//var canvas = document.getElementById("chart");
			//canvas.width = $("#gChart").width();
			
			connect();

			//var smoothie = new SmoothieChart({ 
			//                    grid: {fillStyle:'rgba(13,39,62,0.78)', strokeStyle:'#4b8da3',
			//                    lineWidth: 1, millisPerLine: 250, verticalSections: 6, }
			//});

			//var line1 = new TimeSeries();
			//var line2 = new TimeSeries();

			//smoothie.streamTo(document.getElementById("chart"), 500 /*delay*/);
			//smoothie.addTimeSeries(line1, { lineWidth:2, strokeStyle:'#00ff00',fillStyle:'rgba(0,0,0,0.30)' });
			//smoothie.addTimeSeries(line2, { lineWidth:2,strokeStyle:'#ff8000',fillStyle:'rgba(0,0,0,0.30)' });

			function connect(){
					var socket;
					var host = "ws://" +hostName+ ":81";
					
					//if (hostName!="mypi3") host = "ws://"+hostName+":81";
					//else host = "ws://192.168.2.134:81";

					var swCount = 0;
					var switches = [ ];


					try{
							var socket = new WebSocket(host);

							$("#footerText").html("Connecting...");
							message('<li class="event">Socket Status: '+socket.readyState);

							socket.onopen = function(){
								message('<li class="event">Socket Status: '+socket.readyState+' (open)');
								$("#footerText").html("Connected!");
							}

							socket.onmessage = function(msg){
								if (msg.data=="") return;
								var datamsg = msg.data + '';
								var cmds = datamsg.split("=");
								
								switch(cmds[0]) {
									case 'time':
										var myD = new Date(cmds[1] * 1000);
										var myDstr = myD.getUTCHours() + ":" + addZero(myD.getMinutes()) + ":" + addZero(myD.getSeconds());
										 $("#footerText").html("Device time: " + myDstr);
										break;
									case 'name':
										$("#headerText").html(cmds[1]);
										nodeName=cmds[1];
										document.title = cmds[1];
										break;
									case 'temp':
										$("#headerText").html(nodeName+ "<BR>" +cmds[1]+ "&deg;C");
										break;
									case 'bat':
										$("#footer2").html("Battery " +cmds[1]+" volts");
										break;
									case 'volts':
										$("#footer2").html("Vcc " +cmds[1]+" volts");
										break;
									case 'remain':
										$("#footerText").html("Timer Running<br>" +cmds[1]+ " min remaining");
										break;
									case 'amps0':
										$("#ch1lbl").html(switches[0]+ " " +cmds[1]+"A");
										break;
									case 'amps1':
										$("#ch2lbl").html(switches[1]+ " " +cmds[1]+"A");
										break;
									case 'adc':
									case 'rssi':
									case 'raw0':
									case 'raw1':
									case 'raw2':
										rawvalue(cmds[0] +'='+ cmds[1]);
										break;
									case 'rgb':
									case 'label':
									case 'switch':
										var switchName = cmds[1];
										switches[swCount] = switchName;
										var _sw = parseInt(swCount) + 1;
										var isRGB = (cmds[0]=="rgb");

										// setup some labels
										var switchID = 'ch' +_sw+ 'en';
										var modeID = 'ch' +_sw+ 'fnc';
										var onID = 'ch' +_sw+ 'on';
										var offID = 'ch' +_sw+ 'off';

										// build the html
										var controlGroup = $('<div>', {'id':'cg'+_sw,'data-role':'controlgroup'});
										var swField = $('<div>', {'class':'ui-field-contain'}).appendTo(controlGroup);
										var swLabel = $('<label>', {'id':'ch' +_sw+ 'lbl','for':switchID}).html(switchName).appendTo(swField);
										var swBox = $('<select>', {'id':switchID,'name':switchID,'class':'chpwr','data-mini':'true','data-role':'flipswitch'}).appendTo(swField);
										var swOff = $('<option>', {'value':'0'}).html('Off').appendTo(swBox);
										var swOn = $('<option>', {'value':'1'}).html('On').appendTo(swBox);
										if (isRGB) {
											var rgbField = $('<div>', {'class':'ui-field-contain'}).appendTo(controlGroup);
											var rgbInput = $('<input>', {'type':'text','id':'full'}).appendTo(rgbField);
											var rgbLog = $('<em>', {'id':'basic-log'}).appendTo(rgbField);
										} else {
											var modeField = $('<div>', {'class':'ui-field-contain'}).appendTo(controlGroup);
											var modeLabel = $('<label>', {'for':modeID}).html('Mode').appendTo(modeField);
											var modeBox = $('<select>', {'id':modeID,'name':modeID, 'class':'chfnc' }).appendTo(modeField);
											var mode0 = $('<option>', {'value':'0','selected':''}).html('Manual').appendTo(modeBox);
											var mode1 = $('<option>', {'value':'1'}).html('Duration').appendTo(modeBox);
											var mode2 = $('<option>', {'value':'2'}).html('Interval').appendTo(modeBox);
											var onOffField = $('<div>', {'class':'ui-field-contain'}).appendTo(controlGroup);
											var onLabel = $('<label>', {'for':onID }).html('On Time (interval)').appendTo(onOffField);
											var onBox = $('<input>', {'type':'number','id':onID,'name':onID,'class':'numbox','value':'0','data-mini':'true'}).appendTo(onOffField);
											var offLabel = $('<label>', {'for':offID }).html('Off Time (duration)').appendTo(onOffField);
											var offBox = $('<input>', {'type':'number','id':offID,'name':offID,'class':'numbox','value':'0','data-mini':'true'}).appendTo(onOffField);
										}
										// add it to the page

										if (isRGB) { 
											// setup the color picker element
											 $( rgbInput ).spectrum({
												flat:true,
												allowEmpty:true,
												showInitial: true,
												showSelectionPalette: true,
												color: "#f00",
												maxPaletteSize: 10,
												preferredFormat: "hex",
												localStorageKey: "spectrum.demo",
												showAlpha: true,
												clickoutFiresChange: true,
												showButtons: false
											});
											$( rgbInput ).on("dragstart.spectrum", colorChange)
														 .on("dragstop.spectrum", colorChange);
										}
										$( controlGroup ).appendTo('#mainbody').enhanceWithin();

										swCount++; // increment switch counter
										break;
									case 'sw1':
										var state=parseInt(cmds[1]);
										var swState=parseInt($("#ch1en").val);
										if ((state>=0) && (state != swState)) {
											$("body").off("change", ".chpwr");
											$("#ch1en").val(state).flipswitch("refresh");
											$("body").on("change",".chpwr", flipChanged);
										}
										break;
									case 'sw2':
										var state=parseInt(cmds[1]);
										var swState=parseInt($("#ch2en").val);
										if ((state>=0) && (state != swState)) {
											$("body").off("change", ".chpwr");
											$("#ch2en").val(state).flipswitch("refresh");
											$("body").on("change",".chpwr", flipChanged);
										}
										break;
									case 'sw3':
										var state=parseInt(cmds[1]);
										var swState=parseInt($("#ch3en").val);
										if ((state>=0) && (state != swState)) {
											$("body").off("change", ".chpwr");
											$("#ch3en").val(state).flipswitch("refresh");
											$("body").on("change",".chpwr", flipChanged);
										}
										break;
									case 'sw4':
										var state=parseInt(cmds[1]);
										var swState=parseInt($("#ch4en").val);
										if ((state>=0) && (state != swState)) {
											$("body").off("change", ".chpwr");
											$("#ch4en").val(state).flipswitch("refresh");
											$("body").on("change", ".chpwr", flipChanged);
										}
										break;
									default:
										message('<li class="message">Msg: '+msg.data); 
									} // end switch
							} // end socket.message
							
							socket.onerror = function(){
								message('<li class="message">WebSocket Error'); 
							}

							socket.onclose = function(){
								 $("#mainbody").empty();
								message('<li class="event">Socket Status: '+socket.readyState+' (Closed)');
								 $("#footerText").html("Connection lost!");
								 $("#headerText").html("Disconnected");
								 setTimeout(connect(), 2000);
							}

					} catch(exception){
						 message('<li>Error'+exception);
					}



					$("body")
						.on("click","#rebootbtn", sendBtn)
						.on("click","#updatebtn", sendBtn)
						.on("blur",".numbox", numBlur)
						.on("change", ".chpwr", flipChanged);
					function specDragStart(e, color) {
						myID = $( this ).attr("id");
						console.log(myID +"="+ color._r +", "+ color._g +", "+ color._b +", "+ color._a);
					}

					function specDragStop(e, color) {
						myID = $( this ).attr("id");
						console.log(myID +"="+ color._r +", "+ color._g +", "+ color._b +", "+ color._a);
					}
					
					function colorChange(e,color) {
						var myName = $( this ).attr('name');
						var red = parseInt(color._r);
						var blue = parseInt(color._b);
						var green = parseInt(color._g);
						var white = parseInt(255*color._a); //a is decimal 0.0 to 1.0 for "alpha"
						if (white<0) white=0;
						if (red<0) red=0; if (blue<0) blue=0; if (green<0) green=0;
						//alert("r=" +red+ " b=" +blue+ " g=" +green+ " w=" + white);
						var bufferMsg = "wsbuffer=" +socket.bufferedAmount
						rawvalue(bufferMsg);
						if (socket.bufferedAmount==0) { // only send if the buffer is empty
							socket.send("red="+red);
							socket.send("blue="+blue);
							socket.send("green="+green);
							socket.send("white="+white);
							var logMsg = myName + " r=" +red+ " b=" +blue+ " g=" +green+ " w=" + white;
							rawvalue(logMsg);
						}
					}

					function numBlur() {
						var myName = $( this ).attr('name');
						if (myName===undefined) return;
						var myValue = $( this ).val();
						if ((myValue < 0) || (myValue == "")) myValue = 0;
						var myMsg = myName +"="+ myValue;
						socket.send(myMsg);
						message('<li class="message">Sent: '+myMsg);
					}

					function flipSet(_sw, _val) {
						if (_val>=0) {
							// console.log(_sw);
							$( _sw ).val(_val).flipswitch("refresh");
							//$( _sw ).off("change").val(_val).flipswitch("refresh").on("change", flipChanged);
						 }
					}

					function flipChanged(e) {
						var myName = $( this ).attr('name');
						if (myName===undefined) return;
						var myValue =$( this ).val();
						//if ($( this ).is(":checked")) myValue="1";
						var myMsg = myName +"="+ myValue;
						socket.send(myMsg);
						message('<li class="message">Sent: '+myMsg);            
					}


					function message(msg){
						diagCount++;
						$('#diagText').html('Device Messages (' + diagCount +')');
						$('#diagList').prepend(msg+'</li>').listview("refresh");
						if (diagCount>=100){
							$('#diagList li:last-child').remove();
							diagCount--;
						}
					}

					function rawvalue(msg){
						rawCount++;
						$('#rawText').html('Raw Values (' + rawCount +')');
						$('#rawList').prepend($('<li>', {'class':'rawdata'}).html(msg)).listview("refresh");
						if (rawCount>=100) {
							$('#rawList li:last-child').remove();
							rawCount--;
						}
					}

					function sendBtn() {
						var myButton = $( this ).attr('id');
						switch(myButton) {
							case 'rebootbtn':
								socket.send("reboot");
								break;
							case 'updatebtn':
								socket.send("update");
								break;
							default:
								alert(myButton);
						}
					}

			}//End connect

});