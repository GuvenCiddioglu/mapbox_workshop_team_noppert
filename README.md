# mapbox-workshop
Voordat we beginnen, moeten we de .env-file aanmaken en configureren met onze Mapbox API-sleutel. Volg deze stappen om aan de slag te gaan:

## Mapbox API-key

**Als je nog geen Mapbox account en API-key hebt, doe dan eerst dit. Heb je dit al wel? sla de volgende stappen over en ga verder**
1. Ga naar: https://www.mapbox.com/ en creëer een account
2. Creëer vervolgens een API-key aan op: https://account.mapbox.com/access-tokens/



1. Kopieer het bestand .env.example naar een nieuw bestand genaamd .env
2. Open het bestand .env en vul je Mapbox API-key in naast de variabele VITE_MAPBOX_API_KEY.
3. Sla het bestand op.

In deze workshop maken we alleen wijzigingen in het component: Map.vue Deze is te vinden bij `'src' > 'components'`

1. Open de applicatie in je favorieten IDE
2. Installeer alle benodigde dependencys door: `npm install` uit te voeren in de root folder van het project.
3. Start de website met: `npm run dev`

## Map source toevoegen
Navigeer naar het component: `'Map.vue'` (open de map: `src`. Open dan: `components`)

Om listings op de Mapbox kaart te weergeven moet een source worden toegevoegd aan de map. Plaats de onderstaande code toe in de function `map.on("load")`

Code snippet: 1
```typescript
map.value?.addSource("listings", {
    type: "geojson",
    data: geojson.value
})

map.value?.addSource("neighbourhoods", {
    type: "geojson",
    data: "https://raw.githubusercontent.com/blackmad/neighborhoods/master/paris.geojson"
})
```

Hiermee worden de nodige data toegevoegd aan de kaart. Het toevoegen van bronnen is essentieel voor het weergeven van verschillende gegevenslagen op de kaart.

## Map layer toevoegen
Om de brondata zichtbaar te maken op de kaart, moeten we gebruik maken van layers. Volg de onderstaande stappen:

Importeer eerst de lagen die we willen toevoegen:

Code snippet: 2
```typescript
// Importeer eerst de layers
import { listingLayer, neighbourhoodLayer } from "@/mapbox/layers"
```
Plaats vervolgens de volgende code binnen de functie `map.on("load")` om de lagen toe te voegen aan de kaart:

Code snippet: 3
```typescript
map.value?.addLayer(neighbourhoodLayer)
map.value?.addLayer(listingLayer)
```
Met deze stappen worden de lagen geïmporteerd en toegevoegd aan de kaart, waardoor de brondata zichtbaar wordt voor de gebruiker.

## GeoJson filteren
Om de kaart dynamisch bij te werken op basis van de geselecteerde buurt, moeten we de GeoJSON-gegevens filteren. Hier is hoe we dit kunnen doen binnen de `onNeighbourhoodChange` functie:

Code snippet: 4
``` typescript
// Haal de geselecteerde buurt en alle lijstopnames op
const neighbourhood = selectedNeighbourhood.value
const allListings = geojson.value;

// Haal de bron op waar de lijstopnames zijn opgeslagen
const mapSource = map.value?.getSource("listings") as mapboxgl.GeoJSONSource

// Haal de gegevens op voor de geselecteerde buurt van de server
const result = await fetch(`https://localhost:7292/listings/neighbourhoods/${neighbourhood}`)
const json = await result.json();

// Controleer of er een buurt is geselecteerd
if (!neighbourhood) {
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
map.value?.setFilter("neighbourhoods", ["==", "name", neighbourhood])
mapSource.setData(json);
```

## Clustering
Om clustering toe te voegen aan je kaart, volg je onderstaande stappen:

1. Pas eerst je source aan van listings om clustering mogelijk te maken. Voeg de cluster en clusterRadius eigenschappen toe aan de bron:
   
Code snippet: 5

 ```typescript
 map.value?.addSource("listings", {
     type: "geojson",
     data: geojson.value,
     'cluster': true,
     'clusterRadius': 50,
 })
 ```

Nu heeft mapbox een extra property toegevoegd. Genaamd `point_count`.

2. Om clustering toe te voegen aan je map, importeer je eerst de juiste layers die nodig zijn voor clustering. Pas de layer import aan en zorg ervoor dat deze layers zijn geïmporteerd:

Code snippet: 6 
```typescript
 // import eerst de juiste layers
 import { neighbourhoodLayer, airBnbLocationClusterLayer, airBnbLocationCountLayer, unclusterdListingLayer } from "@/mapbox/layers"
 ```

3. Voeg vervolgens de clustering layers toe aan de kaart. Vervang de layers die je al heb gedefineerd met de onderstaande layers. Let op de volgorde van toevoeging om overlapping van layers te voorkomen:

Code snippet: 7
```typescript
 map.value?.addLayer(airBnbLocationClusterLayer)
 map.value?.addLayer(airBnbLocationCountLayer)
 map.value?.addLayer(unclusterdListingLayer)
 ```
## Naar een buurt 'bouncen'
In deze stap maken we gebruik van de boundsToNeighbourhood functie om naar een specifieke buurt te navigeren. Volg de onderstaande stappen om dit te implementeren:

1. Roep eerst de boundsToNeighbourhood functie aan binnen de onNeighbourhoodChange functie om de kaart naar de geselecteerde buurt te laten 'bouncen'.

2. Om naar een buurt te navigeren, maken we gebruik van de open-source bibliotheek van Mapbox genaamd Turf.js. Dit stelt ons in staat om de geografische grenzen van de buurt te berekenen.

Hier is de code voor het implementeren van deze stap:

Code snippet: 8
``` typescript
// Roep de boundsToNeighbourhood functie aan binnen onNeighbourhoodChange
boundsToNeighbourhood(neighbourhood);
```

Code snippet: 9
``` typescript
// Definieer de boundsToNeighbourhood functie
const boundsToNeighbourhood = (neighbourhood: string) => {
    // Filter de features van de buurt
    const filteredFeatures = map.value?.querySourceFeatures("neighbourhoods", {
        filter: ["==", "name", neighbourhood],
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
```