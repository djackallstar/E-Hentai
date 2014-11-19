// ==UserScript==
// @name            E-Hentai Gallery - My Home All in One
// @description     Appends "Hath/GP Exchange" and "Credit Log" to "Overview" under the "My Home" tab
// @include         http://g.e-hentai.org/home.php
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var t = 0
var add_iframe = function(url) {
    var homebox = $('.homebox')
    var stuffbox = $('.stuffbox')

    var frm = doc.createElement('IFRAME')
    frm.src = url
    frm.width = frm.height = frm.frameBorder = 0
    frm.addEventListener('load', function(){
        var frmdoc = this.contentDocument
        if(/\bt=(gp|hath)\b/.test(url)) {
            var tbl = $(frmdoc, '.stuffbox')
        }
        else if(/\bt=credits\b/.test(url)) {
            //var tbl = $(frmdoc, 'BODY>DIV>TABLE')
            var tbl = $(frmdoc, 'BODY>DIV')
        }
        setTimeout(function() {
            homebox.parentNode.insertBefore(tbl.cloneNode(true), homebox.nextSibling)
        }, t)
        t = t + 100
        this.parentElement.removeChild(this)
    }, false)

    var div = doc.createElement('DIV')
    div.appendChild(frm)
    doc.body.appendChild(div)
}

add_iframe('http://g.e-hentai.org/exchange.php?t=hath')
add_iframe('http://g.e-hentai.org/logs.php?t=credits')
add_iframe('http://g.e-hentai.org/exchange.php?t=gp')
