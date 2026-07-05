
import PolicyDataBase from '../JSON/PolicyDataBase-062626.json' with { type: 'json' }
import Descriptions from '../JSON/Descriptions-062626.json' with { type: 'json' }
import CaseStudies from '../JSON/CaseStudies-063026.json' with { type: 'json' }
import PullQuotes from '../JSON/PullQuotes-070526.json' with { type: 'json' }
import Signitories from '..JSON/Signitories.json' with { type: 'json' }

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
    return getUnique(Filtered, AssociatedKey)
}

export function pullAllOf(JSON, Key, value){
    return JSON.filter(item => item[Key] === value)
}

export function MatchDescription(Name){
    const Item = Descriptions.find(item => item.Name === Name)
    return Item.Description
}

const Pillars = getUnique(PolicyDataBase, 'Pillar');
const Recommendations = getUnique(PolicyDataBase, 'Recommendation');
const PolicyTypes = getUnique(PolicyDataBase, 'Policy Type');
const PolicyActions = getUnique(PolicyDataBase, 'Policy Action');

export const Data = { PolicyDataBase, Descriptions, CaseStudies, PullQuotes }
export const List = {Pillars, Recommendations, PolicyTypes, PolicyActions }
