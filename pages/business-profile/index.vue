<template>
  <div class="pages-business-profile">
    <div class="container">
      <breadcrumbs :crumbs="crumbs"/>
      <div class="row justify-content-center mt-4 mt-lg-0">
        <div class="col-auto">
          <form-switch :options="profileTypes" v-model="profileTypeModel" auto-width />
        </div>
      </div>
      <parts-packages v-if="isParts"/>
      <packages v-if="isAutosalon && isMobileBreakpoint"/>
      <hr class="m-0" v-if="isAutosalon && isMobileBreakpoint"/>
      <advantages v-if="isAutosalon"/>
      <hr class="m-0"/>
      <competitor-announcements />
      <hr class="m-0"/>
      <control-panel />
      <hr class="m-0"/>
      <additional-features />
      <hr class="m-0" v-if="isAutosalon && !isMobileBreakpoint"/>
      <packages v-if="isAutosalon && !isMobileBreakpoint"/>
      <hr class="m-0"/>
      <announcements />
    </div>
    <application-section v-if="isParts"/>
    <contact-us v-if="isAutosalon"/>
    <div class="container">
      <f-a-q />
      <!-- <hr class="m-0"/>
      <entrepreneurs /> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Features from '~/components/business-profile/Features';
import CompetitorAnnouncements from '~/components/business-profile/CompetitorAnnouncements';
import ControlPanel from '~/components/business-profile/ControlPanel';
import AdditionalFeatures from '~/components/business-profile/AdditionalFeatures';
import Announcements from '~/components/business-profile/Announcements';
import ApplicationSection from '~/components/business-profile/ApplicationSection';
import FAQ from '~/components/business-profile/FAQ';
// import Entrepreneurs from '~/components/business-profile/Entrepreneurs';
import Advantages from '~/components/business-profile/Advantages';
import Packages from '~/components/business-profile/Packages';
import PartsPackages from '~/components/business-profile/PartsPackages';
import ContactUs from '~/components/business-profile/ContactUs';

export default {
  name: 'pages-business-profile',
  components: {
    Features,
    CompetitorAnnouncements,
    ControlPanel,
    AdditionalFeatures,
    Announcements,
    ApplicationSection,
    FAQ,
    // Entrepreneurs,
    Advantages,
    Packages,
    PartsPackages,
    ContactUs
  },
  nuxtI18n: {
    paths: {
      az: '/biznes-profil'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('meta-title_business-profile'),
      description: this.$t('meta-descr_business-profile')
    });
  },
  async asyncData({ store, route }) {
    store.dispatch('packages/setProfileType', route.query.type == 2 ? 'parts' : 'salon');
    await Promise.all([
      store.dispatch('packages/getPackages'),
      store.dispatch('packages/getFaq')
    ]);
  },
  computed: {
    ...mapGetters({
      profileType: 'packages/profileType'
    }),
    crumbs() {
      return [
        { name: this.$t('business_profile_services')}
      ];
    },
    profileTypes() {
      return [
        { key: 'salon', name: this.$t('salon') },
        { key: 'parts', name: this.$t('parts') }
      ];
    },
    profileTypeModel: {
      get() {
        return this.profileType;
      },
      set(value) {
        this.$store.dispatch('packages/setProfileType', value);
        this.$router.push({ query: { ...this.$route.query, type: value === 'parts' ? 2 : 1 } });
      }
    },
    isAutosalon() { return this.profileType === 'salon' },
    isParts() { return this.profileType === 'parts' }
  },
  watch: {
    $route(route) {
      this.profileTypeModel = route.query.type == 2 ? 'parts' : 'salon';
    }
  }
}
</script>