<script setup lang="ts">
    import mapboxgl from "mapbox-gl";
    import { onMounted, ref } from "vue";
    import type { Feature, FeatureCollection, GeoJsonObject, Geometry } from "geojson"
    import neigbourhoods from '@/../data/neigbourhoods.json';
    import listings from '@/../data/listings.json';
    // @ts-ignore
    import * as turf from '@turf/turf'
    import type { NeighbourhoodDTO } from "@/types/neighbourhood"

    // (2) Importeer layers && (6) voeg de juiste layers toe
    // import eerst de juiste layers
    import { neighbourhoodLayer, airBnbLocationClusterLayer, airBnbLocationCountLayer, unclusterdListingLayer } from "@/mapbox/layers"

    const map = ref<mapboxgl.Map>();
    const neighbourhoods = ref<NeighbourhoodDTO[]>([]);
    const selectedNeighbourhood = ref<string>("");
    const geojson = ref<FeatureCollection>()

    onMounted(async () => {
      neighbourhoods.value = neigbourhoods;


      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
      map.value = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/streets-v12",
          center: [2.347, 48.859],
          zoom: 11.72,
      })

      map.value.on("load", async () => {
        geojson.value = listings as FeatureCollection<Geometry, GeoJsonObject>;

        // (1) Voeg hier je source toe & (5) Voeg hier clustering toe
        map.value?.addSource("listings", {
            type: "geojson",
            data: geojson.value,
            'cluster': true,
            'clusterRadius': 50,
        })

        map.value?.addSource("neighbourhoods", {
            type: "vector",
            url: "mapbox://username.clvgc35v20ntc1nlqicdpzzv5-89ayz"
        })

        // (3) Voeg hier je layers toe & (7) Pas nog meer layers toe
        map.value?.addLayer(neighbourhoodLayer)
        map.value?.addLayer(airBnbLocationClusterLayer)
        map.value?.addLayer(airBnbLocationCountLayer)
        map.value?.addLayer(unclusterdListingLayer)

      })
    })

    const onNeighbourhoodChange = async () => {
        // (4) Voeg hier je code toe
        // Haal de geselecteerde buurt en alle listings op
        const neighbourhood = selectedNeighbourhood.value
        const allListings = geojson.value;

        // Haal de source op waar de listings zijn opgeslagen
        const mapSource = map.value?.getSource("listings") as mapboxgl.GeoJSONSource

        // Haal de gegevens op voor de geselecteerde buurt
        const result = allListings?.features.filter((feature: Feature) => feature.properties && feature.properties.neighbourhood == neighbourhood) || []

        // Controleer of er een buurt is geselecteerd
        if (!neighbourhood) {
            // Controlleer of allListings niet undifined is.
            if(!allListings) return
            // Als er geen buurt is geselecteerd, verwijder dan het filter en laad alle listings
            map.value?.setFilter("neighbourhoods", null)
            mapSource.setData(allListings)
            // Vlieg naar een standaardlocatie en zoomniveau
            map.value?.flyTo({
                center: [2.347, 48.859],
                zoom: 11.72,
            });

            return;
        };

        // Pas het filter toe op de buurt en update de kaart met de gefilterde gegevens
        map.value?.setFilter("neighbourhoods", ["==", "neighbourhood", neighbourhood])
        mapSource.setData({
          type: "FeatureCollection",
          features: result
        });

        // (8) Roep de boundsToNeighbourhood functie aan binnen onNeighbourhoodChange
        // Roep de boundsToNeighbourhood functie aan binnen onNeighbourhoodChange
        boundsToNeighbourhood(neighbourhood);
    }

    // (9) Filter de features van de buurt
    // Definieer de boundsToNeighbourhood functie
    const boundsToNeighbourhood = (neighbourhood: string) => {
        // Filter de features van de buurt
        const filteredFeatures = map.value?.querySourceFeatures("neighbourhoods", {
          sourceLayer: "Neighbourhood_Paris",
          filter: ["==", "neighbourhood", neighbourhood],
        });

        // Controleer of er features zijn gevonden
        if (filteredFeatures && filteredFeatures.length) {
            // Maak een feature collectie aan met de gefilterde features
            const featureCollection = turf.featureCollection(filteredFeatures);
            // Bereken de grenzen van de buurt
            const bounds = turf.bbox(featureCollection);

            // Pas de kaart aan om de grenzen van de buurt weer te geven
            map.value?.fitBounds(bounds, {
                padding: 40,
                maxZoom: 13
            });

            return;
        }
    }
</script>

<template>
  <div>
    <div class="height" id="map"></div>

    <select v-model="selectedNeighbourhood" @change="onNeighbourhoodChange" class="custom-select">
      <option selected value="">Paris</option>
      <option v-for="neighbourhood in neighbourhoods" :value="neighbourhood.name">{{ neighbourhood.name }}</option>
    </select>
  </div>
</template>

<style scoped>
    .height{
        height: 600px;
        width: 100%;
    }

    .custom-select {
        display: inline-block;
        background-color: #f8f9fa;
        border: 1px solid #ced4da;
        border-radius: 4px;
        padding: 8px 12px;
        font-size: 16px;
        line-height: 1.5;
        cursor: pointer;
    }
</style>

