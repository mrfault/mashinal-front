<template>
  <div class="map-wrapper" ref="mapWrapper">
    <div class="map" @click.stop>
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { YMapsMixin } from '~/mixins/ymaps';

export default {
  props: {
    marginLeft: {},
    marginTop: {},
    useMarginLeft: Boolean
  },
  mixins: [YMapsMixin],
  data() {
    return {
      map: null,
      placemarks: [],
      marginAccessors: {}
    }
  },
  computed: {
    ...mapGetters(['salonsFiltered'])
  },
  methods: {
    init() {
      this.map = new ymaps.Map('map', {
        center: [40.400651, 49.8694303],
        zoom: 12,
        controls: ['zoomControl','geolocationControl'],
        // autoFitToViewport: 'always' 
      }, {
        geolocationControlPosition: {
          top: '20px',
          right: '20px'
        },
        zoomControlPosition: {
          bottom: '40px',
          right: '20px'
        }
      });
      
      this.panMapToCenter(0);

      this.salonsFiltered.map((salon, i) => {
        this.placemarks[i] = new ymaps.Placemark([salon.lat, salon.lng], {}, {
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

        this.map.geoObjects.add(this.placemarks[i]);
      });
    },
    panMapToCenter(duration = 600) {
      if (!this.marginAccessors.topArea) 
        this.marginAccessors.topArea = this.marginTop && this.map.margin.addArea(this.marginTop);
      if (!this.marginAccessors.leftArea) 
        this.marginAccessors.leftArea = this.marginLeft && this.map.margin.addArea(this.marginLeft);
      if (this.marginLeft && !this.useMarginLeft) {
        this.marginAccessors.leftArea.remove();
        this.marginAccessors.leftArea = false;
      }
      
      // this.map.panTo(this.map.getCenter(), { useMapMargin: true, duration });
    },
    resize() {
      this.map.container.fitToViewport();
    }
  },
  watch: {
    useMarginLeft() {
      this.panMapToCenter();
    }
  },
  mounted() {
    this.ymapsScriptLoad().then(() => {
      ymaps.ready(this.init);
    });
  }
}
</script>