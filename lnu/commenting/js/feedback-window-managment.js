/**
 * This file manage opening and closing of feedback window for each tool
 * Requirement: one feedback window per tool
 *
 */


//global variables
feedbackWindows = {}; //associative javascript array {'toolName':'feedback_window_id'}

/**
 * This function assigns for each tool one feedback window
 * @param toolName: String
 * @param windowId: String
 */
function addFeedbackWindow(toolName, windowId){
   feedbackWindows[toolName] = windowId;
   //console.log(feedbackWindows);
}


/**
 * This function opens feedback window if it not open already
 * @param toolUrl: String
 * @param toolName: String
 * @param event
 */
function openFeedbackWindow(toolUrl, toolName, event){
     if(feedbackWindows[toolName]===undefined){
         openIframeWindowRightBottom(toolUrl,toolName,event);
     }
}



/**
 * This function opens ifram window in right bottom corner
 * Draggable option available in Metro UI v.4 right now used Mentro UI v.3
 * @param toolUrl : String
 * @param toolName : String
 * @param event
 * @returns {*}
 */
function openIframeWindowRightBottom(toolUrl, toolName, event) {

    docWidth = 320;
    docHeight = 250;


    var toolTile = $(event.srcElement).closest('[data-role], tile');
    var bgColor = toolTile.css("background-color");

    if(bgColor=="rgba(0, 0, 0, 0)" || bgColor=="rgb(255, 255, 255)")
        bgColor="rgb(64,64,64)";

    activeWindow = $.Dialog({
        title: "<span class='text-medium fg-white notranslate' style='-ms-user-select: none; -moz-user-select: none; -webkit-user-select: none;user-select: none;' translate='no'> Feedback "+toolName+"</span><span class='btn-min' onclick='minimizeWindow(this)'></span> <span class='btn-max' onclick='maximizeWindow(this)'></span> <span class='btn-close' onclick='closeWindow(this);'></span>",
        content: "<iframe id='iframeWindow' src='"+toolUrl+"' frameborder='0' style='margin:0px; height: 250px'   />",
        padding: 0,
        options: {
            modal: false,
            closeButton: false,
            width: docWidth,
            height: docHeight,
            place:"bottom-right"

        }
    }).css("background-color", bgColor).css('margin-bottom','65px');

    var toolIcon = toolTile.find('img').attr('src');

    var frame = new WinIFrame(activeWindow.position().left, activeWindow.position().top, activeWindow.width(), activeWindow.height(), toolUrl, toolIcon, bgColor, "Feedback " + toolName);

    activeWindow.data('winData', frame);
    addFeedbackWindow(toolName,activeWindow.attr('id'));
    //using jquery draggable function to make commenting window draggable
    //NOTE! in Metro UI v.4 this should be removed and used original draggable option of the dialog
    activeWindow.draggable();

    return activeWindow;
}
/**
 * Close feedback window
 * @param closeBtn
 */
function closeWindow(closeBtn){
    var winDiv = $(closeBtn).parent().closest('[data-role], .dialog');
    metroDialog.close(winDiv);

    //find tool name based on feedback window id and remove it from feedbackWidnows array
     for(var k in feedbackWindows){
         if(feedbackWindows[k]===winDiv.attr('id')){
             delete feedbackWindows[k];
         }
     }

}



//This function is called when the maximize button of a window is pressed. The function should be able to maximize and revert back to original sizes.
function maximizeWindow(maxBtn){
    console.log("inside");
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
        //Temporal fix, still need to find why it reduces the height on 20px...
        winData.height = 300;
        resizeWindow2Normal(winDiv, winData);
    }
}

//Given a WinDiv and its WinData, it restores the Div to its original place and size.

    function resizeWindow2Normal($winDiv, $winData){

    $winDiv.animate({
        top: $winData.posy,
        left: $winData.posx,
        width: $winData.width,
        height: $winData.height+20,
        opacity: 1
    }, 300).find('iframe').animate({
        top: 0,
        left: 0,
        width: $winData.width-20,
        height: $winData.height,
        opacity: 1
    }, 300);

    $winDiv.show();
}