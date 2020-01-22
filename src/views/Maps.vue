<template>

    <div class="maps">
        <h1>{{ msg }}</h1>
        <div id="myMap"></div>
    </div>

</template>

<script>

    import MapLoader from '../utils/MapLoader.ts';
    import RSocketGeojsonClient from "../utils/RsocketGeojsonClient.ts";
    import TravelTimeService from "../utils/TravelTime.ts";
    import initNotificationTable from "../utils/NotificationTable.ts";

    const STREAM_LIVE = "TRAVELTIME_STREAM";
    const STREAM_HISTORY = "TRAVELTIME_HISTORY";

    const url = 'ws://localhost:9897/rsocket';
    let key =  'AIzaSyB6SSvjmmzWA9zOVHhh4IsBbp3qqY25qas';

    export default {
        name: 'hello',
        data() {
            return {
                msg: 'Smart City'
            }
        },
        mounted: async function () {
            let map;
            let googleMapsApi;

            try {
                googleMapsApi = await MapLoader.getGoogleMapsApi(key);
                map = await MapLoader.createMap(googleMapsApi);
            } catch (error) {
                console.error("Error loading map. " + error);
            }

            initNotificationTable();

            try {
                let travelTimeService = new TravelTimeService(map, googleMapsApi, new RSocketGeojsonClient(url));
                await travelTimeService.subscribe(STREAM_LIVE);
            } catch (error) {
                console.error("Error in traveltime service: " + error);
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
