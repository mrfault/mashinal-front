<template>
  <div class="parts-banners row">

    <!-- Winter tyres -->
    <div class="parts-banner parts-banner--winter-tyres">
      <div class="parts-banner__text">
        <h3 class="parts-banner__title">
          {{ $t('winter_tyres') }}
        </h3>
        <p class="parts-banner__description">
          {{ $t('winter_tyres_desc') }}
        </p>
        <nuxt-link :to="winterTyresURL" class="parts-banner__link">
          {{ $t('detail') }}
          <icon name="arrow-right" />
        </nuxt-link>
      </div>
      <img class="parts-banner__image" src="/img/banner_winter_tyres.png" />
    </div>

    <!-- Create online store -->
    <div class="parts-banner parts-banner--online-store">
      <div class="parts-banner__text">
        <h3 class="parts-banner__title">
          {{ $t('create_online_store') }}
        </h3>
        <p class="parts-banner__description">
          {{ $t('create_online_store_desc') }}
        </p>
        <nuxt-link to="#" event="" @click.native="showCreateStoreModal = true"  class="parts-banner__link">
          {{ $t('apply') }}
          <icon name="arrow-right" />
        </nuxt-link>
      </div>
      <img class="parts-banner__image" src="/img/banner_create_online_store.png" />
    </div>

    <CreateStore
      :visible="showCreateStoreModal"
      @visible="showCreateStoreModal = $event"
    />

  </div>
</template>

<script>
import CreateStore from '~/components/parts/CreateStore'

export default {
  components: {
    CreateStore
  },
  data() {
    return {
      showCreateStoreModal: false
    }
  },
  computed: {
    winterTyresURL() {
      return (
        this.$localePath('/parts') +
        '/' + this.$t('slug_tyres') +
        '?parts_filter=' +
        encodeURI(JSON.stringify({"season": [1]}))
      )
    }
  }
}
</script>