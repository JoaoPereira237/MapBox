import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import { geojson } from './icons';

function App() {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const markersRef = useRef([]);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiODIyMDgxNiIsImEiOiJjbTFnZG5yZm0wMnUwMmxzaXltbGpkejQzIn0.-z9XH3aUAFvj6xR-qG-0sg';
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
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

        if (bounds.contains([lng, lat])) {
          console.log('Adding marker at:', [lng, lat]);
          const el = document.createElement('div');
          const width = marker.properties.iconSize[0];
          const height = marker.properties.iconSize[1];
          el.className = 'marker';
          el.style.backgroundImage = `url(https://picsum.photos/id/${marker.properties.imageId}/${width}/${height})`;
          el.style.width = `${width}px`;
          el.style.height = `${height}px`;

          el.addEventListener('click', () => {
            window.alert(marker.properties.message);
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
  }, []);

  return (
    <>
      <div id='map-container' ref={mapContainerRef} style={{ width: '100%', height: '100vh' }}/>
    </>
  );
}

export default App;