import * as Cmpnt from './Components.js'
import * as Parser from './JsonParser.js'

const FilterGroup = document.querySelector('#FilterGroup')

Parser.List.Pillars.forEach(pillar => {
    let CheckGroup = Cmpnt.CheckGroup({ name: pillar, value: pillar, taxonomy:'Pillar' })

    FilterGroup.appendChild(CheckGroup);
});

NestCheckGroups('Pillar', 'Recommendation');
NestCheckGroups('Recommendation', 'Policy Type');

function NestCheckGroups(ParentTaxonomy, AssociatedTaxonomy){

    // console.log(`Nesting check groups for ${ParentTaxonomy} -> ${AssociatedTaxonomy}`);

    const ParentCheckGroups = FilterGroup.querySelectorAll(`[data-taxonomy="${ParentTaxonomy}"]`)
    ParentCheckGroups.forEach(CheckGroup => {
        
        const AssociatedItems = Parser.getAssociated(
            Parser.Data.PolicyDataBase,
            CheckGroup.dataset.taxonomy,
            CheckGroup.dataset.name,
            AssociatedTaxonomy
        );

        // console.log(`Associated items for ${CheckGroup.dataset.name}:`, AssociatedItems);
        if(! AssociatedItems.length > 0) return
        const CheckNested = Cmpnt.CheckNested(CheckGroup)
        const ParentLevel = parseInt(CheckGroup.dataset.checklevel)

        AssociatedItems.forEach(item => {
            const ItemCheck = Cmpnt.CheckGroup({ name: item, value: item, taxonomy: AssociatedTaxonomy, level: ParentLevel + 1 });
            CheckNested.appendChild(ItemCheck);
        });
        CheckGroup.appendChild(CheckNested);
    });


}    

function updateParent(Checkbox){
  const groupContainer = Checkbox.closest('.CheckNested')
  if(!groupContainer){return}
  const parentContainer = groupContainer.closest('.CheckGroup')
  if(!parentContainer){return}
  const parentCheckbox = parentContainer.querySelector('label input[type="checkbox"].filterValue');
  if(!parentCheckbox){return}

  const siblings = Array.from(groupContainer.querySelectorAll(':scope > .CheckGroup > .CheckGroupHead > label > input[type="checkbox"].filterValue'))
  // parentCheckbox.checked = siblings.every(s => s.checked || s.indeterminate)
  // parentCheckbox.indeterminate = !parentCheckbox.checked && siblings.some(s => s.checked || s.indeterminate)
  parentCheckbox.checked = siblings.some(s => s.checked)

  toggleContentVis(parentCheckbox)
  updateParent(parentCheckbox)
  
}

function updateChildren(Checkbox, nestedGroup){
  const children = nestedGroup.querySelectorAll('input[type="checkbox"].filterValue')
  children.forEach(child=>{
    child.checked = Checkbox.checked
    toggleContentVis(child)
  })
}

function toggleContentVis(Checkbox) {
  const container = document.querySelector('.ContentContainer')
  if (!container) return

  // Find all elements where data-controller matches the checkbox value
  const targets = container.querySelectorAll(`[data-controller="${Checkbox.value}"]`)
  
  targets.forEach(target => {
    if (Checkbox.checked) {
      target.style.display = '' // Restores original CSS display (block, flex, etc.)
    } else {
      target.style.display = 'none' // Hides the element
    }
  })
}

FilterGroup.addEventListener('change', (e)=>{

  if (e.target.type !== 'checkbox') return
  const Checkbox = e.target
  if(!Checkbox.classList.contains('filterValue')) return
  
  const nestedGroup = Checkbox.closest('.CheckGroup').querySelector('.CheckNested')
  if(nestedGroup){
    updateChildren(Checkbox, nestedGroup)
  }
  
  toggleContentVis(Checkbox)
  updateParent(Checkbox)

})

const ContentContainer = document.querySelector('.ContentContainer>ul');
Parser.List.PolicyActions.forEach(action => {
    const AssociatedPType = Parser.getAssociated(Parser.Data.PolicyDataBase, 'Policy Action', action, 'Policy Type')
  const actionCard = Cmpnt.ActionCard({ Action: action, DataControl: AssociatedPType });
  ContentContainer.appendChild(actionCard);
});