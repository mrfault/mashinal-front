<template>
  <div class="pages-commercial-id">
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
        <div class="row flex-column flex-lg-row">
          <div class="col-auto">
            <gallery />
            <comment :comment="announcement.comment" v-if="!isMobileBreakpoint">
              <template #before>
                <thumbs-gallery />
              </template>
            </comment>
          </div>
          <div class="col-auto">
            <quick-info />
            <vehicle-specs type="commercial" />
            <comment :comment="announcement.comment" v-if="isMobileBreakpoint" />
            <promote-card v-if="!isMobileBreakpoint" />
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
import ThumbsGallery from '~/components/announcements/inner/ThumbsGallery';
import Comment from '~/components/announcements/inner/Comment';
import PromoteCard from '~/components/announcements/inner/PromoteCard';

export default {
  name: 'pages-commercial-id',
  components: {
    QuickInfo,
    VehicleSpecs,
    Gallery,
    ThumbsGallery,
    Comment,
    PromoteCard
  },
  nuxtI18n: {
    paths: {
      az: '/ticari-avtomobiller/elan/:id'
    }
  },
  head() {
    let announcementTitle = `${this.$translateSoft(this.announcement.commercial_brand.name)} ${this.$translateSoft(this.announcement.commercial_model.name)}`;
    let title = `${this.$t(`meta-title_announcement-${this.announcement.is_new ? 'new' : 'used'}`, { announce: `${announcementTitle}, ${this.announcement.year}` })}`;
    let description = `${announcementTitle}, ${this.$t('meta-descr_announcement', { announce: `${this.announcement.price}` })}`;
    let image = this.getAnnouncementImage(this.announcement);
    return this.$headMeta({ title, description, image }, {
      category: 'Commercial',
      id: this.announcement.id_unique,
      autosalon: this.announcement.user.autosalon,
      brand: this.$translateSoft(this.announcement.commercial_brand.name),
      model: this.$translateSoft(this.announcement.commercial_model.name),
      year: this.announcement.year,
      price: { amount: this.announcement.price_int, currency: this.announcement.currency_id },
      services: this.announcement.type,
      new: this.announcement.is_new,
      available: this.announcement.status == 1,
      barter: this.announcement.tradeable,
      credit: this.announcement.credit
    });
  },
  async asyncData({ store, route }) {
    await Promise.all([
      store.dispatch('getAnnouncementInner', route.params.id),
      store.dispatch('getComplaintOptions'),
      store.dispatch('getOptions')
    ]);
  },
  methods: {
    getFilterLink(type) {
      let brand = { brand: '', model: '' };
      let form = {
        sorting: 'created_at_desc',
        additional_brands: {0: {...brand}, 1: {...brand}, 2: {...brand}, 3: {...brand}, 4: {...brand}},
        announce_type: 0,
        currency: 1,
        com_type: this.announcement.commercial_type_id
      }
      // insert announcement data into form
      if (type.includes('brand')) {
        form.additional_brands[0].brand = this.announcement.commercial_brand.id;
      }
      if (type.includes('model')) {
        form.additional_brands[0].model = this.announcement.commercial_model.id;
      }
      
      return `/commercial/${this.$t('slug_'+this.commercialSlug)}?filter=${encodeURI(JSON.stringify(form))}`
    }
  },
  computed: {
    ...mapGetters(['announcement']),

    commercialSlug() {
      return ({
        1: 'light',
        2: 'trucks',
        3: 'tractors',
        4: 'bus',
        5: 'trailers',
        6: 'agricultural',
        7: 'building',
        8: 'autoloader',
        9: 'cranes',
        10: 'excavators',
        11: 'bulldozers',
        12: 'forklift',
        13: 'utilities',
      })[this.announcement.commercial_type_id];
    },
    crumbs() {
      return [
        { name: this.$t('commercial'), route: '/commercial' },
        { name: this.$translateSoft(this.announcement.commercial_brand.name), route: this.getFilterLink('brand') },
        { name: this.$translateSoft(this.announcement.commercial_model.name), route: this.getFilterLink('brand-model') },
        { name: '#'+this.announcement.id_unique }
      ]
    }
  },
}
</script>