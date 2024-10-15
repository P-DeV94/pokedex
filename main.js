import './style.css'
let pokemon = [];
let selectedType = [];
const sectionPokedex = document.getElementById('pokedex');
const inputSearch = document.getElementById('search');
const types = document.querySelectorAll('.type');
const btnMenu = document.querySelector('.btn-menu');
const sidebar = document.querySelector('.sidebar');
const btnSideMenu = document.querySelector('.btn-side-menu')

btnMenu.addEventListener('click', ()=> {
  sidebar.classList.add('open');
})

btnSideMenu.addEventListener('click', ()=>{
  sidebar.classList.remove('open')
})

inputSearch.addEventListener("keyup", (e) => {
  filterPokemoByName(pokemon, e);
  sidebar.classList.remove('open')
});

types.forEach((type) => {
  type.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    const checkBoxValue = e.target.value;
    if (isChecked) {
      selectedType.push(checkBoxValue);
      sidebar.classList.remove('open');
    } else {
      selectedType = selectedType.filter(type => type !== checkBoxValue);
    }
    const pokemonBytype = pokemon.filter(pkm => selectedType.every(selectedType => pkm.type.includes(selectedType)));
    console.log(pokemonBytype);
    return pokemonCard(pokemonBytype);

  })
})

async function fetchPokemon() {
  try {
    const response = await fetch('./pokemon.json-master/pokedex.json');
    pokemon = await response.json();
    console.log(pokemon);
    const listaPokemon = pokemonCard(pokemon);
    return listaPokemon;
  } catch (error) {
    console.log(error);
  }
};

//Formatto id pokemon per immagini
function formatId(id) {
  if (id.toString().length == 1) return `00${id}`;
  if (id.toString().length == 2) return `0${id}`;
  return id;
}

function pokemonCard(pokemonList) {
  while (sectionPokedex.firstChild) {
    sectionPokedex.removeChild(sectionPokedex.firstChild);
  }
  pokemonList.forEach((pokemon) => {
    const cardDiv = document.createElement('article');
    cardDiv.className = 'card-pokemon';
    cardDiv.id = pokemon.id;
    cardDiv.innerHTML += `
      <div class='box-img'>
        <img src='pokemon.json-master/images/${formatId(pokemon.id)}.png'>
      </div>
      <h4>${pokemon.name.english}</h4>
    `
    cardDiv.addEventListener('click', () => {
      showSingleCardPokemon(pokemon)
    });

    sectionPokedex.appendChild(cardDiv);
  });

  return sectionPokedex;
};

function showSingleCardPokemon(pokemon) {
  const popup = document.createElement('section');
  popup.className = 'overlay',
    popup.innerHTML += `
    <div class='popup'>
      <header>
        <button class='btn-close'>X</button>
      </header>
      <div class='content-popup'>
        <div class='box-img-popup'>
          <img src='pokemon.json-master/images/${formatId(pokemon.id)}.png'>
        </div>
        <div class='popup-text'>
        <h2>${pokemon.name.english}</h2>
        <ul>
          <li>HP: ${pokemon.base.HP}</li>
          <li>Attack: ${pokemon.base.Attack}</li>
          <li>Defense: ${pokemon.base.Defense}</li>
          <li>Speed: ${pokemon.base.Speed}</li>
        </ul>
        </div>
      </div>
    </div>
  `
  sectionPokedex.appendChild(popup);
  const btnClose = document.querySelector('.btn-close');
  const overlay = document.querySelector('.overlay');
  btnClose.addEventListener('click', () => {
    popup.remove();
  })
  overlay.addEventListener('click', ()=> {
    popup.remove();
  })
}

function filterPokemoByName(pokemon, event) {
  event.preventDefault();
  const name = event.target.value;
  const pokemonName = pokemon.filter(pkm => pkm.name.english.startsWith(name.trim()));
  console.log(pokemonName);
  pokemonCard(pokemonName);
};


fetchPokemon();