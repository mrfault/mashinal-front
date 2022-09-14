<template>
  <div>
    <template v-if="announcement.is_part_salon || announcement.is_autosalon || announcement.is_external_salon">
      <grid
        v-if="shopAnnouncements.data && shopAnnouncements.data.length"
        :announcements="shopAnnouncements.data"
        :title="title"
      />
    </template>
    <template v-else>
      <grid
        v-if="relativeAnnouncements.data && relativeAnnouncements.data.length"
        :announcements="relativeAnnouncements.data"
        :title="title"
      />
    </template>
    <infinite-loading
      :action="announcement.is_part_salon || announcement.is_autosalon || announcement.is_external_salon ? 'getShopOtherAnnouncementsWithoutMutate': 'getRelativeAnnouncementsWithoutMutate'"
      :getter="announcement.is_part_salon || announcement.is_autosalon || announcement.is_external_salon ? 'shopAnnouncements': 'relativeAnnouncements'"
    />
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
        else if (this.announcement.is_external_salon)
          return this.$t('salon_other_announcements', { name: this.announcement.user.external_salon.name });
        return this.$t('relative_announcements');
      }
    },
    methods: {
      ...mapActions(['getRelativeAnnouncements', 'getShopOtherAnnouncements'])
    },
    mounted() {
    console.log('mounted relative')
    },
    created() {
      if (this.announcement.is_part_salon || this.announcement.is_autosalon || this.announcement.is_external_salon)
        this.getShopOtherAnnouncements({ id: this.announcement.id_unique });
      else this.getRelativeAnnouncements({ id: this.announcement.id_unique });
    },
    beforeDestroy() {
      this.mutate({ property: 'relativeAnnouncements', value: {} });
      this.mutate({ property: 'temporaryLazyData', value: {} });
      this.mutate({ property: 'shopAnnouncements', value: {} });
    }
  }
</script>
