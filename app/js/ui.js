

var UI = {


    renderDisplay: function(pokemon, isLoading, showShiny) {
        if (isLoading) {
            return '<div class="image-screen-container"><div class="display-bezel"><div class="image-display">' +
                   '<div style="color:#fff; font-size:0.4rem">SYNCING...</div></div></div></div>';
        }

        var imgUrl = '';
        if (pokemon) {
            if (showShiny) {
                imgUrl = (pokemon.sprites.other.home && pokemon.sprites.other.home.front_shiny)
                       || pokemon.sprites.front_shiny;
            } else {
                imgUrl = (pokemon.sprites.other['official-artwork'] && pokemon.sprites.other['official-artwork'].front_default)
                       || pokemon.sprites.front_default;
            }
        }

        var inner = pokemon
            ? '<img class="pokemon-image" src="' + imgUrl + '" alt="' + pokemon.name + '">'
            : '<div style="color:#fff; font-size:0.4rem">NO SELECTION</div>';

        return '<div class="image-screen-container"><div class="display-bezel"><div class="image-display">' +
               inner + '</div></div></div>';
    },


    renderInfo: function(pokemon, species) {
        if (!pokemon) return '<div style="font-size:0.4rem; color:#666">Awaiting data...</div>';


        var flavorEntry = species && species.flavor_text_entries
            ? species.flavor_text_entries.find(function(e) { return e.language.name === 'en'; })
            : null;
        var description = flavorEntry ? flavorEntry.flavor_text.replace(/\f|\n/g, ' ') : 'No data available.';


        var genusEntry = species && species.genera
            ? species.genera.find(function(g) { return g.language.name === 'en'; })
            : null;
        var genus = genusEntry ? genusEntry.genus : '';

        var typeBadges = pokemon.types.map(function(t) {
            return '<span class="type-indicator" style="background:' + TYPE_COLORS[t.type.name] + '">'
                 + t.type.name.toUpperCase() + '</span>';
        }).join('');

        return '<div>' +
            '<div class="lcd-title">#' + pokemon.id + ' ' + pokemon.name.toUpperCase() + '</div>' +
            '<div class="lcd-subtitle">' + genus + '</div>' +
            '<div style="margin-bottom:10px">' + typeBadges + '</div>' +
            '<div style="font-size:0.45rem; line-height:1.5; opacity:0.9">' + description + '</div>' +
            '</div>';
    },


    renderStats: function(pokemon) {
        if (!pokemon) return '<div>NO STATS</div>';

        var bars = pokemon.stats.map(function(s) {
            var pct = (s.base_stat / 200 * 100);
            return '<div class="stat-bar-row">' +
                '<div class="stat-name">' + s.stat.name.toUpperCase().slice(0,3) + '</div>' +
                '<div class="stat-bg"><div class="stat-fill" style="width:' + pct + '%"></div></div>' +
                '<div style="font-size:0.4rem">' + s.base_stat + '</div></div>';
        }).join('');

        return '<div><div class="lcd-title">CORE STATS</div>' + bars + '</div>';
    },


    renderList: function(list, selectedId, searchTerm) {
        searchTerm = searchTerm || '';

        var filtered = list.filter(function(p) {
            return p.name.toLowerCase().includes(searchTerm.toLowerCase())
                || String(p.id).includes(searchTerm);
        });

        var items = filtered.map(function(pk) {
            var cls = pk.id === selectedId ? 'p-list-item selected' : 'p-list-item';
            return '<div class="' + cls + '" data-id="' + pk.id + '">' +
                '<div style="font-size:0.35rem; color:#888">#' + pk.id + '</div>' +
                '<div style="font-size:0.4rem">' + pk.name.toUpperCase() + '</div></div>';
        }).join('');

        return '<div>' +
            '<input type="text" id="list-search-input" placeholder="SEARCH ARCHIVE..." class="list-search-input" value="' + searchTerm + '">' +
            '<div class="pokemon-list-scroll">' + items + '</div></div>';
    },

    // gen filter tab
    renderFilter: function(currentGen) {
        var btns = POKEMON_GENS.map(function(g, i) {
            var cls = currentGen === i ? 'gen-btn active' : 'gen-btn';
            return '<button class="' + cls + '" data-gen="' + i + '" data-start="' + g.start + '">' + g.name + '</button>';
        }).join('');

        return '<div><div class="lcd-title">REGION SELECT</div>' +
               '<div style="display:grid; grid-template-columns:1fr 1fr; gap:5px">' + btns + '</div></div>';
    }
};
