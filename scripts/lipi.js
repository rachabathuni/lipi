var AUTOSAVE_INTERVAL = 1000;
var LOCALSTORAGE_TEXT = "text";
var LOCALSTORAGE_AUTOSAVE_ENABLED = "autosaveEnabled";
var DEFAULT_AUTOSAVE = true;
var DEFAULT_FONT_SIZE = 16;
var LOCALSTORAGE_FONT_SIZE = "fontSize";
var LOCALSTORAGE_INTRO_DISMISSED = false;

var g_helpShowing = false;
var g_introShowing = false;
var g_fontSize = DEFAULT_FONT_SIZE;
var g_autosaveTimerHandle = null;
var g_modified = false;


function handleIntroClick(e) {
    e.preventDefault();
    toggleIntro();
}


function toggleIntro() {
    const modal = document.getElementById('intro');
    modal.classList.toggle("show");
    g_introShowing = !g_introShowing;
    if (!g_introShowing) {
        localStorage[LOCALSTORAGE_INTRO_DISMISSED] = true;
    }
}


function closeIntro(e) {
    e.preventDefault();
    if (g_introShowing) {
        toggleIntro();
    }
}


function showIntroOnFirstUse() {
    if (!localStorage.getItem(LOCALSTORAGE_INTRO_DISMISSED, false)) {
        if (!g_introShowing) {
            toggleIntro();
        }
    }
}


function toggleHelp(e) {
    e.preventDefault();
    const modal = document.getElementById('help');
    modal.classList.toggle("show");
    g_helpShowing = !g_helpShowing;
}


function closeHelp(e) {
    e.preventDefault();
    if (g_helpShowing) {
        toggleHelp(e);
    }
}

function getTimestamp() {
    let now = new Date();
    
    let YYYY = now.getFullYear();
    let MM = String(now.getMonth() + 1).padStart(2, "0");  // Months are 0-based
    let DD = String(now.getDate()).padStart(2, "0");
    let HH = String(now.getHours()).padStart(2, "0");
    let mm = String(now.getMinutes()).padStart(2, "0");
    let SS = String(now.getSeconds()).padStart(2, "0");
  
    return `${YYYY}${MM}${DD}${HH}${mm}${SS}`;
}


function saveFile() {
    let text = document.getElementById("edit").value;
    let blob = new Blob([text], { type: "text/plain" });
    let a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = "Lipi_" + getTimestamp() + ".txt";

    // Simulate a click without adding it to the DOM
    a.click();

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(a.href);
 }


function setFontSize(size) {
    $("#edit").css("font-size", size + "px");
    localStorage[LOCALSTORAGE_FONT_SIZE] = size;
}


function increaseFont(e) {
    e.preventDefault();
    g_fontSize++;
    setFontSize(g_fontSize);
}


function decreaseFont(e) {
    e.preventDefault();
    g_fontSize--;
    setFontSize(g_fontSize);
}


function initFontSize() {
    let fontSize = localStorage.getItem(LOCALSTORAGE_FONT_SIZE, 0);
    if (fontSize == 0) {
        fontSize = DEFAULT_FONT_SIZE;
    }

    setFontSize(fontSize);
}


function copyToClipboard(e) {
    e.preventDefault();
    const tb = $("#edit");
    tb.select();
    navigator.clipboard.writeText(tb.val());
}


function autosaveChanged(e) {
    if($("#ascheck").prop('checked')) {
        localStorage[LOCALSTORAGE_TEXT] = $("#edit").val();
        localStorage[LOCALSTORAGE_AUTOSAVE_ENABLED] = true;
        setRtsTextareaCallback(keypressedCallback);
		$("#saved").show();
    }
    else {
        localStorage[LOCALSTORAGE_TEXT]= "";
        localStorage[LOCALSTORAGE_AUTOSAVE_ENABLED] = false;
        setRtsTextareaCallback(null);
        window.clearInterval(g_autosaveTimerHandle);
		$("#savestatus").hide();
    }
}


function initAutosaveFromStorage() {
    const cb = $("#ascheck");

    if(localStorage[LOCALSTORAGE_AUTOSAVE_ENABLED]) {
        cb.prop('checked', true);
        $("#edit").val(localStorage[LOCALSTORAGE_TEXT]);
        setRtsTextareaCallback(keypressedCallback);
        $("#saved").show();
    }
    else {
        cb.prop('checked', false);
    }
}


function initStorage() {
    const cb = $("#ascheck");

    if(typeof(Storage) == "undefined") {
        cb.prop('checked', false);
        cb.prop('disabled', true)
        return;
    }

    cb.change(autosaveChanged);

    if (localStorage.getItem(LOCALSTORAGE_AUTOSAVE_ENABLED) == null) {
        localStorage[LOCALSTORAGE_AUTOSAVE_ENABLED] = DEFAULT_AUTOSAVE;
    }

    initAutosaveFromStorage();

    return;
    
}


function setModified(modified) {
	if(g_modified != modified ) {
		if(modified) {
			$("#saved").hide();
		}
		else {
			$("#saved").show();
		}
		
		g_modified = modified;
	}
}


function autosaveTimer() {
    localStorage[LOCALSTORAGE_TEXT] = $("#edit").val();
	setModified(false);
}


function keypressedCallback(e) {
	if(g_autosaveTimerHandle)
		window.clearTimeout(g_autosaveTimerHandle);

   	g_autosaveTimerHandle = window.setTimeout(autosaveTimer, AUTOSAVE_INTERVAL);
   	setModified(true);
}

function handleKeyEvent(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key == "S")) {
        e.preventDefault();
        saveFile();
    }
}

function ready() {
    $("#menuintro").click(handleIntroClick);
    $("#menuhelp").click(toggleHelp);
    $("#introclose").click(closeIntro);
    $("#helpclose").click(closeHelp);
    $("#menucopy").click(copyToClipboard);
    $("#menudownload").click(saveFile);

    initFontSize();
    $("#fontup").click(increaseFont);
    $("#fontdown").click(decreaseFont);
	
	setRtsTextarea($("#edit"));
    $('#edit').focus();

    initStorage();
    showIntroOnFirstUse();

    // Monitor for save key
    document.addEventListener("keydown", handleKeyEvent);
}

$(document).ready(ready);
