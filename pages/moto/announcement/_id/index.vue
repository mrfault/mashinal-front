<template>
  <div class="pages-moto-id">
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
              <quick-info type="moto" brief />
              <announcement-specs type="moto" brief />
            </gallery>
            <comment :comment="announcement.comment" v-if="!isMobileBreakpoint">
              <template #before>
                <thumbs-gallery />
              </template>
            </comment>
          </div>
          <div class="col-auto">
            <quick-info type="moto" />
            <announcement-specs type="moto" />
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
  name: 'pages-moto-id',
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
      az: '/moto/elan/:id'
    }
  },
  head() {
    let announcementTitle = `${this.motoBrand.name} ${this.motoModel.name}`;
    let title = `${this.$t(`meta-title_announcement-${this.announcement.is_new ? 'new' : 'used'}`, { announce: `${announcementTitle}, ${this.announcement.year}` })}`;
    let description = `${announcementTitle}, ${this.$t('meta-descr_announcement', { announce: `${this.announcement.price}` })}`;
    let image = this.getAnnouncementImage(this.announcement);
    let category = 'Motorcycle';
    if (this.announcement.moto_atv_brand) category = 'Atv';
    else if (this.announcement.scooter_brand) category = 'Scooter';
    return this.$headMeta({ title, description, image }, {
      category,
      id: this.announcement.id_unique,
      autosalon: this.announcement.user.autosalon,
      brand: this.motoBrand.name,
      model: this.motoModel.name,
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
      store.dispatch('getMotoOptions')
    ]);
  },
  methods: {
    getFilterLink(type) {
      let form = {
        sorting: 'created_at_desc',
        additional_brands: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} },
        announce_type: 0,
        currency: 1
      }
      // insert announcement data into form
      if (type.includes('brand')) {
        form.additional_brands[0].brand = this.motoBrand.id;
      }
      if (type.includes('model')) {
        form.additional_brands[0].model = this.motoModel.id;
      }
      
      let slug = 'motorcycles';
      if (this.announcement.moto_atv_brand) slug = 'atvs';
      else if (this.announcement.scooter_brand) slug = 'scooters';
      return `/moto/${this.$t('slug_'+slug)}?filter=${encodeURI(JSON.stringify(form))}`
    }
  },
  computed: {
    ...mapGetters(['announcement']),

    motoBrand() {
      return this.announcement.moto_brand || this.announcement.moto_atv_brand || this.announcement.scooter_brand;
    },
    motoModel() {
      return this.announcement.moto_model || this.announcement.moto_atv_model || this.announcement.scooter_model;
    },
    crumbs() {
      return [
        { name: this.$t('moto'), route: '/moto' },
        { name: this.motoBrand.name, route: this.getFilterLink('brand') },
        { name: this.motoModel.name, route: this.getFilterLink('brand-model') },
        { name: '#'+this.announcement.id_unique }
      ]
    }
  },
}
</script>