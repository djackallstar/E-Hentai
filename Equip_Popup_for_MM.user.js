// ==UserScript==
// @name            Equipment Popup for MoogleMail
// @description     Press "c" to open the equipment popup of the attached equipment in a new tab.
// @include         http://hentaiverse.org/?s=Bazaar&ss=mm*
// @grant           GM_openInTab
// ==/UserScript==

/*** Settings ***/

var hotkey = 67 // Default: 67 (The "c" key)

/*** End of Settings ***/

var wnd = unsafeWindow
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var m = doc.body.innerHTML.match(/equips.set\((.+?),\s*['"](.+?)['"]\)/)
if(m) {
    var eid = m[1]
    var key = m[2]
    var equip_url = 'http://hentaiverse.org/pages/showequip.php?eid=' + eid + '&key=' + key
    addEventListener('keydown', function(evt) { if((evt.target.tagName!='INPUT') && (evt.target.tagName!='TEXTAREA') && (evt.keyCode == hotkey)) { GM_openInTab(equip_url) } }, false)
}
