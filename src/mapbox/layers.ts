import type { AnyLayer } from "mapbox-gl"

export const neighbourhoodLayer: AnyLayer = {
    id: "neighbourhoods",
    type: "fill",
    source: "neighbourhoods",
    paint: {
        "fill-color": "#088",
        "fill-opacity": 0.4,
    },
}

export const listingLayer: AnyLayer = {
    id: "listings",
    type: "circle",
    source: "listings",
    filter: ['!', ['has', 'point_count']],
    paint: {
        'circle-color': '#da1122',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
    }
}

export const unclusterdListingLayer: AnyLayer = {
  id: "listings",
  type: "circle",
  source: "listings",
  filter: ['!', ['has', 'point_count']],
  paint: {
      'circle-color': '#da1122',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
  }
}

export const airBnbLocationClusterLayer: AnyLayer = {
    id: "cluster-listings",
    type: "circle",
    source: "listings",
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#ce1e1e',
        100,
        '#f1f075',
        750,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
      ]
    },
  };
  
  export const airBnbLocationCountLayer: AnyLayer = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'listings',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  }