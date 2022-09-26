let strengths = [];
let weaknesses = [];
const poke_container = document.getElementById('poke_container');
const pokemons_number = 150;
const colors = {
	fire: '#FDDFDF',
	grass: '#DEFDE0',
	electric: '#FCF7DE',
	water: '#DEF3FD',
	ground: '#f4e7da',
	rock: '#d5d5d4',
	fairy: '#fceaff',
	poison: '#98d7a5',
	bug: '#f8d5a3',
	dragon: '#97b3e6',
	psychic: '#eaeda1',
	flying: '#F5F5F5',
	fighting: '#E6E0D4',
	normal: '#F5F5F5'
};
const main_types = Object.keys(colors);

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const fetchPokemons = async () => {
	for (let i = 1; i <= pokemons_number; i++) {
		await getPokemon(i);
	}
};



const getPokemon = async id => {
  
	const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  
  const res = await $.ajax({
    type: 'GET',
    
    url: url,
    
  }).done(result=>{
    
  }).fail((error)=>{
    console.log(error);
  });
	//const res = await fetch(url);
	//const pokemon = await res.json();
  //console.log(res);
	createPokemonCard(res);
};

function createPokemonCard(pokemon) {
	const pokemonEl = document.createElement('div');
	pokemonEl.classList.add('pokemon');

	const poke_types = pokemon.types.map(type => type.type.name);
	const type = main_types.find(type => poke_types.indexOf(type) > -1);
	const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
	const color = colors[type];
	
	pokemonEl.style.backgroundColor = color;
  let poke=JSON.stringify(pokemon);
	const pokeInnerHTML = `
      <div class="containerCard">  
        <button type="button" class="btn p-0 rounded-circle btn-sm shadow" id="btnDetail" onclick="detail(${JSON.stringify(pokemon).split('"').join("&quot;")})" data-bs-toggle="modal" data-bs-target="#modalPokemon" style="background-color: ${color};"><img src="src/eye.png" class="mx-auto my-auto d-block"></i></button>
        <div class="img-container vstack gap-2 col-md-5 mx-auto text-center" id="cardPoke">
            <img class="mx-auto my-auto d-block" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${name}" />
        </div>
        <div class="info">
            <span class="number">#${pokemon.id
							.toString()
							.padStart(3, '0')}</span>
            <h3 class="name">${name}</h3>
            ${putBadge(pokemon.types)}
            
        </div>
      </div>
    `;
  
	pokemonEl.innerHTML = pokeInnerHTML;

	poke_container.appendChild(pokemonEl);
}

const detail= async poke=>{
  
  //console.log(poke);
  const poke_types = poke.types.map(type => type.type.name);
  const type = main_types.find(type => poke_types.indexOf(type) > -1);
  const color = colors[type];
  const name = poke.name[0].toUpperCase() + poke.name.slice(1);
  //Height & Weight
  const height= poke.height / 10 + " m";
  const weight = poke.weight / 10 + " kg";

  
  //tabContent.backgroundColor=color;
	//https://pokeapi.co/api/v2/evolution-chain/{id}/
	//pokemonEl.style.backgroundColor = color;
  let pokeDemageRelations={};

  for (const item of poke.types) {
    pokeDemageRelations= await $.ajax({
      type: 'GET',
      url: item.type.url,
      
    }).done(result=>{
      
    }).fail((error)=>{
      console.log(error);
    });
  }
  console.log(pokeDemageRelations);
  
  const pokeSpecies =await $.ajax({
    type: 'GET',
    url: `https://pokeapi.co/api/v2/pokemon-species/${poke.id}`,
    
  }).done(result=>{
    
  }).fail((error)=>{
    console.log(error);
  });

  var text=`
  <div class="container">
          <div class="row">
            <div class="col">
            <h3 class="text-start" >${name}</h3>
            
            </div>
            <div class="col">
              <h3  class="text-end text-secondary">#${poke.id
                .toString()
                .padStart(3, '0')}</h3>
            </div>
          </div>
          <div class="row ">
            <div class="col-6 mx-auto my-auto d-block">
              <img class="img-fluid w-100" src="${poke.sprites.other["official-artwork"].front_default}"  />
            </div>
            <div class="col-6 ">
              <div class="row">
                <div class="col">
                  <span class="underline--magical fs-6 fw-bold ">Type</span>
                  <div class="my-2">
                    ${putBadge(poke.types)}
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <span class="underline--magical fs-6 fw-bold ">Abilities</span>
                  <div class="text-start">
                  ${putBadgeAbility(poke.abilities)}
                  </div>
                </div>
                <div class="col text-center">
                <span class="underline--magical fs-6 fw-bold ">Height</span>
                  <div class="">
                  ${height}
                  </div>
                </div>
                <div class="col text-center">
                <span class="underline--magical fs-6 fw-bold ">Weight</span>
                  <div class="">
                  ${weight}
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <span class="underline--magical fs-6 fw-bold ">Strengths</span>
                  <div class="my-2" id="pokeStrengths">
                  </div>
                  <span class="underline--magical fs-6 fw-bold ">Weaknesses</span>
                  <div class="my-2" id="pokeWeaknesses">
                  </div>
                </div>
              </div>
            </div>
            
            
          </div>
          
          
          
          <div class="row">
            <div class="col-4 mx-auto my-auto d-block">
              <span class="underline--magical fs-6 fw-bold ">Habitat</span>
              <div class="">
                ${pokeSpecies.habitat.name}
              </div>
              <span class="underline--magical fs-6 fw-bold ">Held Items</span>
              <div class="">
                ${getHeldItem(poke.held_items)}
              </div>
              <span class="underline--magical fs-6 fw-bold ">Egg Groups</span>
              <div class="">
                <ul>
                
                  ${getEggGroups(pokeSpecies.egg_groups)}
                </ul>
              </div>
            </div>
            <div class="col-8">
              <div class="row text-center">
                <div class="col ">
                  <span class="underline--magical fs-6 fw-bold ">Base Stats</span>
                </div>
                <div class="col">
                  <span class="underline--magical fs-6 fw-bold ">Gender Ratio</span>
                </div>
              </div>
              <div class="row">
                <div class="col text-center">
                <canvas id="radar-chart"></canvas>
                </div>
                <div class="col">
                <canvas id="pie-chart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
    
    `;
    $("#modalBodyPoke").html(text);
    loadRadarChart(poke.stats);
    loadPieChart(pokeSpecies.gender_rate);
    putDemageRelations(pokeDemageRelations)

}


function putDemageRelations(pokeDemageRelations){
  console.log(pokeDemageRelations.damage_relations.double_damage_to);
  let textStrengths="",textWeaknesses="";

  pokeDemageRelations.damage_relations.double_damage_to.forEach((element) => {
    //create element and append
    
    textStrengths+=badge(element.name);
    $("#pokeStrengths").html(textStrengths);

    
  });

  pokeDemageRelations.damage_relations.double_damage_from.forEach((element) => {
    //create element and append
    textWeaknesses+=badge(element.name);
    $("#pokeWeaknesses").html(textWeaknesses);
  });
}

fetchPokemons();
function getHeldItem(poke){
  text="";
  for (const item of poke) {
    //console.log(item);
    text+=`
    <li>${item.item.name}</li>
    `;
  }
  if(!text || !text.trim())
    return `---`
  return text;
}
function getEggGroups(poke){
  text="";
  for (const item of poke) {
    //console.log(item);
    text+=`
    <li>${item.name}</li>
    `;
  }
  return text;
};

function loadPieChart(femalePercent) {
  //1.
  let pieChart = document.getElementById("pie-chart");
  //2.
  pieChart = new Chart(pieChart, {
    type: "pie",
    data: {
      datasets: [
        //only 1 data obj in datasets
        {
          data: [femalePercent, 100 - femalePercent], // female, male
          backgroundColor: [
            "rgba(255,137,180, 0.5)", //pink for female
            "rgba(44, 130, 201, 0.5)", //blue for male
          ],
          borderColor: ["rgba(255,137,180,1 )", "rgba(44, 130, 201,1)"],
          borderWidth: 1, //they share the same value so no need array
        },
      ],
      //add custom labels, female first then male
      labels: ["Female", "Male"],
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      scale: {
          ticks: {
              beginAtZero: true,
              max: 100,
              display: false
          }
      },
    },
  });
}

function loadRadarChart(data) {
  console.log(data);
  //1.
  let statsChart = document.getElementById("radar-chart");
  const dataPoke = {
    labels: ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"],
    datasets: [{
      //label: 'My First Dataset',
      data: [
        data[0]["base_stat"], //HP
        data[1]["base_stat"], //Atk
        data[2]["base_stat"], //Def
        data[3]["base_stat"], //SpA
        data[4]["base_stat"], //SpD
        data[5]["base_stat"], //Speed
      ],
      //fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)',
     
    }]
  };
  //2.
  statsChart = new Chart(statsChart, {
    type: 'radar',
    data: dataPoke ,
    options: {
      responsive: false,
      maintainAspectRatio: true,
      scale: {
          ticks: {
              beginAtZero: true,
              max: 100,
              display: false
          }
      },
      plugins:{
        legend:{
           display:false
        }
     }
    },
  }
)};

function putBadgeAbility(abilities){
  text="";
  for (const item of abilities) {
    //console.log(item);
    text+=`
    <span class="badge rounded-pill text-bg-warning pb-2 shadow-sm">${item.ability.name}</span>
    `;
  }
  return text;
}

function putBadgeForms(forms){
  text="";
  for (const item of forms) {
    //console.log(item);
    text+=`
    <span class="badge text-bg-secondary pb-2 shadow-sm">${item.name}</span>
    `;
  }
  return text;
}



function putBadge(types){
  text="";
  for (const item of types) {
    //console.log(item);
    text+=badge(item.type.name);
  }
  return text;
}



function badge(typePoke){
  switch (typePoke) {
    case "normal":
      return `<span class="badge text-bg-light pb-2 shadow" >${typePoke}</span>`;
      break;
    case "fighting":
      return `<span class="badge text-bg-danger pb-2 shadow">${typePoke}</span>`;
      break;
    case "flying":
      return `<span class="badge text-bg-info pb-2 shadow">${typePoke}</span>`;
      break;
    case "poison":
      return `<span class="badge text-bg-secondary pb-2 shadow">${typePoke}</span>`;
      break;
    case "rock":
      return `<span class="badge text-bg-secondary pb-2 shadow">${typePoke}</span>`;
      break;
    case "bug":
      return `<span class="badge text-bg-warning pb-2 shadow">${typePoke}</span>`;
      break;
    case "ghost":
      return `<span class="badge text-bg-dark pb-2 shadow">${typePoke}</span>`;
      break;
    case "steel":
      return `<span class="badge text-bg-secondary pb-2 shadow">${typePoke}</span>`;
      break;
    case "fire":
      return `<span class="badge text-bg-danger pb-2 shadow">${typePoke}</span>`;
      break;
    case "water":
      return `<span class="badge text-bg-primary pb-2 shadow">${typePoke}</span>`;
      break;
    case "grass":
      return `<span class="badge text-bg-success pb-2 shadow">${typePoke}</span>`;
      break;
    case "electric":
      return `<span class="badge text-bg-warning pb-2 shadow">${typePoke}</span>`;
      break;
    case "psychic":
      return `<span class="badge text-bg-light pb-2 shadow">${typePoke}</span>`;
      break;
    case "ice":
      return `<span class="badge text-bg-primary pb-2 shadow">${typePoke}</span>`;
      break;
    case "dragon":
      return `<span class="badge text-bg-danger pb-2 shadow">${typePoke}</span>`;
      break;
    case "dark":
      return `<span class="badge text-bg-dark pb-2 shadow">${typePoke}</span>`;
      break;
    case "fairy":
      return `<span class="badge text-bg-light pb-2 shadow">${typePoke}</span>`;
      break;
    case "unknown":
      return `<span class="badge text-bg-info pb-2 shadow">${typePoke}</span>`;
      break;
    case "shadow":
      return `<span class="badge text-bg-secondary pb-2 shadow">${typePoke}</span>`;
      break;
    case "ground":
      return `<span class="badge text-bg-secondary pb-2 shadow">${typePoke}</span>`;
      break;
  
    default:
      break;
  }
}
