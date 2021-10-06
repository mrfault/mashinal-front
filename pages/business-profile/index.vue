<template>
  <div class="pages-business-profile-index">
    <div class="container">
      <breadcrumbs :crumbs="crumbs"/>

      <div class="row justify-content-center mt-4 mt-lg-0">
        <div class="col-auto">
          <form-switch
            :options="profileTypes"
            v-model="profileTypeModel"
            autoWidth
          />
        </div>
      </div>

      <packages v-if="isAutosalon && isMobileBreakpoint"/>
      <hr class="m-0" v-if="isAutosalon && isMobileBreakpoint"/>

      <parts-packages v-if="isParts"/>

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

    <application-section :type="profileType"/>

    <div class="container">
      <f-a-q />
      <hr class="m-0"/>
      <entrepreneurs />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Features from '~/components/business-profile/Features.vue'
import RegistrationFormParts from '~/components/business-profile/RegistrationFormParts';
import RegistrationFormSalon from '~/components/business-profile/RegistrationFormSalon';
import CompetitorAnnouncements from '~/components/business-profile/CompetitorAnnouncements';
import ControlPanel from '~/components/business-profile/ControlPanel';
import AdditionalFeatures from '~/components/business-profile/AdditionalFeatures';
import Announcements from '~/components/business-profile/Announcements';
import ApplicationSection from '~/components/business-profile/ApplicationSection';
import FAQ from '~/components/business-profile/FAQ';
import Entrepreneurs from '~/components/business-profile/Entrepreneurs';
import Advantages from '~/components/business-profile/Advantages';
import Packages from '~/components/business-profile/Packages';
import PartsPackages from '~/components/business-profile/PartsPackages';

export default {
  name: 'pages-business-profile-index',
  nuxtI18n: {
    paths: {
      az: '/biznes-profil'
    }
  },
  head() {
    // Fix translations
    return this.$headMeta({
      title: this.$t('meta-title_business-profile'),
      description: this.$t('meta-descr_business-profile')
    });
  },
  components: {
    Features,
    RegistrationFormParts,
    RegistrationFormSalon,
    CompetitorAnnouncements,
    ControlPanel,
    AdditionalFeatures,
    Announcements,
    ApplicationSection,
    FAQ,
    Entrepreneurs,
    Advantages,
    Packages,
    PartsPackages
  },
  computed: {
    ...mapGetters({
      profileType: 'businessProfile/profileType'
    }),
    crumbs() {
      return [
        { name: this.$t('business_profile_services')}
      ]
    },
    profileTypes() {
      return [
        { key: 'autosalon', name: this.$t('autosalon') },
        { key: 'parts', name: this.$t('parts') }
      ]
    },
    profileTypeModel: {
      get() {
        return this.profileType
      },
      set(value) {
        this.$store.dispatch('businessProfile/setProfileType', value)
      }
    },
    isAutosalon() { return this.profileType === 'autosalon' },
    isParts() { return this.profileType === 'parts' }
  }
}
</script>