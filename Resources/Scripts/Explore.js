import * as Cmpnt from './Components.js'
import * as Parser from './JsonParser.js'

const ExploreContent = document.querySelector('main.ExploreContent')

const intro = document.createElement('p')
intro.classList.add('ExploreIntro')
intro.textContent = "There are lots of ways to address the escalating threat of extreme heat. Click through to explore different strategies – and specific policy solutions - that state and local leaders can put in place to achieve the Agenda's vision of Safe Homes, Safe Workplaces, Safe Schools and Childcare, and Safe Communities."
ExploreContent.append(intro)

const state = {
    pillar: null,
    recommendation: null,
    policyType: null
}

const TRANSITION_MS = 160

async function render(){
    const oldLevel = ExploreContent.querySelector('.ExploreLevel')
    if(oldLevel){
        oldLevel.classList.add('is-exiting')
        await new Promise(r => setTimeout(r, TRANSITION_MS))
    }

    if(state.pillar){
        ExploreContent.dataset.pillar = state.pillar
    } else {
        delete ExploreContent.dataset.pillar
    }

    Array.from(ExploreContent.children).forEach(c => {
        if(c.classList.contains('ExploreLevel') || c.classList.contains('ExploreNav')){
            c.remove()
        }
    })

    if(state.pillar){
        ExploreContent.append(renderNav())
    }

    const level = document.createElement('div')
    level.classList.add('ExploreLevel')
    level.append(renderPrompt())

    if(!state.pillar){
        level.append(renderPillarButtons())
        level.append(renderSearchSection())
    } else if(!state.recommendation){
        level.append(renderRecommendationButtons())
    } else if(!state.policyType){
        level.append(renderPolicyTypeButtons())
    } else {
        level.append(renderActions())
    }

    ExploreContent.append(level)
}

function renderNav(){
    const nav = document.createElement('div')
    nav.classList.add('ExploreNav')

    const crumbs = document.createElement('div')
    crumbs.classList.add('ExploreBreadcrumb')

    const trail = []
    trail.push({label: 'All Focus Areas', target: 'root'})
    if(state.pillar) trail.push({label: state.pillar, target: 'pillar'})
    if(state.recommendation) trail.push({label: state.recommendation, target: 'recommendation'})
    if(state.policyType) trail.push({label: state.policyType, target: 'policyType'})

    trail.forEach((crumb, i) => {
        if(i > 0){
            const sep = document.createElement('span')
            sep.classList.add('ExploreBreadcrumbSep')
            sep.textContent = '›'
            crumbs.append(sep)
        }
        if(i < trail.length - 1){
            const btn = document.createElement('button')
            btn.classList.add('ExploreBreadcrumbItem')
            btn.textContent = crumb.label
            btn.addEventListener('click', () => jumpTo(crumb.target))
            crumbs.append(btn)
        } else {
            const current = document.createElement('span')
            current.classList.add('ExploreBreadcrumbCurrent')
            current.textContent = crumb.label
            crumbs.append(current)
        }
    })

    nav.append(crumbs)
    return nav
}

function renderSearchSection(){
    const section = document.createElement('div')
    section.classList.add('ExploreSearchSection')

    const divider = document.createElement('div')
    divider.classList.add('ExploreSearchDivider')
    divider.innerHTML = '<span>or</span>'
    section.append(divider)

    const heading = document.createElement('p')
    heading.classList.add('ExploreSearchHeading')
    heading.textContent = 'Looking for something specific? Search directly.'
    section.append(heading)

    section.append(renderSearchBox())

    return section
}

const SEARCH_RESULTS_LIMIT = 20

function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function renderSearchBox(){
    const wrap = document.createElement('div')
    wrap.classList.add('ExploreSearchBox')

    const input = document.createElement('input')
    input.type = 'text'
    input.classList.add('ExploreSearchInput')
    input.placeholder = 'Search strategies, solutions, states, or cities… try "cooling" or "Georgia"'
    wrap.append(input)

    const results = document.createElement('ul')
    results.classList.add('ExploreSearchResults')
    wrap.append(results)

    let showAll = false

    function closeResults(){
        results.classList.remove('is-open')
        results.innerHTML = ''
        showAll = false
    }

    function renderResultItem(row){
        const li = document.createElement('li')
        li.classList.add('ExploreSearchResult')

        const caption = document.createElement('span')
        caption.classList.add('ExploreSearchResultCaption')
        caption.textContent = `${row.Pillar} › ${row.Recommendation} › ${row['Policy Type']}`

        const title = document.createElement('span')
        title.classList.add('ExploreSearchResultTitle')
        title.textContent = row['Policy Action']

        li.append(caption, title)

        const location = [
            row['State Link Title'] && `State: ${row['State Link Title']}`,
            row['Local Link Title'] && `Local: ${row['Local Link Title']}`
        ].filter(Boolean).join(' · ')
        if(location){
            const locationEl = document.createElement('span')
            locationEl.classList.add('ExploreSearchResultLocation')
            locationEl.textContent = location
            li.append(locationEl)
        }
        li.addEventListener('click', (e) => {
            e.stopPropagation()
            state.pillar = row.Pillar
            state.recommendation = row.Recommendation
            state.policyType = row['Policy Type']
            input.value = ''
            closeResults()
            render()
        })
        return li
    }

    function runSearch(){
        const query = input.value.trim()
        results.innerHTML = ''

        if(!query){
            results.classList.remove('is-open')
            return
        }

        const pattern = new RegExp('\\b' + escapeRegExp(query), 'i')
        const seen = new Set()
        const matches = []
        for(const row of Parser.Data.PolicyDataBase){
            const key = `${row.Pillar}|${row.Recommendation}|${row['Policy Type']}|${row['Policy Action']}`
            if(seen.has(key)) continue
            const haystack = `${row.Pillar} ${row.Recommendation} ${row['Policy Type']} ${row['Policy Action']} ${row.Description} ${row['State Link Title']} ${row['Local Link Title']}`
            if(pattern.test(haystack)){
                seen.add(key)
                matches.push(row)
            }
        }

        if(matches.length === 0){
            const li = document.createElement('li')
            li.classList.add('ExploreSearchEmpty')
            li.textContent = 'No matches found.'
            results.append(li)
        } else {
            const visible = showAll ? matches : matches.slice(0, SEARCH_RESULTS_LIMIT)
            visible.forEach(row => results.append(renderResultItem(row)))

            if(!showAll && matches.length > SEARCH_RESULTS_LIMIT){
                const more = document.createElement('li')
                more.classList.add('ExploreSearchShowMore')
                more.textContent = `Show all ${matches.length} results`
                more.addEventListener('click', (e) => {
                    e.stopPropagation()
                    showAll = true
                    runSearch()
                })
                results.append(more)
            }
        }

        results.classList.add('is-open')
    }

    input.addEventListener('input', () => {
        showAll = false
        runSearch()
    })

    document.addEventListener('click', (e) => {
        if(!wrap.contains(e.target)) closeResults()
    })

    return wrap
}

function renderPrompt(){
    const prompt = document.createElement('p')
    prompt.classList.add('ExplorePrompt')
    if(!state.pillar){
        prompt.textContent = 'Choose a focus area to explore.'
    } else if(!state.recommendation){
        prompt.textContent = 'Choose an objective.'
    } else if(!state.policyType){
        prompt.textContent = 'Choose a strategy.'
    } else {
        prompt.textContent = 'Policy solutions'
    }
    return prompt
}

function goBack(){
    if(state.policyType) state.policyType = null
    else if(state.recommendation) state.recommendation = null
    else if(state.pillar) state.pillar = null
    render()
}

function jumpTo(target){
    if(target === 'root'){
        state.pillar = null; state.recommendation = null; state.policyType = null
    } else if(target === 'pillar'){
        state.recommendation = null; state.policyType = null
    } else if(target === 'recommendation'){
        state.policyType = null
    }
    render()
}

function bestColumnsFor(n){
    if(n <= 3) return n
    if(n === 4) return 4
    if(n === 5) return 3
    if(n === 6) return 3
    if(n === 7) return 4
    if(n === 8) return 4
    if(n === 9) return 3
    return 4
}

function makeGrid(values, onSelect){
    const grid = document.createElement('div')
    grid.classList.add('ExploreButtonGrid')
    grid.style.setProperty('--cols', bestColumnsFor(values.length))
    values.forEach((value, i) => {
        const btn = document.createElement('button')
        btn.classList.add('ExploreDrillBtn')
        btn.style.setProperty('--i', i)
        btn.textContent = value
        btn.addEventListener('click', () => onSelect(value))
        grid.append(btn)
    })
    return grid
}

function renderPillarButtons(){
    const grid = document.createElement('div')
    grid.classList.add('ExploreButtonGrid', 'ExploreButtonGrid--pillars')
    Parser.List.Pillars.forEach((pillar, i) => {
        const btn = document.createElement('button')
        btn.classList.add('ExploreDrillBtn', 'ExploreDrillBtn--pillar')
        btn.dataset.pillar = pillar
        btn.style.setProperty('--i', i)
        btn.textContent = pillar
        btn.addEventListener('click', () => {
            state.pillar = pillar
            render()
        })
        grid.append(btn)
    })
    return grid
}

function renderRecommendationButtons(){
    const recs = Parser.getAssociated(Parser.Data.PolicyDataBase, 'Pillar', state.pillar, 'Recommendation')
    return makeGrid(recs, rec => {
        state.recommendation = rec
        render()
    })
}

function renderPolicyTypeButtons(){
    const filtered = Parser.Data.PolicyDataBase.filter(r =>
        r.Pillar === state.pillar &&
        r.Recommendation === state.recommendation
    )
    const types = Parser.getUnique(filtered, 'Policy Type')
    return makeGrid(types, type => {
        state.policyType = type
        render()
    })
}

function renderActions(){
    const filtered = Parser.Data.PolicyDataBase.filter(r =>
        r.Pillar === state.pillar &&
        r.Recommendation === state.recommendation &&
        r['Policy Type'] === state.policyType
    )
    const actions = Parser.getUnique(filtered, 'Policy Action')

    const list = document.createElement('ul')
    list.classList.add('ExploreActionList', 'gridList')
    actions.forEach(action => {
        const card = Cmpnt.ActionCard({Action: action, DataControl: state.policyType})
        list.append(card)
    })
    return list
}

render()
