<template>
  <div class="pages-announcement-edit">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="sell_cards-row row">
        <div class="col-auto">
          <div :class="{ card: !isMobileBreakpoint }">
            <div class="mb-5">
              <table>
                <tr>
                  <td><h3>Qeyd edilib:</h3></td>
                  <td><brand :brand="myAnnouncement.car_catalog.brand" /></td>
                  <td>
                    <button
                      :class="['btn full-width', `btn--dark-blue`]"
                      @click="openModal('brands')"
                    >
                      <icon name="edit" />
                      {{ $t('edit') }}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><h3>Qeyd edilib:</h3></td>
                  <td>
                    <brand :brand="myAnnouncement.car_catalog.model" cover />
                  </td>
                  <td>
                    <button
                      :class="['btn full-width', `btn--dark-blue`]"
                      @click="openModal('models')"
                    >
                      <icon name="edit" />
                      {{ $t('edit') }}
                    </button>
                  </td>
                </tr>
              </table>
            </div>
            <sell-last-step
              type="cars"
              :edit="true"
              :restore="myAnnouncement.status == 3"
              :title="$t('edit_ad')"
              :key="lastStepKey"
              :initial-form="form"
              :announcement="myAnnouncement"
            />
          </div>
        </div>
      </div>
      <modal-popup :toggle="showModal" @close="showModal = false">
        <model-options
          key="model"
          :options="brands"
          :title="$t('mark')"
          :status-title="$t('select_model')"
          :input-title="$t('model_name')"
          :value="form.brand"
          :sort-alphabetically="true"
          :img-key="'transformed_media'"
          :img-placeholder="`/logos/car-${colorMode}.svg`"
          :considerPopular="false"
          highlightSelected
          enlarge-columns
        />
      </modal-popup>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import SellLastStep from '~/components/sell/SellLastStep'
import SellPreview from '~/components/sell/SellPreview'
import Brand from '~/components/moderator/brand.vue'
import EditButton from '~/components/announcements/EditButton'
import ModelOptions from '~/components/options/ModelOptions'

export default {
  name: 'pages-moto-announcement-edit',
  middleware: 'auth_general',
  components: {
    SellLastStep,
    SellPreview,
    Brand,
    EditButton,
    ModelOptions,
  },
  nuxtI18n: {
    paths: {
      az: '/moderator',
    },
  },
  head() {
    return this.$headMeta({
      title: this.$t('your_announcements'),
    })
  },
  data() {
    return {
      showModal: false,
      lastStepKey: 0,
      showBrands: false,
      showModels: false,
    }
  },
  methods: {
    openModal(type) {
      this.showModal = true
      if (type == 'models') {
        this.getModels()
      }else return;
    },
    getBrands() {
      this.$store.dispatch('getBrands')
    },
    async getModels() {
      await this.$store.dispatch(
        'getModels',
        this.myAnnouncement.car_catalog.brand.slug,
      )
    },
  },
  async asyncData({ store, route, app }) {
    store.dispatch('setSellPreviewData', { value: {} })
    await Promise.all([
      store.dispatch('getOptions'),
      store.dispatch('getColors'),
      store.dispatch('getAllOtherOptions'),
      store.dispatch('getPopularOptions'),
      store.dispatch('getMyAnnouncement', 16643365830),
    ])

    const announcement = store.state.myAnnouncement
    const catalog = announcement.car_catalog

    return {
      lastStepKey: 0,
      form: {
        car_catalog_id: announcement.car_catalog_id,
        brand: announcement.brand.slug,
        model: announcement.model.slug,
        generation_id: catalog.generation_id,
        car_body_type: catalog.car_type.id,
        gearing: catalog.main['  ']['engine'], // engines
        modification: catalog.main[' ']['box'], // transmissions/box
        transmission: catalog.main[' ']['type_of_drive'], // gearing
        capacity: catalog.capacity,
        power: catalog.power,
        year: announcement.year,
        auction: announcement.auction,
        end_date: app.$moment(announcement.end_date).format('DD.MM.YYYY HH:mm'),
        country_id: announcement.country_id,
        youtube: {
          id: announcement.youtube_link,
          thumb: `https://img.youtube.com/vi/${announcement.youtube_link}/hqdefault.jpg`,
        },
        selectedColor: announcement.colors,
        is_matte: announcement.is_matte,
        mileage: parseInt(announcement.mileage || 0),
        mileage_measure: announcement.mileage_measure || 1,
        region_id: announcement.region_id || 1,
        address: announcement.address,
        lat: parseFloat(announcement.latitude || 0),
        lng: parseFloat(announcement.longitude || 0),
        vin: announcement.vin,
        price: announcement.price_int || '',
        owner_type: parseInt(announcement.owner_type || 0),
        currency: announcement.currency_id || 1,
        car_number: announcement.car_number,
        show_car_number: announcement.show_car_number,
        show_vin: announcement.show_vin,
        part: announcement.car_body_health
          ? JSON.parse(announcement.car_body_health.options)
          : {},
        all_options: app.$clone(announcement.options),
        badges: announcement.stickers?.map((item) => item.id),
        new_badges: [],
        comment: announcement.comment || '',
        is_new: announcement.is_new,
        beaten: announcement.broken,
        customs_clearance: announcement.customs_clearance,
        tradeable: announcement.exchange_possible,
        credit: announcement.credit,
        guaranty: announcement.in_garanty,
        saved_images: announcement.mediaIds,
      },
    }
  },
  computed: {
    ...mapGetters(['myAnnouncement', 'brands', 'models']),

    crumbs() {
      return [
        // { name: this.$t('my_announces'), route: `/profile/announcements` },
        // { name: `#${this.myAnnouncement.id_unique}`, route: `/cars/announcement/16642054490` },
        { name: this.$t('moderator') },
      ]
    },
  },
  mounted() {
    this.getBrands()
  },
}
</script>
