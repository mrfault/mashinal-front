<template>
  <div class="pages-commercial-id">
    <div class="container">
      <div class="announcements-inner">
        <breadcrumbs :crumbs="crumbs">
          <share-it type="publish" />
          <span class="text-data">
            <icon name="eye" />
            {{ announcement.view_count }}
            <icon name="cursor" />
            {{ announcement.open_count }}
          </span>
          <span class="text-data">
            <icon name="calendar" />
            {{ announcement.humanize_created_at }}
          </span>
        </breadcrumbs>
        <div class="row flex-column flex-lg-row">
          <div class="col-auto">
            <gallery>
              <quick-info type="commercial" brief />
              <announcement-specs type="commercial" brief />
            </gallery>
            <comment :comment="announcement.comment" v-if="!isMobileBreakpoint">
              <template #before>
                <thumbs-gallery />
              </template>
            </comment>
          </div>
          <div class="col-auto">
            <quick-info type="commercial" />
            <announcement-specs type="commercial" />
            <comment :comment="announcement.comment" v-if="isMobileBreakpoint" />
          </div>
        </div>
        <relatives />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import QuickInfo from '~/components/announcements/inner/QuickInfo';
import AnnouncementSpecs from '~/components/announcements/inner/AnnouncementSpecs';
import Gallery from '~/components/announcements/inner/Gallery';
import ThumbsGallery from '~/components/announcements/inner/ThumbsGallery';
import Comment from '~/components/announcements/inner/Comment';
import Relatives from '~/components/announcements/inner/Relatives';

export default {
  name: 'pages-commercial-id',
  components: {
    QuickInfo,
    AnnouncementSpecs,
    Gallery,
    ThumbsGallery,
    Comment,
    Relatives
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
      store.dispatch('getOptions'),
      store.dispatch('getCommercialTypes')
    ]);
  },
  methods: {
    getFilterLink(type) {
      let form = {
        sorting: 'created_at_desc',
        additional_brands: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} },
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
    ...mapGetters(['announcement', 'commercialTypes']),

    commercialSlug() {
      return this.commercialTypes.find(type => type.id == this.announcement.commercial_type_id)?.param;
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