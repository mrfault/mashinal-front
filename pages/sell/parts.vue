<template>
  <div class="pages-sell">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <sell-progress :form="form" />
      <div class="sell_cards-row row">
        <div class="col-auto">
          <div class="card">
            <sell-parts-form />
          </div>
        </div>
        <div class="col-auto" v-if="!isMobileBreakpoint">
          <div class="card">
            <sell-preview :form="form"/>
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
  name: 'pages-sell-parts',
  middleware: 'sellTokens',
  nuxtI18n: {
    paths: {
      az: '/satmaq/ehtiyat-hisseleri'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('meta-title_parts-sell'),
      description: this.$t('meta-descr_parts-sell')
    });
  },
  async asyncData({ store }) {
    store.dispatch('setSellPreviewData', { value: {} });
  },
  components: {
    SellProgress,
    SellPreview,
    SellPartsForm
  },
  computed: {
    ...mapGetters({
      form: 'parts/form'
    }),
    crumbs() {
      return [
        { name: this.$t('place_an_ad'), route: '/sell' },
        { name: this.$t('parts') }
      ]
    }
  }
}
</script>