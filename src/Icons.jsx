export const geojson = {
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