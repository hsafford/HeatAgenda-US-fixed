import * as Parser from './JsonParser.js'

const navItem =(name, href)=>{
    const item = document.createElement('a');
    item.textContent = name;
    item.href = href;
    return item;
}

const navBar =(items=[])=>{
    const navbar = document.createElement('nav');
    items.forEach(item => {
        const newNavItem = navItem(item.name, item.href)
        navbar.appendChild(newNavItem);
    });

    return navbar;
}

export function ProcessHeader(){
    const header = document.querySelector('header');

    header.append(navBar([
        { name: 'The Agenda', href: './index.html' },
        { name: 'Explore', href: './explore.html' },
        { name: 'Database', href: './database.html' },
        { name: 'Policy in Action', href: './map.html' }
    ]));
}

export function ProcessFooter(){
    const footer = document.querySelector('footer');
    
    const FASInfo = document.createElement('p')
    FASInfo.textContent = 'Footer content goes here.'
    footer.appendChild(FASInfo)

    const Attribution = document.createElement('p')
    Attribution.textContent = 'Attribution content goes here.'
    footer.appendChild(Attribution)
}

export function CheckGroup({ name='name', value='value', taxonomy='taxonomy', checked = true, level=1}={}){
    const CheckGroup = document.createElement('div');
    CheckGroup.className = 'CheckGroup';
    CheckGroup.classList.add(`CheckGroupL${level}`);
    CheckGroup.dataset.taxonomy = taxonomy;
    CheckGroup.dataset.name = name;
    CheckGroup.dataset.checklevel = level;

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
    input.classList.add('filterValue');
    label.prepend(input);

    return CheckGroup;
}

export function CheckNested(ParentCheckGroup){
    const CheckNested = document.createElement('div');
    CheckNested.className = 'CheckNested';
    ParentCheckGroup.appendChild(CheckNested);

    const CheckGroupHead = ParentCheckGroup.querySelector(':scope > .CheckGroupHead');
    
    const toggleElement = document.createElement('input')
    toggleElement.type = "checkbox"
    toggleElement.classList.add('visToggle')


    const toggleLabel = document.createElement('label');
    toggleLabel.classList.add('visToggleLabel')
    toggleLabel.prepend(toggleElement)

    CheckGroupHead.appendChild(toggleLabel)

    return CheckNested;
}

export function ActionCard({Action="Action", DataControl="NA"}={}){
    const ActionCard = document.createElement('li');
    ActionCard.className = 'ActionCard';
    ActionCard.dataset.controller = DataControl;

    const Title = document.createElement('h3');
    Title.textContent = Action;
    ActionCard.appendChild(Title);

    return ActionCard;
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

export const caseStudyItem =({
    Title="Title",
    LocationPills=[],
    DescriptionText="Description",
    Sources=[],
    Pillar="Pillar",
    Recc="Policy Recommendation",
    PType="Policy Type"
}={})=>{

    const CaseStudyItem = ExpandRuleBox()
    CaseStudyItem.classList.add('CaseStudyItem')

    const CaseStudyInfo = document.createElement('div')
    CaseStudyInfo.classList.add('CaseStudyInfo')
    
    const CaseStudyTitle = document.createElement('h4')
    CaseStudyTitle.textContent = Title

    const LocationPillsContainer = pillBox()
    LocationPills.forEach((pill) => {
        LocationPillsContainer.appendChild(pill)
    })

    const Taxonomy = document.createElement('div')
    Taxonomy.classList.add('Taxonomy')

    const MoreInfo = document.createElement('div')
    MoreInfo.classList.add('MoreInfo')

    const Description = document.createElement('p')
    Description.textContent = DescriptionText
    MoreInfo.append(Description)

    const SourcesList = document.createElement('div')
    SourcesList.classList.add('Sources')
    const SourcesTitle = document.createElement('h4')
    SourcesTitle.textContent = 'Sources'

    SourcesList.append(SourcesTitle)
    Sources.forEach((source) => {
        const SourceItem = document.createElement('a')
        SourceItem.textContent = source.Title
        SourceItem.href = source.Url
        SourceItem.target = "_blank"
        SourcesList.appendChild(SourceItem)
    })
    MoreInfo.append(SourcesList)

    CaseStudyInfo.appendChild(CaseStudyTitle)
    CaseStudyInfo.appendChild(LocationPillsContainer)


    addContent(CaseStudyItem, CaseStudyInfo)
    addContent(CaseStudyItem, MoreInfo)
    return CaseStudyItem
}