const AUTOSAVE_INTERVAL = 1000;
const LOCALSTORAGE_TEXT = "text";
const LOCALSTORAGE_AUTOSAVE_ENABLED = "autosaveEnabled";
const DEFAULT_AUTOSAVE = "true";
const DEFAULT_FONT_SIZE = 16;
const LOCALSTORAGE_FONT_SIZE = "fontSize";
const LOCALSTORAGE_INTRO_DISMISSED = "introDismissed";
const LOCALSTORAGE_SHORTCUT = "shortcut_"

var g_helpShowing = false;
var g_introShowing = false;
var g_scInfoShowing = false;
var g_fontSize = DEFAULT_FONT_SIZE;
var g_autosaveTimerHandle = null;
var g_modified = false;
var g_showShortcutMenu = false;
var g_autosaveEnabled = false;


function getLocalstorageItem(itemName, defaultValue) {
    let ret = localStorage.getItem(itemName);
    if (ret == null) {
        ret = defaultValue;
    }
    return ret;
}

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
        $("#edit").focus();
    }
}


function closeIntro(e) {
    e.preventDefault();
    if (g_introShowing) {
        toggleIntro();
    }
}


function showIntroOnFirstUse() {
    if (!getLocalstorageItem(LOCALSTORAGE_INTRO_DISMISSED, false)) {
        if (!g_introShowing) {
            toggleIntro();
        }
    }
}


function toggleScInfo(e) {
    e.preventDefault();
    const modal = document.getElementById('scinfo');
    modal.classList.toggle("show");
    g_scInfoShowing = !g_scInfoShowing;
    if (g_scInfoShowing) {
        showShortcutMenu();
    }
    else {
        $("#edit").focus();
        hideShortcutMenu();
    }
}


function toggleHelp(e) {
    e.preventDefault();
    const modal = document.getElementById('help');
    modal.classList.toggle("show");
    g_helpShowing = !g_helpShowing;
    if (!g_helpShowing) {
        $("#edit").focus();
    }
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


function printContent() {
    let text = document.getElementById("edit").value;
    text = text.replaceAll("\n", "<br/>");

    // Open a new blank window
    let printWindow = window.open("", "_blank");

    // Write the content inside the new window
    printWindow.document.write(`
      <html>
      <head>
        <title>Lipi - Online Telugu Editor<\/title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu&display=swap" rel="stylesheet">
        <link rel="icon" type="image/png" href="images/favicon.png">
        <style>
        body {margin: auto;}
          div.content { font-family: 'Noto Sans Telugu', Verdana, Geneva, Tahoma, sans-serif; 
          line-height: 150%; 
          font-size: ${g_fontSize};
          width: 850px;
          text-align: justify;
          margin: auto;
          }
        <\/style>
      <\/head>
      <body><div class="content">
        ${text}
        </div>
        <script>
          window.onload = function() { window.print(); }
        <\/script>
      <\/body>
      <\/html>
    `);
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
    let fontSize = getLocalstorageItem(LOCALSTORAGE_FONT_SIZE, "0");
    g_fontSize = parseInt(fontSize);
    if (g_fontSize == 0) {
        fontSize = DEFAULT_FONT_SIZE;
    }

    setFontSize(fontSize);
}

function getCursorPos(textarea) {
	var el = textarea.get(0);
	var pos = 0;
	if ('selectionStart' in el) {
		pos = el.selectionStart;
	} else if ('selection' in document) {
		el.focus();
		var Sel = document.selection.createRange();
		var SelLength = document.selection.createRange().text.length;
		Sel.moveStart('character', -el.value.length);
		pos = Sel.text.length - SelLength;
	}
	return pos;
}

function setCursorPos(textarea, pos) {
	if (textarea.get(0).setSelectionRange) {
	  textarea.get(0).setSelectionRange(pos, pos);
	}
	else if (textarea.get(0).createTextRange) {
	  var range = textarea.get(0).createTextRange();
	  range.collapse(true);
	  range.moveEnd('character', pos);
	  range.moveStart('character', pos);
	  range.select();
	}
}


function copyToClipboard(e) {
    e.preventDefault();
    const tb = $("#edit");
    const pos = getCursorPos(tb);
    tb.select();
    navigator.clipboard.writeText(tb.val());
    tb.get(0).setSelectionRange(0,0);
    setCursorPos(tb, pos);
    showTooltip("menucopy", "Copied");
}


function autosaveChanged(e) {
    if($("#ascheck").prop('checked')) {
        localStorage[LOCALSTORAGE_TEXT] = $("#edit").val();
        localStorage[LOCALSTORAGE_AUTOSAVE_ENABLED] = "true";
		$("#saved").show();
        g_autosaveEnabled = true;
    }
    else {
        localStorage[LOCALSTORAGE_TEXT]= "";
        localStorage[LOCALSTORAGE_AUTOSAVE_ENABLED] = "false";
        window.clearInterval(g_autosaveTimerHandle);
		$("#saved").hide();
        g_autosaveEnabled = false;
    }
}


function initAutosaveFromStorage() {
    const cb = $("#ascheck");

    const asEnabled = getLocalstorageItem(LOCALSTORAGE_AUTOSAVE_ENABLED, DEFAULT_AUTOSAVE);
    if(asEnabled == "true") {
        cb.prop('checked', true);
        $("#edit").val(localStorage[LOCALSTORAGE_TEXT]);
        $("#saved").show();
        g_autosaveEnabled = true;
    }
    else {
        cb.prop('checked', false);
        $("#saved").hide();
        g_autosaveEnabled = false;
    }
}


function handleAutoSaveClicked(e) {
    const cb = $("#ascheck");
    if(cb.prop('checked')) {
        cb.prop('checked', false);
    }
    else {
        cb.prop('checked', true);
    }

    autosaveChanged(e);
}

function initStorage() {
    const cb = $("#ascheck");

    if(typeof(Storage) == "undefined") {
        cb.prop('checked', false);
        cb.prop('disabled', true)
        return;
    }

    cb.change(autosaveChanged);
    $("#autosavespan").click(handleAutoSaveClicked);
    $("#saveddiv").click(handleAutoSaveClicked);

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

function resetKeypressedTimer() {
    if (g_autosaveEnabled) {
	    if(g_autosaveTimerHandle) {
		    window.clearTimeout(g_autosaveTimerHandle);
        }

        g_autosaveTimerHandle = window.setTimeout(autosaveTimer, AUTOSAVE_INTERVAL);
        setModified(true);
    }
}


function getShortcutDisplayText(text) {
    let ret = text;
    if (text.length > 10) {
        ret = truncateText(text, 10);
        ret = ret + " ...";
    }
    return ret;
}


function updateShortcutsMenu() {
    g_showShortcutMenu = false;
    for (let i=1; i<=9; i++) {
        const liId = "#shortcut" + i;
        const shortcutName = LOCALSTORAGE_SHORTCUT + i;
        const shortcutText = getLocalstorageItem(shortcutName, "");
        let displayText = shortcutText;
        if (shortcutText != "") {
            displayText = getShortcutDisplayText(shortcutText);
            g_showShortcutMenu = true;
        }
        displayText = i + ": " + displayText;
        $(liId).text(displayText);
    }
}


function saveShortcut(key) {
    const MAPPING = {"!": "1", "@": "2", "#": "3", "$": "4", "%": "5", "^": "6", "&": "7", "*": "8", "(": "9"};
    if (!key in MAPPING) {
        return;
    }

    const shortcutName = LOCALSTORAGE_SHORTCUT + MAPPING[key];

    const selStart = $("#edit").get(0).selectionStart;
	const selEnd = $("#edit").get(0).selectionEnd;
    if (selStart == selEnd) {
        // Remove the shortcut
        localStorage.removeItem(shortcutName);
        updateShortcutsMenu();
        if (!g_showShortcutMenu) {
            hideShortcutMenu();
        }
    }
    else {
        const txt = $("#edit").val();
        let selection = txt.substring(selStart, selEnd);
        localStorage[shortcutName] = selection;
        updateShortcutsMenu();
        showShortcutMenu();
    }
}


function pasteShortcut(key) {
    const shortcutName = LOCALSTORAGE_SHORTCUT + key;
    const shortcut = localStorage.getItem(shortcutName);
    if (shortcut != null) {
        insertString(shortcut);
        resetKeypressedTimer();
    }
}


function handleKeyDown(e) {
    if (e.ctrlKey ||e.metaKey) {
        if (e.repeat) {
            return;
        }
        else if (g_showShortcutMenu) {
            showShortcutMenu();
        }

        if ((e.key === "s" || e.key == "S")) {
            e.preventDefault();
            saveFile();
        }
        else if (e.which >= 48 && e.which <= 57 ) {
            if (e.shiftKey) {
                e.preventDefault();
                saveShortcut(e.key);
            }
            else {
                e.preventDefault();
                pasteShortcut(e.key);
            }
        }
    }
    else {
        resetKeypressedTimer();
    }
}


function handleKeyUp(e) {
    if (e.key == "Control" || e.key == "Meta") {
        hideShortcutMenu();
    }
}


function showShortcutMenu() {
    let position = getShortcutMenuPos();
    let shortcutdiv = document.getElementById("shortcutdiv");
    shortcutdiv.style.left = position.x + "px";
    shortcutdiv.style.top = position.y + "px";
    shortcutdiv.style.display = "block";
  }


function hideShortcutMenu() {
    let shortcutdiv = document.getElementById("shortcutdiv");
    shortcutdiv.style.display = "none";
}


function showTooltip(nextToElementId, tooltipText) {
    elem = document.getElementById(nextToElementId);
    let rect = elem.getBoundingClientRect();
    let x = rect.left;
    let y = rect.top + rect.height + 5;

    let tooltip = document.getElementById("tooltip");
    $("#tooltip").text(tooltipText);
    let trect = tooltip.getBoundingClientRect();
    console.log(trect);

    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
    tooltip.style.display = "block";

    setTimeout(hideTooltip, 700);
  }


function hideTooltip() {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
}



function getShortcutMenuPos() {
    const edit = document.getElementById("edit");
    let rect = edit.getBoundingClientRect();
    let x = rect.left + rect.width + 5;
    let y = rect.top;
    return { x, y };
}


function handleBlur(e) {
    hideShortcutMenu();
}


function handleTextboxFocus(e) {
    if (g_scInfoShowing) {
        toggleScInfo(e);
    }
}


function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}


function checkMobile() {
    if (isMobileDevice()) {
        const mainDiv = document.getElementById("main");
        mainDiv.style.display = "none";
        const mobileAlert = document.getElementById("mobilealert");
        mobileAlert.style.display = "block";
    }
}


function langeChangeCallback(newLang) {
    const edit = document.getElementById("edit");
    if (newLang == ENGLISH_ENTRY) {
        edit.classList.add("hilight");
    }
    else {
        edit.classList.remove("hilight");
    }
}

function ready() {
    $("#menuintro").click(handleIntroClick);
    $("#menuhelp").click(toggleHelp);
    $("#menuscinfo").click(toggleScInfo);
    $("#scinfoclose").click(toggleScInfo);
    $("#introclose").click(closeIntro);
    $("#helpclose").click(closeHelp);
    $("#menucopy").click(copyToClipboard);
    $("#menudownload").click(saveFile);
    $("#menuprint").click(printContent);

    initFontSize();
    $("#fontup").click(increaseFont);
    $("#fontdown").click(decreaseFont);
	
	setRtsTextarea($("#edit"));
    $('#edit').focus();
    setLangChangeCallback(langeChangeCallback);

    initStorage();
    showIntroOnFirstUse();

    // Monitor for save key
    const edit = document.getElementById("edit");
    edit.addEventListener("keydown", handleKeyDown);
    edit.addEventListener("keyup", handleKeyUp);
    window.addEventListener('blur', handleBlur);
    $("#edit").focus(handleTextboxFocus);
    updateShortcutsMenu();

    checkMobile();
}

$(document).ready(ready);
