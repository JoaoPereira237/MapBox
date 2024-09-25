import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import { geojson } from './icons';

function App() {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const markersRef = useRef([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiODIyMDgxNiIsImEiOiJjbTFnZG5yZm0wMnUwMmxzaXltbGpkejQzIn0.-z9XH3aUAFvj6xR-qG-0sg';
    
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-8.0, 39.5],
        zoom: 6.12,
      });

      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true,
        fitBoundsOptions: {
          maxZoom: 11 
        }
      });

      mapRef.current.addControl(geolocateControl);

      const addMarkers = () => {
        const zoom = mapRef.current.getZoom();
        console.log('Current zoom level:', zoom);

        if (zoom < 9) {
          console.log('Zoom level is less than 9, not adding markers.');
          markersRef.current.forEach(marker => marker.remove());
          markersRef.current = [];
          return;
        }

        const bounds = mapRef.current.getBounds();
        console.log('Map bounds:', bounds);

        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        console.log('Existing markers removed');

        for (const marker of geojson.features) {
          const [lng, lat] = marker.geometry.coordinates;
          const rating = ratings[marker.properties.message] || 0;

          if (bounds.contains([lng, lat])) {
            console.log('Adding marker at:', [lng, lat]);
            const el = document.createElement('div');
            const width = marker.properties.iconSize[0];
            const height = marker.properties.iconSize[1];
            el.className = 'marker';
            el.style.backgroundImage = `url(https://picsum.photos/id/${marker.properties.imageId}/${width}/${height})`;
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.borderColor = getBorderColor(rating);

            el.addEventListener('click', () => {
              const newRating = promptRating(marker.properties.message, [lng, lat]);
              if (newRating !== null) {
                setRatings(prevRatings => ({
                  ...prevRatings,
                  [marker.properties.message]: newRating
                }));
              }
            });

            const mapMarker = new mapboxgl.Marker(el)
              .setLngLat([lng, lat])
              .addTo(mapRef.current);

            markersRef.current.push(mapMarker);
          } else {
            console.log('Marker out of bounds:', [lng, lat]);
          }
        }
      };

      mapRef.current.on('moveend', addMarkers);
      mapRef.current.on('zoomend', addMarkers);
      geolocateControl.on('geolocate', addMarkers);

      return () => {
        mapRef.current.off('moveend', addMarkers);
        mapRef.current.off('zoomend', addMarkers);
        geolocateControl.off('geolocate', addMarkers);
        mapRef.current.remove();
      };
    }
  }, [ratings]);

  const handleSearch = () => {
    const feature = geojson.features.find(f => f.properties.message.toLowerCase() === searchQuery.toLowerCase());
    if (feature) {
      const [lng, lat] = feature.geometry.coordinates;
      mapRef.current.flyTo({ center: [lng, lat], zoom: 12 });
    } else {
      alert('Icon not found');
    }
  };

  const promptRating = (message, coordinates) => {
    const rating = prompt(`Rate ${message} from 1 to 5 stars:`);
    const parsedRating = parseInt(rating, 10);
    if (parsedRating >= 1 && parsedRating <= 5) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.flyTo({ center: coordinates, zoom: currentZoom });
      return parsedRating;
    }
    alert('Invalid rating. Please enter a number between 1 and 5.');
    return null;
  };

  const getBorderColor = (rating) => {
    switch (rating) {
      case 1: return 'black';
      case 2: return 'red';
      case 3: return 'yellow';
      case 4: return 'green';
      case 5: return 'blue';
      default: return 'white';
    }
  };

  return (
    <>
      <div className="search-bar">
        <input 
          type="text" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Search by message" 
        />
        <button onClick={handleSearch}>🔍</button>
      </div>
      <div id='map-container' ref={mapContainerRef} style={{ width: '100%', height: '100vh' }}/>
    </>
  );
}

export default App;