<template>
  <div class="pages-announcement-edit">
    <div class="container">
      <breadcrumbs :crumbs="crumbs"/>
      <div class="sell_cards-row row">
        <div class="col-auto">
          <div class="card">
            <div class="mb-5">
              <brand
                :brand="single_announce.brand"
                :model="single_announce.model"
                :userData="single_announce.user"
              />
              <!--              brand -->
              <div class="row mt-5">
                <div class="col-12">
                  <title-with-line-and-reject-reason
                    rejectKey="brand"
                    title="mark"
                    @change="changeReason"
                  />
                </div>
                <div class="col-12 col-lg-3">
                  <form-select
                    v-model="initialForm.brand_id"
                    :label="$t('mark')"
                    :options="brands"
                    has-search
                    @change="changeBrand($event)"
                  />
                </div>
              </div>
              <!--              model -->
              <div class="row">
                <div class="col-12">
                  <title-with-line-and-reject-reason
                    rejectKey="model"
                    title="model"
                    @change="changeReason"
                  />
                </div>
                <div class="col-12 col-lg-3">
                  <form-select
                    v-model="initialForm.model_id"
                    :label="$t('model')"
                    :options="models"
                    has-search
                    @change="changeModel($event)"
                  />
                </div>
              </div>
              <!--              year -->
              <div class="mt-2">
                <year-options
                  :isModeration="isModerator"
                  :title="$t('prod_year')"
                  :value="initialForm.year"
                  :years="{ min: sellYears.min, max: sellYears.max }"
                  rejectKey="year"
                  @changeReason="changeReason"
                  @close="handleYear()"
                  @input="handleYear"

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
                  v-model="initialForm.car_body_type"
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
                  rejectKey="engine"
                  required
                  @change="changeReason"
                />
                <div class="col-12 col-lg-3  pl-0">

                  <form-select
                    v-model="initialForm.gearing"
                    :disabled="user.admin_group == 2"
                    :label="$t('fuel')"
                    :options="
                    engines.map((o) => ({
                        name: $t('engine_values')[o.engine],
                        key: o.engine,
                      }))
                    "
                    has-search
                    @change="
                    handleChange(
                        $event,
                        'getSellGearing',
                        ['car_body_type', 'generation_id', 'gearing'],
                        ['sellGearing', 'sellTransmissions', 'sellModifications'],
                        'transmission',
                      )
                    "
                  />
                  <form-checkbox
                    v-model="single_announce.autogas"
                    :label="$t('gas_equipment')"
                    class="mb-4 mt-2"
                    input-name="autogas"
                    transparent
                  />

                </div>
                <title-with-line-and-reject-reason
                  :title="$t('type_of_drive')"
                  rejectKey="gearing"
                  required
                  @change="changeReason"
                />
                <div class="col-12 col-lg-3 pl-0">
                  <template
                    v-if="
                    sellTransmissions && sellTransmissions.length && sellGear
                  "
                  >
                    <form-select
                      v-model="initialForm.transmission"
                      :disabled="user.admin_group == 2"
                      :label="$t('tip-privoda')"
                      :options="
                      sellGear.map((o) => ({
                        name: $t('type_of_drive_values')[o.type_of_drive],
                        key: o.type_of_drive,
                      }))
                    "
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
                    </form-select>
                  </template>
                </div>


                <title-with-line-and-reject-reason
                  v-if="sellTransmissions && sellTransmissions.length"
                  :title="$t('box')"
                  rejectKey="transmission"
                  required
                  @change="changeReason"
                />
                <div class="col-12 col-lg-3 pl-0">

                  <form-select
                    v-model="initialForm.modification"
                    :disabled="user.admin_group == 2"
                    :label="$t('box')"
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
                  </form-select>

                </div>
                <title-with-line-and-reject-reason
                  v-if="sellModifications"
                  :title="$t('modification')"
                  rejectKey="modification"
                  required
                  @change="changeReason"

                />
                <div class="col-12 col-lg-3 pl-0">

                  <form-select
                    v-model="initialForm.car_catalog_id"
                    :disabled="user.admin_group == 2"
                    :label="$t('modification')"
                    :options="
                    sellModifications.map((o) => ({
                      name: getModificationName(o),
                      key: o.id,
                    }))
                  "
                    @change="handleChange($event, false, ['car_catalog_id'], [])"
                  />

                </div>
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
                  @changeReason="changeReason"
                  @close="
                    $router.push(
                      pageRef || $localePath('/profile/announcements'),
                    )
                  "
                  @getRejectObj="getSellLastStepRejectObj"
                />
              </div>

              <!-- actions   ------------------------>
              <div class="moderator-comment mt-5">
                <!--  moderator-->
                <div v-if="user.admin_group == 2" class="row">
                  <div class="col-8">
                    <form-textarea
                      v-model="initialForm.delay_comment"
                      :maxlength="3000"
                      :placeholder="$t('comment')"
                    />
                  </div>
                  <div class="col-4">
                    <button
                      v-if="!rejectObj.rejectArray.length && !sellLastStepRejectObj.rejectArray.length"
                      :class="[
                        'btn btn--green w-50',
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
                        'btn btn--green w-50',
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
                      v-if="!transfer.isOpen"
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

                <!--  supervisor-->
                <div v-if="user.admin_group == 1" class="row">
                  <div class="col float-right">

                    <button
                      v-if="
                        rejectObj.rejectArray.filter((item) => !rejectObj.reject360.includes(item)).length === 0 && (!sellLastStepRejectObj.rejectArray.length)
                      "
                      :class="{ button_loading: button_loading }"
                      class="'btn btn--green mt-2"
                      style="padding: 10px 30px;"
                      @click.prevent="sendData(1)"
                    >
                      {{ $t('confirm') }}
                    </button>
                    <button
                      :class="{ button_loading: button_loading }"
                      class="'btn btn--red mt-2"
                      style="padding: 10px 30px;"
                      @click.prevent="sendData(0)"
                    >
                      {{ $t('reject') }}
                    </button>
                    <button
                      :class="{ button_loading: button_loading }"
                      class="'btn btn--pale-red mt-2"
                      style="padding: 10px 30px;"
                      @click.prevent="sendData(3)"
                    >
                      {{ $t('deactive_announce') }}
                    </button>
                    <button
                      :class="{ button_loading: button_loading }"
                      class="'btn btn--grey mt-2"
                      style="padding: 10px 30px;"
                      @click.prevent="gotoList()"
                    >
                      {{ $t('back_to_list') }}
                    </button>
                  </div>
                </div>
              </div>


              <!-- actions   ------------------------>

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
import moment from "moment";

export default {
  data() {
    return {

      initialForm: {
        delay_comment: '',
        car_catalog_id: this.single_announce?.car_catalog_id,
        brand: this.single_announce?.brand.slug,
        brand_id: this.single_announce?.brand.id,
        model: this.single_announce?.model.slug,
        model_id: this.single_announce?.model.id,
        generation_id: this.single_announce?.car_catalog?.generation_id,
        car_body_type: this.single_announce?.car_catalog?.car_type.id,
        gearing: this.single_announce?.car_catalog?.main['  ']['engine'], // engines
        modification: this.single_announce?.car_catalog?.main[' ']['box'], // transmissions/box
        transmission: this.single_announce?.car_catalog?.main[' ']['type_of_drive'], // gearing
        capacity: this.single_announce?.car_catalog?.capacity,
        power: this.single_announce?.car_catalog?.power,
        year: this.single_announce?.year,
        auction: this.single_announce?.auction,
        end_date: moment(this.single_announce?.end_date).format('DD.MM.YYYY HH:mm'),
        country_id: this.single_announce?.country_id,
        youtube: {
          id: this.single_announce?.youtube_link,
          thumb: `https://img.youtube.com/vi/${this.single_announce?.youtube_link}/hqdefault.jpg`,
        },
        selectedColor: this.single_announce?.colors,
        is_matte: this.single_announce?.is_matte,
        mileage: parseInt(this.single_announce?.mileage) || 0,
        mileage_measure: this.single_announce?.mileage_measure || 1,
        region_id: this.single_announce?.region_id || 1,
        address: this.single_announce?.address,
        lat: parseFloat(this.single_announce?.latitude || 0),
        lng: parseFloat(this.single_announce?.longitude || 0),
        vin: this.single_announce?.vin || "",
        price: this.single_announce?.price_int || '',
        owner_type: parseInt(this.single_announce?.owner_type) || 0,
        currency: this.single_announce?.currency_id || 1,
        car_number: this.single_announce?.car_number,
        show_car_number: this.single_announce?.show_car_number,
        show_vin: this.single_announce?.show_vin,
        part: this.single_announce?.car_body_health
          ? JSON.parse(this.single_announce?.car_body_health.options)
          : {},
        all_options: this.single_announce?.options,
        badges: this.single_announce?.stickers?.map((item) => item.id),
        new_badges: [],
        comment: this.single_announce?.comment || '',
        is_new: this.single_announce?.is_new || false,
        beaten: this.single_announce?.broken,
        customs_clearance: this.single_announce?.customs_clearance || false,
        tradeable: this.single_announce?.exchange_possible,
        credit: this.single_announce?.credit,
        guaranty: this.single_announce?.in_garanty,
        saved_images: this.single_announce?.mediaIds,
        engine: this.single_announce?.car_catalog.engine_id,
        message: "test",
      },
    }

  },
  methods: {
    async getAllData() {

      await this.$auth.setUserToken(`Bearer ${this.$route.query.token}`)
      console.log("auth",this.$auth)
      const admin_user = await this.$axios.$get('/user')
      console.log("admin_user",admin_user)
      this.$auth.setUser(admin_user.user)
      console.log("auth 2",this.$auth)
      //timer
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
        this.$store.commit('moderator/changeTimerData', {
          data: _return,
          unix: timer / 1000,
        })
      }, 1000)
      let data
      try {
        console.log("this axios",this.$axios)
        data = await this.$axios.$get('/ticket/car')
        this.$store.commit('moderator/moderatorMutator', {
          with: data.announce,
          property: 'single_announce',
        })
        this.$store.commit('moderator/moderatorMutator', {
          with: data.brands,
          property: 'brands',
        })
        this.$store.commit('moderator/moderatorMutator', {
          with: data.boxes,
          property: 'boxes',
        })
        this.$store.commit('moderator/moderatorMutator', {
          with: data.models,
          property: 'models',
        })
        this.$store.commit('moderator/moderatorMutator', {
          with: data.moderator,
          property: 'moderator',
        })
        this.$store.commit('moderator/moderatorMutator', {
          with: data.modifications,
          property: 'modifications',
        })
        this.$store.commit('moderator/moderatorMutator', {
          with: data.sellYears,
          property: 'sellYears',
        })
        this.$store.commit('moderator/moderatorMutator', {
          with: data.sell_bodies,
          property: 'sell_bodies',
        })
        this.$store.commit('moderator/moderatorMutator', {
          with: data.type_of_drives,
          property: 'type_of_drives',
        })


      } catch (e) {
        this.$store.commit('moderator/moderatorMutator', {
          with: {},
          property: 'single_announce',
        })
      }
    },

  }
}
</script>
