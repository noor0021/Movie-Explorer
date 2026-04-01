const container = document.getElementById("pokemon-container");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");

let allPokemon = [];


async function fetchPokemon() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
  const data = await res.json();


  const promises = data.results.map(p => fetch(p.url).then(r => r.json()));
  allPokemon = await Promise.all(promises);

  renderPokemon(allPokemon);
}

function renderPokemon(data) {
  container.innerHTML = "";

  data.map(pokemon => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${pokemon.name}</h3>
      <img src="${pokemon.sprites.front_default}" />
    `;

    container.appendChild(card);
  });
}



searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = allPokemon.filter(p =>
    p.name.includes(value)
  );

  renderPokemon(filtered);
});



sortSelect.addEventListener("change", () => {
  let sorted = [...allPokemon];

  if (sortSelect.value === "az") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortSelect.value === "za") {
    sorted.sort((a, b) => b.name.localeCompare(a.name));
  }

  renderPokemon(sorted);
});



fetchPokemon();
