<template>
  <div class="map-wrapper" ref="mapWrapper">
    <div class="map" @click.stop>
      <div id="map" :class="{hide: !centerUpdated}"></div>
    </div>
    <div class="sr-only" ref="salonInfo">
      <div class="balloon-content">
        <salon-card :salon="selectedSalon" :key="selectedSalon.id" v-if="selectedSalon" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { YMapsMixin } from '~/mixins/ymaps';
import { SalonsMixin } from '~/mixins/salons';

import SalonCard from '~/components/salons/SalonCard';

export default {
  props: {
    marginLeft: {
      default: 0
    },
    marginTop: {
      default: 0
    },
    useMarginLeft: {
      type: Boolean,
      default: false
    },
    checkBounds: {
      type: Boolean,
      default: true
    }
  },
  components: {
    SalonCard
  },
  mixins: [YMapsMixin, SalonsMixin],
  data() {
    return {
      map: null,
      objectManager: null,
      placemarks: [],
      marginAccessors: {},
      cacheMapCenter: [40.400651, 49.8694303],
      centerUpdated: false,
      selectedSalon: null
    }
  },
  computed: {
    ...mapGetters(['salonsList', 'salonsSearched', 'salonsFiltered', 'salonsInBounds'])
  },
  methods: {
    ...mapActions(['updateSalonsInBounds']),

    init() {
      this.map = new ymaps.Map('map', {
        center: this.cacheMapCenter,
        zoom: 1,
        controls: ['zoomControl','geolocationControl','typeSelector'],
        // autoFitToViewport: 'always'
      }, {
        restrictMapArea: [[85,-178.9], [-73.87011,180]],
        geolocationControlPosition: !this.isMobileBreakpoint
          ? { bottom: '170px', left: '20px' }
          : { top: '20px', left: '20px' },
        zoomControlPosition: !this.isMobileBreakpoint
          ? { bottom: '40px', left: '20px' }
          : { bottom: '40px', left: '20px' },
        typeSelectorPosition: !this.isMobileBreakpoint
          ? { bottom: '135px', left: '20px' }
          : { top: '20px', right: '20px' },
        typeSelectorSize: 'small',
        zoomControlSize: 'small'
      });

      this.map.controls.options.set('panoramasItemMode', 'off');

      this.objectManager = new ymaps.ObjectManager({
        clusterize: true,
        gridSize: 128,
        zoomMargin: 50,
        geoObjectBalloonAutoPanMargin: [90, 20, 220, 20],
        geoObjectOpenBalloonOnClick: false,
        geoObjectHideIconOnBalloonOpen: false,
        geoObjectIconLayout: 'default#imageWithContent',
        geoObjectIconLayoutSize: [30, 30],
        geoObjectIconImageHref: '',
        geoObjectIconImageOffset: [-15, -15],
        geoObjectIconContentLayout: ymaps.templateLayoutFactory.createClass(`
          <div class="map-geoobject"></div>
        `),
        clusterIconLayout: 'default#imageWithContent',
        clusterIconLayoutSize: [50, 50],
        clusterIconImageHref: '',
        clusterIconImageOffset: [-25, -25],
        clusterIconContentLayout: ymaps.templateLayoutFactory.createClass(`
          <div class="map-cluster"><span>{{ properties.geoObjects.length }}</span></div>
        `),
        clusterIconShape: {
          type: 'Rectangle',
          coordinates: [[-25, -25], [25, 25]]
        }
      });

      this.objectManager.objects.events.add('click', (e) => {
        let id = e.get('objectId');
        let object = this.objectManager.objects.getById(id);
        this.$set(this, 'selectedSalon', object.data);
        this.$nextTick(() => {
          object.properties.balloonContent = this.$refs.salonInfo?.innerHTML || '';
          this.objectManager.objects.balloon.setData(object);
          this.objectManager.objects.balloon.open(id);
        });
      });

      this.objectManager.objects.balloon.events.add('click', () => {
        this.$emit('balloon-click', this.selectedSalon?.slug || '')
      });

      this.map.geoObjects.add(this.objectManager);

      this.updatePlacemarks(false);
      this.updateMapMargin();
      this.updateMapCenter(0, true);

      if (this.checkBounds) {
        this.map.events.add('boundschange', (e) => {
          let list = this.salonsList.filter(salon => salon.lat).filter(salon => {
            let bounds = this.map.getBounds(true);
            return ymaps.util.bounds.containsPoint(bounds, [salon.lat, salon.lng]);
          });

          this.updateSalonsInBounds(list.map(salon => salon.id));
        });
      }

      this.$nuxt.$on('filter-salons', this.setFilters);
    },
    updatePlacemarks(filter = true) {
      this.objectManager.removeAll();
      this.objectManager.add({
        type: 'FeatureCollection',
        features: this.salonsList.filter(salon => salon.lat).map((salon) => ({
          type: 'Feature',
          id: salon.id,
          geometry: {
            type: 'Point',
            coordinates: [salon.lat, salon.lng]
          },
          properties: {
            balloonContent: salon.name,
            clusterCaption: salon.name,
            hintContent: salon.name,
            iconCaption: salon.name
          },
          data: salon
        }))
      });

      if (filter) this.setFilters();
    },
    setFilters() {
      this.objectManager?.setFilter((object) => !!this.salonsFiltered.find(salon => salon.id == object.id));
    },
    updateMapCenter(duration = 600, filter = false) {
      if (!this.salonsList.filter(salon => salon.lat).length) {
        this.centerUpdated = true;
        return;
      } else if (this.centerUpdated && !this.salonsFiltered.length) return;
      this.map.setBounds(this.map.geoObjects.getBounds(), {
        duration: duration,
        checkZoomRange: true,
        zoomMargin: this.map.margin.getMargin(),
      }).done(() => {
        this.cacheMapCenter = this.map.getCenter();
        if (filter) this.setFilters();
        this.centerUpdated = true;
        this.map.setZoom(12);
      }, (err) => {
        this.centerUpdated = true;
      });
    },
    updateMapMargin() {
      if (!this.marginAccessors.topArea)
        this.marginAccessors.topArea = this.marginTop && this.map.margin.addArea(this.marginTop);
      if (!this.marginAccessors.leftArea)
        this.marginAccessors.leftArea = this.marginLeft && this.map.margin.addArea(this.marginLeft);
      if (this.marginLeft && !this.useMarginLeft) {
        this.marginAccessors.leftArea.remove();
        this.marginAccessors.leftArea = false;
      }
    },
    resize() {
      this.map.container.fitToViewport();
    }
  },
  watch: {
    // useMarginLeft() {
    //   this.updateMapMargin();
    //   this.updateMapCenter();
    // }
  },
  mounted() {
    this.ymapsScriptLoad().then(() => {
      ymaps.ready(this.init);
    });
  },
  beforeDestroy() {
    this.updateSalonsInBounds(false);
    this.$nuxt.$off('filter-salons', this.setFilters);
  }
}
</script>
