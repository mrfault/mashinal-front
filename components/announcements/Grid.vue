<template>
  <div :class="['announcements-grid', {'loading-content': pending, 'paginated': paginate}]">
    <div class="title grid-title" v-if="title && showTitle">
      <h2>
        <icon :name="iconName" v-if="iconName" />
        <span>{{ title }}</span>
      </h2>
      <nuxt-link v-if="showAll" :to="showAll">
        {{ $t('all') }}
        <icon name="arrow-right" />
      </nuxt-link>
    </div>
    <div class="row mb-n2 mb-lg-n3">
      <template v-for="(announcement, index) in announcements">
        <div class="col-6 col-lg-auto mb-2 mb-lg-3" :key="announcement.id_unique + '_' + index">
          <grid-item 
            :announcement="announcement" 
            :show-checkbox="showCheckbox" 
            :show-status="showStatus"
            :show-phone-count="showPhoneCount"
            :track-views="trackViews"
          />
        </div>
      </template>
    </div>
    <pagination 
      v-if="paginate && paginate.last_page > 1"
      :page-count="paginate.last_page"
      :value="paginate.current_page"
      @change-page="changePage"
    />
  </div>
</template>

<script>
import GridItem from '~/components/announcements/GridItem';

export default {
  props: {
    announcements: {
      type: Array,
      default: () => ([])
    },
    title: String,
    iconName: String,
    showAll: String,
    showTitle: {
      type: Boolean,
      default: true
    },
    trackViews: {
      type: Boolean,
      default: true
    },
    pushIntoRouter: {
      type: Boolean,
      default: true
    },
    showStatus: Boolean,
    showCheckbox: Boolean,
    showPhoneCount: Boolean,
    paginate: {},
    pending: Boolean,
    watchRoute: Boolean
  },
  components: {
    GridItem
  },
  methods: {
    changePage(page) {
      if (this.showAll) {
        this.$emit('pending');
        this.$router.push({ path: this.showAll, query: { page } }, () => {
          this.scrollTo('.announcements-grid', [-15, -20]);
        });
      } else {
        if (!this.pushIntoRouter) {
          this.$emit('change-page', page);
        } else {
          this.$router.push({ query: { ...this.$route.query, page } }, () => {
            this.$emit('change-page', page);
          });
        }
      }
    }
  },
  watch: {
    '$route.query.page'(page) {
      if (this.watchRoute) 
        this.changePage(page);
    }
  }
}
</script>