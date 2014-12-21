// ==UserScript==
// @name            E-Hentai Grep
// @description     Searches forum posts for lines that match given string patterns
// @include         http://forums.e-hentai.org/index.php?*showtopic=*
// ==/UserScript==

/*** Settings ***/
var default_on = true
var hotkey = 71 // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
var max_length = 60
var display_title_and_poster = false
var remove_stockout_line = true
var remove_strike_through_line = true
var remove_quoted_text = true
if(typeof result_box_position == 'undefined') {
    var result_box_position = 'center' // where to show the result box ("left", "center" or "right")
}
var blacklist = [
    '22234', // Ask the Experts
    '163637', // The Shared Free Shop
]
if(typeof grep_patterns == 'undefined') {
    var grep_patterns = [ // Add [[pattern_1, pattern_2, ... , pattern_n], color] to the array by yourself.
        [ // Items
            [
                // Bindings
                /binding.*(slaughter|nimble|balance)/i,
                /^\s*(slaughter|nimble|balance)/i,
                // Graded materials
                /mid.*grade.*metal/i,
                /high.*grade.*(metal|cloth)/i,
                /scrap.*(wood|metal|cloth)/i,
                // Shard
                /\b(shards?|voidseeker|aether|amnesia|featherweight)/i,
                // Artifact
                /\bartifacts?/i,
                // ED
                /\benergy\b/i,
                // Happy Pills
                /\bpills\b/i,
                // Battle items
                /\bscrolls?/i, /\binfusions?/i, /\bvase\b/i, /\bbubble\b/i, /\belixir\b/i,
                // Trophy
                /\b(troph|manbearpig|antioch|mithra|dalek|lock|costume|hinamatsuri|broken|sapling|shirt|unicorn|noodl)/i,
            ], 'yellow'
        ],
        [ // Equipments
            [   // Rapier 1: Leg+ prefixed rapier of slaughter
                /(Peerless|Leg)(\S+)? +(\S+) +Rapier.*Slaughter/i,
                // Rapier 2: Mag good-prefixed rapier of slaughter
                /(Mag)(\S+)? +(Ethereal|Hallowed|Demonic) +Rapier.*Slaughter/i,
                // Rapier 3: ST-Ru
                /(Peerless|Leg|Mag|Ex)(\S+)? +(Ethereal|Astral|Hallowed) +Rapier.*Battlecaster/i,
                // Shield 1: Leg+ force shield
                /(Peerless|Leg)(\S+)?.*Force +Shield/i,
                // Shield 2: Mag force shield with good prefix & suffix
                /(Mag)(\S+)? +(Mithril|Zircon|Onyx|Ruby) +Force +Shield.*(Protection|Warding|Dampening)/i,
                // Shield 3: Mag force shield without prefix & with good suffix
                /(Mag)(\S+)? +Force +Shield.*(Protection|Warding|Dampening)/i,
                // Power of Slaughter: Mag+ power of slaughter
                /(Peerless|Leg|Mag)(\S+)?( +\S+)? +Power.*Slaughter/i,
            ], 'darkred'
        ],
        [
            [   // Toys
                /(Peerless|Leg)(\S+)? +(Shielding|Mithril|Zircon|Onyx|Ruby) +Plate +(Cuirass|Greaves) +of +Protection/i, // Leg+ good plate
                /(Peerless|Leg|Mag)(\S+)? +Agile +(Leather|Kevlar).*Protection/i, // Mag+ agile leather xxx of protection
                /(Peerless|Leg|Mag|Ex)(\S+)? +Frugal +Cotton.*Protection/i, // Ex+ frugal cotton xxx of protection

                // Obsolete stuff
                /\b(Flimsy|Fine)/i, // quality
                /\w \b(Gold|Silver|Bronze|Diamond|Emerald|Prism|Platinum|Steel|Titanium|Iron)/i, // prefix
                /(trimmed|adorned|tipped)\b/i, // prefix amendment
                /\b(Flimsy|Crude|Fair|Av|Fine|Sup|Ex|Mag|Leg|Peerless)([eqn][a-zA-Z]+)? +([a-zA-z]+)$/i, // suffix-less equip
                /\b(Flimsy|Crude|Fair|Av|Fine|Sup|Ex|Mag|Leg|Peerless)([eqn][a-zA-Z]+)? +([a-zA-z]+)$/i, // suffix-less equip
                /\b(Flimsy|Crude|Fair|Av|Fine|Sup|Ex|Mag|Leg|Peerless)([eqn][a-zA-Z]+)? +([^o][a-zA-z]+) +([a-zA-z]+)$/i, // suffix-less equip
                /\b(Flimsy|Crude|Fair|Av|Fine|Sup|Ex|Mag|Leg|Peerless)([eqn][a-zA-Z]+)? +([^o][a-zA-z]+) +([^o][a-zA-z]+) +([a-zA-z]+)$/i, // suffix-less equip
                /\b(Flimsy|Crude|Fair|Av|Fine|Sup|Ex|Mag|Leg|Peerless)([eqn][a-zA-Z]+)? +.*\b(Ox|Raccoon|Cheetah|Turtle|Fox|Owl)/i, // suffix
                /\b(Flimsy|Crude|Fair|Av|Fine|Sup|Ex|Mag|Leg|Peerless)([eqn][a-zA-Z]+)? +.*\bAstral/i, // elemental prefix
                /\b(Flimsy|Crude|Fair|Av|Fine|Sup|Ex|Mag|Leg|Peerless)([eqn][a-zA-Z]+)? +.*\b(Chucks|Ebony|Scythe|Dagger)/i, // weapon
                /\b(Flimsy|Crude|Fair|Av|Fine|Sup|Ex|Mag|Leg|Peerless)([eqn][a-zA-Z]+)? +.*\b(Silk|Hide)/i, // armor
                /\b(Flimsy|Crude|Fair|Av|Fine|Sup|Ex|Mag|Leg|Peerless)([eqn][a-zA-Z]+)? +Shield +/i, // shield armor
                /\b(Flimsy|Crude|Fair|Av|Fine|Sup|Ex|Mag|Leg|Peerless)([eqn][a-zA-Z]+)? +.*\b(Hulk|Aura|Priestess|Stone-Skinned)/i, // armor suffix
                /\b(Flimsy|Crude|Fair|Av|Fine|Sup|Ex|Mag|Leg|Peerless)([eqn][a-zA-Z]+)? +.*\b(Fire-eater|Frost-born|Thunder-child|Wind-waker|Thrice-blessed|Spirit-ward)/i, // armor suffix
                /\b(Chainmail|Coif|Mitons|Hauberk|Chausses)/i, // heavy
                /\b(Kevlar|Gossamer|Tower)/i, // light, cloth, shield
            ], 'darkgreen'
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
    if(!remove_stockout_line) { return false }
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
    if(remove_quoted_text){
        var paras = $$(e, '.quotemain')
        for(var i=paras.length-1; i>=0; i--) { paras[i].parentNode.removeChild(paras[i]) }
        var paras = $$(e, '.quotetop')
        for(var i=paras.length-1; i>=0; i--) { paras[i].parentNode.removeChild(paras[i]) }
    }
    var s = e.innerHTML
    if(remove_strike_through_line) { s = s.replace(/<strike>.*?<\/strike>/g, '') }
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
        console.log(lines)
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
            if(display_title_and_poster && (/#1/.test($(posts[i], '.postdetails').textContent))) {
                var shop_title = $$('.maintitle>table>tbody>tr>td>div')[0].textContent
                out = '[Title]\t' + shop_title.substring(0, max_length) + '\n' + '[Poster] ' + poster.textContent.substring(0, max_length)+ '\n\n' + out
            }
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
        console.log(lines)
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
            if(display_title_and_poster && (/#1/.test($(posts[i], '.postdetails').textContent))) {
                var shop_title = $$('.maintitle>table>tbody>tr>td>div')[0].textContent
                out = '[Title]\t' + shop_title.substring(0, max_length) + '\n' + '[Poster] ' + poster.textContent.substring(0, max_length)+ '\n\n' + out
            }
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
