// ==UserScript==
// @name            HV Hide Infinite Items
// @description     Hide items with infinite supply on the "All" tab of the Item Shop
// @include         http://hentaiverse.org/?s=Bazaar&ss=is*
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

if(/&ss=is/.test(href)) {
    if(/&filter=all/.test(href) || (!/&filter=/.test(href))) {
        var shop_pane = $('#shop_pane')
        var items = $$(shop_pane, '.idp')
        var supplies = $$(shop_pane, '.ii')
        for(var i=0, len=items.length; i<len; i++) {
            if(isNaN(parseInt(supplies[i].textContent))) {
                items[i].parentNode.parentNode.style.display = 'none'
            }
        }
    }
}
