// app state — keeps track of everything
var state = {
    pokemonList: [],
    selectedId: 1,
    pokemonData: null,
    speciesData: null,
    loading: false,
    currentTab: 'info',
    shinyMode: false,
    currentGen: 0,
    favorites: [],
    searchTerm: '',
    bootPhase: 'splash',
    isOpened: false
};

// updates the whole UI based on current state
function render() {
    // left side — pokemon image
    var display = document.getElementById('pokemon-display-container');
    display.innerHTML = UI.renderDisplay(state.pokemonData, state.loading, state.shinyMode);

    // status bar at bottom left
    var status = document.getElementById('status-display');
    var isFav = state.favorites.includes(state.selectedId);
    if (state.loading) {
        status.textContent = 'BUSY...';
    } else {
        status.textContent = 'ID: ' + formatId(state.selectedId) + (isFav ? ' ❤️' : '');
    }

    // right side — lcd screen content depends on which tab is active
    var lcd = document.getElementById('lcd-info-content');
    if (state.currentTab === 'info') {
        lcd.innerHTML = UI.renderInfo(state.pokemonData, state.speciesData);
    } else if (state.currentTab === 'stats') {
        lcd.innerHTML = UI.renderStats(state.pokemonData);
    } else if (state.currentTab === 'list') {
        lcd.innerHTML = UI.renderList(state.pokemonList, state.selectedId, state.searchTerm);
    } else if (state.currentTab === 'filter') {
        lcd.innerHTML = UI.renderFilter(state.currentGen);
    }

    // highlight the active tab
    document.querySelectorAll('.menu-tab').forEach(function(tab) {
        if (tab.getAttribute('data-tab') === state.currentTab) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // highlight active action buttons
    document.querySelectorAll('.cyan-btn').forEach(function(btn) {
        var action = btn.getAttribute('data-action');
        if (action === 'tab-list') btn.classList.toggle('active', state.currentTab === 'list');
        if (action === 'tab-filter') btn.classList.toggle('active', state.currentTab === 'filter');
        if (action === 'tab-stats') btn.classList.toggle('active', state.currentTab === 'stats');
        if (action === 'tab-info') btn.classList.toggle('active', state.currentTab === 'info');
        if (action === 'toggle-shiny') btn.classList.toggle('active', state.shinyMode);
    });

    // fav button text
    var favBtn = document.getElementById('fav-btn');
    favBtn.textContent = isFav ? 'REM' : 'FAV';
    if (isFav) favBtn.classList.add('active');
    else favBtn.classList.remove('active');
}


// fetches full details for whatever pokemon is currently selected
async function loadPokemon() {
    state.loading = true;
    render();

    try {
        var results = await Promise.all([
            fetchData(API_URL + '/pokemon/' + state.selectedId),
            fetchData(API_URL + '/pokemon-species/' + state.selectedId)
        ]);
        state.pokemonData = results[0];
        state.speciesData = results[1];
    } catch (err) {
        console.warn('Could not load pokemon ' + state.selectedId, err);
    }

    state.loading = false;
    render();
}


// go to next/prev pokemon
function goNext() {
    state.selectedId = state.selectedId < 1025 ? state.selectedId + 1 : 1;
    loadPokemon();
}
function goPrev() {
    state.selectedId = state.selectedId > 1 ? state.selectedId - 1 : 1025;
    loadPokemon();
}


// wires up all the click handlers
function setupEvents() {
    // nav buttons
    document.getElementById('nav-next-btn').onclick = goNext;
    document.getElementById('nav-prev-btn').onclick = goPrev;

    // d-pad mirrors the nav buttons
    document.getElementById('d-pad-up').onclick = goPrev;
    document.getElementById('d-pad-down').onclick = goNext;
    document.getElementById('d-pad-left').onclick = goPrev;
    document.getElementById('d-pad-right').onclick = goNext;

    // top tabs
    document.querySelectorAll('.menu-tab').forEach(function(tab) {
        tab.onclick = function() {
            state.currentTab = this.getAttribute('data-tab');
            render();
        };
    });

    // cyan action buttons on right side
    document.querySelectorAll('.cyan-btn').forEach(function(btn) {
        btn.onclick = function() {
            var act = this.getAttribute('data-action');
            if (act === 'tab-list') { state.currentTab = 'list'; render(); }
            else if (act === 'tab-stats') { state.currentTab = 'stats'; render(); }
            else if (act === 'tab-info') { state.currentTab = 'info'; render(); }
            else if (act === 'tab-filter') { state.currentTab = 'filter'; render(); }
            else if (act === 'toggle-shiny') { state.shinyMode = !state.shinyMode; render(); }
            else if (act === 'exit') { window.location.href = '../landing/index.html'; }
        };
    });

    // fav button
    document.getElementById('fav-btn').onclick = function() {
        if (state.favorites.includes(state.selectedId)) {
            state.favorites = state.favorites.filter(function(id) { return id !== state.selectedId; });
        } else {
            state.favorites.push(state.selectedId);
        }
        render();
    };

    // shiny toggle (the red oval button on the left side)
    document.getElementById('shiny-toggle-btn').onclick = function() {
        state.shinyMode = !state.shinyMode;
        render();
    };

    // event delegation for stuff inside the LCD screen
    // (list items and gen buttons get created dynamically so we catch clicks on the parent)
    document.getElementById('lcd-info-content').onclick = function(e) {
        var listItem = e.target.closest('.p-list-item');
        if (listItem) {
            state.selectedId = parseInt(listItem.getAttribute('data-id'));
            state.currentTab = 'info';
            loadPokemon();
            return;
        }

        var genBtn = e.target.closest('.gen-btn');
        if (genBtn) {
            state.currentGen = parseInt(genBtn.getAttribute('data-gen'));
            state.selectedId = parseInt(genBtn.getAttribute('data-start'));
            state.currentTab = 'info';
            loadPokemon();
        }
    };

    // search input inside the list tab
    document.getElementById('lcd-info-content').oninput = function(e) {
        if (e.target.id === 'list-search-input') {
            state.searchTerm = e.target.value;
            // only re-render the scroll area so the input doesnt lose focus
            var scroll = document.querySelector('.pokemon-list-scroll');
            if (!scroll) return;

            var filtered = state.pokemonList.filter(function(p) {
                return p.name.toLowerCase().includes(state.searchTerm.toLowerCase())
                    || String(p.id).includes(state.searchTerm);
            });

            var html = filtered.map(function(pk) {
                var cls = pk.id === state.selectedId ? 'p-list-item selected' : 'p-list-item';
                return '<div class="' + cls + '" data-id="' + pk.id + '">' +
                    '<div style="font-size:0.2rem;color:#666">#' + pk.id + '</div>' +
                    '<div style="font-size:0.26rem">' + pk.name.toUpperCase() + '</div></div>';
            }).join('');

            scroll.innerHTML = html;
        }
    };
}


// the opening boot animation sequence
function bootSequence() {
    var frame = document.getElementById('pokedex-frame');
    var rightPanel = document.getElementById('right-section');
    var bootOverlay = document.getElementById('boot-screen');

    // after 3.5s show the pokedex frame
    setTimeout(function() {
        frame.classList.remove('hidden');
        frame.classList.add('entering');
    }, 3500);

    // after 4.5s unfold the right panel
    setTimeout(function() {
        rightPanel.classList.remove('is-closed');
    }, 4500);

    // after 5.8s hide boot screen, show final state
    setTimeout(function() {
        bootOverlay.classList.add('fade-out');
        frame.classList.remove('entering');
        frame.classList.add('ready');
    }, 5800);
}


// kicks everything off when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // load the full pokemon list first
    try {
        var data = await fetchData(API_URL + '/pokemon?limit=1025');
        state.pokemonList = data.results.map(function(item, index) {
            return { id: index + 1, name: item.name };
        });
    } catch (err) {
        console.error('Failed to load pokemon list:', err);
    }

    setupEvents();
    bootSequence();
    loadPokemon();
});
