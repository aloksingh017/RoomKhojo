
mapboxgl.baseApiUrl = 'https://api.mapbox.com';
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
center:[83.789319, 83.789319], // starting position [lng, lat]
zoom: 9 // starting zoom
});




