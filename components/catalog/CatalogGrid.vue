<template>
  <div :class="['catalog-grid', {'loading-content': pending, 'paginated': paginate}]">
    <div class="title" v-if="title">
      <h2>
        <span>{{ catalogTitle || title }}</span>
      </h2>
    </div>
    <div class="row mb-n2 mb-lg-n3">
      <template v-for="item in catalogItems">
        <div class="col-6 col-lg-1-5 mb-2 mb-lg-3" :key="item.id">
          <a class="catalog-grid_item" :href="$localePath(getLink(item))" @click.prevent="handleItemClick(item)">
            <div class="card">
              <div class="item-img">
                <img :src="getImage(item)" :alt="getTitle(item)" v-if="getImage(item)" />
                <img src="/img/car.svg" alt="" class="no-img" v-else/>
              </div>
              <h3 class="text-truncate" v-html="getTitle(item)"></h3>
            </div>
          </a>
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
export default {
  props: {
    items: {},
    title: String,
    pending: Boolean,
    paginate: {}
  },
  computed: {
    catalogTitle() {
      if (!this.$route.params.model) 
        return this.$t('select_model');
      else if (!this.$route.params.generation) 
        return this.$t('select_generation');
      else if (!this.$route.params.body) 
        return this.$t('select_carcase');
      return '';
    },
    catalogItems() {
      if (!this.$route.params.model) 
        return Object.values(this.items?.data || []).filter(item => item.parent);
      if (!this.items.length) return [];
      if (!this.$route.params.generation)
        return this.items?.filter(item => item.car_types.length > 0) || [];
      else
        return this.items[0]?.car_types.map((car_type) => ({
          car_type,
          ...this.items[0].car_type_generation.find(item => item.car_type_id === car_type.id)
        }));
    }
  },
  methods: {
    changePage(page) {
      this.$router.push({ query: { ...this.$route.query, page } }, () => {
        this.$emit('change-page', page);
      });
    },
    handleItemClick(item) {
      let path = this.$localePath(this.getLink(item));
      let scrollToGrid = !this.$route.params.generation;
      this.$router.push(path, () => {
        if (scrollToGrid) this.scrollTo('.catalog-grid', [-15, -20]);
        else this.scrollReset();
      });
    },
    getTitle(item) {
      const { brand, model, generation } = {...this.$route.params};
      if (model) {
        if (generation) 
          return item?.car_type.name[this.locale];
        else 
          return `${this.$translateHard(item.short_name)}<br/>${item.start_year} - ${item.end_year || this.currentYear}`;
      } else {
        return (!brand ? (item.parent.name + ' ') : '') + this.$translateHard(item.name);
      }
    },
    getLink(item) {
      const { brand, model, generation } = {...this.$route.params};
      const { filter } = {...this.$route.query}
      let path = model
        ? (generation ? `/catalog/${brand}/${model}/${generation}/${item.car_type_id}` : `/catalog/${brand}/${model}/${item.id}`)
        : (`/catalog/${item.parent.slug}/${item.slug}`);
      return filter ? `${path}?filter=${filter}` : path;
    },
    getImage(item) {
      const { model, generation } = {...this.$route.params};
      if (!model) {
        return item.transformed_media ? this.$withBaseUrl(item.transformed_media) : false;
      } else {
        let media = generation ? item.transformed_media.thumb : item.car_type_generation[0].transformed_media.thumb;
        return media?.length ? this.$withBaseUrl(media[0]) : false;
      }
    },
  }
}
</script>