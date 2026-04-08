// simple cache so we dont hit the API for the same thing twice
var cache = {};

async function fetchData(url) {
  if (cache[url]) return cache[url];

  var res = await fetch(url);
  if (!res.ok) throw new Error('Fetch failed: ' + res.status);

  var data = await res.json();
  cache[url] = data;
  return data;
}

// pads the id to 3 digits like 001, 025 etc
function formatId(id) {
  return String(id).padStart(3, '0');
}
