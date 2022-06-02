export function fetchCountries(name) {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
  const options = {};

  return fetch(url, options).then(response =>
    response.json().then(data => data)
  );
}
