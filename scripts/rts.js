var NUMBER_0 = "\u0C66";
var NUMBER_1 = "\u0C67";
var NUMBER_2 = "\u0C68";
var NUMBER_3 = "\u0C69";
var NUMBER_4 = "\u0C6A";
var NUMBER_5 = "\u0C6B";
var NUMBER_6 = "\u0C6C";
var NUMBER_7 = "\u0C6D";
var NUMBER_8 = "\u0C6E";
var NUMBER_9 = "\u0C6F";

var VOW_a = "\u0C05";
var VOW_aa = "\u0C06";
var VOW_i = "\u0C07";
var VOW_ii = "\u0C08";
var VOW_u = "\u0C09";
var VOW_uu = "\u0C0A";
var VOW_R = "\u0C0B";
var VOW_RR = "\u0C60";
var VOW_e = "\u0C0E";
var VOW_ee = "\u0C0F";
var VOW_ai = "\u0C10";
var VOW_o = "\u0C12";
var VOW_oo = "\u0C13";
var VOW_ou = "\u0C14";
var VOW_alu = "\u0C0C";
var VOW_aloo = "\u0C61";

var CONS_k = "\u0C15";
var CONS_K = "\u0C16";
var CONS_g = "\u0C17";
var CONS_G = "\u0C18";
var CONS_INYA = "\u0C19";
var CONS_c = "\u0C1A";
var CONS_C = "\u0C1B";
var CONS_j = "\u0C1C";
var CONS_J = "\u0C1D";
var CONS_INI = "\u0C1E";
var CONS_T = "\u0C1F";
var CONS_TH = "\u0C20";
var CONS_D = "\u0C21";
var CONS_DH = "\u0C22";
var CONS_N = "\u0C23";
var CONS_t = "\u0C24";
var CONS_th = "\u0C25";
var CONS_d = "\u0C26";
var CONS_dh = "\u0C27";
var CONS_n = "\u0C28";
var CONS_p = "\u0C2A";
var CONS_P = "\u0C2B";
var CONS_b = "\u0C2C";
var CONS_B = "\u0C2D";
var CONS_m = "\u0C2E";
var CONS_y = "\u0C2F";
var CONS_r = "\u0C30";
var CONS_BANDI_RA = "\u0C31";
var CONS_l = "\u0C32";
var CONS_L = "\u0C33";
var CONS_v = "\u0C35";
var CONS_S = "\u0C36";
var CONS_sh = "\u0C37";
var CONS_s = "\u0C38";
var CONS_h = "\u0C39";

// cha as in rachchabanda
var CONS_q = "\u0C58";

// ja as in jalleda
var CONS_z = "\u0C59";

var VIRAMA = "\u0C4D";
var VISARGA = "\u0C03";
var ANUSVARA = "\u0C02";
var EXT_AI = "\u0C48";
var EXT_OU = "\u0C4C";
var EXT_A = "\u0C3E";
var EXT_E = "\u0C47";
var EXT_I = "\u0C40";
var EXT_O = "\u0C4B";
var EXT_R = "\u0C43";
var EXT_RR = "\u0C44";
var EXT_U = "\u0C42";
var EXT_e = "\u0C46";
var EXT_i = "\u0C3F";
var EXT_o = "\u0C4A";
var EXT_u = "\u0C41";

var ZERO_WIDTH_SPACE = "\u200B";
var ZERO_WIDTH_NON_JOINER = "\u200c";
var THIN_SPACE = "\u2009";

var NON_JOINER = ZERO_WIDTH_NON_JOINER;

var RTS_ENTRY = 1;
var ENGLISH_ENTRY = 2;

var sm = {};

function is_consonent(ch) {
	return (ch>=CONS_k && ch<=CONS_h);
}


function is_vowel(ch) {
	return ((ch>=VOW_a && ch<=VOW_R) || ch==VOW_RR || ch==VOW_aloo);
}


function is_aspiration_possible(ch) {
	switch(ch) {
		case CONS_k:
		case CONS_g:
		case CONS_c:
		case CONS_j:
		case CONS_T:
		case CONS_D:
		case CONS_t:
		case CONS_d:
		case CONS_p:
		case CONS_b:
		case CONS_m:
		return true;
	}
	return false;
}

function add_aspiration(ppchar, pchar, input) {
	switch(ppchar) {
		case CONS_k:
			return CONS_K+VIRAMA;
		case CONS_g:
			return CONS_G+VIRAMA;
		case CONS_c:
			return CONS_C+VIRAMA;
		case CONS_j:
			return CONS_J+VIRAMA;
		case CONS_T:
			return CONS_TH+VIRAMA;
		case CONS_D:
			return CONS_DH+VIRAMA;
		case CONS_t:
			return CONS_th+VIRAMA;
		case CONS_d:
			return CONS_dh+VIRAMA;
		case CONS_p:
			return CONS_P+VIRAMA;
		case CONS_b:
			return CONS_B+VIRAMA;
	}
	return ppchar+VIRAMA;
}

function is_extension(ch) {

	switch(ch) {
		case EXT_AI:
		case EXT_OU:
		case EXT_A:
		case EXT_E:
		case EXT_I:
		case EXT_O:
		case EXT_R:
		case EXT_RR:
		case EXT_U:
		case EXT_e:
		case EXT_i:
		case EXT_o:
		case EXT_u:
			return true;
	}

	return false;
}



/* Format is
[ prev_prev_char, prev_char, output_str, replace_n_chars_at_cursor]
*/
sm.a =
	[
		[ "", VIRAMA, "", 1 ],
		[ "", ANUSVARA, CONS_m, 1 ],
		[ "", VOW_a, VOW_aa, 1 ],
		[ "", is_consonent, EXT_A, 0 ],
		[ "", " ", VOW_a, 0 ],
		[ "", "", VOW_a, 0 ]
	];

sm.A =
	[
		[ "", VIRAMA, EXT_A, 1 ],
		[ "", ANUSVARA, CONS_m + EXT_A, 1 ],
		[ "", VOW_a, VOW_aa, 1 ],
		[ "", is_consonent, EXT_A, 0 ],
		[ "", " ", VOW_aa, 0 ],
		[ "", "", VOW_aa, 0 ]
	];

sm.e =
	[
		[ "", VIRAMA, EXT_e, 1 ],
		[ "", EXT_e, EXT_E, 1 ],
		[ "", ANUSVARA, CONS_m + EXT_e, 1 ],
		[ "", " ", VOW_e, 0 ],
		[ "", "", VOW_e, 0 ]
	];

sm.E = 	
	[
		[ "", VIRAMA, EXT_E, 1 ],
		[ "", ANUSVARA, CONS_m + EXT_E, 1 ],
		[ "", " ", VOW_ee, 0 ],
		[ "", "", VOW_ee, 0 ]
	];

sm.i =
	[
		[ "", VOW_a, VOW_ai, 1 ],
		[ "", ANUSVARA, CONS_m + EXT_i, 1 ],
		[ "", is_consonent, EXT_AI, 0],
		[ "", VIRAMA, EXT_i, 1 ],
		[ "", EXT_i, EXT_I, 1 ],
		[ "", " ", VOW_i, 0 ],
		[ "", "", VOW_i, 0 ]
	];

sm.I =
	[
		[ "", VOW_a, VOW_ai, 1 ],
		[ "", ANUSVARA, CONS_m + EXT_I, 1 ],
		[ "", is_consonent, EXT_AI, 0],
		[ "", VIRAMA, EXT_I, 1 ],
		[ "", " ", VOW_ii, 0 ],
		[ "", "", VOW_ii, 0 ]
	];

sm.o = 	
	[
		[ "", VIRAMA, EXT_o, 1 ],
		[ "", EXT_o, EXT_O, 1 ],		
		[ "", ANUSVARA, CONS_m + EXT_o, 1 ],
		[ "", " ", VOW_o, 0 ],
		[ "", "", VOW_o, 0 ]
	];

sm.O = 	
	[
		[ "", VIRAMA, EXT_O, 1 ],
		[ "", ANUSVARA, CONS_m + EXT_O, 1 ],
		[ "", " ", VOW_oo, 0 ],
		[ "", "", VOW_oo, 0 ]
	];

sm.u =
	[
		[ "", VOW_a, VOW_ou, 1 ],
		[ "", ANUSVARA, CONS_m + EXT_u, 1 ],
		[ "", is_consonent, EXT_OU, 0],
		[ "", EXT_o, EXT_OU, 1],
		[ "", VIRAMA, EXT_u, 1 ],
		[ "", EXT_u, EXT_U, 1 ],		
		[ "", VOW_R, VOW_RR, 1 ],
		[ "", EXT_R, EXT_RR, 1 ],
		[ "", " ", VOW_u, 0 ],
		[ "", "", VOW_u, 0 ]
	];

sm.U =
	[
		[ "", VOW_a, VOW_ou, 1 ],
		[ "", ANUSVARA, CONS_m + EXT_U, 1 ],
		[ "", is_consonent, EXT_OU, 0],
		[ "", EXT_R, EXT_RR, 1 ],
		[ "", VIRAMA, EXT_U, 1 ],
		[ "", " ", VOW_uu, 0 ],
		[ "", "", VOW_uu, 0 ]
	];

sm.h =
	[
		[CONS_s, VIRAMA, CONS_sh+VIRAMA, 2 ],
		["", "@", VISARGA, 1 ],
		[ CONS_c, VIRAMA, "", 0 ],
		[ CONS_C, VIRAMA, "", 0 ],
		[ CONS_t, VIRAMA, CONS_th+VIRAMA, 2 ],
		[ CONS_T, VIRAMA, CONS_TH+VIRAMA, 2 ],
		[ is_aspiration_possible, VIRAMA, add_aspiration, 2 ],
		["", VIRAMA, CONS_h+VIRAMA, 1],
		["", "", CONS_h+VIRAMA, 0]
	];

// TODO: Handle vowel before m case. Test case: Amla
sm.m =
	[
		[ "", "~", CONS_INYA+VIRAMA, 1 ],
		[ "", VIRAMA, CONS_m + VIRAMA, 0 ],
		[ "", "", CONS_m + VIRAMA, 0 ]
	];

sm.M =
	[
		[ "", VIRAMA, ANUSVARA, 1 ],
		[ "", is_consonent, ANUSVARA, 0 ],
		[ "", "", ANUSVARA, 0 ]
	];

sm.n =
	[
		[ "", "~", CONS_INI+VIRAMA, 1 ],
		[ "", VIRAMA, CONS_n + VIRAMA, 0 ],
		[ "", "", CONS_n + VIRAMA, 0 ]
	];

sm.R =
	[
		[ "", VIRAMA, EXT_R, 1 ],
		[ "", ANUSVARA, CONS_m + EXT_R, 1 ],
		[ "", is_consonent, EXT_R, 0 ],
		[ "", "", VOW_R, 0 ]
	];

sm.r =
	[
		[ "", "~", CONS_BANDI_RA+VIRAMA, 1 ]
	];

sm["^"] =
	[
        /* Following is a HACK so that we won't delete the non-joiner on
        next character. We needed to delete it if pchar is a non-joiner
        this is it work with the fact that non-joiner doesn't count in the
        length of the string */
		["", "", NON_JOINER+NON_JOINER, 0 ]
	];

sm["&"] =
	[
		[ "", ANUSVARA, CONS_m + VIRAMA, 1 ],
		[ "", "", "&", 0 ]
	];

var mapping = [
/* 0 (\00) */ 0, /* 1 () */ 0, /* 2 () */ 0, /* 3 () */ 0, /* 4 () */ 0,
/* 5 () */ 0, /* 6 () */ 0, /* 7 () */ 0, /* 8 () */ 0, /* 9 (	) */ 0,
/* 10 () */ 0, /* 11 () */ 0, /* 12 () */ 0, /* 13 () */ 0, /* 14 () */ 0,
/* 15 () */ 0, /* 16 () */ 0, /* 17 () */ 0, /* 18 () */ 0, /* 19 () */ 0,
/* 20 () */ 0, /* 21 () */ 0, /* 22 () */ 0, /* 23 () */ 0, /* 24 () */ 0,
/* 25 () */ 0, /* 26 () */ 0, /* 27 () */ 0, /* 28 () */ 0, /* 29 () */ 0,
/* 30 () */ 0, /* 31 () */ 0, /* 32 ( ) */ 0, /* 33 (!) */ 0, /* 34 (") */ 0,
/* 35 (#) */ 0, /* 36 ($) */ 0, /* 37 (%) */ 0, /* 38 (&) */ 0, /* 39 (') */ 0,
/* 40 (() */ 0, /* 41 ()) */ 0, /* 42 (*) */ 0, /* 43 (+) */ 0, /* 44 (,) */ 0,
/* 45 (-) */ 0, /* 46 (.) */ 0, /* 47 (/) */ 0, /* 48 (0) */ "\u0C66", /* 49 (1) */ "\u0C67",
/* 50 (2) */ "\u0C68", /* 51 (3) */ "\u0C69", /* 52 (4) */ "\u0C6A", /* 53 (5) */ "\u0C6B", /* 54 (6) */ "\u0C6C",
/* 55 (7) */ "\u0C6D", /* 56 (8) */ "\u0C6E", /* 57 (9) */ "\u0C6F", /* 58 (:) */ 0, /* 59 (;) */ 0,
/* 60 (<) */ 0, /* 61 (=) */ 0, /* 62 (>) */ 0, /* 63 (?) */ 0, /* 64 (@) */ 0,
/* 65 (A) */ "\u0C06", /* 66 (B) */ CONS_B, /* 67 (C) */ CONS_C, /* 68 (D) */ CONS_D, /* 69 (E) */ "\u0C0F",
/* 70 (F) */ CONS_P, /* 71 (G) */ CONS_G, /* 72 (H) */ 0, /* 73 (I) */ "\u0C08", /* 74 (J) */ CONS_J,
/* 75 (K) */ CONS_K, /* 76 (L) */ CONS_L, /* 77 (M) */ 0, /* 78 (N) */ "\u0C23", /* 79 (O) */ "\u0C13",
/* 80 (P) */ CONS_P, /* 81 (Q) */ 0, /* 82 (R) */ "\u0C0B", /* 83 (S) */ CONS_S, /* 84 (T) */ CONS_T,
/* 85 (U) */ "\u0C0A", /* 86 (V) */ CONS_v, /* 87 (W) */ CONS_v, /* 88 (X) */ CONS_k+VIRAMA+CONS_sh, /* 89 (Y) */ CONS_y,
/* 90 (Z) */ 0, /* 91 ([) */ 0, /* 92 (\) */ 0, /* 93 (]) */ 0, /* 94 (^) */ 0,
/* 95 (_) */ 0, /* 96 (`) */ 0, /* 97 (a) */ "\u0C05", /* 98 (b) */ CONS_b, /* 99 (c) */ CONS_c,
/* 100 (d) */ CONS_d, /* 101 (e) */ "\u0C0E", /* 102 (f) */ CONS_P, /* 103 (g) */ CONS_g, /* 104 (h) */ 0,
/* 105 (i) */ "\u0C07", /* 106 (j) */ CONS_j, /* 107 (k) */ "\u0C15", /* 108 (l) */ CONS_l, /* 109 (m) */ CONS_m,
/* 110 (n) */ CONS_n, /* 111 (o) */ "\u0C12", /* 112 (p) */ CONS_p, /* 113 (q) */ CONS_q, /* 114 (r) */ CONS_r,
/* 115 (s) */ CONS_s, /* 116 (t) */ CONS_t, /* 117 (u) */ "\u0C09", /* 118 (v) */ CONS_v, /* 119 (w) */ CONS_v,
/* 120 (x) */ CONS_k+VIRAMA+CONS_sh, /* 121 (y) */ CONS_y, /* 122 (z) */ CONS_z, /* 123 ({) */ 0, /* 124 (|) */ 0,
/* 125 (}) */ 0, /* 126 (~) */ 0, /* 127 () */ 0, /* 128 (\80) */ 0, /* 129 (\81) */ 0,
/* 130 (\82) */ 0, /* 131 (\83) */ 0, /* 132 (\84) */ 0, /* 133 (\85) */ 0, /* 134 (\86) */ 0,
/* 135 (\87) */ 0, /* 136 (\88) */ 0, /* 137 (\89) */ 0, /* 138 (\8A) */ 0, /* 139 (\8B) */ 0,
/* 140 (\8C) */ 0, /* 141 (\8D) */ 0, /* 142 (\8E) */ 0, /* 143 (\8F) */ 0, /* 144 (\90) */ 0,
/* 145 (\91) */ 0, /* 146 (\92) */ 0, /* 147 (\93) */ 0, /* 148 (\94) */ 0, /* 149 (\95) */ 0,
/* 150 (\96) */ 0, /* 151 (\97) */ 0, /* 152 (\98) */ 0, /* 153 (\99) */ 0, /* 154 (\9A) */ 0,
/* 155 (\9B) */ 0, /* 156 (\9C) */ 0, /* 157 (\9D) */ 0, /* 158 (\9E) */ 0, /* 159 (\9F) */ 0,
/* 160 (\A0) */ 0, /* 161 (\A1) */ 0, /* 162 (\A2) */ 0, /* 163 (\A3) */ 0, /* 164 (\A4) */ 0,
/* 165 (\A5) */ 0, /* 166 (\A6) */ 0, /* 167 (\A7) */ 0, /* 168 (\A8) */ 0, /* 169 (\A9) */ 0,
/* 170 (\AA) */ 0, /* 171 (\AB) */ 0, /* 172 (\AC) */ 0, /* 173 (\AD) */ 0, /* 174 (\AE) */ 0,
/* 175 (\AF) */ 0, /* 176 (\B0) */ 0, /* 177 (\B1) */ 0, /* 178 (\B2) */ 0, /* 179 (\B3) */ 0,
/* 180 (\B4) */ 0, /* 181 (\B5) */ 0, /* 182 (\B6) */ 0, /* 183 (\B7) */ 0, /* 184 (\B8) */ 0,
/* 185 (\B9) */ 0, /* 186 (\BA) */ 0, /* 187 (\BB) */ 0, /* 188 (\BC) */ 0, /* 189 (\BD) */ 0,
/* 190 (\BE) */ 0, /* 191 (\BF) */ 0, /* 192 (\C0) */ 0, /* 193 (\C1) */ 0, /* 194 (\C2) */ 0,
/* 195 (\C3) */ 0, /* 196 (\C4) */ 0, /* 197 (\C5) */ 0, /* 198 (\C6) */ 0, /* 199 (\C7) */ 0,
/* 200 (\C8) */ 0, /* 201 (\C9) */ 0, /* 202 (\CA) */ 0, /* 203 (\CB) */ 0, /* 204 (\CC) */ 0,
/* 205 (\CD) */ 0, /* 206 (\CE) */ 0, /* 207 (\CF) */ 0, /* 208 (\D0) */ 0, /* 209 (\D1) */ 0,
/* 210 (\D2) */ 0, /* 211 (\D3) */ 0, /* 212 (\D4) */ 0, /* 213 (\D5) */ 0, /* 214 (\D6) */ 0,
/* 215 (\D7) */ 0, /* 216 (\D8) */ 0, /* 217 (\D9) */ 0, /* 218 (\DA) */ 0, /* 219 (\DB) */ 0,
/* 220 (\DC) */ 0, /* 221 (\DD) */ 0, /* 222 (\DE) */ 0, /* 223 (\DF) */ 0, /* 224 (\E0) */ 0,
/* 225 (\E1) */ 0, /* 226 (\E2) */ 0, /* 227 (\E3) */ 0, /* 228 (\E4) */ 0, /* 229 (\E5) */ 0,
/* 230 (\E6) */ 0, /* 231 (\E7) */ 0, /* 232 (\E8) */ 0, /* 233 (\E9) */ 0, /* 234 (\EA) */ 0,
/* 235 (\EB) */ 0, /* 236 (\EC) */ 0, /* 237 (\ED) */ 0, /* 238 (\EE) */ 0, /* 239 (\EF) */ 0,
/* 240 (\F0) */ 0, /* 241 (\F1) */ 0, /* 242 (\F2) */ 0, /* 243 (\F3) */ 0, /* 244 (\F4) */ 0,
/* 245 (\F5) */ 0, /* 246 (\F6) */ 0, /* 247 (\F7) */ 0, /* 248 (\F8) */ 0, /* 249 (\F9) */ 0,
/* 250 (\FA) */ 0, /* 251 (\FB) */ 0, /* 252 (\FC) */ 0, /* 253 (\FD) */ 0, /* 254 (\FE) */ 0,
/* 255 (\FF) */ 0
];


/* GLOBAL VARIABLES */
var gEntryType = RTS_ENTRY;
var gTextarea;
var gTextareaCallback = null;

// Call this method with a jquery textbox to make the texbox RTS entry
function setRtsTextarea(tb) {
	gTextarea = tb;
	gTextarea.keypress(keyPressed);
	gTextarea.on('keydown', keyDown);
}

function keyDown(event) {
	if (event.key === 'Backspace') {
		handleBackspace(event);
		
		if (gTextareaCallback) {
        	gTextareaCallback(event);
    	}
	}
}

function handleBackspace(event) {
	let backspaceChars = 0;
	let newStr = "";
	let effectiveStringLength = 0;
	let defaultAction = true;

	// If text area has selection, fall back to default behavior
	const selStart = gTextarea.get(0).selectionStart;
	const selEnd = gTextarea.get(0).selectionEnd;
	if (selStart != selEnd) {
		return;
	}

	if (event.originalEvent.ctrlKey) {
		return;
	}

	const currentCursor = getCursorPosition();
	let pchar1 = getChar(currentCursor-1);
	let pchar2 = getChar(currentCursor-2);
	let cchar = getChar(currentCursor);

	//console.log("pchar2: " + pchar2 + ", pchar1: " + pchar1 + ", cchar: " + cchar);
	let ccur = currentCursor;
	while (pchar1 == NON_JOINER) {
		backspaceChars += 1;
		ccur -= 1
		pchar1 = getChar(ccur - 1);
		pchar2 = getChar(ccur - 2);
	}
	// console.log("pchar2: " + pchar2 + ", pchar1: " + pchar1 + ", cchar: " + cchar);

	if (is_consonent(pchar1)) {
		newStr = VIRAMA;
		effectiveStringLength = 1;
		defaultAction = false;
	}
	else if (is_extension(pchar1)) {
		if (is_consonent(pchar2)) {
			newStr = VIRAMA;
			effectiveStringLength = 1;
			backspaceChars += 1;
			defaultAction = false;
		}
	}
	else if (pchar1 == VIRAMA) {
		backspaceChars += 2;
		defaultAction = false;
	}
	else {
		backspaceChars += 1;
		defaultAction = false;
	}

	if (cchar != "") {
		newStr += NON_JOINER;
		effectiveStringLength += 1;
	}

	if (!defaultAction) {
		replaceCharAtCursor(newStr, backspaceChars, effectiveStringLength);
		event.preventDefault();
	}
	// dumpTextAreaContent(-1, -1, -1);
}

function setRtsTextareaCallback(callback) {
    gTextareaCallback = callback;
}

function getCursorPosition() {
	var el = gTextarea.get(0);
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

function setCursorPosition(textarea, pos) {
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

function replaceCharAtCursor(strToInsert, backspaceChars, effectiveStringLength) {
	var cur = getCursorPosition();
	var txt = gTextarea.val();

	gTextarea.val( txt.substring(0, cur-backspaceChars) + strToInsert
		+ txt.substring(cur));
	var newCursorPos = cur + effectiveStringLength - backspaceChars;
	//console.log("new cursor pos: " + newCursorPos);
	setCursorPosition(gTextarea, newCursorPos);
	// dumpTextAreaContent(newCursorPos-1, newCursorPos+1, newCursorPos);
}


function dumpTextAreaContent(start, end, curpos) {
	const val = gTextarea.val();
	if (start < 0) {
		start = 0;
	}
	let len;
	if (end < 0 || end >= val.length) {
		len = val.length;
	}
	else {
		len = end - start + 1;
	}

	for (let i=start; i<len; i++) {
		if (curpos == i) {
			console.log("--------");
		}
		if (val[i] == NON_JOINER) {
			console.log(i + ": NJ");
		}
		else if (val[i] == "\n") {
			console.log(i + ": NL");
		}
		else {
			console.log(i + ": " + val[i]);
		}
		if (curpos == i) {
			console.log("--------");
		}
	}
}

function isVowel(asciiCode) {
	if (asciiCode == 65 || asciiCode == 97 ||
	asciiCode == 69 || asciiCode == 101 ||
	asciiCode == 73 || asciiCode == 105 ||
	asciiCode == 79 || asciiCode == 111 ||
	asciiCode == 85 || asciiCode == 117 ||
	asciiCode == 82 /* R */) {
		return true;
	}
	else
		return false;
}

function getChar(pos) {
	try {
		return gTextarea.val()[pos];
	}
	catch(err) {
		return "";
	}
}

function deleteSelection() {
	const selStart = gTextarea.get(0).selectionStart;
	const selEnd = gTextarea.get(0).selectionEnd;
	if (selStart != selEnd) {
		let text = gTextarea.val();
		gTextarea.val(
			text.substring(0,selStart)
			+ text.substring(selEnd, text.length)
		);
		setCursorPosition(gTextarea, selStart);
	}
}

function rtsEntry(e, currentCursor) {
	var pchar = getChar(currentCursor-1);
	var ppchar = getChar(currentCursor-2);
	var nchar = getChar(currentCursor);
	var replace_separator = 0;

	if (pchar == NON_JOINER ) {
	    replace_separator = 1;
	    pchar = ppchar;
	    ppchar = getChar(currentCursor-3);
	}

	var input = String.fromCharCode(e.which);
	var input_sm = sm[input];

	var replace = 0;
	var output = "";
	var match_found = 0;

	if (e.which == 0) {
		return 0;
	}

	if (input === "#") {
		gEntryType = ENGLISH_ENTRY;
		return 1;
	}

	// If there is a selection delete it first
	deleteSelection();

	if (input_sm) {
		for (var i=0; i<input_sm.length; i++) {
			if ((!input_sm[i][0]) ||
				(typeof input_sm[i][0]=="function" &&
					input_sm[i][0](ppchar)) ||
				(input_sm[i][0] === ppchar))
			{
				if ((!input_sm[i][1]) ||
					(typeof input_sm[i][1]=="function" && input_sm[i][1](pchar)) ||
					(input_sm[i][1] === pchar))
				{
					if (typeof input_sm[i][2] == "function")
						output = input_sm[i][2](ppchar, pchar, input);
					else
						output = input_sm[i][2];
					replace = input_sm[i][3];
					match_found = 1;
					break;
				}
			}
		}
	}

	if (!match_found) {
		output = mapping[e.which];
		if (output) {
			output = output + VIRAMA;
		}	
	}


	if (match_found || output != 0) {
		var effectiveStringLength = output.length;	
		if (nchar && nchar != '\0' && nchar != NON_JOINER && nchar != "" && nchar != "\n"  && nchar != " ") {
			// If there is a next char, insert a null so that
			// we don't combine the current letter with next
			output = output + NON_JOINER;
		}

		replaceCharAtCursor(output, replace+replace_separator, effectiveStringLength);
		return 1;
	}
	else
		return 0;

}

function englishEntry(e, currentCursor) {
	var input = String.fromCharCode(e.which);
	if (input === "#") {
		gEntryType = RTS_ENTRY;
		return 1;
	}

	return 0;
}

function keyPressed(e) {
	// TODO: Optimize this. We don't need to call this multiple times
	var currentCursor = getCursorPosition();
	var prevent;

    if (gTextareaCallback) {
        gTextareaCallback(e);
    }

	if (e.altKey) {
		return;
	}

	if (e.metaKey || e.ctrlKey) {
		if (e.whcih == 83 || e.which == 115) {
			e.preventDefault();
		}

		return;
	}

	if (gEntryType == RTS_ENTRY) {
		prevent = rtsEntry(e, currentCursor);
		// dumpTextAreaContent(-1, -1, -1);
	}
	else {
		prevent = englishEntry(e, currentCursor);
	}

	if (prevent) {
		e.preventDefault();
	}
}

function dumpValues(from, to) {
	var text = from.val();
	var out = "";

	for (var i=0; i<text.length; i++) {
	   out = out + text[i] + "(" + text.charCodeAt(i).toString(16) + ") ";
	}

	to.val(out);
}
