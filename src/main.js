// creates a card as a string, `a` is a card and `id` is the index of the card
var tpl = function(a, id){var out='<div class="card-parent column is-4"><div class="card is-fullwidth"><header class="card-header"><p class="card-header-title">'+a.name+' ';if(a.abbrs.length===1){out+='('+a.abbrs[0]+')';}else if(a.abbrs.length>1){out+='(';var arr1=a.abbrs;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+=value;if(index+1 !== a.abbrs.length){out+=', ';}} } out+=')';}out+='</p></header><div class="card-content"><div class="content">'+a.desc+'<ul>';for(var key in a.ressources){out+='<li><a href="'+(a.ressources[key] )+'">'+key+'</a></li>';}out+='</ul></div></div><footer class="card-footer"><a class="card-footer-item related" data-id="'+id+'">See related</a><a class="card-footer-item">Suggest changes</a></footer></div></div>';return out;}
var input = document.getElementById('input')  // search input
var lang  = document.getElementById('lang')   // lang select
var main  = document.getElementById('main')   // card list
var data  = {}                                // data loaded from json
var defaultLang = 'en-US'
var langs = {
    'en-US': 'English',
    'fr-FR': 'French',
}

// give life to all "See related" buttons
function activateRelated() {
    var list = main.getElementsByClassName('related')
    for (var i = 0; i < list.length; i++) {
        list[i].addEventListener('click', function (e) {
            e.preventDefault()
            input.value = 'related: ' + e.target.dataset.id
            update()
        })
    }
}

// add a card to main
function insert(id, l) {
    l = data[l].hasOwnProperty(id) ? l : defaultLang
    main.insertAdjacentHTML('beforeend', tpl(data[l][id], id))
}

// add a lang to select
function insertLang(display, value) {
    lang.insertAdjacentHTML(
        'beforeend',
        '<option value="'+value+'">'+display+'</option>'
    )
}

// whether a query and a specific lang matches a term id
function matchLang(query, lang, id) {
    var q = query.toLowerCase()
    var card = data[lang][id]

    if (id.toLowerCase().indexOf(q) !== -1 ||
        card.name.toLowerCase().indexOf(q) !== -1 ||
        card.desc.toLowerCase().indexOf(q) !== -1) {
        return true
    }

    for (var i in card.abbrs) {
        if (card.abbrs[i].toLowerCase().indexOf(q) !== -1) { return true }
    }

    return false
}

// whether a query and a lang matches a term id
// checks against english and other lang if specified
function match(query, lang, id) {
    if (matchLang(query, defaultLang, id)) { return true }
    if (lang === defaultLang || !data[lang].hasOwnProperty(id)) { return false }
    return matchLang(query, lang, id)
}

// cleans up main and fills it up again
function update() {
    var q = input.value
    var l = lang.value

    // clean main
    while(main.firstChild) { main.removeChild(main.firstChild); }

    // if we look for terms related to one we know
    if (q.startsWith('related:') && data[defaultLang].hasOwnProperty(q.substring(8).trim())) {
        var related = data[defaultLang][q.substring(8).trim()].related
        for (var id in data[defaultLang]) {
            if (related.indexOf(id) !== -1) {
                insert(id, l)
            }
        }
    } else {  // standard search
        for (var id in data[defaultLang]) {
            if (match(q, l, id)) {
                insert(id, l)
            }
        }
    }

    activateRelated()
}

// get all GET parameters
function getParams() {
    var res = {}
    var params = location.search.substr(1).split('&')

    for (var value; value = params.pop();) {
        var tmp = value.split('=')
        res[tmp[0]] = decodeURIComponent(tmp[1])
    }

    return res
}

// what we run on boot
function init() {
    // add event listeners on the search input and the lang select
    input.addEventListener('input', update)
    lang.addEventListener('change', update)

    // load the GET parameters
    var params = getParams()
    if (params.hasOwnProperty('q')) { input.value = params.q }
    if (params.hasOwnProperty('l') && Object.keys(langs).indexOf(params.l) !== -1) {
        lang.value = params.l
    }

    // GET req on data/*.json
    // add the langs to the select
    for (var i in langs) {
        var req = new XMLHttpRequest()
        req.open('GET', 'data/' + i + '.json')
        req.onload = function (i) {
            if (this.status === 200) {
                insertLang(langs[i], i)
                data[i] = JSON.parse(this.response)
                update()
            }
        }.bind(req, i)
        req.send()
    }
}

init()
