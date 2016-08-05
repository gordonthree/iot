var viewportWidth = $(window).width();

var macAddr;
var activeTab=1;


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
	var pageType = $( "meta[name=pagetype]" ).attr("content");
	var details;
	var intervalId;

	if (pageType==="nodelist") {
		loadNodelist();	
	} else if (pageType==="nodedetails") {
		loadDetails();
	}
	
	// setRefresh();

	$("body")
		.on("click","#autorefresh", autoUpdate)
		.on("click","a.configLink", openConfig)
		.on("click","a.dtablink",loadDetails)
		.on("panelopen", "#configPanel", loadConfig)
		.on("panelbeforeclose", "#configPanel", clearConfig)
		.on("blur","input.configinput", configChanged)
		.on("focus","input.configinput", clearRefresh) // clear refresh timer if a input has focus
		.on("mouseover mouseleave",".configinput", doHighlight)
		.on("mouseover mouseleave","td", doHighlight);

	function clearRefresh(){
		window.clearTimeout(intervalId); // stop refresh timer
		intervalId=undefined;
		$( "#footerText" ).html("Footer!");
	}

	function setRefresh(){
		// only set interval if not already set
		if (!intervalId) intervalId = window.setTimeout(refresher, 15000); // refresh nodelist every 5 seconds
	}

	function refresher(){
		if (pageType==="nodelist") {
			loadNodelist();
		} else if (pageType==="nodedetails") {
			if (!activeTab) return;
			loadDetails(activeTab);
		}

	}

	function autoUpdate(){
		$("#autorefresh").toggleClass("ui-btn-active");
		setRefresh();
	}

	function doHighlight(e) {
		if (e.type == 'mouseover') {
			$(this).addClass("highlight").parent().addClass("highlight");
			//$("colgroup").eq($(this).index()).addClass("highlight");
		}
		else {
			$(this).removeClass("highlight").parent().removeClass("highlight");
			//$("colgroup").eq($(this).index()).removeClass("highlight");
		}
	}
	function loading(showhide,msg) {
		setTimeout(function () {
			$.mobile.loading( showhide, {
			  text: msg,
			  textVisible: true,
			  theme: "b",
			  html: ""
			});
		});
	};

	function loadDetails(_tab) {
		var myId = $(this).attr("id");
		var tab = _tab;
		clearRefresh(); // stop refreshing

		if (!myId) { // no id, called via javascript
			if (!tab) tab=1 // tab not set either? must be pagecreate
			myId="#dtablink" +tab; // rebuild id
			$( myId ).addClass("ui-btn-active"); // set tab button active
		} else { // there is an id, get the tab number
			tab=myId.substr(myId.length-1);
			if (tab<1) tab=1; // tab less than one during inital load
		}
		var readOnly = parseInt($(myId).attr("ro")); // readonly status stored in link for tab, from database
		if (!$.isNumeric(readOnly)) readOnly=1;
		var reqdata = tab - 1; // sql query to request
		var target = "#tab" +tab+ "box"; // container for results table
		activeTab = tab;
		
		loading( "show", "running query");

		$( "#footerText" ).html("Updating...");

		$.getJSON("/nodedetails?reqdata=" +reqdata, function(result) {
			loading( "hide" );
			var table = buildTable(result,readOnly,"detailrow"); // build table
			$( target ).empty();
			$( table ).appendTo( target ).enhanceWithin();
			if ($("#autorefresh").hasClass("ui-btn-active")) setRefresh(); // start refresh timer
			$( "#footerText" ).html("Footer!");
		});

		
	}

	function buildTable(result,readOnly,_rowClass) {
		var bigTable = Array.isArray(result); // did we get one object or an array of objects?
		var myMac = "";
		var rowClass = _rowClass;
		var table = $('<table>'); // start with an empty table

		if (bigTable) { // fadd header section for big tables
			var headerRow = $('<thead>',{'class':'nlheaderow'});
			$.each(result[0], function(key,value) {
				var th = $('<th>', {'class':key}).html(key).appendTo( headerRow );
			});

			$( table ).append( headerRow );
		}

		// now for the table body
		var tbody = $('<tbody>').appendTo( table );
		if (bigTable) {
			$.each(result, function(row,columns) { // iterate rows
				var tr = $('<tr>',{'class':rowClass}).appendTo( tbody ); // new row
				$.each(columns, function(key,value) { // step through columns
					if (!bigTable) var field = $('<td>', {'class':'configfield ' +key}).html(key).appendTo( tr );
					var data =  $('<td>', {'class':'configdata ' +key}).appendTo( tr );
					if (key==="mac") { // mac address links to nodedetail
						myMac = value;
						var a = $( "<a>", {'href':'#configPanel','class':'configLink ' +key,'mac-addr':myMac}).html(value).appendTo( data );
					} else if (key==="currentip") { // mac address links to nodedetail
						var a = $( "<a>", {'href':'/nodecontrol?mac=' +myMac+ '&ip=' +value,'class':key,'target':'_blank'}).html(value).appendTo( data );
					} else if (readOnlys.indexOf(key)>=0 || readOnly==1) { // disabled text box for fields the user shouldnt change
						$( data ).html(value);
					} else {
						$( "<input>", {'class':'configinput ' +key,'name':'config_'+key,'old-value':value,'value':value,'mac-addr':myMac,'data-wrapper-class':'ui-custom'}).appendTo( data );
					}
				});
				$( tr ).attr('mac-addr',myMac);
				$( table ).append( tr ); // append row to table, go back for another row?
			});
		} else {
			$.each(result, function(key,value) { // new row with only two columns, key and value
				var tr = $('<tr>',{'class':rowClass}).appendTo( tbody );
				var field = $('<td>', {'class':'configfield ' +key}).html(key).appendTo( tr );
				var data =  $('<td>', {'class':'configdata ' +key}).appendTo( tr );
				if (key==="mac") { // mac address links to nodedetail
					myMac = value;
					$( data ).html(myMac);
				} else if (readOnlys.indexOf(key)>=0 || readOnly==1) { // disabled text box for fields the user shouldnt change
					$( data ).html(value);
				} else {
					$( "<input>", {'class':'configinput ' +key,'name':'config_'+key,'old-value':value,'value':value,'mac-addr':myMac,'data-wrapper-class':'ui-custom'}).appendTo( data );
				}
				$( table ).append( tr ); // append row to table
			});

		}

		return table;
	}

	function configChanged(e) {
		if (macAddr===undefined) macAddr=$(this).attr("mac-addr");
		if (macAddr===undefined) {
			alert("No mac address");
			return;
		}

		var myName = $( this ).attr('name');
		var myValue = $( this ).val();
		var oldVal = $( this ).attr('old-value');
		if (oldVal===myValue) return;
		var myName = myName.substr(7); // trim off "config_" from the db field name
		//alert(nodeMac +':\n'+ myName +'='+ myValue);
		$.post( "/nodeupdate", { mac: macAddr, key: myName, val: myValue }, function( data ) {
			console.log(data);
		});
	}

	function openConfig() {
		macAddr = $(this).attr("mac-addr");
		$( "#configPanel" ).panel( "open" );
	}

	function loadConfig() {
		if (macAddr===undefined) macAddr = $( "meta[name=devicemac]" ).attr('content');
		if (macAddr===undefined) {
			alert("No mac address.");
			return;
		}
		var query;
		var target;

		
		if (pageType=="nodedetails" || pageType=="nodelist") {
			query = "/iotconfig?readconfig=true&full=yes&mac=" +macAddr;
			target = "#configList"; 
		} else {
			query = "/iotconfig?readconfig=true&mac=" +macAddr;
			target = "#configList"; 
		}

		$.getJSON(query, function(result) {
			var container = $('<div>');
			var table = buildTable(result,false,'configrow'); // build table with inputs (readonly=false)
			$( table ).appendTo( container );

			if (pageType!="nodelist" && pageType!="nodedetails") { // add some websocket command buttons if ws is available
				var controlGroup = $('<div>', {'data-role':'controlgroup'}).appendTo( container );
				$( "<a>", {'class':'ui-btn ui-btn-inline ui-corner-all ui-shadow ui-data-mini', 'id':'updatebtn'}).html("Update").appendTo( controlGroup );
				$( "<a>", {'class':'ui-btn ui-btn-inline ui-corner-all ui-shadow ui-data-mini','id':'rebootbtn'}).html("Reboot").appendTo( controlGroup );
			}
			$( container ).appendTo( target ).enhanceWithin();
			$( "#configPanel" ).trigger( "updatelayout" );

		});
	}


	function clearConfig() {
		$("#configList").empty();
	}


	function loadNodelist() {
		$.getJSON("/nodelist?get=json", function(result) {
			var table = buildTable(result,false,'nlrow'); // build table with inputs (readonly=false)
			
			$( "#mainbody" ).empty(); // clear out old table
			$( table ).appendTo( "#mainbody" ).enhanceWithin(); // append new table
			//$( "#nodelist" ).colResizable({liveDrag:true});
		});
	}

});