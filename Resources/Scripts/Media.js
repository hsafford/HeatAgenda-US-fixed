import * as Parser from './JsonParser.js'

const MediaItems = Parser.Data.Media

function formatDate(iso){
    if(!iso) return ''
    const [y, m, d] = iso.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function metaRow(source, dateText){
    const row = document.createElement('div')
    row.classList.add('MediaCardMeta')
    row.innerHTML = `<span></span><span>&middot;</span><span></span>`
    row.children[0].textContent = source
    row.children[2].textContent = dateText
    return row
}

const OUTLET_LOGOS = {
    'GovTech': './Resources/Assets/Logos/govtech.png',
    'Governing': './Resources/Assets/Logos/governing.png',
    'The Conversation': './Resources/Assets/Logos/theconversation.png',
    'New America': './Resources/Assets/Logos/newamerica.png',
    'E&E News': './Resources/Assets/Logos/eenews.png',
    'Smart Cities Dive': './Resources/Assets/Logos/smartcitiesdive.png',
    'KSUT': './Resources/Assets/Logos/ksut.png',
    'Forbes': './Resources/Assets/Logos/forbes.png',
    'Heatmap News': './Resources/Assets/Logos/heatmapnews.png'
}

function outletRow(source, dateText){
    const wrap = document.createElement('div')
    wrap.classList.add('MediaEditorialOutlet')

    const logoSrc = OUTLET_LOGOS[source]
    if(logoSrc){
        const logo = document.createElement('img')
        logo.classList.add('MediaEditorialLogo')
        logo.src = logoSrc
        logo.alt = ''
        wrap.append(logo)
    }

    const name = document.createElement('span')
    name.classList.add('MediaEditorialOutletName')
    name.textContent = source
    wrap.append(name)

    const date = document.createElement('span')
    date.classList.add('MediaEditorialDate')
    date.textContent = dateText
    wrap.append(date)

    return wrap
}

function renderHero(featured){
    const hero = document.querySelector('.MediaHero')
    if(!hero || !featured) return

    hero.querySelector('.MediaHeroTitle').textContent = featured.Title
    hero.querySelector('.MediaHeroExcerpt').textContent = featured.Body
    hero.querySelector('.MediaHeroLink').href = featured['Link URL']

    const meta = hero.querySelector('.MediaHeroMeta')
    const logoSrc = OUTLET_LOGOS[featured.Source]
    const logoHtml = logoSrc ? `<img class="MediaHeroLogo" src="${logoSrc}" alt="">` : ''
    meta.innerHTML = `${logoHtml}<span>${featured.Source}</span><span>&middot;</span><span>${formatDate(featured.Date)}</span>`
}

function renderEditorialList(pressItems){
    const list = document.querySelector('.MediaEditorialList')
    if(!list) return

    pressItems.forEach(item => {
        const li = document.createElement('li')
        li.classList.add('MediaEditorialItem')

        const body = document.createElement('div')
        body.classList.add('MediaEditorialBody')
        body.append(outletRow(item.Source, formatDate(item.Date)))

        const title = document.createElement('h3')
        title.classList.add('MediaEditorialTitle')
        title.textContent = item.Title
        body.append(title)

        const excerpt = document.createElement('p')
        excerpt.classList.add('MediaEditorialExcerpt')
        excerpt.textContent = item.Body
        body.append(excerpt)

        const link = document.createElement('a')
        link.classList.add('MediaCardLink')
        link.href = item['Link URL']
        link.target = '_blank'
        link.rel = 'noopener'
        link.textContent = 'Read article →'
        body.append(link)

        li.append(body)
        list.append(li)
    })
}

const EMBED_SCRIPTS = {
    tiktok: 'https://www.tiktok.com/embed.js',
    instagram: 'https://www.instagram.com/embed.js',
    x: 'https://platform.twitter.com/widgets.js'
}

const EMBED_BLOCKQUOTES = {
    tiktok: (item) => {
        const blockquote = document.createElement('blockquote')
        blockquote.classList.add('tiktok-embed')
        blockquote.setAttribute('cite', item['Link URL'])
        blockquote.setAttribute('data-video-id', item['Video ID'])
        blockquote.style.maxWidth = '100%'
        blockquote.style.minWidth = '0'
        blockquote.innerHTML = `<section><a target="_blank" href="${item['Link URL']}">${item.Author}</a></section>`
        return blockquote
    },
    instagram: (item) => {
        const blockquote = document.createElement('blockquote')
        blockquote.classList.add('instagram-media')
        blockquote.setAttribute('data-instgrm-permalink', item['Link URL'])
        blockquote.setAttribute('data-instgrm-version', '14')
        blockquote.style.maxWidth = '100%'
        blockquote.style.minWidth = '0'
        blockquote.style.margin = '0'
        blockquote.innerHTML = `<a href="${item['Link URL']}" target="_blank"></a>`
        return blockquote
    },
    x: (item) => {
        const blockquote = document.createElement('blockquote')
        blockquote.classList.add('twitter-tweet')
        blockquote.innerHTML = `<a href="${item['Link URL']}"></a>`
        return blockquote
    }
}

function platformOf(item){
    if(item.Type === 'TikTok') return 'tiktok'
    if(!item.Source) return null
    const source = item.Source.toLowerCase()
    if(source === 'instagram') return 'instagram'
    if(source === 'x / twitter' || source === 'x' || source === 'twitter') return 'x'
    return null
}

const EMBED_NATIVE_WIDTH = 340

function renderSocial(embedItems){
    const section = document.querySelector('.MediaSocialSection')
    const container = document.querySelector('.MediaSocialGrid')
    if(!section || !container) return
    if(embedItems.length === 0){
        section.hidden = true
        return
    }

    const platformsUsed = new Set()

    embedItems.forEach(item => {
        const platform = platformOf(item)
        const buildBlockquote = EMBED_BLOCKQUOTES[platform]
        if(!buildBlockquote) return

        const card = document.createElement('div')
        card.classList.add('MediaSocialCard')

        const scaleWrap = document.createElement('div')
        scaleWrap.classList.add('MediaSocialEmbedScale')
        const inner = document.createElement('div')
        inner.classList.add('MediaSocialEmbedInner')
        inner.append(buildBlockquote(item))
        scaleWrap.append(inner)
        card.append(scaleWrap)

        if(item.Body){
            const caption = document.createElement('p')
            caption.classList.add('MediaCardBody')
            caption.textContent = item.Body
            card.append(caption)
        }

        container.append(card)
        platformsUsed.add(platform)
    })

    const scaleWraps = [...container.querySelectorAll('.MediaSocialEmbedScale')]
    new ResizeObserver(() => {
        scaleWraps.forEach(wrap => {
            wrap.style.setProperty('--embed-scale', wrap.clientWidth / EMBED_NATIVE_WIDTH)
        })
    }).observe(container)

    platformsUsed.forEach(platform => {
        const embedScript = document.createElement('script')
        embedScript.src = EMBED_SCRIPTS[platform]
        embedScript.async = true
        document.body.append(embedScript)
    })
}

function renderPodcasts(podcastItems){
    const section = document.querySelector('.MediaPodcastSection')
    const container = document.querySelector('.MediaPodcastGrid')
    if(!section || !container) return
    if(podcastItems.length === 0){
        section.hidden = true
        return
    }

    podcastItems.forEach(item => {
        const card = document.createElement('div')
        card.classList.add('MediaPodcastCard')

        const iframe = document.createElement('iframe')
        iframe.src = item['Embed URL']
        iframe.height = 175
        iframe.setAttribute('frameborder', '0')
        iframe.setAttribute('allow', 'autoplay *; encrypted-media *; fullscreen *; clipboard-write')
        iframe.setAttribute('sandbox', 'allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation')
        card.append(iframe)

        container.append(card)
    })
}

const byDateDesc = (a, b) => new Date(b.Date) - new Date(a.Date)

const pressItems = MediaItems.filter(m => m.Type === 'Press').sort(byDateDesc)
const featured = pressItems.find(m => m.Featured === 'Yes')
const editorialItems = pressItems.filter(m => m !== featured)
const embedItems = MediaItems.filter(m => m.Type === 'TikTok' || m.Embed === 'Yes')
const podcastItems = MediaItems.filter(m => m.Type === 'Podcast').sort(byDateDesc)

renderHero(featured)
renderEditorialList(editorialItems)
renderSocial(embedItems)
renderPodcasts(podcastItems)
