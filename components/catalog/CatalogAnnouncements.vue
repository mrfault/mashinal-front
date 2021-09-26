<template>
  <div class="mt-lg-n1 mb-n5 mb-lg-0">
    <grid
      v-if="catalogAnnouncements.length"
      where="catalog"
      :announcements="catalogAnnouncements" 
    />
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  import Grid from '~/components/announcements/Grid';

  export default {
    props: {
      catalogId: Number
    },
    components: {
      Grid
    },
    computed: {
      ...mapGetters(['catalogAnnouncements'])
    },
    methods: {
      ...mapActions(['getCatalogAnnouncements'])
    },
    created() {
      this.getCatalogAnnouncements(this.catalogId);
    }
  }
</script>