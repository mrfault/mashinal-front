<template>
  <div class="show-map-button">
    <button class="btn btn--dark-blue full-width" @click="showMap = true">
      <icon name="placeholder" /> {{ $t('map') }}
    </button>
    <portal to="modals">
      <backdrop @click="closeMap" v-if="showMap" @mount="beforeInit">
        <template #default="{ show }">
          <transition name="fade">
            <div class="map-wrapper" v-show="show" @keyup.prevent.enter="savePlaceOnMap">
              <div class="map lower" @click.stop>
                <div id="map"></div>
              </div>
              <div class="full-width" @click.stop>
                <div class="row mt-2 mt-lg-3">
                  <div class="col-lg-10">
                    <slot />
                  </div>
                  <div class="col-lg-2 mt-2 mt-lg-0">
                    <button class="btn btn--green full-width" @click="savePlaceOnMap">{{ $t('confirm') }}</button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </template>
      </backdrop>
    </portal>
  </div>
</template>

<script>
import { YMapsMixin } from '~/mixins/ymaps';

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
        restrictMapArea: [[85,-178.9], [-73.87011,180]]
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
        options: { noPlacemark: true }
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
      this.$emit('change-latlng', { lat: coords[0], lng: coords[1] });
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
      this.$emit('change-latlng', { lat: this.cacheLat, lng: this.cacheLng });
      this.$emit('change-address', this.cacheAddress);
      this.$nextTick(() => {
        this.showMap = false;
      });
    },
    handleEscapeKey(e) {
      if (e.key === 'Escape'){
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