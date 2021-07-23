<template>
  <div class="pages-announcement-edit">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="sell_cards-row row">
        <div class="col-auto">
          <div :class="{'card': !isMobileBreakpoint}">
            <sell-last-step 
              type="commercial"
              :edit="true"
              :restore="myAnnouncement.status == 3"
              :title="$t('edit_ad')"
              :key="lastStepKey"
              :initial-form="form"
              :announcement="myAnnouncement"
              @close="$router.push(pageRef || $localePath('/profile/announcements'))"
            />
          </div>
        </div>
        <div class="col-auto" v-if="!isMobileBreakpoint">
          <div class="card">
            <sell-preview 
              :form="form" 
              :brand="getAnnouncementBrandName(myAnnouncement)" 
              :model="getAnnouncementModelName(myAnnouncement)" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import SellLastStep from '~/components/sell/SellLastStep';
import SellPreview from '~/components/sell/SellPreview';

export default {
  name: 'pages-commercial-announcement-edit',
  middleware: 'auth_general',
  components: {
    SellLastStep,
    SellPreview
  },
  nuxtI18n: {
    paths: {
      az: '/ticari-avtomobiller/elan/:id/redakte'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('your_announcements')
    });
  },
  async asyncData({ store, route }) {
    await Promise.all([
      store.dispatch('getOptions'),
      store.dispatch('getColors'),
      store.dispatch('getCommercialAllOptions'),
      store.dispatch('getMyAnnouncement', route.params.id)
    ]);

    const announcement = store.state.myAnnouncement;
    
    const filters = store.state.commercialFilters;
    const category = announcement.commercial_type_id;
    await store.dispatch('getCommercialFilters', announcement.commercial_type_id);

    return {
      lastStepKey: 0,
      form: {
        category: category,
        filters: filters.map(item => item.search_key).reduce((form, key) => ({ ...form,  [key]: announcement[key] || '' }), {}),
        selectedYear: announcement.year,
        youtube: {
          id: announcement.youtube,
          thumb: `https://img.youtube.com/vi/${announcement.youtube}/hqdefault.jpg`
        },
        selectedColor: announcement.color_id,
        mileage: parseInt(announcement.mileage || 0),
        mileage_measure: announcement.mileage_measure || 1,
        region_id: announcement.region_id,
        address: announcement.address,
        lat: parseFloat(announcement.latitude || 0),
        lng: parseFloat(announcement.longitude || 0),
        vin: announcement.vin,
        price: announcement.price_int || '',
        owner_type: announcement.owner || 0,
        currency: announcement.currency_id || 1,
        car_number: announcement.car_number,
        show_car_number: announcement.show_car_number,
        show_vin: announcement.show_vin,
        badges: announcement.stickers?.map(item => item.id),
        new_badges: [],
        comment: announcement.comment || '',
        is_new: announcement.is_new, 
        beaten: announcement.beaten, 
        customs_clearance: announcement.customed, 
        tradeable: announcement.tradeable, 
        credit: announcement.credit,
        guaranty: announcement.guaranty, 
        saved_images: announcement.mediaIds
      }
    }
  },
  computed: {
    ...mapGetters(['myAnnouncement']),

    crumbs() {
      return [
        { name: this.$t('my_announces'), route: `/profile/announcements` },
        { name: `#${this.myAnnouncement.id_unique}`, route: `/commercial/announcement/${this.$route.params.id}` },
        { name: this.$t('edit_ad') }
      ]
    }
  }
}
</script>