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

          <!------  Notification---------------------------------------------->
          <v-snackbar v-model="startReplay" :top="top" dark>
            <div>
              <b> Replay started</b>
            </div>
            <v-icon size="100" @click="startReplay = false"></v-icon>
          </v-snackbar>

          <v-snackbar v-model="pauseReplay" :top="top" dark>
            <div>
              <b> Replay paused/started </b>
            </div>
            <v-icon size="100" @click="pauseReplay = false"></v-icon>
          </v-snackbar>

          <v-snackbar v-model="startLive" :top="top" dark>
            <div>
              <b> Livestream started </b>
            </div>
            <v-icon size="100" @click="startReplay = false"></v-icon>
          </v-snackbar>

          <!------------------------------------------------------------------->

          <div class="maps">
            <div id="myMap"/>
          </div>

          <v-container fluid>

            <v-row>
              <v-col cols="12" sm="6" class="py-2" >

                <v-btn color="success" @click="streamLive()">
                  Live stream
                </v-btn>

               <p>Replay control</p>
                <v-btn-toggle v-model="toggle_exclusive">

                  <v-btn color="success" @click="streamHistory()">
                    Start/Reset
                  </v-btn>

                  <!--todo-->
                  <v-btn color="success" @click="streamRewind()">
                    Rewind
                  </v-btn>
                  <v-btn color="error" @click="streamPauze()">
                    Pause/Resume
                  </v-btn>

                  <v-btn color="success" @click="streamFastforward()"> <!--todo-->
                    Fast Forward
                  </v-btn>

                  <v-text-field
                      class="purple-input"
                      label="Replay speed"
                  />

                </v-btn-toggle>
              </v-col>
            </v-row>

          </v-container>

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
    const STREAM_HISTORY = "TRAVELTIME_REPLAY_MINIMAL";

    const url = 'ws://localhost:9897/rsocket'
    const key = 'AIzaSyB6SSvjmmzWA9zOVHhh4IsBbp3qqY25qas'

    export default {
        name: 'Hello',
        roadService: undefined,
        data() {
            return {
                msg: '',
                top: true,
                toggle_exclusive: 2,
                startReplay: false,
                startLive: false,
                pauseReplay: false,
                roadService: this.roadService
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
                this.roadService = new TravelTimeService(
                    map,
                    googleMapsApi,
                    new RSocketGeojsonClient(url)
                )
                await this.roadService.liveSubscription(STREAM_LIVE)
            } catch (error) {
                console.error('Error in traveltime service: ' + error)
            }
        }, methods: {
            async streamLive() {
                this.top = true
                try {
                    this.startLive = true;
                    this.roadService.cancelSubscription();
                    await this.roadService.liveSubscription(STREAM_LIVE)
                } catch (error) {
                    console.error('Error live streaming. ' + error)
                }
            },
            async streamHistory() {
                this.top = true
                this.startReplay = true
                try {
                    this.roadService.cancelSubscription();
                    await this.roadService.replaySubscription(STREAM_HISTORY, 500)
                } catch (error) {
                    console.error('Error replaying history. ' + error)
                }
            },

            async streamPauze() {
                this.top = true
                this.pauseReplay = true
                try {
                    await this.roadService.playPause();
                } catch (error) {
                    console.error('Error pauzeReplay. ' + error)
                }
            },
            async test() {
                this.top = true
                try {
                    this.roadService.cancelSubscription();
                    await this.roadService.test()
                } catch (error) {
                    console.error('Error replaying history. ' + error)
                }
            },

            async streamRewind() {

            },

            async streamFastforward() {

            },
        }
    }
</script>
<style scoped>
  #myMap {
    height: 600px;
    width: 100%;
  }
</style>
