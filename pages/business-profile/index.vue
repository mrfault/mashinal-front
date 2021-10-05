<template>
  <div class="pages-business-profile-index">
    <div class="container">
      <breadcrumbs :crumbs="crumbs"/>

      <div class="row justify-content-center">
        <div class="col-auto">
          <form-switch
            :options="profileTypes"
            v-model="profileType"
            autoWidth
          />
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12 col-lg-8">
          <features />
        </div>
        <div class="col-12 col-lg-4">
          <!-- <registration-form-salon /> -->
          <registration-form-parts />
        </div>
      </div>

      <hr class="m-0"/>
      <competitor-announcements />

      <hr class="m-0"/>
      <control-panel />

      <hr class="m-0"/>
      <additional-features />

      <hr class="m-0"/>
      <announcements />
    </div>
    <application-section />
  </div>
</template>

<script>
import Features from '~/components/business-profile/Features.vue'
import RegistrationFormParts from '~/components/business-profile/RegistrationFormParts.vue';
import RegistrationFormSalon from '~/components/business-profile/RegistrationFormSalon.vue';
import CompetitorAnnouncements from '~/components/business-profile/CompetitorAnnouncements.vue';
import ControlPanel from '~/components/business-profile/ControlPanel.vue';
import AdditionalFeatures from '~/components/business-profile/AdditionalFeatures.vue';
import Announcements from '~/components/business-profile/Announcements.vue';
import ApplicationSection from '~/components/business-profile/ApplicationSection.vue';

export default {
  name: "pages-business-profile-index",
  nuxtI18n: {
    paths: {
      az: "/biznes-profil"
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
    ApplicationSection
  },
  data() {
    return {
      profileType: 0
    }
  },
  computed: {
    crumbs() {
      return [
        { name: this.$t('business_profile_services')}
      ]
    },
    profileTypes() {
      return [
        { key: 0, name: this.$t('autosalon') },
        { key: 1, name: this.$t('parts') }
      ]
    }
  }
}
</script>