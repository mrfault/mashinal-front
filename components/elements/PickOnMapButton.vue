<template>
   <div class="show-map-button">
      <button type="button" class="btn btn--dark-blue full-width" @click="showMap = true">
         {{ $t('map') }}
         <icon name="placeholder"/>
      </button>
      <portal to="modals">
         <backdrop @click="closeMap" v-if="showMap" @mount="beforeInit">
            <template #default="{ show }">
               <transition name="fade">
                  <div class="map-wrapper" v-show="show" @keyup.prevent.enter="savePlaceOnMap">
                     <div class="full-width">
                        <div class="row">
                           <div class="col-md-12 d-flex justify-content-between align-items-center">
                              <h4 class="title-modal">{{$t('choose_on_map')}}</h4>
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                 <span aria-hidden="true">&times;</span>
                              </button>
                           </div>
                        </div>
                     </div>
                     <div class="full-width" @click.stop>
                        <div class="row mt-2 mt-lg-3">
                           <div class="col-lg-10">
                              <slot/>
                           </div>
                           <div class="col-lg-2 mt-2 mt-lg-0">
                              <button class="btn btn--green full-width" @click="savePlaceOnMap">
                                 {{ $t('confirm') }}
                              </button>
                           </div>
                        </div>
                     </div>
                     <div class="map lower mt-3" @click.stop>
                        <div id="map"></div>
                     </div>
                  </div>
               </transition>
            </template>
         </backdrop>
      </portal>
   </div>
</template>

<script>
import {YMapsMixin} from '~/mixins/ymaps';

export default {
   props: {
      lat: Number,
      lng: Number,
      address: String
   },
   mixins: [YMapsMixin],
   data() {
      return {
         showMap: false,
         map: null,
         placemark: null,
         cacheLat: this.lat,
         cacheLng: this.lng,
         cacheAddress: this.address
      }
   },
   methods: {
      beforeInit() {
         this.ymapsScriptLoad().then(() => {
            ymaps.ready(this.init);
         });
         this.cacheLat = this.lat,
            this.cacheLng = this.lng,
            this.cacheAddress = this.address;
      },
      init() {
         this.map = new ymaps.Map('map', {
            center: [this.lat || 40.400651, this.lng || 49.8694303],
            zoom: 12,
            controls: ['zoomControl']
         }, {
            restrictMapArea: [[85, -178.9], [-73.87011, 180]]
         });

         this.placemark = new ymaps.Placemark(this.map.getCenter(), {}, {
            draggable: true,
            iconLayout: 'default#imageWithContent',
            iconLayoutSize: [28, 40],
            iconImageHref: '',
            iconImageOffset: [-14, -40],
            iconContentLayout: ymaps.templateLayoutFactory.createClass(`
          <div class="map-placemark">
            <img src="/icons/maps-placeholder.svg" alt="" />
          </div>
        `)
         });

         this.placemark.events.add('beforedragstart', (e) => {
            document.querySelector('.map-placemark').classList.add('grabbing');
         });

         this.placemark.events.add('dragend', (e) => {
            let coords = e.get('target').geometry.getCoordinates();
            this.applyCoordinates(coords);
            this.map.setCenter(coords, this.map.getZoom(), {duration: 300});
            document.querySelector('.map-placemark').classList.remove('grabbing');
         });

         this.map.geoObjects.add(this.placemark);

         const geolocationControl = new ymaps.control.GeolocationControl({
            options: {noPlacemark: true}
         });

         geolocationControl.events.add('locationchange', (e) => {
            const coords = e.get('position');
            this.placemark.geometry.setCoordinates(coords);
            this.applyCoordinates(coords);
            this.map.setCenter(coords, this.map.getZoom(), {duration: 300});
         });

         this.map.controls.add(geolocationControl);
      },
      applyCoordinates(coords) {
         this.$emit('change-latlng', {lat: coords[0], lng: coords[1]});
         ymaps.geocode(coords).then((res) => {
            let data = res.geoObjects.get(0).properties.getAll();
            this.$emit('change-address', data.text);
         });
      },
      savePlaceOnMap() {
         if (!this.map) return;
         if (!this.lat && !this.lng) {
            this.placemark.events.fire('dragend');
         }
         this.showMap = false;
      },
      closeMap() {
         this.$emit('change-latlng', {lat: this.cacheLat, lng: this.cacheLng});
         this.$emit('change-address', this.cacheAddress);
         this.$nextTick(() => {
            this.showMap = false;
         });
      },
      handleEscapeKey(e) {
         if (e.key === 'Escape') {
            this.closeMap();
         }
      }
   },
   mounted() {
      window.addEventListener('keydown', this.handleEscapeKey);
   },
   beforeDestroy() {
      window.removeEventListener('keydown', this.handleEscapeKey);
   }
}
</script>

<style>
.btn--dark-blue {
   background-color: #E3E8EF;
   border: 1px solid #E3E8EF;
   color: #121926;
   width: 164px;
   height: 52px;
   padding: 14px 16px 14px 16px;
   border-radius: 8px;
   gap: 4px;
   font-size: 16px;
   font-weight: 500;
   line-height: 20px;
   letter-spacing: 0;
   text-align: center;
   justify-content: center;
}
.btn--dark-blue i{
   margin-left: 5px;
}
.btn--green {
   width: 240px;
   height: 52px;
   padding: 14px 16px 14px 16px;
   border-radius: 8px;
   gap: 8px;
}

.backdrop {
   display: flex;
   justify-content: center;
   align-items: center;
}

.backdrop .map-wrapper {
   border: 1px solid #FFF;
   background-color: #FFF;
   padding: 20px;
   border-radius: 12px;
   height: max-content;
   max-height: max-content;
}

.map.lower {
   border-radius: 12px;
}
.title-modal{
   font-size: 24px;
   font-weight: 600;
   line-height: 28px;
   letter-spacing: 0;
   text-align: left;
   margin: 0;
   padding: 0;
}
.close{
   height: 32px;
   width: 32px;
   border-radius: 50%;
   background-color: #E3E8EF;
   border: 1px solid #E3E8EF;
   display: flex;
   justify-content: center;
   align-items: center;
   padding: 0;
}
.close:hover{
   box-shadow: 1px 2px 6px rgba(0,0,0, .19);
}
.close span{
   font-size: 24px;
   padding: 0;
   margin: -2px 0 0;
}
.dark-mode {
   .backdrop .map-wrapper {
      border: 1px solid #1B2434;
      background-color: #1B2434;
   }
   .close{
      background-color: #364152;
      border: 1px solid #364152;
   }
   .close span{
      color: #121926;
   }
   .close:hover,
   .close:focus{
      background-color: #3D475AFF;
      border: 1px solid #3D475AFF;
   }
}
</style>
