// ==UserScript==
// @name        HV - Clean Forum Posts
// @updateURL   about:blank
// @include     http://forums.e-hentai.org/index.php?showtopic=*
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

/*** Settings ***/
if(typeof uid_blist == 'undefined') {
    uid_blist = [ // hide posts by them
        11328,
    ]
}
if(typeof uname_blist == 'undefined') {
    uname_blist = [ // hide quotes by them
        'Scremaz',
    ]
}
var hide_cutie_marks = true

/*** End of Settings ***/

var borderwrap = $$('.borderwrap')
for(var i=0, len=borderwrap.length; i<len; i++) {
    var is_post = ($(borderwrap[i], '.postcolor') != null)
    if(is_post) {
        var uid = $(borderwrap[i], '.post1 a[href^="http://forums.e-hentai.org/index.php?showuser="]')
        if(!uid) { uid = $(borderwrap[i], '.post2 a[href^="http://forums.e-hentai.org/index.php?showuser="]') }
        if(uid) {
            uid = parseInt(uid.href.match(/\?showuser=(\d+)/)[1])
            if(uid_blist.indexOf(uid) != -1) {
                borderwrap[i].style.display = 'none'
                borderwrap[i].previousSibling.previousSibling.style.display = 'none'
                borderwrap[i].nextSibling.nextSibling.style.display = 'none'
            }
        }
    }
}

var p = new RegExp('^QUOTE\\((' + uname_blist.join('|') + ') @', 'i')
var postcolor = $$('.postcolor')
for(var i=0, len=postcolor.length; i<len; i++) {
    var quotetop = $$(postcolor[i], '.quotetop')
    for(var j=0, len2=quotetop.length; j<len2; j++) {
        if(p.test(quotetop[j].textContent)) {
            quotetop[j].style.display = 'none'
            quotetop[j].nextSibling.style.display = 'none'
            if(quotetop[j].nextSibling.nextSibling.tagName == 'BR') { quotetop[j].nextSibling.nextSibling.style.display = 'none' }
            if(quotetop[j].nextSibling.nextSibling.nextSibling.tagName == 'BR') { quotetop[j].nextSibling.nextSibling.nextSibling.style.display = 'none' }
            if(quotetop[j].nextSibling.nextSibling.nextSibling.nextSibling.tagName == 'BR') { quotetop[j].nextSibling.nextSibling.nextSibling.nextSibling.style.display = 'none' }
            if(quotetop[j].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.tagName == 'BR') { quotetop[j].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.style.display = 'none' }
        }
    }
}

if(hide_cutie_marks) {
    var div = $$('DIV[style*="url(http://forums.e-hentai.org/ehgt/cm/"]')
    for(var i=0, len=div.length; i<len; i++) { div[i].style.display = 'none' }
}
