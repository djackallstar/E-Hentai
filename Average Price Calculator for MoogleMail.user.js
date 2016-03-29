// ==UserScript==
// @name            HV - Average Price Calculator for MoogleMail
// @updateURL       about:blank
// @grant           none
// @include         http://hentaiverse.org/?s=Bazaar&ss=mm&filter=*
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

if(/&mid=/.test(href)) {
    var normalize_price = function(p) {
        if(p.toString().replace(/\..*/, '').length <= 3) { return p+'' }
        p /= 1000; if(p.toString().replace(/\..*/, '').length <= 3) { return p+'k' }
        p /= 1000; if(p.toString().replace(/\..*/, '').length <= 3) { return p+'m' }
        p /= 1000; if(p.toString().replace(/\..*/, '').length <= 3) { return p+'b' }
        p /= 1000; return p+'t'
    }
    var m = $('#leftpane').nextSibling.nextSibling.nextSibling
    if(m.querySelector('*[onmouseover]')) {
        var cnt = parseInt(m.children[0].textContent.match(/Attached:\s*(\d+)x/)[1])
        var name = m.children[1].textContent.replace(/\n/g, '')
        var cod = m.children[2].textContent.match(/CoD:\s*([0-9,]+)\s*credits/i)
        if(cod) { cod = parseInt(cod[1].replace(/,/g, '')) } else { cod = 0 }
        var avg_price = cod/cnt
        //$('#leftpane').children[1].innerHTML += '<HR>Status: Not Taken<BR>Name: ' + name + '<BR>Count: ' + cnt + '<BR>CoD: ' + cod + '<BR>Average Price: ' + avg_price
        $('#leftpane').children[1].innerHTML += '<HR>' + cnt + 'x ' + name + ' @' + normalize_price(avg_price) + '<BR>CoD: ' + normalize_price(cod) + '<BR>Not Taken Yet'
    }
    else {
        var body_section = $('#leftpane').children[1]
        var s = body_section.textContent.replace(/>/g, '')
        var m = s.match(/(?:Attached item removed: )(?:([0-9]+)x )?([^\(]+)\(.+, CoD was ([0-9]+)C/i)
        if(m) {
            var cnt = parseInt(m[1])
            if(isNaN(cnt)) { cnt = 1 }
            var name = m[2].replace(/^ +| +$/g, '')
            var cod = parseInt(m[3])
            var avg_price = cod/cnt
            //body_section.innerHTML = body_section.innerHTML + '<HR>Status: Taken<BR>Name: ' + name + '<BR>Count: ' + cnt + '<BR>CoD: ' + cod + '<BR>Average Price: ' + avg_price
            body_section.innerHTML += '<HR>' + cnt + 'x ' + name + ' @' + normalize_price(avg_price) + '<BR>CoD: ' + normalize_price(cod) + '<BR>Already Taken'
        }
    }
}
