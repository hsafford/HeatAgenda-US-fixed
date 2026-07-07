import * as Cmpnt from './Components.js'
import * as Parser from './JsonParser.js'

const ExploreContent = document.querySelector('main.ExploreContent')

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
        if(!c.classList.contains('PageTitle')){
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

    const back = document.createElement('button')
    back.classList.add('ExploreBackBtn')
    back.setAttribute('aria-label', 'Back')
    back.innerHTML = '&larr; Back'
    back.addEventListener('click', goBack)
    nav.append(back)

    const crumbs = document.createElement('div')
    crumbs.classList.add('ExploreBreadcrumb')

    const trail = []
    trail.push({label: 'All Pillars', target: 'root'})
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

function renderPrompt(){
    const prompt = document.createElement('p')
    prompt.classList.add('ExplorePrompt')
    if(!state.pillar){
        prompt.textContent = 'Choose a pillar to explore.'
    } else if(!state.recommendation){
        prompt.textContent = 'Choose a policy recommendation.'
    } else if(!state.policyType){
        prompt.textContent = 'Choose a policy type.'
    } else {
        prompt.textContent = 'Policy actions'
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

function makeGrid(values, onSelect){
    const grid = document.createElement('div')
    grid.classList.add('ExploreButtonGrid')
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
    return makeGrid(Parser.List.Pillars, pillar => {
        state.pillar = pillar
        render()
    })
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
