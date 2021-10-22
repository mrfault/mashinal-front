<template>
  <div class="map-switch" @click="setMapView(!mapView), changeView()">
    <icon :name="mapView ? 'list' : 'placeholder'" />
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

    changeView() {
      this.$nextTick(() => {
        // fix floating button position by calling
        // scroll handler in layout mixin
        window.dispatchEvent(new Event('scroll'));
      });
    }
  }
}
</script>