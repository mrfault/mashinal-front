<template>
  <div class="pages-announcement-edit">

    <div class="container">
      <pre>
        {{rejectObj.rejectArray}}
      </pre>
      <breadcrumbs :crumbs="crumbs"/>
      <div class="sell_cards-row row">
        <div class="col-auto">
          <div class="card">
            <div class="mb-5">
              <brand
                :brand="single_announce.brand"
                :model="single_announce.model"
                :userData="single_announce.user"
                :year="single_announce.year"
                @showBrands="toggleOptions('brands')"
                @showModels="toggleOptions('models')"
                @showYears="toggleOptions('years')"
              />
              <!--   model options ------------->
              <div class="mt-5">
                <model-options
                  v-if="show.brands"
                  key="brand"
                  :considerPopular="false"
                  :img-key="'transformed_media'"
                  :img-placeholder="`/logos/car-${colorMode}.svg`"
                  :input-title="$t('model_name')"
                  :options="brands"
                  :sort-alphabetically="true"
                  :status-title="$t('select_model')"
                  :title="$t('mark')"
                  :value="single_announce.brand"
                  highlightSelected
                  isModeration
                  rejectKey="brand"
                  @changeReason="changeReason"
                />
                <model-options
                  v-if="show.models"
                  key="model"
                  :input-title="$t('model_name')"
                  :options="models"
                  :sort-alphabetically="false"
                  :status-title="$t('select_model')"
                  :title="$t('model')"
                  :value="single_announce.model"
                  highlightSelected
                  isModeration
                  rejectKey="model"
                  @changeReason="changeReason"
                />
                <year-options
                  v-if="show.years"
                  :title="$t('prod_year')"
                  :value="single_announce.year"
                  :years="{ min: sellYears.min, max: sellYears.max }"
                  @close="handleYear()"
                  @input="handleYear"
                  isModeration
                  rejectKey="model"
                  @changeReason="changeReason"

                />
              </div>
              <!--     modifications -------  -->
              <div>
                <title-with-line-and-reject-reason
                  rejectKey="body_type"
                  title="body_type"
                  @change="changeReason"
                />
                <form-buttons
                  :btn-class="'primary-outline select-body'"
                  :group-by="isMobileBreakpoint ? 2 : 5"
                  :options="sell_bodies"
                  class="mb-4"
                  @change="
                    handleChange(
                      $event,
                      'getSellGenerations',
                      ['car_body_type'],
                      [
                        'sellGenerations',
                        'sellEngines',
                        'sellGearing',
                        'sellTransmissions',
                        'sellModifications',
                      ],
                      'generation_id',
                    )
                  "
                >
                  <template #custom="{ button }">
                    <div class="body-img">
                      <img
                        :alt="button.name[locale]"
                        :src="$withBaseUrl(button.transformed_media)"
                      />
                    </div>
                  </template>
                </form-buttons>

                <title-with-line-and-reject-reason
                  :title="$t('generation')"
                  rejectKey="generation"
                  required
                  @change="changeReason"
                />
                <form-buttons
                  v-model="initialForm.generation_id"
                  :btn-class="'primary-outline select-generation'"
                  :group-by="isMobileBreakpoint ? 2 : 5"
                  :options="sellGenerations"
                  @change="
                    handleChange(
                      $event,
                      'getSellEngines',
                      ['car_body_type', 'generation_id'],
                      [
                        'sellEngines',
                        'sellGearing',
                        'sellTransmissions',
                        'sellModifications',
                      ],
                      'gearing',
                    )
                  "
                >
                  <template #custom="{ button }">
                    <div
                      :class="[
                        'generation-bg',
                        { 'no-img': !!getGenerationStyle(button).noImg },
                      ]"
                      :style="getGenerationStyle(button)"
                    ></div>
                    <div class="generation-info">
                      <span>
                        {{ button.start_year }} —
                        {{ button.end_year || currentYear }}
                      </span>
                      <span>{{ button.short_name[locale] }}</span>
                    </div>
                  </template>
                </form-buttons>

                <title-with-line-and-reject-reason
                  :title="$t('fuel')"
                  rejectKey="fuel"
                  required
                  @change="changeReason"
                />
                <form-buttons
                  v-model="single_announce.car_catalog.gearing_id"
                  :btn-class="'primary-outline'"
                  :group-by="isMobileBreakpoint ? 1 : 5"
                  :options="
                    engines.map((o) => ({
                      name: $t('engine_values')[o.engine],
                      key: o.engine,
                    }))
                  "
                  @change="
                    handleChange(
                      $event,
                      'getSellGearing',
                      ['car_body_type', 'generation_id', 'gearing'],
                      ['sellGearing', 'sellTransmissions', 'sellModifications'],
                      'transmission',
                    )
                  "
                >
                  <template #icon="{ button }">
                    <icon
                      :class="`engine-${button.key}`"
                      :name="getIcon('engine', button.key)"
                    />
                  </template>
                </form-buttons>
                <form-checkbox
                  v-model="single_announce.autogas"
                  :label="$t('gas_equipment')"
                  class="mb-4"
                  input-name="autogas"
                  transparent
                />

                <title-with-line-and-reject-reason
                  :title="$t('type_of_drive')"
                  required
                />
                <template
                  v-if="
                    sellTransmissions && sellTransmissions.length && sellGear
                  "
                >
                  <form-buttons
                    v-model="initialForm.transmission"
                    :btn-class="'primary-outline'"
                    :group-by="isMobileBreakpoint ? 1 : 5"
                    :options="
                      sellGear.map((o) => ({
                        name: $t('type_of_drive_values')[o.type_of_drive],
                        key: o.type_of_drive,
                      }))
                    "
                    :isModerator="user.admin_group == 2"
                    @change="
                    handleChange(
                      $event,
                      'getSellTransmissions',
                      ['car_body_type', 'generation_id', 'gearing', 'transmission'],
                      ['sellTransmissions', 'sellModifications'],
                      'modification',
                    )
                  "
                  >
                    <template #icon="{ button }">
                      <icon
                        :class="`type-of-drive-${button.key}`"
                        :name="getIcon('type_of_drive', button.key)"
                      />
                    </template>
                  </form-buttons>
                </template>

                <title-with-line-and-reject-reason
                  v-if="sellTransmissions && sellTransmissions.length"
                  :title="$t('box')"
                  rejectKey="transmission"
                  required
                />
                <form-buttons
                  v-model="initialForm.modification"
                  :btn-class="'primary-outline'"
                  :group-by="isMobileBreakpoint ? 1 : 5"
                  :options="
                    sellTransmissions.map((o) => ({
                      name: $t('box_values')[o.box],
                      key: o.box,
                    }))
                  "
                  @change="
                    handleChange(
                      $event,
                      'getSellModifications',
                      [
                        'car_body_type',
                        'generation_id',
                        'gearing',
                        'transmission',
                        'modification',
                      ],
                      ['sellModifications'],
                      'car_catalog_id',
                    )
                  "
                >
                  <template #icon="{ button }">
                    <icon
                      :class="`box-${button.key}`"
                      :name="getIcon('box', button.key)"
                    />
                  </template>
                </form-buttons>

                <title-with-line-and-reject-reason
                  v-if="sellModifications && sellModifications.length"
                  :title="$t('modification')"
                  rejectKey="transmission"
                  required

                />
                <form-buttons
                  v-model="initialForm.car_catalog_id"
                  :btn-class="'primary-outline'"
                  :group-by="isMobileBreakpoint ? 1 : 3"
                  :options="
                    sellModifications.map((o) => ({
                      name: getModificationName(o),
                      key: o.id,
                    }))
                  "
                  @change="handleChange($event, false, ['car_catalog_id'], [])"
                />
              </div>
              <!--     sell last step ------  -->
              <div v-if="single_announce">
                <sell-last-step
                  :key="lastStepKey"
                  :announcement="single_announce"
                  :colors="colors"
                  :edit="true"
                  :restore="single_announce.status == 3"
                  :title="$t('moderator')"
                  type="cars"
                  @close="
                    $router.push(
                      pageRef || $localePath('/profile/announcements'),
                    )
                  "
                />
              </div>
              <!-- actions  ------------------------->
              <div
                v-if="user.admin_group && user.admin_group !== 2"
                class="moderator-actions mt-5"
              >
                <div class="text-right">
                  <!--            moderator-->
                  <button
                    :class="['btn btn--green', { pending }]"
                    type="button"
                  >
                    salam
                  </button>

                  <!--    supervisor        -->

                  <button
                    :class="['btn btn--green', { pending }]"
                    class="mb-2"
                    type="button"
                    @click="transferToSupervisor()"
                  >
                    {{ $t('refuse') }}
                  </button>
                  <button
                    :class="['btn btn--green', { pending }]"
                    class="mb-2"
                    type="button"
                    @click="transferToSupervisor()"
                  >
                    {{ $t('this_announce_inactive') }}
                  </button>
                  <button
                    :class="['btn btn--green', { pending }]"
                    class="mb-2"
                    type="button"
                    @click="transferToSupervisor()"
                  >
                    {{ $t('back_to_list') }}
                  </button>
                </div>
              </div>
              <!-- comment   ------------------------>
              <div class="moderator-comment mt-5">
                <div class="row">
                  <div class="col-8">
                    <form-textarea
                      v-if="getTimer.unix > 60 * 2"
                      v-model="initialForm.comment"
                      :maxlength="3000"
                      :placeholder="$t('comment')"
                    />
                  </div>
                  <div class="col-4">
                    <button
                      v-if="
                        rejectObj.rejectArray.filter((item) => !rejectObj.reject360.includes(item))
                          .length === 0
                      "
                      :class="[
                        'btn btn--green',
                        { pending },
                        { disabled: initialForm.comment.length == 0 },
                      ]"
                      :disabled="initialForm.comment.length == 0"
                      class="mb-2"
                      type="button"
                      @click.prevent="sendData(1)"
                    >
                      {{ $t('confirm') }}
                    </button>
                    <button
                      v-else
                      :class="[
                        'btn btn--green',
                        { pending },
                        { disabled: initialForm.comment.length == 0 },
                      ]"
                      :disabled="initialForm.comment.length == 0"
                      class="mb-2"
                      type="button"
                      @click.prevent="sendData(0)"
                    >
                      {{ $t('refuse') }}
                    </button>
                    <button
                      v-if="user.admin_group == 2 && !transfer.isOpen"
                      :class="['btn btn--green', { pending }]"
                      class="mb-2"
                      type="button"
                      @click="transfer.isOpen = true"
                    >
                      {{ $t('transfer_to_supervisor') }}
                    </button>
                    <div
                      v-if="getTimer && getTimer.data"
                      class="moderator-timer"
                    >
                      {{ getTimer.data.replace('d', $t('day')) }}
                    </div>
                  </div>

                </div>

              </div>


              <!-- actions   ------------------------>
              <div v-if="false">
                <section v-if="user.admin_group === 1" class="container">
                  <!--supervisor-->
                  <div class="row">
                    <div class="col-12">
                      <button
                        v-if="
                rejectArray.filter((item) => !reject360.includes(item))
                  .length === 0
              "
                        :class="{ button_loading: button_loading }"
                        class="section-post__btn mt-0"
                        style="padding: 10px 30px; background: #3a9b35;"
                        @click.prevent="sendData(1)"
                      >
                        {{ $t('approve') }}
                      </button>
                      <button
                        :class="{ button_loading: button_loading }"
                        class="section-post__btn mt-0 ml-1"
                        style="padding: 10px 30px; background: #b90026;"
                        @click.prevent="sendData(0)"
                      >
                        {{ $t('reject') }}
                      </button>
                      <button
                        :class="{ button_loading: button_loading }"
                        class="section-post__btn mt-0 ml-1"
                        style="padding: 10px 30px; background: #f56808;"
                        @click.prevent="sendData(3)"
                      >
                        {{ $t('deactive_announce') }}
                      </button>
                      <a href="javascript:void(0);" @click="handleBackToList">
                        <button
                          class="section-post__btn mt-0 ml-1"
                          style="padding: 10px 30px; background: #bfbfbf;"
                        >
                          {{ $t('back_to_list') }}
                        </button>
                      </a>
                    </div>
                  </div>
                </section>
                <!--                ----------------------------------------------------------->
                <!--                ----------------------------------------------------------->
                <!--                ----------------------------------------------------------->
                <!--                ----------------------------------------------------------->
                <!--                ----------------------------------------------------------->
                <section v-else-if="user.admin_group === 2" class="container">

                  <div class="moderator-comment mt-5">
                    <div class="row">
                      <div class="col-8">
                        <form-textarea
                          v-model="initialForm.comment"
                          :maxlength="3000"
                          :placeholder="$t('comment')"
                        />
                      </div>
                      <div class="col-4">
                        <button
                          :class="[
                        'btn btn--green',
                        { pending },
                        { disabled: initialForm.comment.length == 0 },
                      ]"
                          :disabled="initialForm.comment.length == 0"
                          class="mb-2"
                          type="button"
                          @click.prevent="sendData(1)"
                        >
                          {{ $t('confirm') }}
                        </button>
                        <button
                          :class="[
                        'btn btn--green',
                        { pending },
                        { disabled: initialForm.comment.length == 0 },
                      ]"
                          :disabled="initialForm.comment.length == 0"
                          class="mb-2"
                          type="button"
                          @click.prevent="sendData(0)"
                        >
                          {{ $t('reject') }}
                        </button>
                        <button
                          v-if="user.admin_group && user.admin_group == 2 && !transfer.isOpen"
                          :class="['btn btn--green', { pending }]"
                          class="mb-2"
                          type="button"
                          @click="transfer.isOpen = true"
                        >
                          {{ $t('transfer_to_supervisor') }}
                        </button>
                        <div
                          v-if="getTimer && getTimer.data"
                          class="moderator-timer"
                        >
                          {{ getTimer.data.replace('d', $t('day')) }}
                        </div>
                      </div>

                    </div>

                  </div>

                </section>
                <!--                ----------------------------------------------------------->
                <!--                ----------------------------------------------------------->
                <!--                ----------------------------------------------------------->
                <!--                ----------------------------------------------------------->
                <!--                ----------------------------------------------------------->
                <!--                ----------------------------------------------------------->

                <section v-else-if="user.admin_group === 3" class="container">
                  <!--call center-->
                  <div class="row">
                    <div class="col-12">
                      <button
                        :class="{ button_loading: button_loading }"
                        class="section-post__btn mt-0"
                        style="padding: 10px 30px; background: #3a9b35;"
                        @click.prevent="sendData(2)"
                      >
                        {{ $t('send_to_moderate') }}
                      </button>

                      <button
                        :class="{ button_loading: button_loading }"
                        class="section-post__btn mt-0 ml-1"
                        style="padding: 10px 30px; background: #f56808;"
                        @click.prevent="sendData(3)"
                      >
                        {{ $t('deactive_announce') }}
                      </button>
                      <a href="javascript:void(0);" @click="handleBackToList">
                        <button
                          class="section-post__btn mt-0 ml-1"
                          style="padding: 10px 30px; background: #bfbfbf;"
                        >
                          {{ $t('back_to_list') }}
                        </button>
                      </a>

                      <button
                        class="section-post__btn mt-0"
                        style="padding: 10px 30px; background: #d55e13; float: right;"
                        @click.prevent="transferModal = true"
                      >
                        {{ $t('Transfer to Supervisor') }}
                      </button>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <modal-popup
      :modal-class="'offer-payment-modal'"
      :title="$t('transfer_to_supervisor')"
      :toggle="transfer.isOpen"
      @close="transfer.isOpen = false"
    >
      <div class="row">
        <div class="col-12 mt-2">
          <form-textarea
            v-model="transfer.comment"
            :maxlength="3000"
            :placeholder="$t('transfer_comment')"
          />
        </div>
        <div class="col-12 mt-2">
          <button
            v-if="user.admin_group && user.admin_group == 2"
            :class="['btn btn--green', { pending }]"
            class="mb-2"
            type="button"
            @click="transferToSupervisor()"
          >
            {{ $t('transfer_to_supervisor') }}
          </button>

        </div>
      </div>

    </modal-popup>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import moment from 'moment'

// ./././././././././././
import SellLastStep from '~/components/sell/SellLastStepModerator'
import SellPreview from '~/components/sell/SellPreview'
import Brand from '~/components/moderator/brand.vue'
import EditButton from '~/components/announcements/EditButton'
import ModelOptions from '~/components/options/ModelOptions'
import TitleWithLine from '~/components/global/titleWithLine.vue'
import YearOptions from '~/components/options/YearOptions'
import ButtonOptions from '~/components/moderator/buttonOptions'
import UploadImage from '~/components/elements/UploadImage'
import RejectReason from '~/components/moderator/rejectReason'
import TitleWithLineAndRejectReason from '~/components/moderator/titleWithLineAndRejectReason'

export default {
  layout: 'ticket',
  components: {
    TitleWithLineAndRejectReason,
    RejectReason,
    SellPreview,
    Brand,
    EditButton,
    ModelOptions,
    TitleWithLine,
    YearOptions,
    ButtonOptions,
    UploadImage,
    SellLastStep,
  },
  data() {
    return {
      showModal: false,
      lastStepKey: 0,
      show: {
        brands: false,
        models: false,
        years: false,
      },

      type: 'cars',
      pending: false,

      //reject reason
      rejectObj: {
        show360Reject: false,
        showPhotoReject: false,
        rejectArray: [],
        reject360: ['360_photo_reject_1'],
      },
      transfer: {
        comment: '',
        isOpen: false,
      },
      saved_images: [],
    }
  },
  asyncData: async function ({store, $axios, $auth, route}) {
    await $auth.setUserToken(`Bearer ${route.query.token}`)
    const admin_user = await $axios.$get('/user')
    // if (!admin_user.user.is_admin) {
    //   return false
    // }
    $auth.setUser(admin_user.user)
    setInterval(() => {
      let timer = moment().diff(moment(admin_user.user.created_at))
      var duration = moment.duration(timer)
      var days = duration.days(),
        hrs = duration.hours(),
        mins = duration.minutes(),
        secs = duration.seconds()

      if (hrs.toString().length === 1) hrs = '0' + hrs
      if (mins.toString().length === 1) mins = '0' + mins
      if (secs.toString().length === 1) secs = '0' + secs
      let _return = ''

      if (days > 0) _return += days + 'd. '

      _return += hrs + ':' + mins + ':' + secs
      store.commit('moderator/changeTimerData', {
        data: _return,
        unix: timer / 1000,
      })
    }, 1000)
    let data
    try {
      data = await $axios.$get('/ticket/car')
      store.commit('moderator/moderatorMutator', {
        with: data.announce,
        property: 'single_announce',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.brands,
        property: 'brands',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.boxes,
        property: 'boxes',
      })
      //     store.commit('moderator/moderatorMutator', {
      //       with: data.engines,
      //       property: 'engines',
      //     })
      //      store.commit('moderator/moderatorMutator', {
      //        with: data.generations,
      //        property: 'generations',
      //      })
      store.commit('moderator/moderatorMutator', {
        with: data.models,
        property: 'models',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.moderator,
        property: 'moderator',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.modifications,
        property: 'modifications',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.sellYears,
        property: 'sellYears',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.sell_bodies,
        property: 'sell_bodies',
      })
      store.commit('moderator/moderatorMutator', {
        with: data.type_of_drives,
        property: 'type_of_drives',
      })


    } catch (e) {
      store.commit('moderator/moderatorMutator', {
        with: {},
        property: 'single_announce',
      })
    }

    const incomingData = store.state.moderator.single_announce;
    return {
      admin_user: admin_user.user,
      initialForm: {
        car_catalog_id: incomingData?.car_catalog_id || null,
        brand: incomingData?.brand.slug || null,
        model: incomingData?.model.slug || null,
        generation_id: incomingData?.car_catalog?.generation_id || null,
        car_body_type: incomingData?.car_catalog?.car_type.id || null,
        gearing: incomingData?.car_catalog?.main['  ']['engine'] || null, // engines
        modification: incomingData?.car_catalog?.main[' ']['box'] || null, // transmissions/box
        transmission: incomingData?.car_catalog?.main[' ']['type_of_drive'] || null, // gearing
        capacity: incomingData?.car_catalog?.capacity || null,
        power: incomingData?.car_catalog?.power || null,
        year: incomingData?.year || null,
        auction: incomingData?.auction || null,
        end_date: moment(incomingData?.end_date).format('DD.MM.YYYY HH:mm') || null,
        country_id: incomingData?.country_id || null,
        youtube: {
          id: incomingData?.youtube_link,
          thumb: `https://img.youtube.com/vi/${incomingData?.youtube_link}/hqdefault.jpg`,
        },
        selectedColor: incomingData?.colors || null,
        is_matte: incomingData?.is_matte || null,
        mileage: parseInt(incomingData?.mileage || 0) || null,
        mileage_measure: incomingData?.mileage_measure || 1 || null,
        region_id: incomingData?.region_id || 1 || null,
        address: incomingData?.address || null,
        lat: parseFloat(incomingData?.latitude || 0) || null,
        lng: parseFloat(incomingData?.longitude || 0) || null,
        vin: incomingData?.vin || null,
        price: incomingData?.price_int || '',
        owner_type: parseInt(incomingData?.owner_type || 0) || null,
        currency: incomingData?.currency_id || 1 || null,
        car_number: incomingData?.car_number || null,
        show_car_number: incomingData?.show_car_number || null,
        show_vin: incomingData?.show_vin || null,
        part: incomingData?.car_body_health
          ? JSON.parse(incomingData?.car_body_health.options)
          : {} || null,
        all_options: incomingData?.options || null,
        badges: incomingData?.stickers?.map((item) => item.id) || null,
        new_badges: [] || null,
        comment: incomingData?.comment || '',
        is_new: incomingData?.is_new || null,
        beaten: incomingData?.broken || null,
        customs_clearance: incomingData?.customs_clearance || null,
        tradeable: incomingData?.exchange_possible || null,
        credit: incomingData?.credit || null,
        guaranty: incomingData?.in_garanty || null,
        saved_images: incomingData?.mediaIds || null,
      },
    }
  },
  computed: {
    ...mapGetters({
      single_announce: 'moderator/single_announce',
      brands: 'moderator/brands',
      boxes: 'moderator/boxes',
      engines: 'sellEngines',
      sellGenerations: 'sellGenerations',
      sellGear: 'sellGearing',
      generations: 'sellGenerations',
      models: 'moderator/models',
      moderator: 'moderator/moderator',
      sellModifications: 'sellModifications',
      sell_bodies: 'moderator/sell_bodies',
      type_of_drives: 'moderator/type_of_drives',
      sellYears: 'moderator/sellYears',
      colors: 'colors',
      sellTransmissions: 'sellTransmissions',
      getTimer: 'moderator/getTimer',
    }),
    crumbs() {
      return [
        // { name: this.$t('my_announces'), route: `/profile/announcements` },
        // { name: `#${this.myAnnouncement.id_unique}`, route: `/cars/announcement/16642054490` },
        {name: this.$t('moderator')},
      ]
    },
    files() {
      return (this.single_announce?.media || []).map((media, i) => ({
        media,
        key: this.single_announce.media[i],
      }))
    },
    modificationsList() {
      let arr = []
      for (const prop in this.modifications) {
        arr.push({id: prop, obj: this.modifications[prop]})
      }
      return arr
    },
    boxesList() {
      let arr = []
      for (const prop in this.boxes) {
        arr.push({id: prop, obj: this.boxes[prop]})
      }
      return arr
    },
    enginesList() {
      let arr = []
      for (const prop in this.engines) {
        arr.push({id: prop, obj: this.engines[prop]})
      }
      return arr
    },
    type_of_drivesList() {
      let arr = []
      for (const prop in this.type_of_drives) {
        arr.push({id: prop, obj: this.type_of_drives[prop]})
      }
      return arr
    },
    helperImages() {
      let imgs =
        this.type === 'cars'
          ? [1, 2, 3, 4, 5]
          : this.type === 'commercial'
            ? [1, 2, 3, 4]
            : [1, 2, 3]
      return imgs.map((n) => `/img/sell-helpers/${this.type}_${n}.png`)
    },
  },
  methods: {
    ...mapActions([
      'getSellBody',
      'getSellGenerations',
      'getSellEngines',
      'getSellGearing',
      'getSellTransmissions',
      'getSellModifications',
    ]),

    // ui
    openModal(type) {
      this.showModal = true
      if (type == 'models') {
        this.getModels()
      } else return
    },
    toggleOptions(opt) {
      var obj = this.show
      for (const key in obj) {
        obj[key] = false
      }
      if (obj[opt] == true) {
        obj[opt] = false
      } else {
        obj[opt] = true
      }
    },

    // get
    async getModels() {
      await this.$store.dispatch('getModels', this.single_announce?.brand?.slug)
    },
    async getColors() {
      await this.$store.dispatch('getColors')
    },
    async getGenerations() {
      await this.$store.dispatch('getSellGenerations', {
        brand: this.single_announce?.brand?.slug,
        model: this.single_announce?.model?.slug,
        year: this.single_announce?.year,
        body: this.single_announce?.car_catalog?.car_type.id,
      })
      this.getSellEngines()
    },
    async getSellEngines() {
      await this.$store.dispatch('getSellEngines', {
        brand: this.single_announce?.brand?.slug,
        model: this.single_announce?.model?.slug,
        year: this.single_announce?.year,
        body: this.single_announce?.car_catalog?.car_type.id,
        generation: this.single_announce?.car_catalog?.generation_id,
      })
      this.getSellTransmissions()
    },
    async getSellTransmissions() {
      await this.$store.dispatch('getSellTransmissions', {
        brand: this.single_announce?.brand?.slug,
        model: this.single_announce?.model?.slug,
        year: this.single_announce?.year,
        body: this.single_announce?.car_catalog?.car_type.id,
        generation: this.single_announce?.car_catalog?.generation_id,
        engine: this.single_announce?.car_catalog?.engine_id,
        gearing: this.single_announce?.car_catalog?.gearing_id,
      })
      this.getSellGearing()
    },
    async getSellGearing() {
      await this.$store.dispatch('getSellGearing', {
        brand: this.single_announce?.brand?.slug,
        model: this.single_announce?.model?.slug,
        body: this.single_announce?.car_catalog?.car_type.id,
        generation: this.single_announce?.car_catalog?.generation_id,
        engine: this.single_announce?.car_catalog?.engine_id,
      })
      this.getSellModifications()
    },
    async getSellModifications() {
      await this.$store.dispatch('getSellModifications', {
        brand: this.single_announce?.brand?.slug,
        model: this.single_announce?.model?.slug,
        body: this.single_announce?.car_catalog?.car_type.id,
        generation: this.single_announce?.car_catalog?.generation_id,
        engine: this.single_announce?.car_catalog?.engine_id,
        gearing: this.single_announce?.car_catalog?.gearing_id,
        transmission: this.single_announce?.car_catalog?.main[' '][
          'type_of_drive'
          ],
      })
    },

    // handle
    getIcon(key, value) {
      return {
        engine: {
          1: 'fuel-station',
          2: 'battery-charge',
          3: 'diesel',
          4: 'gas',
          5: 'plug',
        },
        type_of_drive: {1: 'drive', 2: 'drive', 3: 'drive'},
        box: {
          1: 'mechanical',
          2: 'automatic',
          3: 'robot',
          4: 'variator',
          5: 'reductor',
        },
      }[key][value]
    },
    getModificationName(o) {
      let generation = this.sellGenerations.find(
        (o) => o.id === this.single_announce?.car_catalog?.generation_id,
      )
      let name = `${this.$t('box_mode_values')[o.box]}/${
        generation.start_year
      } - ${generation.end_year || this.currentYear}`
      if (o.capacity) name = `${o.capacity} ${name}`
      if (o.power) name = `${o.power} ${this.$t('char_h_power')}/${name}`
      if (o.complect_type) name += `/${o.complect_type}`
      return name
    },
    getFormValues(keys) {
      let form = {}
      keys.map((key) => {
        let formKey = key
          .replace('car_body_type', 'body')
          .replace('generation_id', 'generation')
          .replace('gearing', 'engine')
          .replace('transmission', 'gearing')
          .replace('modification', 'transmission')
        form[formKey] = initialForm[key]
      })
      return form
    },
    async handleChange(value, action, keys, props, nextKey) {
      if (this.user.admin_group == 2) {
        return
      } else {
        if (!this.disableScroll) {
          if (keys[0] === 'car_catalog_id' && !this.isMobileBreakpoint) {
            setTimeout(() => {
              window.scrollTo({top: 1000, behavior: 'smooth'})
            }, 500)
          } else if (keys[0] === 'car_catalog_id' && this.isMobileBreakpoint) {
            window.scrollTo({top: 1200, behavior: 'smooth'})
            setTimeout(() => {
              // window.location.href = '#sellLastStepUploadImage'
              const el = document.querySelector('#anchor-saved_images')
              el.scrollIntoView({block: 'start', behavior: 'smooth'})
            }, 500)
          }
        }

        clearTimeout(this.timeout)
        let $container
        if (this.isMobileBreakpoint) {
          $container = document.querySelector('.mobile-screen .container')
          if (action) $container.style.minHeight = `${$container.scrollHeight}px`
        }
        // clean store props
        props.map((property) => {
          this.mutate({property, value: []})
        })
        // update form prop
        this.$emit('update-form', {key: keys[keys.length - 1], value})
        // skip step for the last input
        if (!action) return // clean form props
          ;
        [
          'car_body_type',
          'generation_id',
          'gearing',
          'transmission',
          'modification',
          'car_catalog_id',
        ].map((key) => {
          if (!keys.includes(key)) this.$emit('update-form', {key, value: ''})
        })
        // get values for the next input
        let values = this.getFormValues([...keys, 'brand', 'model', 'year'])
        await this[action](values)
        // move next if only one option available
        this.$nextTick(() => {
          let options = this[action.replace('getSell', 'sell')]
          if (options.length === 1 && nextKey !== 'car_catalog_id') {
            let nextValue =
              options[0].engine ||
              options[0].type_of_drive ||
              options[0].box ||
              options[0].id
            this.$emit('update-form', {key: nextKey, value: nextValue})
          } else if (this.isMobileBreakpoint) {
            this.timeout = setTimeout(() => {
              this.scrollTo(this.$refs[`sell-${nextKey}`], -34, 500)
              $container.style.minHeight = ''
            }, 100)
          }
          if (!this.isMobileBreakpoint) {
            this.timeout = setTimeout(() => {
              this.scrollTo(this.$refs[`sell-${nextKey}`], -20, 500)
            }, 100)
          }
        })

      }
    },
    async getGenerationStyle(o) {
      const getImage = (media) =>
        media && media.length > 0 ? this.$withBaseUrl(media[0]) : false
      let carType = o.car_type_generation.find(
        (type) => type.car_type_id === o.pivot.car_type_id,
      )
      let imgUrl = getImage(carType && carType.transformed_media.thumb)
      return imgUrl ? {backgroundImage: `url('${imgUrl}')`} : {noImg: true}
    },
    changeReason(rejectKey) {
      if (rejectKey === 'image') {
        this.rejectObj.showPhotoReject = true
      } else if (rejectKey === '360') {
        this.rejectObj.show360Reject = true
      } else {
        if (this.rejectObj.rejectArray.includes(rejectKey)) {
          this.rejectObj.rejectArray.splice(this.rejectObj.rejectArray.indexOf(rejectKey), 1)
        } else {
          this.rejectObj.rejectArray.push(rejectKey)
        }
      }
    },
    handleYear() {

    },

    // post
    async transferToSupervisor(withRejectReason = false) {
      this.button_loading = true

      if (withRejectReason) {
        this.transferComment = this.rejectArray
      }

      await this.$store.dispatch('moderator/transferToSupervisor', {
        id: this.single_announce.id,
        comment: this.initialForm.comment,
      })

      if (this.user.admin_group == 2) {
        this.$router.push({path: this.localePath('/e-services')});
      } else {
        // location.href = '/alvcp/resources/announcements'
        this.$router.push($t('e-services'))
      }
    },
    async sendData(status = 2) {
      // if (this.saved_images?.length !== this.imagesBase64.length) {
      //   this.$toasted.show(this.$t('please_wait_for_all_image_loading'), {
      //     type: 'error',
      //   })
      //   return false
      // }


      let form = {};

      this.initialForm.status = this.single_announce.status;
      this.initialForm.brand = this.single_announce.brand
      this.initialForm.model = this.single_announce.model.slug;
      this.initialForm.year = this.single_announce.year;
      this.initialForm.generation = this.single_announce.car_catalog.generation_id;
      this.initialForm.rejectArray = this.rejectObj.rejectArray;


      var formData = new FormData();

      formData.append("data", JSON.stringify(this.initialForm))

      console.log("dataaaaa", formData.get('data'))

      this.$nuxt.$emit('loading_status', true)
      this.pending = true

      try {
        await this.$axios.$post('/ticket/car/' + this.single_announce.id, formData)

        if (this.user.admin_group == 2) {
          console.log("user 2", this.user)
        } else {
          // location.href = '/alvcp/resources/announcements'
          console.log("user else", this.user)
        }
      } catch {

        console.log("error")
        this.pending = false;
      }
    },
    addComment(e) {
      if (initialForm.comment === null) initialForm.comment = ''
      initialForm.comment = initialForm.comment + e + ' '
    },

  },
  mounted() {
    this.getModels()
    if (this.single_announce !== {}) {
      this.getGenerations()
    }
  },
  created() {
    this.getColors()
  },
}
</script>
