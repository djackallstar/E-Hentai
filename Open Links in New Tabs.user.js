// ==UserScript==
// @name            Open Links in New Tabs
// @description     Change the target attribute of specific anchor object to '_blank'
// @updateURL       about:blank
// @include         http://g.e-hentai.org/*
// @include         http://exhentai.org/*
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

if(/^http:\/\/((g\.)|(ex))/.test(href)) {
    var lnks = $$('.itg a')
    if(lnks) { for(var i=lnks.length-1; i>=0; i--) { lnks[i].target = '_blank' } }
    var lnks = $$('#gdt a')
    if(lnks) { for(var i=lnks.length-1; i>=0; i--) { lnks[i].target = '_blank' } }
}
