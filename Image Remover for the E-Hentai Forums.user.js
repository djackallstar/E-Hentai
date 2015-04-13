// ==UserScript==
// @name            Image Remover for the E-Hentai Forums
// @description     Removes specified images in the E-Hentai forums
// @include         http://forums.e-hentai.org/*
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var p = [
    /\bstyle_emoticons\//,
    /\/folder_post_icons\//,
]
var imgs = $$('IMG')
for(var i=imgs.length-1; i>=0; i--) {
    for(var a=0, len=p.length; a<len; a++) {
        if(p[a].test(imgs[i].src)) {
            imgs[i].style.display = 'none'
            break
        }
    }
}
