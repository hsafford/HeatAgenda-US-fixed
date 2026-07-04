import * as Cmpnt from './Components.js'
import * as Parser from './JsonParser.js'

const ExploreContent = document.querySelector('main.ExploreContent')

Parser.List.Pillars.forEach((pillar)=>{
    const pillarSection = Cmpnt.ExploreElement(pillar)
    

    ExploreContent.append(pillarSection)
})
