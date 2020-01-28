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

                    <!------  Notification-->
                    <v-snackbar v-model="notif" :top="top" dark>
                        <div>
                            <b> Replay history </b>
                        </div>
                        <v-icon size="50" @click="notif = false"></v-icon>
                    </v-snackbar>
                    <!------------------------------------------------------------------->

                    <div class="maps">
                        <div id="myMap"/>
                    </div>

                    <v-btn color="success" @click="streamLive()">
                        Live stream
                    </v-btn>

                    <v-btn color="success" @click="streamHistory()">
                        Replay
                    </v-btn>


                    <v-btn color="success" @click="channelTest()">
                        ChannelTest
                    </v-btn>


                </material-card>


                <!--   Control Panel ---------------------------------->

                <material-card color="black" title="Control Panel">


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
    const STREAM_HISTORY = "TRAVELTIME_HISTORY";

    const url = 'ws://localhost:9897/rsocket'
    const key = 'AIzaSyB6SSvjmmzWA9zOVHhh4IsBbp3qqY25qas'

    export default {
        name: 'Hello',
        roadService: undefined,
        data() {
            return {
                msg: '',
                top: true,
                notif: false,
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
                this.notif = true
                try {
                    this.roadService.cancelSubscription();
                    await this.roadService.liveSubscription(STREAM_LIVE)
                } catch (error) {
                    console.error('Error live streaming. ' + error)
                }
            },
            async streamHistory() {
                this.top = true
                this.notif = true
                try {
                    this.roadService.cancelSubscription();
                    await this.roadService.replaySubscription(STREAM_HISTORY)
                } catch (error) {
                    console.error('Error replaying history. ' + error)
                }
            },
            async channelTest() {
                this.top = true
                this.notif = true
                try {
                    this.roadService.cancelSubscription();
                    await this.roadService.replaySubscription(STREAM_HISTORY)
                } catch (error) {
                    console.error('Error replaying history. ' + error)
                }
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
