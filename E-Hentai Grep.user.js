// ==UserScript==
// @name            E-Hentai Grep
// @description     Searches forum posts for lines that match given string patterns
// @include         http://forums.e-hentai.org/index.php?*showtopic=*
// ==/UserScript==

/*** Settings ***/
var default_on = true
var hotkey = 71 // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
var max_length = 60
var result_box_position = 'right' // where to show the result box ("left", "center" or "right")
var blacklist = [
    '22234', // Ask the Experts
    '163637', // The Shared Free Shop
]
if(typeof grep_patterns == 'undefined')
{
    var grep_patterns = [ // Add [[pattern_1, pattern_2, ... , pattern_n], color] to the array by yourself.
        // Items
        [
            [   // Bindings
                /binding.*(slaughter|protection|barrier|nimble|heimdall|ox|raccoon|cheetah|turtle|warding)/i,
                /^\s*(slaughter|protection|barrier|nimble|heimdall|ox|raccoon|cheetah|turtle|warding)/i,
                // Special forge materials
                /\bmodulator\b/i,
                /\bactuator\b/i,
            ], 'cyan'
        ],
        [
            [
                // Graded materials
                /(grade|scrap)\s+(metals?|cloth)/i,
                // Shard
                /\bshards?/i,
                // Artifact
                /\bartifacts?/i,
            ], 'yellow'
        ],
        // Equipments
        [
            [   // Rapier
                /(Peerless|Leg|Mag)(\S+)? +(Ethereal|Hallowed|Demonic|Tempestuous) +Rapier.+(Slaughter)/i, // Mag+ good-prefixed rapier of slaughter
                // Shield
                /(Peerless|Leg)(\S+)?( +\S+)? +(\S)+ +Shield/i, // Leg+ shield
                /(Mag)(\S+)?( +Mithril)? +Force +Shield/i, // Mag non-prefixed or Mithril-prefixed force shield
                // Power of Slaughter
                /(Peerless|Leg)(\S+)?( +\S+)? +Power.+(Slaughter)/i, // Leg+ power of slaughter
                /(Mag)(\S+)?( +Savage)? +Power.+(Slaughter)/i, // Mag non-prefixed or Savage-prefixed power of slaughter
                // Power/Plate of Protection
                /(Peerless|Leg)(\S+)?( +\S+)? +(Power|Plate).+(Protection)/i, // Leg+ power of protection
                // Shielding Plate
                /(Peerless|Leg)(\S+)? +Shielding +Plate/i, // Leg+ shielding plate
            ], 'darkred'
        ],
        [
            [   // Power of Slaughter
                /(Mag)(\S+)?( +\S+)? +Power.+(Slaughter)/i, // Mag prefixed power of slaughter
                /(Exq)(\S+)?( +Savage)? +Power.+(Slaughter)/i, // Exq non-prefixed or Savage-prefixed power of slaughter
            ], 'darkgreen'
        ],
        [
            [   // Rapier
                /(Peerless|Leg)(\S+)?( +\S+) +Rapier.+(Slaughter)/i, // Leg+ bad-prefixed rapier of slaughter
                // Shield
                /(Mag)(\S+)?( +\S+) +Force +Shield/i, // Mag prefixed force shield
                /(Mag)(\S+)?( +\S+) +((Kite|Tower) +Shield).+(Protection|Warding)/i, // Mag prefixed kite/tower shield of protection/warding
                /(Mag)(\S+)?( +\S+) +Buckler.+(Barrier|Nimble)/i, // Mag prefixed buckler of the barrier/nimble
                // Power
                /(Exq)(\S+)?( +\S+) +Power.+(Slaughter)/i, // Exq prefixed power of slaughter
            ], 'darkblue'
        ],
        [
            [   // Toys
                /(Exq)(\S+)? +(Ethereal|Hallowed) +Rapier.+(Slaughter)/i, // Exq good-prefixed rapier of slaughter
            ], 'purple'
        ],
        [
            [   // It's your turn to add patterns and color!
            ], '#00FFFF' // You can find other color codes using this website: http://www.colourlovers.com/palettes/search
        ],
    ]
}

/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

if(/&?\bst=[^0]/.test(href)) { throw 'exit' }

for(var i=0; i<blacklist.length; i++) { if(new RegExp('showtopic=' + blacklist[i] + '\\b').test(href)) { default_on = false } }

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var stockout = function(line) {
    var stockout_patterns = [
        /[\|\(\[【（:x@]\s*[-0x×\/]+(\D|$)/i,
        /(^|\D)[-0x×\/]+\s*[@×x:）】\]\)\|]/i,
        /\b0+\s*[x×]/i,
        /\(\/?\)/i,
        /\[\/?\]/i,
        /【\/?】/i,
        /（\/?）/i,
        /\bnot\s+available\b/i,
        /\bunavailable\b/i,
        /\bnone\b/i,
        /\[restocking\]/i,
        /\s+0\s*$/i,
    ]
    for(var i=0, len=stockout_patterns.length; i<len; i++) {
        if(stockout_patterns[i].test(line)) { return true }
    }
    return false
}

var get_text = function(e) {
    var s = e.innerHTML
    s = s.replace(/<strike>.*<\/strike>/g, '')
    s = s.replace(/<br\s*[^>]*>/g, '\n').replace(/<\/li>/g, '\n').replace(/<ul>/g, '\n').replace(/<\/blockquote>/g, '\n')
    s = s.replace(/<[^>]+>/g, '').replace(/\[(\w+)[^\]]*](.*?)\[\/\1]/g, '')
    s = s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    s = s.replace(/[ \t]+/g, ' ')
    return s
}
var out = ''

if(result_box_position == 'left') {
    var first_post = $('.post2')
    var posts = $$('.borderwrap')
    for(var i=0, len=posts.length; i<len; i++) {
        var poster = $(posts[i], '.bigusername')
        if((!poster) || (poster.textContent != $('.bigusername').textContent)) { continue } // skip threads that are not posted by the shop owner

        var lines = get_text($(posts[i], '.postcolor')).split('\n')
        var out = ''
        for(var j=0, len2=lines.length; j<len2; j++) {
            var line = lines[j].substring(0, max_length)
            if(stockout(line)) { continue }
            for(var k=0, len3=grep_patterns.length; k<len3; k++) {
                for(var m=0, len4=grep_patterns[k][0].length; m<len4; m++) {
                    if(grep_patterns[k][0][m].test(line)) { out = out + line + '\n'; break }
                }
            }
        }
        if(out) {
            var d = doc.createElement('DIV')
            d.className = 'result'
            d.style.cssText = 'background:rgba(237,235,223,1); color:#5C0D11'
            d.appendChild($(posts[i], '.postdetails').cloneNode(true))
            var pre = doc.createElement('PRE')
            pre.appendChild(doc.createTextNode(out))
            d.appendChild(pre)
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
}
else {
    var result_box = doc.createElement('DIV')
    result_box.id = 'result_box'
    var position = 'inherent'
    if(result_box_position == 'right') { position = 'fixed' }
    result_box.style.cssText = 'top:' + wnd.innerHeight/6 + 'px; right:0px; position:' + position + '; z-index:2147483647;'
    var posts = $$('.borderwrap')
    for(var i=0, len=posts.length; i<len; i++) {
        var poster = $(posts[i], '.bigusername')
        if((!poster) || (poster.textContent != $('.bigusername').textContent)) { continue } // skip threads that are not posted by the shop owner

        var lines = get_text($(posts[i], '.postcolor')).split('\n')
        var out = ''
        for(var j=0, len2=lines.length; j<len2; j++) {
            var line = lines[j].substring(0, max_length)
            if(stockout(line)) { continue }
            for(var k=0, len3=grep_patterns.length; k<len3; k++) {
                var grepped = false
                for(var m=0, len4=grep_patterns[k][0].length; m<len4; m++) {
                    if(grep_patterns[k][0][m].test(line)) {
                        grepped = true
                        out = out + line + '\n'
                        break
                    }
                }
                if(grepped) { break }
            }
        }
        if(out) {
            var d = doc.createElement('DIV')
            d.className = 'result'
            d.style.cssText = 'background:rgba(237,235,223,1); color:#5C0D11'
            d.appendChild($(posts[i], '.postdetails').cloneNode(true))
            var pre = doc.createElement('PRE')
            pre.appendChild(doc.createTextNode(out))
            d.appendChild(pre)
            result_box.appendChild(d)
        }
    }
    $('.postcolor').parentNode.insertBefore(result_box, $('.postcolor'))

    var toggle_result_box = function() {
        var result_box = $('#result_box')
        if(result_box.style.display != 'none') { result_box.style.display = 'none' } else { result_box.style.display = '' }
    }
    addEventListener('keydown', function(evt) { if((evt.target.tagName!='INPUT') && (evt.target.tagName!='TEXTAREA') && (evt.keyCode == hotkey)) { toggle_result_box() } }, false)
    if(!default_on) { toggle_result_box() }
}

// Highlights equipments and items
var posts = $$('.postcolor')
for(var i=posts.length-1; i>=0; i--) {
    var lnks = $$(posts[i], 'A')
    for(var j=lnks.length-1; j>=0; j--) {
        for (var k=0, len=grep_patterns.length; k<len; k++) {
            var highlighted = false
            for(var m=grep_patterns[k][0].length-1; m>=0; m--) {
                if(grep_patterns[k][0][m].test(lnks[j].text)) {
                    highlighted = true
                    var spans = lnks[j].querySelectorAll('span')
                    if(spans.length) {
                        for(var n=spans.length-1; n>=0; n--) {
                            (function(){
                                var text = spans[n].textContent
                                var node = doc.createTextNode(text)
                                spans[n].parentNode.replaceChild(node, spans[n])
                            }
                            )()
                        }
                    }
                    lnks[j].style.color = 'white'
                    lnks[j].style.backgroundColor = grep_patterns[k][1]
                    break
                }
            } if(highlighted) { break }
        }
    }
}
