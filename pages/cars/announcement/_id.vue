<template>
  <div class="pages-cars-id">
    <div class="container">
      <div class="announcements-inner">
        <breadcrumbs :crumbs="crumbs">
          <share-it type="publish" />
          <span class="text-data">
            <icon name="eye" />
            {{ announcement.open_count }}
          </span>
          <span class="text-data">
            <icon name="calendar" />
            {{ announcement.humanize_created_at }}
          </span>
        </breadcrumbs>
        <div class="row flex-column-reverse flex-lg-row">
          <div class="col-auto">
            <gallery />
            <comment :comment="announcement.comment" v-if="!isMobileBreakpoint">
              <hr v-if="announcement.comment" />
              <car-complects :options="announcement.options" />
            </comment>
          </div>
          <div class="col-auto">
            <quick-info />
            <vehicle-specs type="cars" />
            <comment :comment="announcement.comment" v-if="isMobileBreakpoint">
              <hr v-if="announcement.comment" />
              <car-complects :options="announcement.options" />
            </comment>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import QuickInfo from '~/components/announcements/inner/QuickInfo';
import VehicleSpecs from '~/components/announcements/inner/VehicleSpecs';
import Gallery from '~/components/announcements/inner/Gallery';
import Comment from '~/components/announcements/inner/Comment';
import CarComplects from '~/components/announcements/inner/CarComplects';

export default {
  name: 'pages-cars-id',
  components: {
    QuickInfo,
    VehicleSpecs,
    Gallery,
    Comment,
    CarComplects
  },
  nuxtI18n: {
    paths: {
      az: '/masinlar/elan/:id'
    }
  },
  head() {
    let announcementTitle = `${this.catalog.brand.name} ${this.$translateHard(this.catalog.model.name)}`;
    let title = `${this.$t(`meta-title_announcement-${this.announcement.is_new ? 'new' : 'used'}`, { announce: `${announcementTitle}, ${this.announcement.year}` })}`;
    let description = `${announcementTitle}, ${this.$t('meta-descr_announcement', { announce: `${this.announcement.price}` })}`;
    let image = this.announcement.media.main_inner ? this.announcement.media.main_inner[0] : this.announcement.media[Object.keys(this.announcement.media)[0]][0];
    return this.$headMeta({ title, description, image }, {
      category: 'Car',
      id: this.announcement.id_unique,
      autosalon: this.announcement.user.autosalon,
      brand: this.catalog.brand.name,
      model: this.catalog.model.name.replace('серия', 'seriya').replace('класс', 'klass'),
      year: this.announcement.year,
      price: { amount: this.announcement.price_int, currency: this.announcement.currency_id },
      services: this.announcement.type,
      new: this.announcement.is_new,
      available: this.announcement.status == 1,
      barter: this.announcement.exchange_possible,
      credit: this.announcement.credit
    });
  },
  async asyncData({ store, route }) {
    let id = route.params.id.slice(0, -1);
    await Promise.all([
      store.dispatch('getCarAnnouncement', { id }),
      store.dispatch('getComplaintOptions'),
      store.dispatch('getOptions'),
      store.dispatch('getAllOtherOptions')
    ]);
  },
  methods: {
    getFilterLink(type) {
      let brand = { brand: '', brand_slug: '', model: '', model_slug: '', generation: '' };
      let form = {
        sorting: 'created_at_desc',
        additional_brands: {0: {...brand}, 1: {...brand}, 2: {...brand}, 3: {...brand}, 4: {...brand}},
        all_options: {},
        announce_type: 1,
        currency: 1
      }
      // insert announcement data into form
      if (type.includes('brand')) {
        form.additional_brands[0].brand = this.catalog.brand.id;
        form.additional_brands[0].brand_slug = this.catalog.brand.slug;
      }
      if (type.includes('model')) {
        form.additional_brands[0].model = this.catalog.model.id;
        form.additional_brands[0].model_slug = this.catalog.model.slug;
      }
      if (type.includes('generation')) {
        form.additional_brands[0].generation = this.catalog.generation.id;
      }
      
      return `/cars?car_filter=${encodeURI(JSON.stringify(form))}`
    }
  },
  computed: {
    ...mapGetters(['announcement', 'catalog']),

    crumbs() {
      return [
        { name: this.$t('cars'), route: '/cars' },
        { name: this.catalog.brand.name, route: this.getFilterLink('brand') },
        { name: this.catalog.model.name, route: this.getFilterLink('brand-model') },
        { name: this.$translateHard(this.catalog.generation.name[this.locale]), route: this.getFilterLink('brand-model-generation') },
        { name: '#'+this.announcement.id_unique }
      ]
    }
  },
}
</script>