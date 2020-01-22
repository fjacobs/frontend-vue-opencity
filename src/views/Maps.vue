<template>

    <div class="maps">
        <h1>{{ msg }}</h1>
        <div id="myMap"></div>
    </div>

</template>

<script>

    export default {
        name: 'hello',
        data() {
            return {
                msg: 'Smart City'
            }
        },
        mounted: function () {
            console.log("map: ", google.maps)
            this.map = new google.maps.Map(document.getElementById('myMap'), {
                center: {lat: 61.180059, lng: -149.822075},
                zoom: 4
            })
        }

    }
</script>
<style scoped>
    #myMap {
        height: 600px;
        width: 100%;
    }
</style>
