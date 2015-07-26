// ==UserScript==
// @name            HV Hide Infinite Items
// @description     Hide items with infinite supply on the "All" tab of the Item Shop
// @include         http://hentaiverse.org/?s=Bazaar&ss=is*
// ==/UserScript==

/*** Settings ***/
if(typeof wlist == 'undefined') {
    var wlist = [ // Infinite items on the list are NOT hidden. Edit it to suit your own needs.
        /Soul Fragment/i,
        /Scrap (Cloth|Wood)/i,
        /Energy Cell/i,
        /(Regular|Robust|Vibrant|Coruscating) Catalyst/i,
    ]
}

if(typeof blist == 'undefined') {
    var blist = [ // Finite items on the list are hidden. Edit it to suit your own needs.
        /Featherweight|Voidseeker/i,
        /(Low|Mid)-Grade/i,
        /High-Grade (Metals|Leather)/i,
        /Scroll of (Swiftness|Shadows|Absorption|Life|(the Gods))/i,
    ]
}

/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

if(/&ss=is&?/.test(href)) {
    if(/&filter=all/.test(href) || (!/&filter=/.test(href))) {
        var shop_pane = $('#shop_pane')
        var items = $$(shop_pane, '.idp')
        var supplies = $$(shop_pane, '.ii')
        for(var i=0, len=items.length; i<len; i++) {
            if(isNaN(parseInt(supplies[i].textContent))) { // Items with infinite stock
                for(var j=0, len2=wlist.length; j<len2; j++) {
                    if(!wlist[j].test(items[i].textContent)) {
                        items[i].parentNode.parentNode.style.display = 'none'
                    }
                }
            }
            for(var j=0, len2=blist.length; j<len2; j++) { // Items with finite stock
                if(blist[j].test(items[i].textContent)) {
                    items[i].parentNode.parentNode.style.display = 'none'
                }
            }
        }
    }
}
