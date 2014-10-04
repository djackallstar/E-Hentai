// ==UserScript==
// @name            E-Hentai Grep
// @description     Searches forum posts for lines that match given patterns
// @include         http://forums.e-hentai.org/index.php?showtopic=*
// ==/UserScript==

/*** Settings ***/

var default_on = true
var hotkey = 71 // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
var max_length = 60
var blacklist = [
    '22234', // Ask the Experts
    '163637', // The Shared Free Shop
]
if(typeof grep_patterns == 'undefined')
{
    var grep_patterns = [ // modify by yourself to suit your needs
        // Bindings
        /binding.*(slaughter|protection|barrier|nimble|heimdall|ox|raccoon|cheetah|turtle|warding)/i,
        /^\s*(slaughter|protection|barrier|nimble|heimdall|ox|raccoon|cheetah|turtle|warding)/i,

        // Special forge materials
        /\bdefense\b/i,
        /\bdmm\b/i,
        /\brepurposed\b/i,
        /\bra\b/i,

        // Graded materials
        /(grade|scrap)\s+(metals?|cloth)/i,
        /\b[hm]gm\b/i,

        // Shard
        /\bshards?/i,

        // Artifact
        /\bartifacts?/i,

        // Equipments
        /(Peerless|Leg|Mag)(\S+)? +(Ethereal|Hallowed|Demonic|Tempestuous) +Rapier.+(Slaughter)/i, // Mag+ good-prefixed rapier of slaughter
        /(Peerless|Leg)(\S+)?( +\S+)? +(\S)+ +Shield/i, // Leg+ shield
        /(Mag)(\S+)?( +Mithril)? +Force +Shield/i, // Mag non-prefixed or Mithril-prefixed force shield
        /(Peerless|Leg)(\S+)?( +\S+)? +Power.+(Slaughter)/i, // Leg+ power of slaughter
        /(Mag)(\S+)?( +Savage)? +Power.+(Slaughter)/i, // Mag non-prefixed or Savage-prefixed power of slaughter
        /(Peerless|Leg)(\S+)?( +\S+)? +(Power|Plate).+(Protection)/i, // Leg+ power of protection
        /(Peerless|Leg)(\S+)? +Shielding +Plate/i, // Leg+ shielding plate

        /(Mag)(\S+)?( +\S+)? +Power.+(Slaughter)/i, // Mag prefixed power of slaughter
        /(Exq)(\S+)?( +Savage)? +Power.+(Slaughter)/i, // Exq non-prefixed or Savage-prefixed power of slaughter

        /(Peerless|Leg)(\S+)?( +\S+) +Rapier.+(Slaughter)/i, // Leg+ bad-prefixed rapier of slaughter
        /(Mag)(\S+)?( +\S+) +Force +Shield/i, // Mag prefixed force shield
        /(Mag)(\S+)?( +\S+) +((Kite|Tower) +Shield).+(Protection|Warding)/i, // Mag prefixed kite/tower shield of protection/warding
        /(Mag)(\S+)?( +\S+) +Buckler.+(Barrier|Nimble)/i, // Mag prefixed buckler of the barrier/nimble
        /(Exq)(\S+)?( +\S+) +Power.+(Slaughter)/i, // Exq prefixed power of slaughter

        /(Exq)(\S+)? +(Ethereal|Hallowed) +Rapier.+(Slaughter)/i, // Exq good-prefixed rapier of slaughter
    ]
}

/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

for(var i=0; i<blacklist.length; i++) { if(new RegExp('showtopic=' + blacklist[i] + '\\b').test(href)) { default_on = false } }

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var get_text = function(e) { return e.innerHTML.replace(/<br\s*[^>]*>/g, '\n').replace(/<[^>]+>/g, '') }
var out = ''
var first_post = $('.post2')
var shop_owner = $('.bigusername').textContent
var posts = $$('.borderwrap')
for(var i=0, len=posts.length; i<len; i++) {
    var poster = $(posts[i], '.bigusername')
    if((!poster) || (poster.textContent != shop_owner)) { continue }

    var lines = get_text($(posts[i], '.postcolor')).split('\n')
    var out = ''
    for(var j=0, len2=lines.length; j<len2; j++) {
        var line = lines[j].substring(0, max_length)
        for(var k=0, len3=grep_patterns.length; k<len3; k++) {
            if(grep_patterns[k].test(line)) { out = out + line + '\n'; break }
        }
    }
    if(out) {
        var d = doc.createElement('DIV')
        d.className = 'result'
        d.style.backgroundColor = 'white'
        d.appendChild($(posts[i], '.postdetails').cloneNode(true))
        var pre = doc.createElement('PRE')
        pre.appendChild(doc.createTextNode(out))
        d.appendChild(pre)
        d.appendChild(doc.createElement('HR'))
        first_post.parentNode.insertBefore(d, first_post)
    }
}

var toggle_results = function() {
    var divs = $$(first_post.parentNode, '.result')
    for(var i=divs.length-1; i>=0; i--) {
        if(divs[i].style.display != 'none') { divs[i].style.display = 'none' } else { divs[i].style.display = '' }
    }
}
addEventListener('keydown', function(evt) { if((evt.target.tagName!='INPUT') && (evt.target.tagName!='TEXTAREA') && (evt.keyCode == hotkey)) { toggle_results() } }, false)
if(!default_on) { toggle_results() }
