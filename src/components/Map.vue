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


        // (3) Voeg hier je layers toe & (7) Pas nog meer layers toe


      })
    })

    const onNeighbourhoodChange = async () => {
        // (4) Voeg hier je code toe

        // (8) Roep de boundsToNeighbourhood functie aan binnen onNeighbourhoodChange

    }

    // (9) Filter de features van de buurt
    
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

