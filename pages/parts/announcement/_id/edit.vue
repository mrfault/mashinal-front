<template>
  <div class="pages-sell">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <sell-progress :form="form" />
      <div class="sell_cards-row row">
        <div class="col-auto">
          <div class="card">
            <sell-parts-form
              :initialForm="myAnnouncement"
              isEdit
            />
          </div>
        </div>
        <div class="col-auto" v-if="!isMobileBreakpoint">
          <div class="card">
            <sell-preview type="part" :form="form" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SellProgress from '~/components/sell/SellProgress';
import SellPreview from '~/components/sell/SellPreview';
import SellPartsForm from '~/components/sell/SellPartsForm';

export default {
  name: 'pages-parts-announcement-edit',
  middleware: 'auth_general',
  nuxtI18n: {
    paths: {
      az: '/ehtiyat-hisseleri/elan/:id/redakte'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('your_announcements')
    });
  },
  async asyncData({ store, route }) {
    store.dispatch('setSellPreviewData', { value: {} });
    await Promise.all([
      store.dispatch('getMyAnnouncement', route.params.id)
    ]);

  },
  components: {
    SellProgress,
    SellPreview,
    SellPartsForm
  },
  computed: {
    ...mapGetters({
      myAnnouncement: 'myAnnouncement',
      form: 'parts/form'
    }),
    brand() {
      return "Brand"
    },
    model() {
      return "Model"
    },
    crumbs() {
      return [
        { name: this.$t('my_announces'), route: `/profile/announcements` },
        { name: `#${this.$route.params.id}`, route: `/parts/announcement/${this.$route.params.id}` },
        { name: this.$t('edit_ad') }
      ]
    }
  }
}
</script>
