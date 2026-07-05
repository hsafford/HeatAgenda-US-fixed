import * as Parser from './JsonParser.js'
import * as Cmpnt from './Components.js'

const PillarIntros = {
    "Safe Homes":`
        <p>Home is where families raise children, work, spend time with and care for loved ones, and relax. Yet <a href="https://www.census.gov/library/stories/2025/09/heat-risks-cooling-problems.html" target="blank">13 million households</a> report being too hot at home and at least <a href="https://powerlines.org/wp-content/uploads/2025/04/PowerLines_Utility-Bills-Are-Rising_2025-1.pdf" target="blank">80 million people</a> struggle to pay their electricity bills today. A cool home is the best strategy to keep people from getting sick.<p>
    `,
    "Safe Workplaces":`
        <p>Every year, an estimated <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12498468/" target="blank">28,000 workers</a> are injured on the job during high heat days, and <a hred="https://www.dol.gov/newsroom/releases/osha/osha20230727" target="blank">dozens</a> lose their lives. Workplace heat protections are both a moral imperative and a common-sense win-win: they <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12498468/" target="blank">prevent injuries and deaths</a>, reduce <a href="https://www.wcrinet.org/reports/impact-of-californias-heat-standard-on-workers-compensation-outcomes" target="blank">workers’ compensation claims</a>, decrease <a href="https://equitablegrowth.org/wp-content/uploads/2020/12/122120-turnover-costs-ib.pdf" target="blank">employee turnover</a>, and even <a href="https://equitablegrowth.org/wp-content/uploads/2020/12/122120-turnover-costs-ib.pdf" target="blank>increase productivity</a>, boosting bottom lines.</p>
    `,
    "Safe Schools and Childcare":`
        <p>Heat <a href="https://fas.org/publication/extreme-heat-childrens-health/" target="blank">harms</a> our children’s health, development, activity, mood, sleep, and ability to focus. Yet <a href="https://www.gao.gov/products/gao-20-494" target="blank">1 in 3 schools</a> don’t have adequate cooling and <a href="https://www.liifund.org/app/uploads/2025/04/Building-Child-Care-Resiliency-in-the-Face-of-a-Changing-Climate-April-2025.pdf" target="blank>45% of childcare facilities</a> have been physically or financially strained by extreme weather. Kids deserve safe, cool spaces to learn and play.</p>
    `,
    "Safe Communities":`
        <p>Dangerous heat is <a href="https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.washingtonpost.com/weather/2026/03/12/record-heat-west-drought-california-utah-arizona/&ved=2ahUKEwjwpvyJyKSTAxWjtokEHbNUCsYQFnoECDoQAQ&usg=AOvVaw2NbgNFBa-q6un7wAErLN_D" target="blank">happening earlier in the year</a> and <a href="https://www.nature.com/articles/s41561-025-01737-w" target="blank">lasting longer</a>, while <a href="https://www.climatecentral.org/climate-matters/fastest-warming-seasons-2025" target="blank">average temperatures across seasons</a> are on the rise, affecting everything from snowpack to crops. Recognizing our new heat reality and preparing accordingly <a href="https://www.phoenix.gov/newsroom/heat-news/city-of-phoenix-unveils-robust-2026-heat-response-plan.html" target="blank">prevents deaths</a> and avoids <a href="https://insidelines.pjm.com/maintaining-grid-reliability-through-highest-peaks-in-a-decade/" target="blank">infrastructure failures</a> and <a href="https://www.dallasfed.org/research/swe/2023/swe2309" target="blank">economic losses, while creating places where people want to build their lives and families.</p>
    `
}

const ReccOverviews = {
    "Safe Homes":[
        "To protect every family",
        "from dangerous heat at home, policymakers should:"
    ],
    "Safe Workplaces":[
        "To protect every worker",
        "from dangerous heat on the job, policymakers should:"
    ],
    "Safe Schools and Childcare":[
        "To protect every child",
        "from dangerous heat at school and childcare, policymakers should:"
    ],
    "Safe Communities":[
        "To help every community",
        "get heat-safe, policymakers should:"
    ]
}

const PillarStats = {
    
}

const PillarTitleCard =(Pillar)=>{
    
}

const ReccsGroup =(Pillar)=>{
    const ReccsGroup = Cmpnt.container({classes:["ReccsGroup"]})
    const ReccOverview = ReccOverviews[Pillar]
    ReccsGroup.innerHTML = `
        <p class="bodyLarge ReccsGroupIntro"><strong>${ReccOverview[0]} </strong><br>${ReccOverview[1]}</p>
    `
    const ReccsList = document.createElement('ul')
    ReccsList.classList.add('ReccsList', 'gridList')

    const Reccs = Parser.getAssociated(Parser.Data.PolicyDataBase, "Pillar", Pillar, 'Recommendation')
    Reccs.forEach((Recc)=>{
        const ReccDescription = Parser.MatchDescription(Recc)
        const ReccItem = document.createElement('li')
        ReccItem.innerHTML = `
            <h3>${Recc}</h3>
            <p>${ReccDescription}</p>
        `

        ReccsList.append(ReccItem)
    })

    ReccsGroup.append(ReccsList)

    return ReccsGroup
}

const PillarsOverview = document.querySelector("#PillarsOverview")

Parser.List.Pillars.forEach(pillar => {
    const PillarSection = Cmpnt.container({
        classes:["PillarGroup"],
        datasets:[['pillar', pillar]]
    })

    const PillarTitleCard = Cmpnt.container({
        classes:['PillarTitleCard']
    })

    const PillarTitleWords = pillar.split(' ')
    const PillarTitleLineBreak = PillarTitleWords.join('<br>')
    PillarTitleCard.innerHTML = `
        <h2>${PillarTitleLineBreak}</h2>
        <span class="ImageBlock"></span>
    `

    const Description = document.createElement('span')
    Description.classList.add('Description', 'bodyLarge')
    Description.innerHTML = PillarIntros[pillar]

    PillarSection.append(
        PillarTitleCard,
        Description,
        ReccsGroup(pillar)
    )

    PillarsOverview.append(PillarSection)
})
