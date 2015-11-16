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
    '169987',
    '170830',
]
if(typeof grep_patterns == 'undefined') {
    var grep_patterns = [ // Add [[pattern_1, pattern_2, ... , pattern_n], 'color'] to the array by yourself.
        [ // Items
            [
                // Rare materials
                /(\b|x)phazon/i,
                // Bindings for staff
                ///(\b|x)binding.*(slaughter|destruction|focus|friendship|heimdall|fenrir|heaven-sent|demon-fiend|curse-weaver|earth-walker|fox|owl)/i,
                ///^\s*(slaughter|destruction|focus|friendship|heimdall|fenrir|heaven-sent|demon-fiend|curse-weaver|earth-walker|fox|owl)/i,
                // Bindings for armor
                /(\b|x)binding.*(destruction|balance|focus|protection|warding|fleet|negation|heimdall|dampening|cheetah|raccoon|fox|owl|heaven-sent)/i,
                /^\s*(destruction|balance|focus|protection|warding|fleet|negation|heimdall|dampening|cheetah|raccoon|fox|owl|heaven-sent)/i,
                // Graded materials
                /(\b|x)(low|mid|high).*grade.*(cloth|wood)/i,
                /(\b|x)(lg|mg|hg).?(cloth|wood)/i,
                /(\b|x)scrap.*(cloth|wood).*@/i,
                /(\b|x)scrap.*(cloth|wood).*\d *c\b/i,
                /(\b|x)scrap.*(cloth|wood).*\b\d{2}\b/i,
                // Catalysts
                /(\b|x)catalyst/i,
                // ED & artifact
                /(\b|x)(energy|drink|(artifact|artefact)).*[@0]/i,
                /(\b|x)(energy|drink|(artifact|artefact)).*\d *k\b/i,
                /(\b|x)(energy|drink|(artifact|artefact)).* *[\d,]+/i,
                // Shards
                /(\b|x)amnesia/i,
                // Potions
                /(\b|x)(health|last).*elixir/i,
                /(\b|x)(mana|spirit).*(potion|elixir)/i,
                /(\b|x)spirit.*draught/i,
                // Infusions and Scrolls
                /(\b|x)(infusion|(scroll of))/i,
                // Trophies
                /(\b|x)noodl/i,
                ///\b(troph|manbearpig|antioch|mithra|dalek|lock|costume|hinamatsuri|broken|sapling|shirt|unicorn|noodl)/i,
                // Monster Foods
                /(\b|x)(crystal|chow|edible|cuisine|pill)/i,
                // Misc
                /(\b|x)(vase|bubble)/i,
            ], 'purple', ''
        ],
        [ // Holy Gear
            [
                /(Peer|Leg).*(Hallowed|Astral).*Katalox.*(Destruction|Heimdall|Heaven-sent)/i,
                /(Peer|Leg).*(Hallowed|Astral).*Oak.*Heimdall/i,
                /(Peer|Leg).*Radiant.*Heimdall/i,
            ], 'darkred', ''
        ],
        [ // Cotton
            [
                /Peer.*(Charged|Frugal).*Cotton.*(Heaven-sent|Elementalist|Curse-weaver)/i,
                /Leg.*Frugal.*(Cotton|Gossamer).*(Heaven-sent|Elementalist|Curse-weaver)/i,
            ], 'darkgreen', ''
        ],
        [ // Toys
            [
                /Leg.*Dagger/i,
                /(Peer|Leg).*Hallowed.*Waki.*(Battlecaster|Nimble)/i,
                /(Peer|Leg).*Buckler.*(Barrier|Battlecaster)/i,
            ], 'darkblue', ''
        ],
    ]
}

/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

if(!/&?\bst=[^0]/.test(href)) {
    for(var i=0; i<blacklist.length; i++) { if(new RegExp('showtopic=' + blacklist[i] + '\\b').test(href)) { default_on = false } }

    var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
    var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

    var stockout = function(line) {
        if(!remove_stockout_line) { return false }
        var stockout_patterns = [
            /[\|\(\[【（:x@]\s*[-0x×\/]+(\D|$)/i,
            // /(^|\D)[-0x×\/]+\s*[@×x:）】\]\)\|]/i,
            /(^|\D)[-0×\/]+\s*[@×:）】\]\)\|]/i,
            /(^|[^,])\b0+\s*[x×]/i,
            /\(\/?\)/i,
            /\[\/?\]/i,
            /【\/?】/i,
            /（\/?）/i,
            /\bnot\s+available\b/i,
            /\bunavailable\b/i,
            /\bnone\b/i,
            /\[restocking\]/i,
            /(^|\s+)0+\s+/i,
            /out of stock/i,
            /This post has been edited by/i,
        ]
        for(var i=0, len=stockout_patterns.length; i<len; i++) {
            if(stockout_patterns[i].test(line)) { return true }
        }
        return false
    }

    var get_text = function(e) {
        var s = e.innerHTML
        s = s.replace(/<!--.*?-->/gi, '')
        if(remove_quoted_text){
            s = s.replace(/<div [^>].*class=.quotetop.>.*?<\/div>/gi, '')
            s = s.replace(/<div [^>].*class=.quotemain.>.*?<\/div>/gi, '')
        }
        if(remove_strike_through_line) { s = s.replace(/<strike>.*?<\/strike>/g, '') }
        s = s.replace(/<br\s*[^>]*>/g, '\n').replace(/<\/li>/g, '\n').replace(/<ul>/g, '\n').replace(/<\/?blockquote>/g, '\n')
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
            //console.log(lines)
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
                //d.appendChild($(posts[i], '.postdetails').cloneNode(true))
                var anchor = doc.createElement('A')
                anchor.text = $(posts[i], '.postdetails').textContent
                anchor.href = href.replace(loc.hash, '') + '#' + $(posts[i], '*[id^="post-main-"]').id
                d.appendChild(anchor)
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
            //console.log(lines)
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
                //d.appendChild($(posts[i], '.postdetails').cloneNode(true))
                var anchor = doc.createElement('A')
                anchor.text = $(posts[i], '.postdetails').textContent
                anchor.href = href.replace(loc.hash, '') + '#' + $(posts[i], '*[id^="post-main-"]').id
                d.appendChild(anchor)
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
                        if(grep_patterns[k][2] != '') { lnks[j].style.cssText = grep_patterns[k][2] }

                        break
                    }
                } if(highlighted) { break }
            }
        }
    }
}
