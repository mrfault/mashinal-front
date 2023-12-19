<template>
  <div class="container">
    <div class="catalog-search-form form">

<!--buttons-->
      <div class="row mt-5">
        <div class="col-12">
          <form-buttons
            :options="getCollapseOptions"
            :group-by="2"
            v-model="form.collapse"
            @change="collapsed = !!collapse"
            single-row
            group-by="1"
          />
        </div>
      </div>

<!--form-->
      <div class="card mt-5">
        <div class="row">
          <div class="col-6 col-lg-4 mb-2">
            <form-text-input v-model="form.id" :label="$t('id')" block-class="placeholder-lighter"
                             :placeholder="$t('ID')"/>
          </div>
          <div class="col-6 col-lg-4 mb-2">
            <form-select
              :label="$t('user_type')"
              v-model="form.user_type"
              has-search
              slug-in-value
              block-class="placeholder-lighter"
            />
          </div>
          <div class="col-6 col-lg-4 mb-2">
            <form-text-input v-model="form.vin" :placeholder="$t('vin')" block-class="placeholder-lighter"/>
          </div>
          <div class="col-6 col-lg-4 mb-2">
            <form-text-input v-model="form.car_number" :placeholder="$t('car_number')"
                             block-class="placeholder-lighter"/>
          </div>
          <div class="col-6 col-lg-4 mb-2">
            <form-text-input v-model="form.phone_number" :placeholder="$t('car_number')"
                             block-class="placeholder-lighter"/>
          </div>
          <div class="col-6 col-lg-4 mb-2">
            <form-select
              :label="$t('status')"
              :placeholder="$t('status')"
              v-model="form.status"
              has-search
              slug-in-value
              block-class="placeholder-lighter"
            />
          </div>
          <div class="col-6 col-lg-4 mb-2">
            <form-select
              :placeholder="$t('mark')"
              :label="$t('mark')"
              v-model="form.filter_by_brand"
              has-search
              slug-in-value
              block-class="placeholder-lighter"
            />
          </div>
          <div class="col-6 col-lg-4 mb-2">
            <form-select
              :placeholder="$t('model')"
              :label="$t('model')"
              v-model="form.filter_by_model"
              has-search
              slug-in-value
              block-class="placeholder-lighter"
            />
          </div>

        </div>
      </div>

<!--table -->
      <div class="card mt-5">
        <b-table hover :items="items"></b-table>
      </div>

    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  data() {
    return {
      collapsed: true,
      timeout: -1,
      form: {
        collapse: 1,
        id: null,
        user_type: null,
        vin: null,
        car_number: null,
        phone_number: null,
        status: null,
        filter_by_brand: null,
        filter_by_model: null,
      },
    }
  },
  computed: {
    getCollapseOptions() {
      return [
        {key: 0, name: this.$t('cars')},
        {key: 1, name: this.$t('motorcycles')},
        {key: 2, name: this.$t('scooters')},
        {key: 3, name: this.$t('moto_atvs')},
        {key: 4, name: this.$t('commercial')},
        {key: 5, name: this.$t('parts')},
      ]
    },
  },
  methods: {
    async getAnnouncementsList(){
      await this.$store.dispatch('moderator/getAnnouncements',this.form)
    }
  },

  mounted() {
    // this.getAnnouncementsList()
  },
}
</script>
