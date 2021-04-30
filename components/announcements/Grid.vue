<template>
  <div :class="['announcements-grid', {'loading-content': pending, 'paginated': paginate}]">
    <div class="title" v-if="title">
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
      <div class="col-6 col-lg-auto mb-2 mb-lg-3" v-for="announcement in announcements" :key="announcement.id_unique">
        <grid-item :announcement="announcement" />
      </div>
    </div>
    <pagination 
      v-if="paginate && paginate.last_page > 1"
      :page-count="paginate.last_page"
      :value="paginate.current_page"
      @changePage="changePage"
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
    paginate: {},
    pending: Boolean
  },
  components: {
    GridItem
  },
  methods: {
    changePage(page) {
      if(this.showAll) {
        this.$emit('pending');
        this.$router.push({ path: this.showAll, query: { page } }, () => {
          this.scrollTo('.announcements-grid', [-15, -20]);
        });
      } else {
        this.$router.push({ query: { ...this.$route.query, page } }, () => {
          this.$emit('changePage', page);
        });
      }
    }
  }
}
</script>