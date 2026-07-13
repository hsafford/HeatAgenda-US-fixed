import * as Parser from './JsonParser.js'

export const container =({
  classes=[],
  datasets=[]
}={})=>{
    const container = document.createElement('div')
    container.classList.add('Container')

    if(classes && Array.isArray(classes) && classes.length > 0){
        container.classList.add(...classes)
    }

    if(datasets && Array.isArray(datasets) && datasets.length > 0){
       datasets.forEach(([key, value]) => {
            container.dataset[key] = value;
        });
    }

    return container
}

const navItem =(name, href, active=false)=>{
    const item = document.createElement('a');
    item.classList.add('navItem')
    if(document.title == name){
        item.classList.add('navItemActive')
    }
    item.textContent = name;
    item.href = href;
    return item;
}

const navButton =(name, href)=>{
    const navBtn = document.createElement('a')
    navBtn.classList.add('navBtn')
    navBtn.textContent = name
    navBtn.href = href
    navBtn.target = '_blank'
    navBtn.rel = 'noopener'
    return navBtn
}

const navToggle =()=>{
    const navToggle = document.createElement('label')
    navToggle.classList.add('navToggle')

    const navToggleInput = document.createElement('input')
    navToggleInput.classList.add('hiddenInput')
    navToggleInput.type = 'checkbox'
    navToggle.name = 'navToggle'
    
    navToggle.append(navToggleInput)
    return navToggle
}

const navBar =(items=[])=>{
    const navbar = document.createElement('nav');
    navbar.classList.add('navbar')
    const navItems = container({
        classes:['FlexContainer', 'FlexRow']
    })
    navItems.classList.add('navItems')
    items.forEach(item => {
        const newNavItem = navItem(item.name, item.href)
        navItems.appendChild(newNavItem);
    })

    navbar.append(navItems)

    return navbar;
}

const HeaderInfo=()=>{
    const HeaderInfo =document.createElement('div')
    HeaderInfo.classList.add('HeaderInfo', 'Container',  'FlexContainer', 'ContainerGap-Mini')

    HeaderInfo.innerHTML = `
        <a class="LogoLink" href="https://fas.org" target="_blank" rel="noopener" aria-label="Federation of American Scientists">
            <img class="Logo Logo-Desktop" src="./Resources/Assets/Graphics/FAS-Logo-Primary-Blue.svg"/>
            <img class="Logo Logo-Mobile" src="./Resources/Assets/Graphics/FAS-Logo-Secondary-Blue.svg"/>
        </a>
        <h1 class="site-title">Heat Policy Agenda</h1>
    `
    return HeaderInfo
}

const PageTitle=(Name)=>{
    const PageTitleContainer = container({classes:['PageTitle']})
    PageTitleContainer.dataset.pagename = Name
    const PageTitle = document.createElement('h1')
    PageTitle.textContent = Name


    PageTitleContainer.appendChild(PageTitle)
    return PageTitleContainer

}

export function ProcessHeader(){
    const header = document.querySelector('header');
    const headerMain = document.createElement('div')
    headerMain.classList.add('headerMain')
    headerMain.append(
        HeaderInfo(),
        navButton('Sign The Agenda', 'https://forms.gle/Y6ZPdVvURpHEfUaQ8')
    )

    const nav = navBar([
        { name: 'The Agenda', href: './index.html' },
        { name: 'Implementation Guide', href: './explore.html' },
        { name: 'State Explorer', href: './map.html' }
    ])

    header.append(headerMain, nav)

    const main = document.querySelector('main')
    if(main){
      main.prepend(PageTitle(header.dataset.pagename))
    }

}

export function ProcessFooter(){
    const footer = document.querySelector('footer');
    
    const FASInfo = document.createElement('p')
    FASInfo.textContent = 'Federation of American Scientists © 2026'
    footer.appendChild(FASInfo)

    const Attribution = document.createElement('p')
    Attribution.textContent = 'Designed & Built by Harrison Jude'
    footer.appendChild(Attribution)
}

export function CheckGroup({ name='name', value='value', taxonomy='taxonomy', checked = true, level=1}={}){
    const CheckGroup = document.createElement('div');
    CheckGroup.className = 'CheckGroup';
    CheckGroup.classList.add(`CheckGroupL${level}`);
    CheckGroup.dataset.taxonomy = taxonomy;
    CheckGroup.dataset.name = name;
    CheckGroup.dataset.checklevel = level;

    if(taxonomy = 'Pillar'){
        CheckGroup.dataset.pillar = value
    }

    const CheckGroupHead = document.createElement('div');

    CheckGroupHead.className = 'CheckGroupHead';
    CheckGroup.appendChild(CheckGroupHead);

    const label = document.createElement('label');
    CheckGroupHead.appendChild(label);
    label.innerHTML = name;

    let input = document.createElement('input');
    input.type = 'checkbox';
    input.name = name;
    input.value = value;
    input.checked = checked;
    input.classList.add('filterValue', 'hiddenInput');
    label.append(input);

    return CheckGroup;
}

export function CheckNested(ParentCheckGroup){
    const CheckNested = document.createElement('div');
    CheckNested.className = 'CheckNested';
    ParentCheckGroup.appendChild(CheckNested);

    const CheckGroupHead = ParentCheckGroup.querySelector(':scope > .CheckGroupHead');
    
    const toggleElement = document.createElement('input')
    toggleElement.type = "checkbox"
    toggleElement.classList.add('visToggle', 'hiddenInput')


    const toggleLabel = document.createElement('label');
    toggleLabel.classList.add('visToggleLabel')
    toggleLabel.prepend(toggleElement)



    CheckGroupHead.append(toggleLabel)

    return CheckNested;
}

export function ActionCard({Action="Action", DataControl="NA"}={}){
    const ActionItemData = Parser.getAssociated(Parser.Data.PolicyDataBase, 'Policy Action', Action)[0]

    const ActionCard = document.createElement('li');
    ActionCard.classList.add('ActionCard', 'TaxonomyItem')
    ActionCard.dataset.controller = DataControl;
    ActionCard.dataset.pillar = ActionItemData.Pillar

    const Lever = document.createElement('p')
    Lever.textContent = ActionItemData['Policy Lever']
    Lever.classList.add('PolicyLeverFlag')

    const Title = document.createElement('p');
    Title.textContent = Action;

    const children = [Lever, Title]

    const note = Parser.getDescriptionNote(ActionItemData)
    if(note){
        children.push(ActionCardNote(note))
    }

    ActionCard.append(...children, ActionCardExamples(ActionItemData));

    return ActionCard;
}

const ActionCardNote = (note) => {
    const wrap = document.createElement('div')
    wrap.classList.add('ActionCardNote')

    const label = document.createElement('p')
    label.classList.add('ActionCardNoteLabel')
    label.textContent = 'Note'
    wrap.append(label)

    const text = document.createElement('p')
    text.classList.add('ActionCardNoteText')
    text.textContent = note
    wrap.append(text)

    return wrap
}


function getActionExampleLinks(ActionItemData, type){
    const wrapper = document.createElement('div')
    wrapper.classList.add('ActionExamplesList')
    wrapper.dataset.type = type

    const LinkTitles = type === 'Local'
        ? Parser.parsePlaceList(ActionItemData[`${type} Link Title`])
        : Parser.parseListString(ActionItemData[`${type} Link Title`])
    if(!LinkTitles) return wrapper

    const label = document.createElement('div')
    label.classList.add('ActionExamplesLabel')
    label.textContent = type
    wrapper.append(label)

    const URLS = Parser.parseUrlList(ActionItemData[`${type} Link URL`]) || []
    const pairs = LinkTitles.map((Title, i) => ({
        title: Title.trim(),
        url: URLS[i] || (URLS.length === 1 ? URLS[0] : '#')
    }))
    pairs.sort((a, b) => a.title.localeCompare(b.title, undefined, {sensitivity: 'base'}))

    const list = document.createElement('ul')
    list.classList.add('ActionExamplesLinks')
    pairs.forEach(({title, url}) => {
        const li = document.createElement('li')
        const ExampleLink = document.createElement('a')
        ExampleLink.target = '_blank'
        ExampleLink.rel = 'noopener'
        ExampleLink.innerText = title
        ExampleLink.href = url
        li.append(ExampleLink)
        list.append(li)
    })
    wrapper.append(list)

    return wrapper
}

const ActionCardExamples =(ActionItemData)=>{
    const ExamplesContainer = container({classes:['ActionExamples']})

    ExamplesContainer.innerHTML = `
        <p>Policy in action</p>
    `

    const hasState = Boolean(Parser.parseListString(ActionItemData['State Link Title']))
    const hasLocal = Boolean(Parser.parseListString(ActionItemData['Local Link Title']))

    if(!hasState && !hasLocal){
        const none = document.createElement('p')
        none.classList.add('ActionExamplesNone')
        none.textContent = 'Not applicable'
        ExamplesContainer.append(none)
        return ExamplesContainer
    }

    const Local = getActionExampleLinks(ActionItemData, "Local")
    const State = getActionExampleLinks(ActionItemData, "State")

    ExamplesContainer.append(State, Local)

    return ExamplesContainer
}

export const StateBox =({State=null, Abbreviation=null, Pos=null}={} )=>{
  const label = document.createElement('label')
  label.classList.add('stateBox')
  label.dataset.abbreviation = Abbreviation
  label.dataset.state = State

  if(Pos && typeof Pos == 'object'){
    label.style.gridColumnStart = typeof Pos[0] == 'number' ? Pos[0] : ''
    typeof Pos[1] == 'number' ? label.style.setProperty('--RowStart', Pos[1]) : ''
  }

  const input = document.createElement('input')
  input.type = 'radio'
  input.name = 'state'
  input.value = State
  input.classList.add('filterValue')

  label.append(input)

  return label
}

export const ExpandRule =({Direction='Left', Expanded=false}={})=>{
    let RuleLabel = document.createElement('label')
    RuleLabel.classList.add(`Flag${Direction}`)

    let RuleInput = document.createElement('input')
    RuleInput.type = 'checkbox'
    RuleInput.checked = Expanded
    RuleInput.classList.add('hiddenInput')

    let RuleFlag = document.createElement('span')
    RuleFlag.classList.add('RuleFlag')

    RuleLabel.append(RuleInput)
    RuleLabel.append(RuleFlag)
    return RuleLabel
}

export const ExpandRuleBox =()=>{
    let ExpandRuleBox = document.createElement('div')
    ExpandRuleBox.classList.add("ExpandRuleBox")

    const RuleToggle = ExpandRule()

    let ContentArea = document.createElement('div')
    ContentArea.classList.add('ContentArea')
    ExpandRuleBox.append(RuleToggle)
    ExpandRuleBox.append(ContentArea)

    return ExpandRuleBox
}

export function addContent(Container, Content){
    let ContentArea = Container.querySelector(":scope > .ContentArea")
    if(!ContentArea){throw new Error("ContentArea not found")}

    ContentArea.appendChild(Content)   
}

const pill =()=>{
    const pill = document.createElement("li")
    pill.classList.add("pill")

    return pill
}

export const pillBox =()=>{
    const pillBox = document.createElement('ul')
    pillBox.classList.add('pillBox')
    return pillBox
}

export const locationPill =({State=null, Local=null}={})=>{
    const newPill = pill()

    if(State){
        const StateText = document.createElement('span')
        StateText.textContent = State
        newPill.appendChild(StateText)
        newPill.dataset.state = State
    }
    if(Local){
        const LocalText = document.createElement('span')
        LocalText.textContent = Local
        newPill.appendChild(LocalText)
        newPill.dataset.local = Local
    }
    return newPill
}

const caseStudyItemTaxonomyItem = ({ TaxonomyName = "Taxonomy", Value = "Value" } = {}) => {
    const item = document.createElement('span');
    item.classList.add('TaxonomyItem');
    item.dataset.taxonomy = TaxonomyName
    item.innerHTML = `<p>${Value}</p>`
    return item;
};

const US_STATE_ABBR = {
    'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
    'Colorado':'CO','Connecticut':'CT','Delaware':'DE','District of Columbia':'DC',
    'D.C.':'DC','Florida':'FL','Georgia':'GA','Hawaii':'HI','Idaho':'ID',
    'Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS','Kentucky':'KY',
    'Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA','Michigan':'MI',
    'Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT','Nebraska':'NE',
    'Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY',
    'North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK','Oregon':'OR',
    'Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD',
    'Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT','Virginia':'VA',
    'Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY'
}
function stateAbbrev(name){
    if(!name) return ''
    const trimmed = name.trim()
    return US_STATE_ABBR[trimmed] || trimmed
}

export const caseStudyItem =({
    Title="Title",
    LocationPills=[],
    DescriptionText="Description",
    Sources=[],
    Pillar="Pillar",
    Recc="Policy Recommendation",
    PType="Policy Type"
}={})=>{

    const CaseStudyItem = document.createElement('li')
    CaseStudyItem.classList.add('CaseStudyItem')
    CaseStudyItem.dataset.pillar = Pillar

    const CaseStudyInfo = document.createElement('div')
    CaseStudyInfo.classList.add('CaseStudyInfo')

    const Flag = document.createElement('div')
    Flag.classList.add('CaseStudyFlag')
    const stateNames = LocationPills
        .map(pill => pill?.dataset?.state)
        .filter(Boolean)
    const primaryState = stateNames[0] || null
    const otherStates = stateNames.slice(1)
    const StateNode = document.createElement('span')
    StateNode.classList.add('CaseStudyFlag-State')
    StateNode.textContent = primaryState || '—'
    StateNode.dataset.defaultState = primaryState || ''
    const ArrowNode = document.createElement('span')
    ArrowNode.classList.add('CaseStudyFlag-Arrow')
    ArrowNode.setAttribute('aria-hidden', 'true')
    ArrowNode.textContent = '→'
    const PillarNode = document.createElement('span')
    PillarNode.classList.add('CaseStudyFlag-Pillar')
    PillarNode.textContent = Pillar
    Flag.append(StateNode, ArrowNode, PillarNode)

    const CaseStudyTitle = document.createElement('h4')
    CaseStudyTitle.classList.add('CaseStudyTitle')
    CaseStudyTitle.textContent = Title

    const Taxonomy = document.createElement('div')
    Taxonomy.classList.add('CaseStudyTaxonomy');
    const ReccNode = document.createElement('span')
    ReccNode.classList.add('CaseStudyTaxonomy-Recc')
    ReccNode.textContent = Recc
    const TaxonomyArrow = document.createElement('span')
    TaxonomyArrow.classList.add('CaseStudyTaxonomy-Arrow')
    TaxonomyArrow.setAttribute('aria-hidden', 'true')
    TaxonomyArrow.textContent = '→'
    const PTypeNode = document.createElement('span')
    PTypeNode.classList.add('CaseStudyTaxonomy-PType')
    PTypeNode.textContent = PType
    Taxonomy.append(ReccNode, TaxonomyArrow, PTypeNode)

    const MoreInfo = document.createElement('div')
    MoreInfo.classList.add('MoreInfo')

    const Description = document.createElement('p')
    Description.classList.add('CaseStudyDescription')
    Description.textContent = DescriptionText
    MoreInfo.append(Description)

    const SourcesList = document.createElement('div')
    SourcesList.classList.add('Sources')
    if(Sources.length){
        const SourcesTitle = document.createElement('div')
        SourcesTitle.classList.add('SourcesLabel')
        SourcesTitle.textContent = 'Sources'
        SourcesList.append(SourcesTitle)
        const list = document.createElement('ul')
        list.classList.add('SourcesLinks')
        Sources.forEach(source => {
            const li = document.createElement('li')
            const a = document.createElement('a')
            a.textContent = source.Title
            a.href = source.Url
            a.target = '_blank'
            a.rel = 'noopener'
            li.append(a)
            list.append(li)
        })
        SourcesList.append(list)
    }

    CaseStudyInfo.append(Flag, CaseStudyTitle, Taxonomy, MoreInfo, SourcesList)

    if(otherStates.length){
        const AlsoIn = document.createElement('div')
        AlsoIn.classList.add('CaseStudyAlsoIn')
        const label = document.createElement('span')
        label.classList.add('CaseStudyAlsoIn-Label')
        label.textContent = 'Also in:'
        AlsoIn.append(label, ' ', otherStates.map(stateAbbrev).join(', '))
        CaseStudyInfo.append(AlsoIn)
    }
    CaseStudyItem.append(CaseStudyInfo)
    return CaseStudyItem
}

const DrillDownFilterMenuItem = (value)=>{
    const MenuItem = document.createElement('button')
    MenuItem.value = value;
    MenuItem.textContent = value
    MenuItem.classList.add("DrillDownFilterMenuItem")
    return MenuItem
}

const DrillDownFilterMenuSection = ({Taxonomy=null, level=1}={}) => {
    const Section = document.createElement('div')
    Section.classList.add('DrillDownFilterMenuSection')
    Section.dataset.taxonomy = Taxonomy
    Section.dataset.level = level
    Section.dataset.pillar = null;

    return Section
}

const DrillDownFilterMenu = (TaxonomyList) => {
    const FilterMenu = document.createElement('div')
    FilterMenu.classList.add('DrillDownFilterMenu')

    TaxonomyList.forEach((taxonomy,i) => {
        const level = i+1
        let Section = DrillDownFilterMenuSection({Taxonomy:taxonomy, level:level})
        if(level === 1){
            populateMenuSection({
                MenuSection:Section,
                Taxonomy:taxonomy
            })
        }

        FilterMenu.append(Section)
    })



    return FilterMenu
}

function populateMenuSection({
    MenuSection=null,
    Dataset=Parser.Data.PolicyDataBase,
    ParentTaxonomy=null,
    ParentValue=null,
    Taxonomy=null,
    Value=null
}={}){

    let values

    if(!ParentTaxonomy || !ParentValue){
        values = Parser.getUnique(Dataset, Taxonomy)
    }

    if(ParentTaxonomy && ParentValue){
        values = Parser.getAssociated(Dataset, ParentTaxonomy, ParentValue, Taxonomy)

        const Pillar = Parser.getAssociated(Parser.Data.PolicyDataBase, ParentTaxonomy, ParentValue, "Pillar")
        MenuSection.dataset.pillar = Pillar
    }

    values.forEach((value)=>{
        const MenuItem = DrillDownFilterMenuItem(value)
        MenuSection.append(MenuItem)
    })

    MenuSection.classList.toggle('ActiveSection', true)
}

function hideMenuSection(MenuSection){
    if(MenuSection){
        MenuSection.innerHTML = ''
        MenuSection.classList.toggle('ActiveSection', false)
        MenuSection.dataset.pillar = null
    }
}

const DrillDownFilterNavItem =({Name, Taxonomy, Level=1}={})=>{
    const NavItem = document.createElement('button')
    NavItem.classList.add('DrillDownFilterNavItem')
    NavItem.value = Name
    NavItem.dataset.level = Level
    NavItem.dataset.taxonomy = Taxonomy
    NavItem.innerHTML = Name

    return NavItem
}

const DrillDownFilterResetBtn =()=>{
    const ResetBtn = document.createElement('button')
    ResetBtn.classList.add('DrillDownFilterResetBtn')
    return ResetBtn
}

function addDrillDownFilterNavItem({DrillDownFilter, NewItemName, Taxonomy, Level}={}){

    const filterNav = DrillDownFilter.querySelector('.DrillDownFilterNav')
    const newNavItem = DrillDownFilterNavItem({Name:NewItemName, Taxonomy:Taxonomy, Level:Level})
    if(Taxonomy == "Pillar"){
        filterNav.dataset.pillar = NewItemName
    }

    filterNav.append(newNavItem)
}

export function processDrillDownFilter({
    FilterContainer=null,
    Dataset=Parser.Data.PolicyDataBase,
    TaxonomyList=["Pillar", "Recommendation", "Policy Type"],
    ContentContainer = null
}={}){

    FilterContainer.dataset.activelevel = 1;

    const FilterNav = document.createElement('div')
    FilterNav.classList.add('DrillDownFilterNav')
    FilterNav.append(DrillDownFilterResetBtn())

    const FilterMenu = DrillDownFilterMenu(TaxonomyList)

    FilterContainer.appendChild(FilterNav)
    FilterContainer.appendChild(FilterMenu)
    FilterContainer.addEventListener('click', (e)=>{drillDownFilterClickHandler(e, ContentContainer)})
}

function drillDownFilterClickHandler(e, ContentContainer){

    if(e.target.classList.contains('DrillDownFilterMenuItem')){
        DrillDownFilterDrillDown(e)
    }
    if(e.target.classList.contains('DrillDownFilterNavItem')){
        DrillDownFilterDrillUp(e)
    }
    if(e.target.classList.contains('DrillDownFilterResetBtn')){
        ResetFilter(e)
    }    
}

function DrillDownFilterDrillDown(e){
    const Menu = e.target.closest('.DrillDownFilterMenu')
    const CurrentValue = e.target.value
    const CurrentMenuSection = e.target.closest('.DrillDownFilterMenuSection')
    const DrillDownFilter = e.target.closest('.DrillDownFilter')
    const FilterNav = DrillDownFilter.querySelector('.DrillDownFilterNav')
    const CurrentTaxonomy = CurrentMenuSection.dataset.taxonomy
    const CurrentLevel = parseInt(DrillDownFilter.dataset.activelevel)
    const NewLevel = CurrentLevel+1

    DrillDownFilter.dataset.activelevel = NewLevel

    hideMenuSection(CurrentMenuSection)
    
    const NextMenuSection = Menu.querySelector(`.DrillDownFilterMenuSection[data-level="${NewLevel}"]`)
    if(NextMenuSection){
        const NewTaxonomy = NextMenuSection.dataset.taxonomy
        populateMenuSection({
            MenuSection:NextMenuSection,
            ParentTaxonomy:CurrentTaxonomy,
            ParentValue:CurrentValue,
            Taxonomy:NewTaxonomy
        })
    }


    addDrillDownFilterNavItem({DrillDownFilter:DrillDownFilter, NewItemName:CurrentValue, Taxonomy:CurrentTaxonomy, Level:NewLevel})
    toggleDrillDownFilterNav(DrillDownFilter)
}

function DrillDownFilterDrillUp(e){
    const DrillDownFilter = e.target.closest('.DrillDownFilter')
    const Nav = e.target.closest('.DrillDownFilterNav')

    const CurrentLevel = parseInt(DrillDownFilter.dataset.activelevel)
    const NewLevel = parseInt(e.target.dataset.level)
    if(CurrentLevel === NewLevel) return
    
    if(CurrentLevel !== NewLevel){
        DrillDownFilter.dataset.activelevel = NewLevel
        const CurrentMenuSection = DrillDownFilter.querySelector(`.DrillDownFilterMenuSection[data-level="${CurrentLevel}"]`)
        const NewMenuSection = DrillDownFilter.querySelector(`.DrillDownFilterMenuSection[data-level="${NewLevel}"]`)
        const CurrentValue = e.target.value
        const CurrentTaxonomy = e.target.dataset.taxonomy
        const NewTaxonomy = NewMenuSection.dataset.taxonomy

        const NavItems = DrillDownFilter.querySelectorAll('.DrillDownFilterNav>.DrillDownFilterNavItem');
        NavItems.forEach((NavItem)=>{
            if(NavItem.dataset.level > NewLevel){NavItem.remove()}
        })

        hideMenuSection(CurrentMenuSection)

        populateMenuSection({
            MenuSection:NewMenuSection,
            ParentTaxonomy:CurrentTaxonomy,
            ParentValue:CurrentValue,
            Taxonomy:NewTaxonomy
        })
    }    
}

function toggleDrillDownFilterNav(DrillDownFilter){
    const ActiveLevel = DrillDownFilter.dataset.activelevel;
    const ShowNav = ActiveLevel > 1

    DrillDownFilter.classList.toggle('ShowNav', ShowNav)
}

function ResetFilter(e){
    const DrillDownFilter = e.target.closest('.DrillDownFilter')
    const CurrentLevel = DrillDownFilter.dataset.activelevel
    const FilterNav = DrillDownFilter.querySelector('.DrillDownFilterNav')
    const InitialMenuSection = DrillDownFilter.querySelector(`.DrillDownFilterMenuSection[data-level="${1}"]`)
    const CurrentMenuSection = DrillDownFilter.querySelector(`.DrillDownFilterMenuSection[data-level="${CurrentLevel}"]`)
    const FilterNavItems = FilterNav.querySelectorAll('.DrillDownFilterNavItem')
    FilterNavItems.forEach((NavItem)=>{NavItem.remove()})

    hideMenuSection(CurrentMenuSection)
    populateMenuSection({
        MenuSection:InitialMenuSection,
        Taxonomy:InitialMenuSection.dataset.taxonomy
    })
    DrillDownFilter.dataset.activelevel = 1
    toggleDrillDownFilterNav(DrillDownFilter)
}

export const ExploreElement =(Pillar)=>{
    const ExploreElement = container({
        classes:['ExploreElement'],
        datasets:[['pillar', Pillar]]
    })

    const PillarHead = ExplorePillarHead(Pillar)


    const ReccSection = ExploreTaxonomySection({ParentTaxonomy:'Pillar', Pillar:Pillar, Taxonomy:'Recommendation'})
    const PTypeSection = ExploreTaxonomySection({ParentTaxonomy:'Recommendation', Pillar:Pillar, Taxonomy:'Policy Type'})

    PTypeSection.append(ActionsGroup(Pillar))
    ReccSection.append(PTypeSection)
    PillarHead.append(ReccSection)
    ExploreElement.append(PillarHead)
    ExploreElement.addEventListener('click', ExploreClickHandler)
    return ExploreElement
}

const ActionsGroup =(pillar)=>{
    const TaxonomySection = container({classes:['TaxonomySection']})
    const TaxItems = document.createElement('ul')
    TaxItems.classList.add("gridList", 'TaxItems')
    const Actions = Parser.getAssociated(Parser.Data.PolicyDataBase, 'Pillar', pillar, 'Policy Action')
    Actions.forEach((Action)=>{
        const AssociatedPType = Parser.getAssociated(Parser.Data.PolicyDataBase, 'Policy Action', Action, 'Policy Type')

        const Card = ActionCard({
            Action:Action,
            DataControl:AssociatedPType
        })

        TaxItems.append(Card)
    })

    TaxonomySection.append(TaxItems)
    return TaxonomySection
}

const ExploreTaxonomySection =({
    Pillar,
    Taxonomy,
    ParentTaxonomy
}={})=>{
    const Section = container({
        classes:['TaxonomySection'],
        datasets:[['taxonomy',Taxonomy]]
    })

    const TaxItems = container({
        classes:["TaxItems"]
    })

    const SectionToggle = document.createElement('button')
    SectionToggle.classList.add('ExploreSectionToggle')

    const SectionContent = container({
        classes:["ExploreSectionContent"]
    })
    const TaxGroup = Parser.getAssociated(Parser.Data.PolicyDataBase, 'Pillar', Pillar, Taxonomy)

    TaxGroup.forEach((TaxValue)=>{
        SectionContent.append(
            ExploreTaxonomyItem({ParentTaxonomy:ParentTaxonomy, Taxonomy:Taxonomy, Value:TaxValue})
        )
    })
    TaxItems.append(SectionToggle, SectionContent)

    Section.append(TaxItems)
    return Section
}

const ExplorePillarHead =(Pillar)=>{
    const PillarHead = container({
        classes:['ExplorePillarHead', 'TaxonomySection'],
        datasets:[['pillar', Pillar], ['taxonomyvalue',Pillar]]
    })
    const Description = Parser.MatchDescription(Pillar)

    PillarHead.innerHTML=`
            <div class="TaxItems">
                <button class="ExploreSectionToggle"></button>
                <label class="Info">
                    <h2>${Pillar}</h2>
                    <p class="bodyLarge">${Description}</p>
                    <input type="radio" name="Pillar"></input>
                </label>
                <span class="ImageBlock"></span>
            </div>
    `

    return PillarHead
}

const ExploreTaxonomyItem =({ParentTaxonomy, Taxonomy, Value}={})=>{
    const Label = document.createElement('label')
    Label.classList.add('TaxonomyItem')
    Label.dataset.controller = Parser.getAssociated(Parser.Data.PolicyDataBase, Taxonomy, Value, ParentTaxonomy)
    const radio = document.createElement('input')
    radio.type = "radio"
    radio.name = Taxonomy
    radio.value = Value
    radio.classList.add('TaxRadioInput')
    const Title = document.createElement('h4')
    Title.textContent = Value
    const Description = document.createElement('p')
    Description.textContent = Parser.MatchDescription(Value)

    Label.append(Title, Description, radio)


    return Label
}

export function ExploreClickHandler(e){
    if(e.target.classList.contains('ExploreSectionToggle')){
        ResetTaxonomySection(e)
    }
    if(e.target.classList.contains('TaxRadioInput')){
        SetChildrenVis(e)
    }
}
function ResetTaxonomySection(e){
    const btn = e.target
    const taxSection = btn.closest('.TaxonomySection')
    const radios = taxSection.querySelectorAll('input')
    radios.forEach((radio)=>{radio.checked = false})
}
function SetChildrenVis(e){
    const value = e.target.value
    const section = e.target.closest('.TaxonomySection')
    const children = section.querySelectorAll(':scope>.TaxonomySection>.TaxItems .TaxonomyItem')
    children.forEach((child)=>{
        const displayValue = child.dataset.controller === value ? '' : 'none'
        child.style.display = displayValue
    })
}

export const statBlock =(value, description)=>{
    const statBlock = document.createElement('div')
    statBlock.classList.add('statBlock')

    statBlock.innerHTML = `
    <p class="statNum">${value}</p>
    <p class="statTxt">${description}</p>
    `
    return statBlock
}

