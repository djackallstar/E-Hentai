// ==UserScript==
// @name            Pinned Threads Remover for the E-Hentai Forums
// @description     Hide Pinned Threads in the E-Hentai Forums
// @include         http://forums.e-hentai.org/index.php?*
// ==/UserScript==

var divs = document.querySelectorAll('tr>td.row1>div')
for(var i=divs.length-1; i>=0; i--) { if(/Pinned:/.test(divs[i].textContent)) { divs[i].parentNode.parentNode.style.display = 'none' } }
