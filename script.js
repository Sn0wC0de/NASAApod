const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfrimed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');



//  NASA API
const count = 7;
const apiKey = 'GYArsZx9LYEy6LlVCeIb57ttk7cEVAnJd7zjRlKh';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
    window.scrollTo({top:0, behavior:'instant'});
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else { 
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden')
} 

function createDOMNodes(page) {
    
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites); 
    
    currentArray.forEach((result) => {
        // card container
        const card = document.createElement('div');
        card.classList.add('card');
        // link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA image of the day';
        image.loading = 'lazy';
        image.classList.add('card-image-top');
        // card body 
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // add to favorites
        const addFavorites= document.createElement('p');
        addFavorites.classList.add('clickable');
        if(page === 'results') {
            addFavorites.textContent = 'Add to Favorites';
            addFavorites.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            addFavorites.textContent = 'Remove Favorites';
            addFavorites.setAttribute('onclick', `removeFavorite('${result.url}')`); 
        }
        // card text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
        // date and copyright
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        const date = document.createElement('strong');
        date.textContent = result.date;
        const copyrightResult = result.copyright === undefined ? '' : result.copyright
        const copyRightInfo = document.createElement('span');
        copyRightInfo.textContent = ` ${copyrightResult}`;
        // appending
        footer.append(date, copyRightInfo);
        cardBody.append( cardTitle, addFavorites, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

function updateDOM(page) {
    // get favoriters from lacol storage
    if(localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'))
        
    } else page = 'results';
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);

}

// get  ten images from API

async function getNasaPictures() {
    // show loade
    loader.classList.remove('hidden');
    try { 
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        
        updateDOM('results');
    } catch (error){
        // catch error here
    }

}

// add tresult to favorite

function saveFavorite(url) {
    // loop through results array to select favorite
    resultsArray.forEach((item) => {
        if (item.url.includes(url) && !favorites[url]) {
            favorites[url] = item;
            // show save confirmation
            saveConfrimed.hidden = false;
            setTimeout(()=> {
                saveConfrimed.hidden = true;
            }, 2000);
            // set favorites in localstorage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
        }
    })
}

// remove item from favorites

function removeFavorite(url) {
    if(favorites[url]) {
        delete favorites[url];
        // set favorites in localstorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

getNasaPictures();