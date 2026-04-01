
const container = document.getElementById("pokemonContainer");
const searchInput = document.getElementById("search");
const typeFilter = document.getElementById("typeFilter");
const sortSelect = document.getElementById("sort");

let allPokemon = [];


async function fetchPokemon() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
  const data = await res.json();

  const detailedData = await Promise.all(
    data.results.map(async (p) => {
      const res = await fetch(p.url);
      return res.json();
    })
  );

  allPokemon = detailedData;
  renderPokemon(allPokemon);
}

function renderPokemon(data) {
  container.innerHTML = "";

  data.map((p) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.sprites.front_default}" />
      <h3>${p.name}</h3>
      <p>HP: ${p.stats[0].base_stat}</p>
      <p>Type: ${p.types[0].type.name}</p>
    `;

    container.appendChild(card);
  });
}


searchInput.addEventListener("input", () => {
  applyFilters();
});


function applyFilters() {
  let filtered = [...allPokemon];


  const searchValue = searchInput.value.toLowerCase();
  filtered = filtered.filter(p =>
    p.name.includes(searchValue)
  );


  const typeValue = typeFilter.value;
  if (typeValue) {
    filtered = filtered.filter(p =>
      p.types.some(t => t.type.name === typeValue)
    );
  }

  const sortValue = sortSelect.value;
  if (sortValue === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortValue === "hp") {
    filtered.sort((a, b) => b.stats[0].base_stat - a.stats[0].base_stat);
  }

  renderPokemon(filtered);
}

typeFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);


fetchPokemon();
