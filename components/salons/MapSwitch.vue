<template>
  <div class="map-switch" @click="setMapView(!mapView), callEvent()">
    <icon :name="mapView ? 'list' : 'placeholder'" />
    <span>{{ $t(mapView ? 'list' : 'map') }}</span>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['mapView'])
  },
  methods: {
    ...mapActions(['setMapView']),

    callEvent() {
      this.$nextTick(() => {
        // fix floating button position by calling
        // scroll handler in layout mixin
        window.dispatchEvent(new Event('scroll'));
      });
    }
  },
  watch: {
    $route() {
      setTimeout(this.callEvent, 10);
    }
  }
}
</script>