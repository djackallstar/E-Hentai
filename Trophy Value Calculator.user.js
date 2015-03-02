// ==UserScript==
// @name            Trophy Value Calculator
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
    'ManBearPig Tail': 450,
    'Holy Hand Grenade of Antioch': 450,
    'Mithra\'s Flower': 450,
    'Dalek Voicebox': 450,
    'Lock of Blue Hair': 700,
    'Bunny-Girl Costume': 900,
    'Hinamatsuri Doll': 900,
    'Broken Glasses': 900,
    'Black T-Shirt': 3000,
    'Sapling': 3000,
    'Unicorn Horn': 6000,
    'Bronze Ticket': 500,
    'Silver Ticket': 1000,
    'Golden Ticket': 4000,
    'Platinum Ticket': 30000,
    'Noodly Appendage': 0,
    'Crystal Snowman': 0,
    'Stocking Stuffers': 0,
    'Reindeer Antlers':300000,
    'Tenbora\'s Box': 1000000,
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