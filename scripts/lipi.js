var g_helpShowing = false;
var g_fontSize = 16;
var g_autosaveTimerHandle = null;
var g_autosaveCheckedOnce = false;
var g_modified = false;

var AUTOSAVE_INTERVAL = 1000;
var LOCALSTORAGE_TEXT = "text";
var LOCALSTORAGE_AUTOSAVE_ENABLED = "autosaveEnabled";

function showIntro(e) {
    $("#intro").toggle(500);
    $("#intro-arrow-open").toggle();
    $("#intro-arrow-closed").toggle();

    e.preventDefault();
}

function showHelp(e) {
    e.preventDefault();

    $("#outer").width(1200);
    $("#help-arrow-open").toggle();
    $("#help-arrow-closed").toggle();

    if(g_helpShowing) {
        g_helpShowing = false;
    	$("#help").toggle(500, function() {
        	$("#outer").width(800);
		});
			
    }
    else {
        $("#outer").width(1200);
        g_helpShowing = true;
    	$("#help").toggle(500 );
    }
}

function increaseFont(e) {
    e.preventDefault();
    g_fontSize++;
    $("#edit").css("font-size", g_fontSize + "px");
}

function decreaseFont(e) {
    e.preventDefault();
    g_fontSize--;
    $("#edit").css("font-size", g_fontSize + "px");
}

function copy(e) {
    e.preventDefault();
	$("#edit").val(convertToHtml($("#edit").val()));
}

function autosaveChanged(e) {
    if($("#autosave").prop('checked')) {
        if( !g_autosaveCheckedOnce ){
            console.log("not checked");
            g_autosaveCheckedOnce = false;
            $("#autosavedialog").dialog();
        }
        localStorage[LOCALSTORAGE_TEXT]= $("#edit").val();
        localStorage[LOCALSTORAGE_AUTOSAVE_ENABLED] = true;
        setRtsTextareaCallback(keypressedCallback);
		$("#savestatus").show();
    }
    else {
        localStorage[LOCALSTORAGE_TEXT]= "";
        localStorage[LOCALSTORAGE_AUTOSAVE_ENABLED] = false;
        setRtsTextareaCallback(null);
        window.clearInterval(g_autosaveTimerHandle);
		$("#savestatus").hide();
    }
}

function initStorage() {
    if(typeof(Storage)!=="undefined") {
        $("#autosaveblock").show();
        $("#autosave").change(autosaveChanged);

        if(localStorage[LOCALSTORAGE_AUTOSAVE_ENABLED]) {
            $("#autosave").prop('checked', true);
            $("#edit").val(localStorage[LOCALSTORAGE_TEXT]);
            setRtsTextareaCallback(keypressedCallback);
		    $("#savestatus").show();
        }
        else {
            $("#autosave").prop('checked', false);
        }
    }
}

function setModified(modified) {
	if(g_modified != modified ) {
		if(modified) {
			$("#modified").show();
			$("#saved").hide();
		}
		else {
			$("#modified").hide();
			$("#saved").show();
		}
		
		g_modified = modified;
	}
}


function autosaveTimer() {
	console.log("timer");
    // safety check before saving
    localStorage[LOCALSTORAGE_TEXT] = $("#edit").val();
	setModified(false);
}


function keypressedCallback(e) {
	if(g_autosaveTimerHandle)
		window.clearTimeout(g_autosaveTimerHandle);

   	g_autosaveTimerHandle = window.setTimeout( autosaveTimer, AUTOSAVE_INTERVAL );
   	setModified(true);
}

function ready() {
    $("#autosavedialog").hide();
    $("#intro-link").click(showIntro);
    $("#intro-arrow-open").hide();
    $("#help-arrow-open").hide();
    $("#help-link").click(showHelp);
    $("#font-increase").click(increaseFont);
    $("#font-decrease").click(decreaseFont);
    $("#copy").click(copy);
	
	setRtsTextarea($("#edit"));

    initStorage();
}

$(document).ready(ready);
