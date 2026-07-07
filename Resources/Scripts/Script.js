import * as Cmpnt from './Components.js'

Cmpnt.ProcessHeader()
Cmpnt.ProcessFooter()

function updateHeaderHeightVar(){
  const header = document.querySelector('header')
  if(!header) return
  document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px')
}
updateHeaderHeightVar()
window.addEventListener('resize', updateHeaderHeightVar)
window.addEventListener('load', updateHeaderHeightVar)