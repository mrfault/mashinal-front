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
export default {
  props: {
    lat: Number,
    lng: Number,
    address: String
  },
  data() {
    return {
      showMap: false,
      map: null,
      cacheLat: this.lat,
      cacheLng: this.lng,
      cacheAddress: this.address
    }
  },
  computed: {
    
  },
  methods: {
    beforeInit() {
      ymaps.ready(this.init);
      this.cacheLat = this.lat,
      this.cacheLng = this.lng,
      this.cacheAddress = this.address;
    },
    init() {
      this.map = new ymaps.Map('map', {
        center: [this.lat || 40.400651, this.lng || 49.8694303],
        zoom: 12,
        controls: ['zoomControl','geolocationControl']
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
    },
    applyCoordinates(coords) {
      this.$emit('change-latlng', { lat: coords[0], lng: coords[1] });
      ymaps.geocode(coords).then((res) => {
        let data = res.geoObjects.get(0).properties.getAll();
        this.$emit('change-address', data.text);
      });
    },
    savePlaceOnMap() {
      this.showMap = false;
    },
    closeMap() {
      this.$emit('change-latlng', { lat: this.cacheLat, lng: this.cacheLng });
      this.$emit('change-address', this.cacheAddress);
      this.$nextTick(() => this.showMap = false);
    }
  }
}
</script>