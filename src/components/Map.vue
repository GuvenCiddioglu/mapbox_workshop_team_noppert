<script setup lang="ts">
    import mapboxgl from "mapbox-gl";
    import { onMounted, ref } from "vue";
    // @ts-ignore
    import * as turf from '@turf/turf'
    import type { NeighbourhoodDTO } from "@/types/neighbourhood"

    const map = ref<mapboxgl.Map>();
    const neighbourhoods = ref<NeighbourhoodDTO[]>([]);
    const selectedNeighbourhood = ref<string>("");
    const geojson = ref<string>("")

    onMounted(async () => {
        const result = await fetch("https://localhost:7292/neighbourhoods/names");
        neighbourhoods.value = await result.json() as NeighbourhoodDTO[];


        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
        map.value = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            center: [2.347, 48.859],
            zoom: 11.72,
        })

        map.value.on("load", async () => {
            const result = await fetch("https://localhost:7292/listings/coordinates");
            geojson.value = await result.json();

            //Voeg hier je source toe
            

            // Voeg hier je layers toe
        })
    })

    const onNeighbourhoodChange = async () => {
        // Voeg hier je code toe
        
    }

    const boundsToNeighbourhood = (neighbourhood: string) => {
        // Voeg hier je code toe
        
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

