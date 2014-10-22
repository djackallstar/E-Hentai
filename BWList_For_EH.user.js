// ==UserScript==
// @name            Blacklist and Whitelist of Forum Threads for the E-Hentai Forums
// @description     Blacklists and whitelists specified forum threads, plus various tweaks.
// @include         http://forums.e-hentai.org/index.php?*
// ==/UserScript==

/*** Settings ***/

var hide_unread_threads = true
var hide_closed_shops = true
var highlight_auctions = true
var highlight_shop_owners = true
if(typeof do_not_hide == 'undefined') {
    var do_not_hide = ['danixxx', 'djackallstar']
}
if(typeof wts_shop_owners_to_highlight == 'undefined') {
    var wts_shop_owners_to_highlight = ['boulay', 'djackallstar', 'Mantra64', 'Pickled Cow', 'spicepie', 'ST-Ru', 'Teana Lanster', 'tychocelchu', 'VriskaSerket', 'wannaf', 'Zack_CN']
}
if(typeof wtb_shop_owners_to_highlight == 'undefined') {
    var wtb_shop_owners_to_highlight = ['Apoly', 'atomicpuppy', 'Cats Lover', 'cwx', 'danixxx', 'djackallstar', 'dongchun', 'frankmelody', 'gc00018', 'Kyoko Hori', 'morineko', 'piyin', 'raisarakun', 'SinBear', 'TCPG', 'warachiasion']
}
if(typeof wts_blist == 'undefined') {
    var wts_blist = [72877, 31783, 96543, 51688, 85197, 105670, 163637, 171583, 162125, 171591]
}
if(typeof wtb_blist == 'undefined') {
    var wtb_blist = [105668, 94876, 166903]
}
if(typeof chat_wlist == 'undefined') {
    var chat_wlist = [20466, 22234, 29703, 65126]
}

/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var showforum = href.match(/showforum=(\d+)/)
if(!showforum) { showforum = href.match(/&?\bf=(\d+)/) }
if(!showforum) { throw 'exit' }
showforum = showforum[1]

// Hide unread imgs
if(hide_unread_threads) {
    var imgs = $$('img[src="style_images/ambience/newpost.gif"]')
    for(var i=0, len=imgs.length; i<len; i++) { imgs[i].style.display = 'none' }
    var imgs = $$('img[src="style_images/fusion/newpost.gif"]')
    for(var i=0, len=imgs.length; i<len; i++) { imgs[i].style.display = 'none' }
}

// Hide closed shops
if(hide_closed_shops) {
    if(showforum == '77' || showforum == '78') {
        var lnks = $$('td.row1 > div > span > a[id^="tid-link-"]')
        for(var i=0, len=lnks.length; i<len; i++) {
            if(/\bauction\b/i.test(lnks[i].textContent)) { continue }
            var owner = $(lnks[i].parentNode.parentNode.parentNode.parentNode, 'td.row2 > a[href*="showuser"]')
            if(do_not_hide.indexOf(owner.textContent) != -1){ continue }
            if(/\b(close|shut|delete|done|end|nothing)/i.test(lnks[i].textContent)) {
                lnks[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none'
            }
            var desc = $(lnks[i].parentNode.parentNode, 'span#tid-desc-'+lnks[i].id.match(/(\d+)/)[1])
            if(/\b(closed?|shut|delete|done|end|nothing)\b/i.test(desc.textContent)) {
                desc.parentNode.parentNode.parentNode.parentNode.style.display = 'none'
            }
        }
    }
}

// Highlight auctions
if(highlight_auctions) {
    if(showforum == '77') {
        var lnks = $$('td.row1 > div > span > a[id^="tid-link-"]')
        for(var i=0, len=lnks.length; i<len; i++) {
            if(/\bauction\b/i.test(lnks[i].textContent)) {
                var owner = $(lnks[i].parentNode.parentNode.parentNode.parentNode, 'td.row2 > a[href*="showuser"]')
                if(owner.style.color == '') { owner.style.color = 'blue'}
            }
        }
    }
}

// Highlight shop owners
if(highlight_shop_owners) {
    var fav = []
    if(showforum == '77') { fav = wts_shop_owners_to_highlight } // WTS
    else if(showforum == '78') { fav = wtb_shop_owners_to_highlight } // WTB
    var owner = $$('td.row2 > a[href*="showuser"]')
    for(var i=0, len=owner.length; i<len; i++) {
        if((fav.indexOf(owner[i].textContent) != -1) && (owner[i].style.color == '')) { owner[i].style.color = 'red' }
    }
}

// Hide specified forum threads
var blist = wlist = []
if(showforum == '76')      { wlist = chat_wlist } // Chat
else if(showforum == '77') { blist = wts_blist } // WTS
else if(showforum == '78') { blist = wtb_blist } // WTB
if(blist.length) {
    for(var i=0, len=blist.length; i<len; i++) {
        try {
            $('#tid-link-'+blist[i]).parentNode.parentNode.parentNode.parentNode.style.display = 'none'
        } catch(e) {}
    }
}
else if(wlist.length) {
    var lnks = $$('td.row1 > div > span > a[id^="tid-link-"]')
    for(var i=0, len=lnks.length; i<len; i++) {
        if(!/^tid-link-/.test(lnks[i].id)) { continue }
        var tid = parseInt(lnks[i].id.match(/tid-link-(\d+)/)[1])
        if(wlist.indexOf(tid)==-1) {
            try {
                lnks[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none'
            } catch(e) {}
        }
    }
}
