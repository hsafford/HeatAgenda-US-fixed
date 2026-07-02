import * as Cmpnt from './Components.js'
import * as Parser from './JsonParser.js'

const statesLayout = [
  {
    State:'Alaska',
    Abbreviation:'AK',
    Pos:[1,1]
  },
  {
    State:'Washington',
    Abbreviation:'WA',
    Pos:[1,3]
  },
  {
    State:'Oregon',
    Abbreviation:'OR',
    Pos:[1,4]
  },
  {
    State:'California',
    Abbreviation:'CA',
    Pos:[1,5]
  },
  {
    State:'Hawaii',
    Abbreviation:'HI',
    Pos:[1,8]
  },
  
  {
    State:'Indiana',
    Abbreviation:'ID',
    Pos:[2,3]
  },
  {
    State:'Hawaii',
    Abbreviation:'HI',
    Pos:[2,4]
  },
  {
    State:'Nevada',
    Abbreviation:'NV',
    Pos:[2,5]
  },
  {
    State:'Arizona',
    Abbreviation:'AZ',
    Pos:[2,6]
  },
  
  {
    State:'Montana',
    Abbreviation:'MT',
    Pos:[3,3]
  },
  {
    State:'Wyoming',
    Abbreviation:'WY',
    Pos:[3,4]
  },
  {
    State:'Colorado',
    Abbreviation:'CO',
    Pos:[3,5]
  },
  {
    State:'New Mexico',
    Abbreviation:'NM',
    Pos:[3,6]
  },
  
  {
    State:'North Dekota',
    Abbreviation:'ND',
    Pos:[4,3]
  },
  {
    State:'South Dekota',
    Abbreviation:'SD',
    Pos:[4,4]
  },
  {
    State:'Nebraska',
    Abbreviation:'NE',
    Pos:[4,5]
  },
  {
    State:'Kansas',
    Abbreviation:'KS',
    Pos:[4,6]
  },
  {
    State:'Oklahoma',
    Abbreviation:'OK',
    Pos:[4,7]
  },
  
  {
    State:'Minnesota',
    Abbreviation:'MN',
    Pos:[5,3]
  },
  {
    State:'Indianapolis',
    Abbreviation:'IA',
    Pos:[5,4]
  },
  {
    State:'Missouri',
    Abbreviation:'MO',
    Pos:[5,5]
  },
  {
    State:'Arkansas',
    Abbreviation:'AR',
    Pos:[5,6]
  },
  {
    State:'Luisiana',
    Abbreviation:'LA',
    Pos:[5,7]
  },
  {
    State:'Texas',
    Abbreviation:'TX',
    Pos:[5,8]
  },
  
  {
    State:'Wisconsin',
    Abbreviation:'WI',
    Pos:[6,4]
  },
  {
    State:'Illinois',
    Abbreviation:'IL',
    Pos:[6,5]
  },
  {
    State:'Indiana',
    Abbreviation:'IN',
    Pos:[6,6]
  },
  {
    State:'Mississippi',
    Abbreviation:'MS',
    Pos:[6,7]
  },
  
  {
    State:'Michigan',
    Abbreviation:'MI',
    Pos:[7,3]
  },
  {
    State:'Ohio',
    Abbreviation:'OH',
    Pos:[7,4]
  },
  {
    State:'West Virginia',
    Abbreviation:'WV',
    Pos:[7,5]
  },
  {
    State:'Kentucky',
    Abbreviation:'KY',
    Pos:[7,6]
  },
  {
    State:'Alababama',
    Abbreviation:'AL',
    Pos:[7,7]
  },
  
  {
    State:'Pennsylvania',
    Abbreviation:'PA',
    Pos:[8,4]
  },
  {
    State:'Virginia',
    Abbreviation:'VA',
    Pos:[8,5]
  },
  {
    State:'Tennessee',
    Abbreviation:'TN',
    Pos:[8,6]
  },
  {
    State:'Georgia',
    Abbreviation:'GA',
    Pos:[8,7]
  },
  
  {
    State:'New York',
    Abbreviation:'NY',
    Pos:[9,3]
  },
  {
    State:'New Jersey',
    Abbreviation:'NJ',
    Pos:[9,4]
  },
  {
    State:'Maryland',
    Abbreviation:'MD',
    Pos:[9,5]
  },
  {
    State:'North Carolina',
    Abbreviation:'NC',
    Pos:[9,6]
  },
  {
    State:'South Carolina',
    Abbreviation:'SC',
    Pos:[9,7]
  },
  {
    State:'Florida',
    Abbreviation:'FL',
    Pos:[9,8]
  },
  
  {
    State:'Vermont',
    Abbreviation:'VT',
    Pos:[10,2]
  },
  {
    State:'Massachusetts',
    Abbreviation:'MA',
    Pos:[10,3]
  },
  {
    State:'Connecticut',
    Abbreviation:'CT',
    Pos:[10,4]
  },
  {
    State:'Deleware',
    Abbreviation:'DE',
    Pos:[10,5]
  },
  
  {
    State:'Maine',
    Abbreviation:'ME',
    Pos:[11,1]
  },
  {
    State:'New Hampshire',
    Abbreviation:'NH',
    Pos:[11,2]
  },
  {
    State:'Rhode Island',
    Abbreviation:'RI',
    Pos:[11,3]
  }
]

const mapSelect = document.querySelector('.mapSelect');
statesLayout.forEach((state, i)=>{
    mapSelect.append( Cmpnt.StateBox(statesLayout[i]) )
  
})
mapSelect.addEventListener('change', (e) => {
  if(!e.target.classList.contains('filterValue')) return;

  const selectedState = e.target.value;
  updateContentStates(selectedState);
  updateMapSelectionTitle(selectedState);
})

const mapTitle = document.querySelector('#map-title');
const mapTitleSelection = mapTitle.querySelector('#MapSelection');
function updateMapSelectionTitle(newSelection){
  mapTitleSelection.textContent = newSelection;
}

const mapContainer = document.querySelector('.mapContainer')
mapContainer.prepend(Cmpnt.ExpandRule({Expanded: true}))

const ContentContainer = document.querySelector('#CaseStudies')
Parser.Data.CaseStudies.forEach((study) => {
    
    const AssociatedStatesArr = study.State.split(', ');
    
    const LocationPills = [];
    AssociatedStatesArr.forEach((state) => {
        const pill = Cmpnt.locationPill({ State: state })
        LocationPills.push(pill);
    });

    const SourceTitles = study['Link Title'] ? study['Link Title'].split(', ') : [];
    const SourceUrls = study['Link Url'] ? study['Link Url'].split(', ') : [];

    const Sources = SourceTitles.map((title, index) => ({
        Title: title,
        Url: SourceUrls[index] || ''
    }));

    const item = Cmpnt.caseStudyItem({
        Title: study['Case Study Title'],
        LocationPills: LocationPills,
        DescriptionText: study['Description'],
        Sources: Sources,
        Pillar: study['Pillar'],
        Recc: study['Recommendation'],
        PType: study['Policy Type']
    })


    ContentContainer.appendChild(item)
})
function updateContentStates(State){
    const filterIn = ContentContainer.querySelectorAll(':scope > *:has([data-state="' + State + '"])')
    const filterOut = ContentContainer.querySelectorAll(':scope > *:not(:has([data-state="' + State + '"]))')
    if (filterOut) {
        filterOut.forEach((element) => {
            element.style.display = "none"
        });
    }
    if(filterIn){
        filterIn.forEach((element) => {
            element.style.display = ""
        });
    }
}

//
const DrillDownFilter = document.querySelector('.DrillDownFilter')
Cmpnt.processDrillDownFilter({FilterContainer: DrillDownFilter})