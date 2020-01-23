<template>

  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout
      justify-center
      wrap
    >
      <v-flex md12>
        <material-card
          color="green"
          title="Smart City"
          text="Road information"
        >
      <div class="maps">
        <div id="myMap" />
      </div>
       </material-card>
      </v-flex>
      <h1>{{ msg }}</h1>

  </v-layout>

  </v-container>
</template>

<script>
import MapLoader from '../utils/MapLoader.ts'
import RSocketGeojsonClient from '../utils/RsocketGeojsonClient.ts'
import TravelTimeService from '../utils/TravelTime.ts'

const STREAM_LIVE = 'TRAVELTIME_STREAM'
// const STREAM_HISTORY = "TRAVELTIME_HISTORY";

const url = 'ws://localhost:9897/rsocket'
const key = 'AIzaSyB6SSvjmmzWA9zOVHhh4IsBbp3qqY25qas'

export default {
  name: 'Hello',
  data ()
  {
    return {
      msg: ''
    }
  },
  mounted: async function () {
    let map
    let googleMapsApi

    try {
      googleMapsApi = await MapLoader.getGoogleMapsApi(key)
      map = await MapLoader.createMap(googleMapsApi)
    } catch (error) {
      console.error('Error loading map. ' + error)
    }
    try {
      const travelTimeService = new TravelTimeService(
        map,
        googleMapsApi,
        new RSocketGeojsonClient(url)
      )
      await travelTimeService.subscribe(STREAM_LIVE)
    } catch (error) {
      console.error('Error in traveltime service: ' + error)
    }
  }
}
</script>
<style scoped>
#myMap {
  height: 600px;
  width: 100%;
}
</style>
