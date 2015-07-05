// ==UserScript==
// @name        HV - Open MoogleMail in New Tab
// @updateURL   about:blank
// @grant       unsafeWindow
// @grant       GM_openInTab
// @include     http://hentaiverse.org/?s=Bazaar&ss=mm&filter=inbox*
// @include     http://hentaiverse.org/?s=Bazaar&ss=mm&filter=sent*
// ==/UserScript==

/*** Settings ***/

var auto_take_attachment = true
var auto_recall = false // only used in the sentbox
var auto_close_mail_without_attachment = false

/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var letters = $('#mainpane').querySelectorAll('tr[onclick]')
for(var i=0, len=letters.length; i<len; i++) {
    (function() {
        var url = ''
        if(/&filter=inbox/.test(href)) { url = 'http://hentaiverse.org/?s=Bazaar&ss=mm&filter=inbox&mid=' }
        else if(/&filter=sent/.test(href)) { url = 'http://hentaiverse.org/?s=Bazaar&ss=mm&filter=sent&mid=' }
        url += letters[i].onclick.toString().match(/&?\bmid=(\d+)/)[1]
        letters[i].onclick = function() { GM_openInTab(url, true) }
    })()
}
if(auto_recall) {
    if(/&filter=sent/.test(href)) {
        if(/&?\bmid=/.test(href)) {
            if($('img[src="http://ehgt.org/v/mooglemail/recallmail.png"]')) { unsafeWindow.mooglemail.return_mail() }
        }
    }
}
if(auto_take_attachment) {
    if(/&?\bmid=/.test(href)) {
        if($('img[src="http://ehgt.org/v/mooglemail/takeattacheditem.png"]')) { unsafeWindow.mooglemail.remove_attachment() }
    }
}
if(auto_close_mail_without_attachment) {
    if(/&?\bmid=/.test(href)) {
        if(!$('img[src="http://ehgt.org/v/mooglemail/recallmail.png"]') && !$('img[src="http://ehgt.org/v/mooglemail/takeattacheditem.png"]') && $('img[src="http://ehgt.org/v/mooglemail/closemail.png"]')) { unsafeWindow.close() }
    }
}
