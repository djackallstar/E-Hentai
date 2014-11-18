// ==UserScript==
// @name            E-Hentai Gallery Overview - All in One
// @description     Appends "Hath Exchange", "GP Exchange" and "Credit Log" to "Overview" under the "My Home" tab
// @include         http://g.e-hentai.org/home.php
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var add_iframe = function(url) {
    var frm = doc.createElement('IFRAME')
    frm.src = url
    frm.width = wnd.innerWidth
    frm.height = wnd.innerHeight
    frm.frameBorder = 0
    var div = doc.createElement('DIV')
    div.appendChild(frm)
    div.style.cssText = $('.stuffbox').parentNode.style.cssText
    doc.body.appendChild(div)
}

add_iframe('http://g.e-hentai.org/exchange.php?t=hath')
add_iframe('http://g.e-hentai.org/exchange.php?t=gp')
add_iframe('http://g.e-hentai.org/logs.php?t=credits')
