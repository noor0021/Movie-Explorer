
var cache = {};

async function fetchData(url) {
  if (cache[url]) return cache[url];

  var res = await fetch(url);
  if (!res.ok) throw new Error('Fetch failed: ' + res.status);

  var data = await res.json();
  cache[url] = data;
  return data;
}


function formatId(id) {
  return String(id).padStart(3, '0');
}
