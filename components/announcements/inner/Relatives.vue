<template>
  <div>
    <template v-if="announcement.is_part_salon || announcement.is_autosalon">
      <grid
        :announcements="shopAnnouncements.data"
        :title="title"
      />
      <infinite-loading
        action="getShopOtherAnnouncementsWithoutMutate"
        getter="shopAnnouncements"
        :per-page="20"
      />
    </template>
    <template v-else>
      <grid
        v-if="relativeAnnouncements.length"
        :announcements="relativeAnnouncements"
        :title="title"
      />
    </template>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  import Grid from '~/components/announcements/Grid';

  export default {
    components: {
      Grid
    },
    computed: {
      ...mapGetters(['announcement', 'relativeAnnouncements', 'shopAnnouncements']),

      title() {
        if (this.announcement.is_part_salon)
          return this.$t('shop_other_announcements', { name: this.announcement.user.part_salon.name });
        else if (this.announcement.is_autosalon)
          return this.$t('salon_other_announcements', { name: this.announcement.user.autosalon.name });
        return this.$t('relative_announcements');
      }
    },
    methods: {
      ...mapActions(['getRelativeAnnouncements', 'getShopOtherAnnouncements'])
    },
    created() {
      if (this.announcement.is_part_salon || this.announcement.is_autosalon)
        this.getShopOtherAnnouncements({ id: this.announcement.id_unique });
      else this.getRelativeAnnouncements({ id: this.announcement.id_unique });
    },
    beforeDestroy() {
      this.mutate({ property: 'relativeAnnouncements', value: [] });
      this.mutate({ property: 'shopAnnouncements', value: {} });
    }
  }
</script>
