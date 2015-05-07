// ==UserScript==
// @name            Average Price Calculator for MoogleMail
// @description     Shows the average price of items attached to a letter at the bottom of the body section.
// @include         http://hentaiverse.org/?s=Bazaar&ss=mm&filter=*
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

if(/&mid=/.test(href)) {
    var body_section = $('#leftpane').children[1]
    var s = body_section.textContent.replace(/>/g, '')
    var m = s.match(/(?:Attached item removed: )(?:([0-9]+)x )?([^\(]+)\(.+, CoD was ([0-9]+)C/i)
    //var m = s.match(/(?:(?:Originally attached item was: )|(?:Attached item removed: ))(?:([0-9]+)x )?([^\(]+)\(.+, CoD was ([0-9]+)C/i)
    console.log(m)
    if(m) {
        var quantity = parseInt(m[1])
        if(isNaN(quantity)) { quantity = 1 }
        var item = m[2].replace(/^ +| +$/g, '')
        var cod = parseInt(m[3])
        var avg_price = cod/quantity
        body_section.innerHTML = body_section.innerHTML + '<HR>Item: ' + item + '<BR>Quantity: ' + quantity + '<BR>CoD: ' + cod + 'c<BR>Average Price: ' + avg_price + 'c'
    }
}
