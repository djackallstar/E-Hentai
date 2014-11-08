// ==UserScript==
// @name            Jenga's Special Offer
// @description     Calculate the total value of trophies based on jenga201's buying prices
// @include         http://hentaiverse.org/?s=Bazaar&ss=is&filter=sp
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var d = {
    'ManBearPig Tail': 500,
    'Holy Hand Grenade of Antioch': 500,
    'Mithra\'s Flower': 500,
    'Dalek Voicebox': 500,
    'Lock of Blue Hair': 750,
    'Bunny-Girl Costume': 1000,
    'Hinamatsuri Doll': 1000,
    'Broken Glasses': 1000,
    'Black T-Shirt': 5000,
    'Sapling': 5000,
    'Unicorn Horn': 6000,
    'Noodly Appendage': 0,
}

var item_pane = $('#item_pane')
if(item_pane) {
    var items = $$('.idp')
    var supplies = $$(item_pane, '.ii')
    for(var i=items.length-1, sum=0; i>=0; i--) {
        var k = items[i].textContent
        var v = parseInt(d[k])
        var supply = parseInt(supplies[i].textContent)
        if( (!isNaN(v)) && (!isNaN(supply)) ) {
            sum += (v*supply)
        }
    }
    console.log('Total value of trophies: ' + sum + ' credits.')
}
