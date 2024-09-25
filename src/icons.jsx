export const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        message: 'Lisboa',
        imageId: 1011,
        iconSize: [60, 60]
      },
      geometry: {
        type: 'Point',
        coordinates: [-9.1393, 38.7223]
      }
    },
    {
      type: 'Feature',
      properties: {
        message: 'Porto',
        imageId: 870,
        iconSize: [50, 50]
      },
      geometry: {
        type: 'Point',
        coordinates: [-8.611, 41.1496]
      }
    },
    {
      type: 'Feature',
      properties: {
        message: 'Faro',
        imageId: 837,
        iconSize: [40, 40]
      },
      geometry: {
        type: 'Point',
        coordinates: [-7.9137, 37.0194]
      }
    }
  ]
};