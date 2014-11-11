// ==UserScript==
// @name            Jenga's Special Offer
// @description     Calculate the total value of trophies based on jenga201's buying prices
// @include         http://hentaiverse.org/?s=Character&ss=in
// @include         http://hentaiverse.org/?s=Bazaar&ss=is
// @include         http://hentaiverse.org/?s=Bazaar&ss=is&*
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
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

var display_total_value = function(sum) {
    var out = 'Total value of trophies: ' + sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' credits'
    console.log(out)

    var div = doc.createElement('DIV')
    div.appendChild(doc.createElement('BR'))
    div.appendChild(doc.createTextNode(out))

    var left = $('.clb')
    div.style.cssText = $(left, '.cit .fd4 > div').style.cssText + 'margin-right: 8px;'
    left.appendChild(div)
}

// Character -> Inventory
var inv_item = $('#inv_item')
if(inv_item) {
    var items = $$(inv_item, '.id')
    for(var i=items.length-1, sum=0; i>=0; i--) {
        var k = items[i].textContent
        var v = parseInt(d[k])
        var supply = parseInt($(items[i].parentNode.parentNode, '.ii').textContent)
        if( (!isNaN(v)) && (!isNaN(supply)) ) {
            sum += (v*supply)
        }
    }
    display_total_value(sum)
}

// Bazaar -> Item Shop -> All/Special
var item_pane = $('#item_pane')
if(item_pane) {
    var items = $$(item_pane, '.idp')
    var supplies = $$(item_pane, '.ii')
    for(var i=items.length-1, sum=0; i>=0; i--) {
        var k = items[i].textContent
        var v = parseInt(d[k])
        var supply = parseInt(supplies[i].textContent)
        if( (!isNaN(v)) && (!isNaN(supply)) ) {
            sum += (v*supply)
        }
    }
    display_total_value(sum)
}
