// ==UserScript==
// @name           Auto Recover All
// @description    This script automatically clicks the "Recover all" button when a battle has finished.
// @include        http://hentaiverse.org/*
// ==/UserScript==
if(document.getElementById('togpane_log') && ((!document.getElementById('ckey_continue'))||(document.getElementById('ckey_continue').getAttribute('onclick')!='battle.battle_continue()')) && (document.getElementsByClassName('btcp'))){ recover_submit('all'); }
