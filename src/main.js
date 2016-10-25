// creates a card as a string, `it` is a card and `id` is the index of the card
var tpl = function(it, id){var out='<div class="card-parent column is-4"><div class="card is-fullwidth"><header class="card-header"><p class="card-header-title">'+(it.name)+' ';if(it.abbrs.length===1){out+='('+(it.abbrs[0])+')'}else if(it.abbrs.length>1){out+='(';var arr1=it.abbrs;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+=''+(value);if(index+1!==it.abbrs.length){out+=', '}}}out+=')'}out+='</p></header><div class="card-content"><div class="content">'+(it.desc)+'<ul>';for(var i in it.ressources){out+='<li><a href="'+(it.ressources[i])+'">'+(i)+'</a></li>'}out+='</ul></div></div><footer class="card-footer"><a class="card-footer-item related" data-id="'+(id)+'">See related</a><a class="card-footer-item">Suggest changes</a></footer></div></div>';return out}
var input = document.getElementById('input')  // search input
var lang  = document.getElementById('lang')   // lang select
var main  = document.getElementById('main')   // card list
var data  = []                                // data loaded from json
var relations = null                          // used when listing relations

// does an array include a value?
function includes(value, arr) {
    for (var i in arr) {
        if (value === arr[i]) {
            return true
        }
    }
    return false
}

// give life to all "See related" buttons
function activateRelated() {
    var list = main.getElementsByClassName('related')
    for (var i = 0; i < list.length; i++) {
        list[i].addEventListener('click', function (e) {
            e.preventDefault()
            input.value = 'related: ' + data[e.target.dataset.id][l].name
            input.dispatchEvent(new Event('input'))
        })
    }
}

// check if a card matches a specific lang
// tests name, desc and every abbrs
function checkLang(query, lang, card) {
    var q = query.toLowerCase()
    if (card[lang].name.toLowerCase().indexOf(q) !== -1 ||
        card[lang].desc.toLowerCase().indexOf(q) !== -1) {
        return true
    }

    for (var i in card[lang].abbrs) {
        if (card[lang].abbrs[i].toLowerCase().indexOf(q) !== -1) { return true }
    }

    return false
}

// check if a card matches english or the specified lang if it exists
function match(query, lang, card) {
    if (checkLang(query, 'en', card)) { return true }
    if (lang === 'en' || !card.hasOwnProperty(lang)) { return false }
    return checkLang(query, lang, card)
}

// used when input starts with "related:"
// matches the cards which are related to the on specified in the input
function matchRelations(query, lang, card) {
    if (relations === null) {  // on first card, list relations
        relations = []  // so that if query doesn't match anything, we don't try every time
        for (var i in data) {
            if (data[i].hasOwnProperty(lang) && data[i][lang].name === query) {
                relations = data[i].relations
                break
            }
        }
    }

    return includes(card.en.name, relations)
}

// add a card to main
function insert(index, l) {
    main.insertAdjacentHTML(
        'beforeend',
        tpl(data[index][data[index].hasOwnProperty(l) ? l : 'en'], index)
    )
}

// remove everything from main and add it again
function update(e) {
    var query = input.value
    var l = lang.value
    var m = null

    // clean main
    while(main.firstChild) { main.removeChild(main.firstChild); }

    if (query.startsWith('related:')) {
        query = query.substring(8).trim()
        m = matchRelations
    } else {
        m = match
    }

    // add all cards to main
    for (var i in data) {
        if (m(query, l, data[i])) { insert(i, l) }
    }
    relations = null

    activateRelated()
}

// list available langs
function getLangs() {
    var res = []
    for (var i = 0; i < lang.options.length; i++) {
        res.push(lang.options[i].value)
    }
    return res
}

// get all GET parameters
function getParams() {
    var res = {}
    var params = location.search.substr(1).split('&')
    var tmp = []

    for (var value; value = params.pop();) {
        tmp = value.split('=')
        res[tmp[0]] = decodeURIComponent(tmp[1])
    }

    return res
}

// put the GET parameters in the search input and the lang select
function loadParams() {
    var params = getParams()
    if (params.hasOwnProperty('q')) { input.value = params.q }
    if (params.hasOwnProperty('l') && getLangs().indexOf(params.l) !== -1) {
        lang.value = params.l
    }
}

// GET req on data.json
function loadData() {
    var req = new XMLHttpRequest()
    req.open('GET', 'data.json', true)

    req.onload = function() {
      if (this.status == 200) {
        data = JSON.parse(this.response)
        input.addEventListener('input', update)
        lang.addEventListener('change', update)
        loadParams()
        input.dispatchEvent(new Event('input'))
      }
    }

    req.send()
}

loadData()
