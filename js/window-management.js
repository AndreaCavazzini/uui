class WinIFrame {
	/*var posx, posy;
	var width, height;
	var iframeUrl;
	var state;
	*/
	constructor(x, y, w, h, url, icon, color, title){
		this.posx = x;
		this.posy = y;
		this.width = w;
		this.height = h;
		this.iframeUrl = url;
		this.iconUrl = icon;
		this.color = color;
		this.title = title;
		this.state = "normal";
	}
}

function getAnalyticFieldName(toolName, isHelp) {
	
	switch (toolName) {

		case './uef/search/index.html':
			return 'search';
		case './uef/ideation/index.html':
			return 'sketch';
		case 'https://trello.com/':
			return 'trello';
		case 'https://www.tinkercad.com/#/?type=tinkercad&collection=designs':
			return 'tinkercard';
		case 'http://beetleblocks.com/':
			return 'beetleblocks';
		case 'https://www.3dslash.net/slash.php':
			return 'slash';
		case '#CuraDialog':
			return 'cura';
		case './snap/snap.html':
			return 'snap';
		case './snap4arduino/index.html':
			return 'snap4arduino';
		case 'https://www.thingiverse.com/':
			return 'thingiverse';
		default:
			return 'help';


	}

}

function sendAnalyticsData(clientId, sessionId, toolName) {

	var obj = {
	
		search: 0,
		sketch: 0,
		trello: 0,
		tinkercard: 0,
		beetleblocks: 0,
		slash: 0,
		cura: 0,
		snap: 0,
		snap4arduino: 0,
		thingiverse: 0,
		help: 0,
		users: ''

	};

	obj[toolName]++;

	var users = window.sessionStorage.getItem('username');
	var sessionId = window.sessionStorage.getItem('pilotsite');
	
	obj['users'] = users;

		
	var data = JSON.stringify(obj);

	$.ajax({

		type: 'POST',
		url: 'https://cs.uef.fi/~tapanit/ecraft2learn/api/pilot_2/put_uui_vectors_pilot_2.php',
		data: 'data=' + data + '&users=' + users + '&sessionId=' + sessionId,
		success: function(data) {
			console.log(data);
		},
		error: function(error) {
			console.log(error);
		}
	});
	
}


//Opens the destination link in a new tab. This is depricated since we are using the iframe solution now.
function gotoTileDestination(dest){
	window.open(dest, '_blank');
}

//This function is responsible for opening a new HELP DIALOG.
var alreadyOpenDialog = null;		
function openHelpDialog(helpUrl, event){
    event.stopPropagation();
	
	metroDialog.open(helpUrl);
	if(alreadyOpenDialog!=null && alreadyOpenDialog!=helpUrl)
		metroDialog.close(alreadyOpenDialog);
	alreadyOpenDialog = helpUrl;
}

//These functions are for opening new windows (iframe). We are allowing for several windows of the same tool to be opened.
// this is because, a student might want to open two different files in the same tool. .

//Given a url and a title for the window, this function creates a window (uses Metro UI dialog classes) and opens the url as an iframe in it.
function openIframeWindow(toolUrl, toolName, event) {
	docWidth = $(window).width()-500;
	docHeight = $(window).height()-100;
	
	var toolTile = $(event.srcElement).closest('[data-role], tile');
	var bgColor = toolTile.css("background-color");
	
	if(bgColor=="rgba(0, 0, 0, 0)" || bgColor=="rgb(255, 255, 255)")
		bgColor="rgb(64,64,64)";
	
	activeWindow = $.Dialog({
		title: "<span class='text-medium fg-white notranslate' translate='no'>"+toolName+"</span><span class='btn-min' onclick='minimizeWindow(this)'></span> <span class='btn-max' onclick='maximizeWindow(this)'></span> <span class='btn-close' onclick='closeWindow(this);'></span>",
		content: "<iframe id='iframeWindow' src='"+toolUrl+"' frameborder='0' style='margin:0px;' allowfullscreen width='"+(docWidth-20)+"' height='"+(docHeight-60)+"'  />",
		padding: 0,
		
		options: {	
			modal: false,
			closeButton: false,
			width: docWidth,
			height: docHeight,
		}
	}).css("background-color", bgColor);
	
	var toolIcon = toolTile.find('img').attr('src');
	var frame = new WinIFrame(activeWindow.position().left, activeWindow.position().top, activeWindow.width(), activeWindow.height(), toolUrl, toolIcon, bgColor, toolName);
	
	activeWindow.data('winData', frame);
	
	return activeWindow;
}

//Given a window button (close, maximize, minimize) this function, finds the related window and closes it.
function closeWindow(closeBtn){
	var winDiv = $(closeBtn).parent().closest('[data-role], .dialog');
	metroDialog.close(winDiv);
}

//This function is called when the maximize button of a window is pressed. The function should be able to maximize and revert back to original sizes.
function maximizeWindow(maxBtn){
	var winDiv = getDialogFromBtn(maxBtn);
	var winFrame = winDiv.find('iframe');
	var winData = winDiv.data('winData');
	
	docWidth = $(window).width();
	docHeight = $(window).height();
	
	if(winDiv.position().left>0){
		winDiv.animate({
				top: 0,
				left: 0,
				height: "100%",
				width: "100%",
				opacity: 1,
		},300);
		winFrame.animate({
				position: "absolute",
				top: 0,
				left: 0,
				height: docHeight-60,
				width: docWidth-20,
				opacity: 1,
		},300);
	}
	else{
		resizeWindow2Normal(winDiv, winData);
	}
}

//Given the clicked minimize button of a window, it finds the window object and minimizes it. This includes creating a small button and the bottom charm and storing the WinData struct in it.
function minimizeWindow(minBtn){
	var winDiv = getDialogFromBtn(minBtn);
	var winData = winDiv.data('winData');
	var icon = winData.iconUrl;
	var color = winData.color;
	
	//$('#bottomCharm').append("<img src='"+icon+"' width='30px' height='30px' />");
	
	//Image Button Style
	//$('#bottomCharm').append("<button class='image-button fg-white icon-left' style='margin-right:10px; background-color:"+color+";'>TinkerCad<img src='"+icon+"' class='icon' style='background-color:"+color+";'/></button>");
	
	//Button Style
	//$('#bottomCharm').append("<button class='button fg-white fg-active-black icon-left' style='margin-right:10px; background-color:"+color+";'><img src='"+icon+"' class='icosn' style='align:left; vertical-align:middle; background-color:"+color+";'/>TinkerCad</button>");
	
	//Tile Style
	//$('#bottomCharm').append("<button class='shortcut-button fg-white icon-left' style='margin-right:10px; background-color:"+color+";'><img src='"+icon+"' class='icon' style='background-color:"+color+";'/><span class='title'>TinkerCad</span></button>");
	
	var $button = createMinimizedTab(winData);
	$button.data('winDiv', winDiv);
	$button.attr('id', $(winDiv).attr('id')+"_btn");
	$('#bottomCharm').append($button);
	
	showMetroCharm('#bottomCharm');
	
	var winDiv = $(minBtn).parent().closest('[data-role], .dialog');
	winDiv.animate({
		top: winData.posy+winData.height-10,
		width: 10,
		height: 10,
		opacity: 0
	}, 300);
	setTimeout(function(){winDiv.hide();}, 300);
}

//When a minimized tab button is pressed, this function finds the related WinDiv and Data and restores the window. Notice that the window is not actually removed when minimized, so this function just makes it visible again.
function unminimizeWindow() {
	// event is not bound in FireFox
	if (typeof event === 'undefined') {
		return; // needs to be fixed
	}
	
	var $buttonElem = typeof event !== 'undefined' && $(event.srcElement).closest('button');
	var $winData = $buttonElem.data('winData');
	var $winDiv = $buttonElem.data('winDiv');
	
	
	
	resizeWindow2Normal($winDiv, $winData);
	
	$($buttonElem).remove();
	
	 if($('#bottomCharm').find('button').length==0){
		hideMetroCharm('#bottomCharm');
	} 
}
//Does as the unminimizeWindow function, except that this one is trigerred from JS code
function unminimizeWindowFromJS(minButton){
	if(typeof minButton === 'undefined') 
		return;
	
	var $winData = $(minButton).data('winData');
	var $winDiv = $(minButton).data('winDiv');
	
	resizeWindow2Normal($winDiv, $winData);
	
	$(minButton).remove();
	
	 if($('#bottomCharm').find('button').length==0){
		hideMetroCharm('#bottomCharm');
	} 
}

//Create a small button which represents the minimized window. The button is added to the bottom charm.
function createMinimizedTab(winData) {
	var $button = $("<button></button>", {
							class: "image-button fg-white icon-left minimized-window-tab",
							style: "background-color:"+winData.color+"; margin-right:5px;"
	});
	
	var $buttonImage = $("<img/>", {
							src: winData.iconUrl,
							class: "icon",
							style: "background-color:"+winData.color	
	});
	
	$button.append($buttonImage).append(winData.title);
	$button.data('winData', winData);
	$button.click(unminimizeWindow);
	
	return $button;
}

//Helper function to find a window from the clicked button (close, max, min).
function getDialogFromBtn(btn) {
	return $(btn).parent().closest('[data-role], .dialog');
}

//Given a WinDiv and its WinData, it restores the Div to its original place and size.
function resizeWindow2Normal($winDiv, $winData){
	$winDiv.animate({
		top: $winData.posy,
		left: $winData.posx,
		width: $winData.width,
		height: $winData.height,
		opacity: 1
	}, 300).find('iframe').animate({
		top: 0,
		left: 0,
		width: $winData.width-20,
		height: $winData.height-60,
		opacity: 1
	}, 300);
	 
	$winDiv.show();
}
