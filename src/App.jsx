import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

const App = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]); 

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiODIyMDgxNiIsImEiOiJjbTFnY2hibGEwMmJvMmpzZWo1dWdxZWwxIn0.a-VEhNNZ7ojZLTe1LrG73Q';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/8220816/cm1ghkhu3002801pi22egfdr9',
      center: [-8.017, 41.14961],
      zoom: 5 
    });

    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            message: 'Foo',
            imageId: 1011,
            iconSize: [60, 60]
          },
          geometry: {
            type: 'Point',
            coordinates: [-8.61099, 41.14961]
          }
        },
        {
          type: 'Feature',
          properties: {
            message: 'Bar',
            imageId: 870,
            iconSize: [50, 50]
          },
          geometry: {
            type: 'Point',
            coordinates: [-8.61099, 39.14961]
          }
        },
        {
          type: 'Feature',
          properties: {
            message: 'Baz',
            imageId: 837,
            iconSize: [40, 40]
          },
          geometry: {
            type: 'Point',
            coordinates: [-8.61099, 38.14961]
          }
        }
      ]
    };

    const addMarkers = () => {
      geojson.features.forEach((marker, index) => {
        const el = document.createElement('div');
        const [width, height] = marker.properties.iconSize;
        el.className = 'marker';
        el.style.backgroundImage = `url(https://picsum.photos/id/${marker.properties.imageId}/${width}/${height})`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = '100%';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';

        el.addEventListener('click', () => {
          window.alert(marker.properties.message);
        });

        const mapMarker = new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates);

        markersRef.current.push(mapMarker);
      });
    };

    const showMarkersAtZoom = (zoomLevel) => {
      markersRef.current.forEach((marker, index) => {
        if (zoomLevel >= 15) {  
          if (!marker._map) marker.addTo(mapRef.current);
        } else {
          if (marker._map) marker.remove();
        }
      });
    };

    addMarkers();

    mapRef.current.on('zoom', () => {
      const zoomLevel = mapRef.current.getZoom();
      showMarkersAtZoom(zoomLevel);
    });

    mapRef.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true,
        fitBoundsOptions: {
          maxZoom: 11 
        }
      })
    );

    return () => {
      if (mapRef.current) {
        markersRef.current.forEach((marker) => marker.remove());
        mapRef.current.remove();
      }
    };
  }, []);

  return <div ref={mapContainerRef} id="map" style={{ height: '100vh', width: '100vw' }} />;
};

export default App;
