
import PolicyDataBase from '../JSON/PolicyDataBase-062626.json' with { type: 'json' }
import Descriptions from '../JSON/Descriptions-062626.json' with { type: 'json' }
import CaseStudies from '../JSON/CaseStudies-063026.json' with { type: 'json' }
import PullQuotes from '../JSON/PullQuotes-070526.json' with { type: 'json' }
import Signitories from '../JSON/Signitories.json' with { type: 'json' }

import * as Cmpnt from './Components.js'

export function getUnique(JSON, Key){
    let UniqueValues = []
    for(let i=0; i<JSON.length; i++){
        if(!UniqueValues.includes(JSON[i][Key])){UniqueValues.push(JSON[i][Key])}
    }
    return UniqueValues
};

export function getAssociated(JSON, NameKey, Name, AssociatedKey){
    const Filtered = JSON.filter(item => item[NameKey] === Name)

    if(AssociatedKey){
        return getUnique(Filtered, AssociatedKey)
    }
    if(!AssociatedKey){
        return Filtered
    }

}

export function pullAllOf(JSON, Key, value){
    return JSON.filter(item => item[Key] === value)
}

export function MatchDescription(Name){
    const Item = Descriptions.find(item => item.Name === Name)
    return Item.Description
}

export function parseListString(ListString){
    if(ListString && ListString !== '#'){
        return ListString.split(',')
    }
}

export function parseUrlList(rawString){
    if(!rawString || rawString === '#') return null

    const parts = rawString.split(',').map(p => p.trim()).filter(Boolean)
    if(parts.length === 0) return null

    const urls = []
    parts.forEach(part => {
        if(part.startsWith('http') || urls.length === 0){
            urls.push(part)
        } else {
            urls[urls.length - 1] += ',' + part
        }
    })
    return urls
}

const US_STATE_NAMES = new Set([
    'alabama','alaska','arizona','arkansas','california','colorado','connecticut','delaware',
    'florida','georgia','hawaii','idaho','illinois','indiana','iowa','kansas','kentucky',
    'louisiana','maine','maryland','massachusetts','michigan','minnesota','mississippi',
    'missouri','montana','nebraska','nevada','new hampshire','new jersey','new mexico',
    'new york','new york state','north carolina','north dakota','ohio','oklahoma','oregon',
    'pennsylvania','rhode island','south carolina','south dakota','tennessee','texas','utah',
    'vermont','virginia','washington','west virginia','wisconsin','wyoming',
    'district of columbia','washington d.c.','washington dc','d.c.','d.c','dc','national'
])

const US_STATE_ABBR = new Set([
    'al','ak','az','ar','ca','co','ct','de','fl','ga','hi','id','il','in','ia','ks','ky',
    'la','me','md','ma','mi','mn','ms','mo','mt','ne','nv','nh','nj','nm','ny','nc','nd',
    'oh','ok','or','pa','ri','sc','sd','tn','tx','ut','vt','va','wa','wv','wi','wy'
])

function splitRespectingParens(text){
    const parts = []
    let depth = 0
    let current = ''
    for(const char of text){
        if(char === '('){ depth++; current += char }
        else if(char === ')'){ depth = Math.max(0, depth - 1); current += char }
        else if(char === ',' && depth === 0){ parts.push(current); current = '' }
        else { current += char }
    }
    if(current.trim()) parts.push(current)
    return parts
}

function normalizeForStateCheck(token){
    return token
        .replace(/\s*\([^)]*\)\s*$/, '')
        .replace(/[.\s]+$/, '')
        .trim()
        .toLowerCase()
}

function looksLikeState(token){
    const normalized = normalizeForStateCheck(token)
    if(US_STATE_NAMES.has(normalized) || US_STATE_ABBR.has(normalized)) return true
    for(const state of US_STATE_NAMES){
        if(normalized.startsWith(state + '.') || normalized.startsWith(state + ' ')) return true
    }
    return false
}

export function parsePlaceList(rawString){
    if(!rawString || rawString === '#') return null

    const tokens = splitRespectingParens(rawString).map(t => t.trim()).filter(Boolean)
    if(tokens.length === 0) return null

    const grouped = []
    let i = 0
    while(i < tokens.length){
        const current = tokens[i]
        const next = tokens[i + 1]
        if(next && looksLikeState(next)){
            grouped.push(`${current}, ${next}`)
            i += 2
        } else {
            grouped.push(current)
            i += 1
        }
    }
    return grouped
}

function normalizeForCompare(text){
    return (text || '')
        .replace(/\bStates?:?\b/gi, '')
        .replace(/\bLocals?:?\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^[,\s]+|[,\s]+$/g, '')
}

export function getDescriptionNote(row){
    const description = (row.Description || '').trim()
    if(!description) return ''

    const extraLength = normalizeForCompare(description).length
        - normalizeForCompare(row['State Link Title']).length
        - normalizeForCompare(row['Local Link Title']).length

    return extraLength > 10 ? description : ''
}

const Pillars = getUnique(PolicyDataBase, 'Pillar');
const Recommendations = getUnique(PolicyDataBase, 'Recommendation');
const PolicyTypes = getUnique(PolicyDataBase, 'Policy Type');
const PolicyActions = getUnique(PolicyDataBase, 'Policy Action');

export const Data = { PolicyDataBase, Descriptions, CaseStudies, PullQuotes, Signitories }
export const List = {Pillars, Recommendations, PolicyTypes, PolicyActions }
