<template>
   <div class="pages-dashboard pt-2 pt-lg-5 mb-5 pb-5">
      <div class="container">
         <div class="row">
            <div class="col-md-12">
               <div id="panorama"></div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   head() {
      return {
         script: [
            {
               src: 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js',
               body: true,
               async: true,
               defer: true
            }
         ],
         link: [{ rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css' }]
      }
   },
   mounted() {
      let interval = setInterval(() => {
         if (window.pannellum) {
            pannellum.viewer('panorama', {
               "type": "equirectangular",
               "panorama": "http://10.20.120.187:3000/360/test2.png",
               "autoLoad": true,
               "autoRotate": -8,
               "compass": false,
               "autoRotateInactivityDelay": 5,
               "mouseZoom": false,
               "keyboardZoom": false,
               "showZoomCtrl": false,
               "showControls": false,
               "draggable": false,
               "yaw": 0,
               "pitch": 0,
               "hfov": 100,
               "avoidShowingBackground": false,
               "backgroundColor": [0,0,0],
            });

            clearInterval(interval);
         }
      }, 1000);
   }
}
</script>

<style scoped>
#panorama {
   width: 100%;
   height: 500px;
}
</style>
