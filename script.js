const form = document.getElementById('form')
const input = document.getElementById('input')
const result = document.getElementById('result')
const navigation = document.getElementById('navigation')

const ApiUrl = 'https://api.lyrics.ovh'

async function fetchSongs(term){
    const res = await fetch(`${ApiUrl}/suggest/${term}`)
    const data = await res.json()
    // console.log(data)
    addSongToDom(data) 
}

function addSongToDom(data){
    result.innerHTML=`<ul class="songs">
    ${data.data.map(song => `<li>
    <span><strong>${song.artist.name}</strong> - ${song.title}</span>
    <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>`)
    .join('')}
    </ul>`

    if(data.prev || data.next){
        navigation.innerHTML=`${data.prev ? `<button class="btn" onclick="getSongs('${data.prev}')"> Prev </button>` : ''}
        ${data.next ? `<button class="btn" onclick="getSongs('${data.next}')"> Next </button>` : ''}`
    }else{
        navigation.innerHTML=''
    }
}

async function getLyrics(artist,title){
    const res = await fetch(`${ApiUrl}/v1/${artist}/${title}`)
    const data = await res.json()

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,'</br>')

    result.innerHTML=`<h2><strong>${artist}</strong>- ${title}</h2>
    <span>${lyrics}</span>`

    navigation.innerHTML=''
}

async function getSongs(url){
    const res = await fetch (`https://cors-anywhere.herokuapp.com/${url}`)
    const data = await res.json()
    addSongToDom(data)
}

// async function getLyrics(artist,title){
//     const res = await fetch(`${ApiUrl}/v1/${artist}/${title}`)
//     const data = await res.json()

//     const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,'</br>')

//     result.innerHTML=`<h2><strong>${artist}</strong>- ${title}</h2>
//     <span>${lyrics}</span>`

//     navigation.innerHTML=''
// }

form.addEventListener('submit', e => {
    e.preventDefault()

    const searchValue = input.value.trim()
    
    if(!searchValue){
        alert('Please enter value to search')
    }else{
        fetchSongs()
    }
})

result.addEventListener('click',e=>{
    const clickElm = e.target
    // console.log(clickElm.tagName)

    if(clickElm.tagName ==='BUTTON'){
        const artist = clickElm.getAttribute('data-artist')
        const title = clickElm.getAttribute('data-songtitle')

        getLyrics(artist,title)
    }
})

// data-artist

// data-songtitle