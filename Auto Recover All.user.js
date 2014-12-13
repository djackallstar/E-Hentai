// ==UserScript==
// @name           Auto Recover All
// @description    This script automatically clicks the "Recover all" button when a battle has finished.
// @include        http://hentaiverse.org/*
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

if($('#togpane_log') && ((!$('#ckey_continue')) || ($('#ckey_continue').getAttribute('onclick') != 'battle.battle_continue()')) && ($('.btcp'))) { recover_submit('all') }
