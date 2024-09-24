import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css'

function App() {

  const mapRef = useRef()
  const mapContainerRef = useRef()

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiODIyMDgxNiIsImEiOiJjbTFnZG5yZm0wMnUwMmxzaXltbGpkejQzIn0.-z9XH3aUAFvj6xR-qG-0sg'
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-8.0, 39.5],
      zoom: 6.12,
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
      mapRef.current.remove()
    }
  }, [])

  return (
    <>
      <div id='map-container' ref={mapContainerRef}/>
    </>
  )
}

export default App