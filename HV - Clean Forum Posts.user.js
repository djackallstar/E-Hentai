// ==UserScript==
// @name        HV - Clean Forum Posts
// @updateURL   about:blank
// @grant       unsafeWindow
// @include     http://forums.e-hentai.org/index.php?showtopic=*
// @include     http://act=Search&CODE=show*
// @include     /^https?://forums\.e-hentai\.org/index\.php\?.*result_type=posts/
// ==/UserScript==

var wnd = (typeof unsafeWindow != 'undefined' ? unsafeWindow : window)
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

/*** Settings ***/
if(typeof wnd.uid_blist == 'undefined') {
    var uid_blist = [ // hide posts by uid (integer)
        -12345,
    ]
} else { var uid_blist = wnd.uid_blist }
if(typeof wnd.uname_blist == 'undefined') {
    var uname_blist = [ // hide quotes by username (string)
        '',
    ]
} else { var uname_blist = wnd.uname_blist }
var hide_cutie_marks = true
var hide_warn_levels = true

/*** End of Settings ***/

// Hide posts
var borderwrap = $$('.borderwrap')
for(var i=0, len=borderwrap.length; i<len; i++) {
    var is_post = ($(borderwrap[i], '.postcolor') != null)
    if(is_post) {
        var uid = $(borderwrap[i], 'a[href^="http://forums.e-hentai.org/index.php?showuser="]')
        //var uid = $(borderwrap[i], '.post1 a[href^="http://forums.e-hentai.org/index.php?showuser="]')
        //if(!uid) { uid = $(borderwrap[i], '.post2 a[href^="http://forums.e-hentai.org/index.php?showuser="]') }
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

// Hide quotes
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

// Hide cutie marks
if(hide_cutie_marks) {
    var div = $$('DIV[style*="url(http://forums.e-hentai.org/ehgt/cm/"]')
    for(var i=0, len=div.length; i<len; i++) { div[i].style.display = 'none' }
}

// Hide warn levels
if(hide_warn_levels) {
    var w = $$('img[src*="style_images/ambience/warn"]')
    for(var i=0, len=w.length; i<len; i++) {
        w[i].style.display = 'none'
        w[i].previousSibling.textContent = ''
        w[i].previousSibling.previousSibling.textContent = ''
        w[i].previousSibling.previousSibling.previousSibling.textContent = ''
    }
    var spacer = $$('img[src*="style_images/ambience/spacer."]')
    for(var i=0, len=spacer.length; i<len; i++) {
        spacer[i].style.display = 'none'
    }
}
