<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout
      justify-center
      align-center
    >
      <v-flex md12>
         <material-card
            color="black"
            title="Smart City - Amsterdam"
            text="Road information"

          >
          <div class="maps">
            <div id="myMap" />
          </div>
         </material-card>


<!--     Control ---------------------------------->

        <material-card
           color="black"
           title="Control Panel"
           text="Rewind history"
        >
          <button @click="callServerMethod">Request Stream</button>
          <v-btn
            color="success"
            @click="snack()"
          >
          Replay
          </v-btn>

          <!--    REWIND HISTORY-->
          <v-snackbar
            v-model="snackbar"
            :top="top"
            dark
          >
          <div>
                <b> Rewinding history </b>
          </div>
          <v-icon
             size="16"
             @click="snackbar = false"
          >
          </v-icon>
         </v-snackbar>

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
      msg: '',
      top: true,
      snackbar: false
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
  },
  methods: {
    callServerMethod() {
      console.log("request - stream call...");
    },
    snack () {
      this.top = true
      this.snackbar = true
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
