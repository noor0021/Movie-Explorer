
const API_URL = 'https://pokeapi.co/api/v2';


const TYPE_COLORS = {
  normal:'#9da3aa', fire:'#ff6b35', water:'#4a90d9', electric:'#f7c948',
  grass:'#56c568', ice:'#74d0f1', fighting:'#c24f3d', poison:'#a65fc1',
  ground:'#d97a3b', flying:'#89aaff', psychic:'#f95587', bug:'#8dc63f',
  rock:'#b8a038', ghost:'#6053a0', dragon:'#5b58e0', dark:'#5a5265',
  steel:'#6e8ea5', fairy:'#e88fd0',
};

const POKEMON_GENS = [
  { name: 'All',     start: 1,   end: 1025 },
  { name: 'Gen I',   start: 1,   end: 151  },
  { name: 'Gen II',  start: 152, end: 251  },
  { name: 'Gen III', start: 252, end: 386  },
  { name: 'Gen IV',  start: 387, end: 493  },
  { name: 'Gen V',   start: 494, end: 649  },
  { name: 'Gen VI',  start: 650, end: 721  },
  { name: 'Gen VII', start: 722, end: 809  },
  { name: 'Gen VIII',start: 810, end: 905  },
  { name: 'Gen IX',  start: 906, end: 1025 },
];
