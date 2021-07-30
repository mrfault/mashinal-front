<template>
  <div class="show-map-button">
    <button class="btn btn--dark-blue full-width" @click="showMap = true">
      <icon name="placeholder" /> {{ $t('map') }}
    </button>
    <backdrop @click="showMap = false" v-if="showMap" @mount="beforeInit">
      <template #default="{ show }">
        <transition name="fade">
          <div class="map-wrapper" v-show="show">
            <template v-if="isStatic">
              <img @click.stop class="static-map" :src="staticMapsUrl" alt="" />
            </template>
            <template v-else>
              <div class="map" @click.stop>
                <div id="map"></div>
              </div>
            </template>
          </div>
        </transition>
      </template>
    </backdrop>
  </div>
</template>

<script>
export default {
  props: {
    lat: Number,
    lng: Number,
    isStatic: Boolean
  },
  data() {
    return {
      showMap: false,
      map: null
    }
  },
  computed: {
    staticMapsUrl() {
      return `https://static-maps.yandex.ru/1.x/?
        ll=${this.lng},${this.lat}
        &pt=${this.lng},${this.lat},vkbkm
        &size=650,450
        &z=15
        &l=map
        &lang=${this.locale}_${this.locale.toUpperCase()}`
          .replace(/\s+/g,'');
    }
  },
  methods: {
    beforeInit() {
      if (this.isStatic) return;
      ymaps.ready(this.init);
    },
    init() {
      this.map = new ymaps.Map('map', {
        center: [this.lat,this.lng],
        zoom: 15,
        controls: ['zoomControl','geolocationControl']
      });

      let markOps = {
        iconLayout: 'default#image',
        iconImageHref: '/icons/maps-placeholder.svg',
        iconImageSize: [28, 40],
        iconImageOffset: [-14, -40]
      }
      
      this.map.geoObjects
        .add(new ymaps.Placemark(this.map.getCenter(), {}, markOps));
    }
  }
}
</script>