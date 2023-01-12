<template>
  <div class="w-100" style="box-sizing: border-box;overflow: hidden">
    <div class="container  px-3 px-md-0">
      <!--    breadcrumbs-->
      <breadcrumbs id="brdcrmbs1" :crumbs="crumbs"/>
      <!--    details-->
      <div class="card w-100">
        <template v-if="single_announce">
          <!--        userdata-->
          <section class="row">
            <div class="col-12 col-lg-9">
              <user-details
                :brand="form.brandObj"
                :createdAt="single_announce.created_at"
                :is-autosalon="single_announce.is_autosalon"
                :is-external-salon="single_announce.is_external_salon"
                :userData="single_announce.user"
              />
            </div>
            <div v-if="single_announce.change_log && single_announce.change_log.length"
                 class="col-12 col-lg-3 d-flex justify-content-end">
              <button
                :class="{ button_loading: button_loading }"
                class="'btn btn--green"
                @click.prevent="openLog = true"
              >
                {{ $t('show_logs') }}
              </button>
            </div>
          </section>

          <!--    brand  -->
          <section class="row">
            <div class="col-12">
              <title-with-line-and-reject-reason
                :no-approval="!(admin_user.admin_group === 1 || admin_user.admin_group === 2)"
                :old-value="(admin_user.admin_group !== 2 && old_brand) ? old_brand : ''"
                rejectKey="brand"
                title="mark"
                @change="changeReason"
              />
            </div>
            <div v-if="getBrands && getBrands.length" class="col-12 col-lg-3">
              <form-select
                :clearOption="false"
                :key="refresh+1"
                v-model="form.brand"
                :disabled="isModerator"
                :label="$t('mark')"
                :options="getBrands"
                has-search
                @change="handleChange({key:'brand',value: form.brand, name: getBrandName(form.brand, getBrands)})"
              />
            </div>
          </section>
          <!--    model  -->
          <section class="row">
            <div class="col-12">
              <title-with-line-and-reject-reason
                :no-approval="!(admin_user.admin_group === 1 || admin_user.admin_group === 2)"
                :old-value="admin_user.admin_group !== 2 ? old_model : ''"
                rejectKey="model"
                title="model"
                @change="changeReason"
              />
            </div>
            <div v-if="getModels && getModels.length" class="col-12 col-lg-3">
              <form-select
                :clearOption="false"
                :key="refresh+1"
                v-model="form.model"
                :disabled="isModerator"
                :label="$t('model')"
                :options="getModels"
                has-search
                @change="handleChange({key:'model',value: form.model, name: getBrandName(form.model, getModels)})"
              />
            </div>
            <div class="mb-4">
              <!--          <multiselect-component-->
              <!--            :with-all-option="false"-->
              <!--            hasTranslation-->
              <!--            :key="refresh+1"-->
              <!--            @select-changed="handleChange"-->
              <!--            :placeholder="$t('model')"-->
              <!--            :multiple="false"-->
              <!--            :default-value="model"-->
              <!--            selected-key="model"-->
              <!--            class="multiselect&#45;&#45;tires "-->
              <!--            :options="getModels"-->
              <!--          />-->
            </div>
          </section>
          <!--    year  -->
          <section class="row">
            <div class="col-12">
              <title-with-line-and-reject-reason
                :no-approval="!(admin_user.admin_group === 1 || admin_user.admin_group === 2)"
                :old-value="admin_user.admin_group !== 2 ? single_announce.year.toString() : ''"
                rejectKey="year"
                title="year"
                @change="changeReason"
              />
            </div>
            <div v-if="getYears && getYears.length" class="col-12 col-lg-3">
              <form-select
                :clearOption="false"
                :key="refresh+1"
                v-model="form.year"
                :disabled="isModerator"
                :label="$t('year')"
                :options="getYears"
                has-search
                @change="handleChange({key:'year',value: form.year, name: getBrandName(form.year, getModels)})"
              />
            </div>
            <div class="mb-4">
              <!--          <multiselect-component-->
              <!--            :with-all-option="false"-->
              <!--            hasTranslation-->
              <!--            :key="refresh+1"-->
              <!--            @select-changed="handleChange"-->
              <!--            :placeholder="$t('year')"-->
              <!--            :multiple="false"-->
              <!--            :default-value="year"-->
              <!--            selected-key="year"-->
              <!--            class="multiselect&#45;&#45;tires "-->
              <!--            :options="getYears"-->
              <!--          />-->
            </div>
          </section>
          <!--      image-->
          <section v-if="single_announce && single_announce.media" class="row">
            <div class="col-12">
              <title-with-line-and-reject-reason
                :subtitle="
                      $t('at_least_5_photos', {
                        min: minFiles,
                        max: maxFiles,
                      }).toLowerCase()
                    "
                hideRejectReason
                title="photos"
              >
                <div class="mb-2 ml-2" style="display: inline-block; z-index: 0;">
                  <reject-reason
                    :disabled-value="true"
                    rejectKey="image"
                    @change="changeReason"
                  />
                </div>

              </title-with-line-and-reject-reason>
            </div>
            <div class="col-12">
              <upload-image-moderator
                :announce="single_announce"
                :changePosition="saved_images.length === imagesBase64.length"
                :default-images="single_announce.media"
                :is-edit="false"
                :load-croppa="true"
                :max_files="30"
                :saved_images="saved_images"
                :stopUploading="imagesBase64.length >= 20"
                page="sell"
                url="/"
                @addFiles="addFiles"
                @change="addImages"
                @deletedIndex="deleteByIndex"
                @passBase64Images="passBase64Images"
                @replaceImage="replaceImage"
              />
            </div>
          </section>
          <!--    color  -->
          <section class="row">
            <div class="col-12">
              <title-with-line-and-reject-reason
                :no-approval="!(admin_user.admin_group === 1 || admin_user.admin_group === 2)"
                rejectKey="color"
                title="color"
                @change="changeReason"
              />
            </div>

            <div v-if="form.selectedColor && colors.length" class="col-12">
              <color-options v-model="form.selectedColor" :hide-matt="type !== 'cars'" :limit="2"
                             :matt="form.is_matte" :multiple="type === 'cars'" @change="removeError('selectedColor')"
                             @change-matt="form.is_matte = $event"/>
            </div>
          </section>
          <!--      mileage-->
          <section class="row">
            <div class="col-12">
              <title-with-line-and-reject-reason
                no-approval
                reject-key="mileage"
                required
                title="mileage"
                @change="changeReason"
              />
            </div>
            <div class="col-12 d-flex align-items-center">
              <form-numeric-input
                v-model="single_announce.mileage"
                :invalid="isInvalid('mileage')"
                :min="0"
                :placeholder="$t('mileage')"
                input-class="w-133"
                @change="getChange($event,'mileage')"
              />

              <form-checkbox
                :label="$t('is_new')"
                :value="single_announce.is_new"
                input-name="is_new"
                transparent
                @change="checkboxChanged"
              />

              <form-checkbox
                v-if="!single_announce.is_external_salon"
                :label="$t('in_garanty')"
                :value="single_announce.guaranty"
                input-name="guaranty"
                transparent
                @change="checkboxChanged"
              />

              <form-checkbox
                v-if="!single_announce.is_external_salon"
                :label="$t('not_cleared')"
                :value="single_announce.customed_id"
                input-name="customs_clearance"
                transparent
                @change="checkboxChanged"
              />

              <form-checkbox
                :label="$t('bitie')"
                :value="single_announce.status_id"
                input-name="bitie"
                transparent
                @change="checkboxChanged"
              >
                <popover
                  :message="
                    $t(
                      'with_significant_damage_to_body_elements_that_do_not_move_on_their_own',
                    )
                  "
                  :width="175"
                  class="white-space-pre-wrap-span"
                />
              </form-checkbox>
            </div>
          </section>
          <!--      region-->
          <section class="row">
            <div class="col-12">
              <title-with-line-and-reject-reason
                description="it_will_not_be_possible_to_change_the_city_after_accommodation"
                no-approval
                title="region_and_place_of_inspection"/>
            </div>

            <div v-if="!single_announce.is_external_salon" class="col-4 col-md-6 col-lg-3">
              <form-select
                :clearOption="false"
                id="region_id"
                :key="refresh+1"
                v-model="form.region_id"
                :disabled="isModerator"
                :has-error="errors.includes('region_id')"
                :label="$t('region')"
                :options="sell_options.regions"
                :value="single_announce.region_id"
                has-search
                selected-key="region_id"
                @change="removeError('region_id'), updatePreview('region')"
              />
            </div>
            <div v-if="single_announce.is_external_salon" class="col-lg-4 mb-2 mb-lg-0">
              <form-select
                :clearOption="false"
                v-model="form.country_id"
                :clear-option="false"
                :invalid="isInvalid('region_id')"
                :label="$t('sale_region_country')"
                :options="sellOptions.countries"
                has-search
                @change="removeError('region_id'), updatePreview('region')"
              />
            </div>
            <div v-if="!single_announce.is_external_salon" class="col-4 col-md-6 col-lg-3">
              <pick-on-map-button
                :address="form.address"
                :lat="Number(form.lat)"
                :lng="Number(form.lng)"
                @change-address="updateAddress"
                @change-latlng="updateLatLng"
              >
                <form-text-input
                  v-model="form.address"
                  :placeholder="$t('address')"
                  icon-name="placeholder"
                />
              </pick-on-map-button>
            </div>
          </section>
          <!--      price-->
          <section class="row">
            <div class="col-12">
              <title-with-line-and-reject-reason
                no-approval
                title="price"/>
            </div>

            <div class="col-auto">
              <form-numeric-input
                v-model="form.price"
                :invalid="isInvalid('price')"
                :placeholder="$t('price')"
                input-class="w-133"
                @change="removeError('price'), updatePreview('price')"
              />
            </div>
            <div class="col-auto">
              <form-switch
                v-model="form.currency"
                :options="getCurrencyOptions"
                @change="updatePreview('currency')"
              />
            </div>
          </section>
          <!--      owner-->
          <section class="row">
            <div class="col-12">
              <title-with-line-and-reject-reason
                no-approval
                title="first_owner_question"/>
            </div>

            <div class="col-auto">
              <form-switch
                v-model="form.owners"
                :options="getOwnerOptions"
                :value="single_announce.owners"
                autoWidth
                translated
                @change="getChange($event,'owner_type')"
              />
            </div>
          </section>

          <!--      number/vin-->
          <section id="moderation-moto-number-vin" class="row">
            <div class="col-12">
              <title-with-line-and-reject-reason

                id="anchor-car_or_vin"
                :reject-key="form.car_number ? 'car_number' : 'vin'"
                :required="user.external_salon"
                :title="'license_plate_number_vin_or_carcase_number'"
                spanId="anchor-vin"
                @change="changeReason"
              />
            </div>
            <div class="col-12 col-md-6 col-lg-3">
              <div
                id="anchor-car_number"
              >
                <form-text-input
                  v-model="form.car_number"
                  :mask="type === 'cars' ? '99 - AA - 999' : '99 - A{1,2} - 999'"
                  :placeholder="type === 'cars' ? '__ - __ - ___' : '__ - _ - ___'"
                  img-src="/img/flag.svg"
                  input-class="car-number-show-popover"
                  @change="removeError('car_number')"
                  @focus="showCarNumberDisclaimer"
                >
                  <popover
                    :message="$t('real-car-number-will-make-post-faster')"
                    :width="190"
                    name="car-number"
                    text-class="text-red"
                    @click="readCarNumberDisclaimer = true"
                  />
                </form-text-input>
                <form-checkbox
                  v-model="form.show_car_number"
                  :label="$t('show_car_number_on_site')"
                  class="mt-2 mt-lg-3"
                  input-name="show_car_number"
                  transparent
                />
              </div>
            </div>
            <div v-if="form.customs_clearance && form && form.vin" class="col-12 col-md-6 col-lg-3">
              <form-textarea
                key="vin"
                v-model="form.vin"
                :mask="$maskAlphaNumeric('*****************')"
                :placeholder="$t('vin_carcase_number')"
                class="textfield-like-textarea"
                @change="removeError('vin')"
              >
                <popover :width="240" name="vin">
                  <inline-svg src="/img/car-cert.svg"/>
                </popover>
              </form-textarea>
              <form-checkbox
                v-model="form.show_vin"
                :label="$t('show_vin_on_site')"
                class="mt-2 mt-lg-3"
                input-name="show_vin"
                transparent
              />
            </div>
          </section>


          <!--          options-->
          <section id="moderation-moto-options" class="row">
            <div class="col-12">
              <transition-expand>
                <div v-if="collapsed" class="w-100">
                  <!--                power-->
                  <div>
                    <title-with-line-and-reject-reason no-approval title="engine_power_system"/>
                    <div v-if="moto_options.config" class="row">
                      <div v-for="input in moto_options.config.engine.sell_values['1']" :key="input.name"
                           class="col-lg-4 mb-2 mb-lg-3">
                        <form-radio
                          :id="`${input.name}-engine-${index}`"
                          v-model="form.engine"
                          :input-name="getKey(item)"
                          :invalid="hasError(item)"
                          :label="input.name[locale] || $t(input.name)"
                          :radio-value="$notUndefined(input.id,input.key)"
                        />
                      </div>
                    </div>
                  </div>
                  <!--              cylinders-->
                  <div>
                    <title-with-line-and-reject-reason no-approval title="number_of_cylinders"/>
                    <div v-if="moto_options.config" class="row">
                      <div v-for="(input,index) in moto_options.config.cylinders.sell_values['1']" :key="input.name"
                           class="col-lg-4 mb-2 mb-lg-3">
                        <form-radio
                          :id="`${input.name}-cylinders-${index}`"
                          v-model="form.cylinders"
                          :input-name="getKey(item)"
                          :invalid="hasError(item)"
                          :label="input.name[locale] || $t(input.name)"
                          :radio-value="$notUndefined(input.id,input.key)"
                        />
                      </div>
                    </div>
                  </div>
                  <!--                gearing-Ötürücü -->
                  <div>
                    <title-with-line-and-reject-reason no-approval title="gearing"/>
                    <div v-if="moto_options.config" class="row">
                      <div v-for="(input,index) in moto_options.config.drive.sell_values['1']" :key="input.name"
                           class="col-lg-4 mb-2 mb-lg-3">
                        <form-radio
                          :id="`${input.name}-drive-${index}`"
                          v-model="form.drive"
                          :input-name="getKey(item)"
                          :invalid="hasError(item)"
                          :label="input.name[locale] || $t(input.name)"
                          :radio-value="$notUndefined(input.id,input.key)"
                        />
                      </div>
                    </div>

                  </div>
                  <!--                fuel-->
                  <div>
                    <title-with-line-and-reject-reason no-approval title="fuel"/>
                    <div v-if="moto_options.config" class="row">
                      <div v-for="(input,index)  in moto_options.config.fuel_type.values" :key="input.name"
                           class="col-lg-4 mb-2 mb-lg-3">
                        <form-radio
                          :id="`${input.name}-fuel_type-${index}`"
                          v-model="form.fuel_type"
                          :input-name="getKey(item)"
                          :invalid="hasError(item)"
                          :label="input.name[locale] || $t(input.name)"
                          :radio-value="$notUndefined(input.id,input.key)"
                        />
                      </div>
                    </div>
                  </div>
                  <!--                box-->
                  <div>
                    <title-with-line-and-reject-reason no-approval title="box"/>
                    <div v-if="moto_options.config" class="row">
                      <div v-for="(input,index)  in moto_options.config.box.sell_values['1']" :key="input.name"
                           class="col-lg-4 mb-2 mb-lg-3">
                        <form-radio
                          :id="`${input.name}-box-${index}`"
                          v-model="form.box"
                          :input-name="getKey(item)"
                          :invalid="hasError(item)"
                          :label="input.name[locale] || $t(input.name)"
                          :radio-value="$notUndefined(input.id,input.key)"
                        />
                      </div>
                    </div>
                  </div>
                  <!--                the_number_of_measures /tact-->
                  <div>
                    <title-with-line-and-reject-reason no-approval title="the_number_of_measures"/>
                    <div v-if="moto_options.config" class="row">
                      <div v-for="(input,index)  in moto_options.config.number_of_vehicles.values" :key="input.name"
                           class="col-lg-4 mb-2 mb-lg-3">
                        <form-radio
                          :id="`${input.name}-number_of_vehicles-${index}`"
                          v-model="form.number_of_vehicles"
                          :input-name="getKey(item)"
                          :invalid="hasError(item)"
                          :label="input.name[locale] || $t(input.name)"
                          :radio-value="$notUndefined(input.id,input.key)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </transition-expand>
            </div>
          </section>
        </template>
        <!--      comment-->
        <div class="row mt-5">
          <div class="col-12">
            <title-with-line-and-reject-reason
              description="forbidden_give_links_text"
              no-approval
              title="comment"
            />
          </div>
          <div class="col-8">
            <form-textarea
              id="comment"
              v-model="form.comment"
              :class="{'w100' : ifPopularCommentsEmpty()}"
              :maxlength="3000"
              :placeholder="$t('comment')"

            />
            <popular-comments v-on:getComment="addComment"/>
          </div>
        </div>
        <!--      actions-->
        <div class="row mt-5">
          <section v-if="admin_user.admin_group === 1" class="container"> <!--supervisor-->
            <div class="row">
              <div class="col-12">
                <button v-if="rejectArray.length === 0" :class="{'button_loading':button_loading}"
                        class="btn btn--green w-50"

                        @click.prevent="sendData(1)">{{ $t('confirm') }}
                </button>
                <button :class="{'button_loading':button_loading}" class="btn btn--red w-50 ml-1"

                        @click.prevent="sendData(0)">{{ $t('reject') }}
                </button>
                <button :class="{'button_loading':button_loading}" class="btn btn--pale-red w-50 ml-1"

                        @click.prevent="sendData(3)"
                >
                  {{ $t('deactive_announce') }}
                </button>
                <button class="btn btn--yellow w-50 ml-1" @click="handleBackToList">
                  {{ $t('back_to_list') }}
                </button>
              </div>
            </div>
          </section>
          <section v-else-if="admin_user.admin_group === 2" class="container"> <!--moderator-->
            <div class="row">
              <div class="col-6 col-lg-2">
            <span class="timer">
              {{ getTimer.data }}
            </span>
              </div>
              <div class="col-auto">
                <form-text-input v-if="getTimer.unix > 60*2" v-model="form.delay_comment"
                                 :placeholder="$t('delay_comment')"
                                 type="text"/>
              </div>

              <div class="col-auto">
            <span v-if="getTimer.unix < 60*2 || (getTimer.unix > 60*2 && form.delay_comment.length)">
              <button v-if="rejectArray.length === 0" :class="{'button_loading':button_loading}"
                      class="btn btn--green w-50"

                      @click.prevent="sendData(1)">{{ $t('confirm') }}</button>

              <!-- sendData(0) -->
              <button v-else :class="{'button_loading':button_loading}" class="btn btn--red w-50 ml-5"


                      @click.prevent="transferToSupervisor(true)">{{ $t('reject') }}</button>
            </span>

                <button :class="{'button_loading':button_loading}" class="btn btn--green w-50"

                        @click.prevent="transferModal = true">{{ $t('Transfer to Supervisor') }}
                </button>
              </div>
            </div>
          </section>
          <section v-else-if="admin_user.admin_group === 3" class="container"> <!--call center-->
            <div class="row">
              <div class="col-12">
                <button :class="{'button_loading':button_loading}" class="btn btn--green w-50"

                        @click.prevent="sendData(2)">{{ $t('send_to_moderate') }}
                </button>

                <button :class="{'button_loading':button_loading}" class="btn btn--pale-red w-50 ml-1"

                        @click.prevent="sendData(3)"
                >
                  {{ $t('deactive_announce') }}
                </button>

                <button class="btn btn--yellow w-50 ml-1" @click="handleBackList">
                  {{ $t('back_to_list') }}
                </button>

                <button class="btn btn--green w-50"
                        @click.prevent="transferModal = true">{{ $t('Transfer to Supervisor') }}
                </button>

              </div>
            </div>
          </section>
        </div>

      </div>
      <!--    comment-->
      <template
        v-if="single_announce && single_announce.id  && admin_user.admin_group === 1 && single_announce.transferred">
        <button
          class="'btn btn--green"
          @click="transferModal = true"
        >
          {{ $t('Show comment') }}
        </button>
      </template>
      <!--    empty announce-->
      <div v-if="!single_announce.id">
        <div style="text-align: center">
          <br><br>
          <h2>{{ $t('not_have_pending') }} {{ $route.query.type }}</h2>
          <!--<a :href="$route.fullPath">
            <button class="section-post__btn add_announce">Get car ticket</button>
          </a>
          &nbsp;&nbsp;-->
          <a href="javascript:void(0);">
            <button class="btn btn--yellow w-50" @click="handleBackList">{{ $t('back_to_list') }}</button>
          </a>
          <br><br>
        </div>
      </div>
    </div>
    <!--    logs modal-->
    <modal-popup
      :modal-class="''"
      :title="`${$t('logs')}`"
      :toggle="openLog"
      @close="openLog = false"
    >
      <change-log
        :btl="single_announce.btl_announces"
        :logs="single_announce.change_log"
        :user-id="single_announce.user_id"
      />
    </modal-popup>
    <!--    transfer modal 1-->
    <modal-popup
      :modal-class="''"
      :title="`${$t('Comment')}`"
      :toggle="(admin_user.admin_group === 1) && transferModal"
      @close="transferModal = false"
      closeable
    >
        <div class="body"
             v-html="(single_announce.transferred && single_announce.transferred.comment) ?  single_announce.transferred.comment: ''">
      </div>
    </modal-popup>
    <!--    transfer modal 2-->
    <modal-popup
      :modal-class="''"
      :title="`${$t('transfer_comment')}`"
      :toggle="transferModal"
      @close="transferModal = false"
      closeable
    >
      <div class="body">
        <textarea
          class="ma-input"
          key="ma-moderation-comment-2"
          v-model="transferComment"
          :placeholder="$t('transfer_comment')"
        />
      </div>
    </modal-popup>
  </div>
</template>


<script>
import {mapActions, mapGetters} from "vuex";
import UserDetails from '~/components/moderator/brand.vue'
import MultiselectComponent from '~/components/moderator/multiselectComponent.vue'
import RejectReason from '~/components/moderator/rejectReason'
import PhotoRejectReason from "~/pages/moderator/photoReject/PhotoRejectReason";
import UploadImageModerator from '~/components/moderator/UploadImageModerator'
import PopularComments from '~/components/moderator/popularComments'
import ColorOptions from '~/components/options/ColorOptions'
import PickOnMapButton from '~/components/elements/PickOnMapButton'
import moment from "moment";
import TitleWithLineAndRejectReason from '~/components/moderator/titleWithLineAndRejectReason'
import SellFilters from '~/components/sell/SellFilters'
import TitleWithLine from "~/components/global/titleWithLine";
import FormRadioGroup from "~/components/forms/FormRadioGroup";
import ChangeLog from "~/components/moderator/changeLog";

export default {

  name: "ModerationMoto",

  layout: 'ticket',

  components: {
    TitleWithLine,
    UserDetails,
    TitleWithLineAndRejectReason,
    MultiselectComponent,
    RejectReason,
    PhotoRejectReason,
    UploadImageModerator,
    ColorOptions,
    PickOnMapButton,
    SellFilters,
    PopularComments,
    FormRadioGroup,
    ChangeLog
  },

  async fetch({store}) {
    await store.dispatch('getOptions');
    await store.dispatch('getScooterOptions');
    await store.dispatch('getAllOtherOptions');
    await store.dispatch('getColors');
    await store.dispatch('getBadges');
  },

  //------------------------------------------------------------asyncData------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------asyncData------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------asyncData------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------asyncData------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------asyncData------------------------------------------------------------------------------------------------------------
  async asyncData({route, store, $auth, $axios}) {
    await $auth.setUserToken(`Bearer ${route.query.token}`);
    const admin_user = await $axios.$get('/user');

    if (!admin_user.user.is_admin) {
      return false;
    }

    await store.dispatch('getMotoOptions');

    let data;
    try {
      data = await $axios.$get(`/ticket/moto?type=${route.query.type}`);
      console.log("asyncdata data", data)
      store.commit('mutate', {
        property: 'single_announce',
        value: data.announce,
      })

      let default_data = {};
      let singleAnnounce = store.state.single_announce;
      let brand;
      let model;
      let type;
      default_data['engine'] = singleAnnounce.engine_type_id;  //+
      default_data['volume'] = singleAnnounce.capacity; //+
      default_data['power'] = singleAnnounce.power; //+
      default_data['cylinders'] = singleAnnounce.cylinders; //+
      default_data['box'] = singleAnnounce.box_id; //+
      default_data['cylinder_placement'] = singleAnnounce.cylinder_type_id;
      default_data['number_of_vehicles'] = singleAnnounce.tact; //+
      default_data['drive'] = singleAnnounce.gear_id; //+
      default_data['capacity'] = singleAnnounce.capacity;
      default_data['fuel_type'] = singleAnnounce.fuel_type;
      if (singleAnnounce.moto_brand !== undefined) {
        default_data['category'] = "1";
        await store.dispatch('getMotoModels', {
          id: singleAnnounce.moto_brand.id,
          category: default_data.category,
          index: 0
        })
        brand = singleAnnounce.moto_brand;
        model = singleAnnounce.moto_model;
        /*  type  = singleAnnounce.moto_type_id;*/
      }
      if (singleAnnounce.scooter_brand !== undefined) {
        default_data['category'] = "2";
        await store.dispatch('getScooterModels', {id: singleAnnounce.scooter_brand.id, index: 0})
        brand = singleAnnounce.scooter_brand;
        model = singleAnnounce.scooter_model;
      }
      if (singleAnnounce.moto_atv_brand !== undefined) {
        default_data['category'] = "3";
        await store.dispatch('getAtvModels', {id: singleAnnounce.moto_atv_brand.id, index: 0})
        brand = singleAnnounce.moto_atv_brand;
        model = singleAnnounce.moto_atv_model;
        /*  type  = singleAnnounce.moto_atv_type_id;*/
      }
      return {
        admin_user: admin_user.user,
        default_data: default_data,
        old_brand: (brand && brand.name) ? brand.name : null,
        old_model: model.name,
        old_type: type,
        brand: brand.id,
        model: model.id,
        year: singleAnnounce.year,
        moderator: data ? data.moderator : {},
      }
    } catch (e) {
      store.commit('moderator/moderatorMutator', {
        with: {},
        property: 'single_announce'
      })
    }
    return {
      admin_user: admin_user.user,
      moderator: data ? data.moderator : {},
    }
    // await store.dispatch('editMoto',{ id:route.params.edit, type:route.query.type });

  },
  //-----------------------------------------------------------------asyncData^------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------asyncData^------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------asyncData^------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------asyncData^------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------asyncData^------------------------------------------------------------------------------------------------------
  data() {
    return {
      button_loading: false,
      openLog: false,
      transferModal: false,
      transferComment: '',
      announceId: false,
      getTimer: {
        data: '',
        unix: 0
      },
      rejectArray: [],
      refresh: 1,
      date: Math.floor(Date.now() / 1000),
      saved_images: [],
      popup: false,
      deleteArr: [],
      errors: [],
      progress_width: 0,
      progress_index: 0,
      color_selected: 0,
      price_selected: 0,
      status_selected: 0,
      complect_selected: 0,
      desc_selected: 0,
      images_selected: 0,

      progress: [this.$t('make_and_model'), this.$t('photo_and_video'), this.$t('color_and_mileage'), this.$t('price_and_contacts'), this.$t('condition'), this.$t('equipment'), this.$t('description')],
      mmm: '',
      cookie_keys: ['engine', 'generation', 'year'],
      breadcrumbs: [],
      show: {},
      category: "1",
      address: '',
      selectedIndex: {},
      option_toggle: 1,
      cars_parts: [
        {
          name: this.$t('front_bamp'),
          classes: 'state__front'
        },
        {
          name: this.$t('front_left_door'),
          classes: 'state__FrontLeftDoor'
        },
        {
          name: this.$t('back_right_door'),
          classes: 'state__FrontRearRight'
        },
        {
          name: this.$t('front_right_door'),
          classes: 'state__FrontRightDoor'
        },
        {
          name: this.$t('back_left_door'),
          classes: 'state__FrontRearLeft'
        },
        {
          name: this.$t('roof'),
          classes: 'state__roof'
        },
        {
          name: this.$t('back_bamp'),
          classes: 'state__rear'
        },
      ],
      titles: [
        this.$t('overview'),
        this.$t('exterior_elements'),
        this.$t('theif_protection'),
        this.$t('multimedia'),
        this.$t('salon'),
        this.$t('comfort'),
        this.$t('safety'),
        this.$t('other')
      ],
      selectedBadges: [],
      modalIsActive: false,
      files: {},
      imagesBase64: [],
      form: {
        auction: '',
        end_date: '',
        country_id: '',
        delay_comment: '',
        brand: null,
        address: '',
        lat: '',
        comment: '',
        lng: '',
        tradeable: 0,
        beaten: 0,
        guaranty: 0,
        category: '1',
        volume: '',
        power: '',
        car_number: '',
        show_car_number: false,
        show_vin: false,
        selectedColor: '',
        all_options: {},
        badges: {},
        region_id: '',
        year: '',
        month: '',
        mileage: '',
        is_new: 0,
        customs_clearance: 0,
        passport: 0,
        vin: '',
        number_of_vehicles: -1,
        cylinders: -1,
        cylinder_placement: -1,
        drive: -1,
        engine: -1,
        used_ones: -1,
        customed_ones: -1,
        box: -1,
        price: '',
        new_badges: [],
        owner_type: 0,
        currency: 0,
        youtube: {
          id: '',
          thumb: ''
        },
        saved_images: [],
        fuel_type: null,
        is_autosalon: false,
        mileage_measure: 0,
        selectedYear: null,
        btl_cookie: "",
        credit: false,
        owners: 0,
      },
      showPhotoReject: false,
      minFiles: this.$route.query.type === 'moto' ? 2 : 3,
      maxFiles: 20,
      readCarNumberDisclaimer: false,
      collapsed: true,
    }
  },

  async created() {
    await this.$auth.setUserToken(`Bearer ${this.$route.query.token}`);
    this.$axios.setHeader('Authorization', `Bearer ${this.$route.query.token}`)

    if (this.admin_user.admin_group == 2) {
      setInterval(() => {
        let timer = moment().diff(moment(this.moderator.created_at));
        var duration = moment.duration(timer);
        var days = duration.days(),
          hrs = duration.hours(),
          mins = duration.minutes(),
          secs = duration.seconds();

        if (hrs.toString().length === 1) hrs = '0' + hrs;
        if (mins.toString().length === 1) mins = '0' + mins;
        if (secs.toString().length === 1) secs = '0' + secs;
        let _return = '';

        if (days > 0) _return += days + 'd. ';

        _return += hrs + ':' + mins + ':' + secs;

        this.getTimer.data = _return;
        this.getTimer.unix = timer / 1000;
      }, 1000);
    }
    if (this.single_announce.id) {

      let announce = JSON.parse(JSON.stringify(this.single_announce));

      this.form.end_date = announce.end_date;
      this.form.auction = announce.auction;
      this.form.country_id = announce.country_id;
      this.announceId = announce.id;
      this.form.id = announce.id;
      this.form.id_unique = announce.id_unique;
      this.form.category = this.default_data.category;
      this.category = this.default_data.category;
      /*   this.form = this.default_data;
         this.form.youtube =  { id:'', thumb:'' };*/
      this.saved_images = announce.mediaIds;
      this.form.selectedColor = announce.color_id;
      this.form.mileage = announce.mileage;
      this.form.address = announce.address;
      this.form.beaten = announce.status_id;
      this.form.fuel_type = announce.fuel_type || 1;
      this.form.is_new = announce.is_new;
      this.form.customs_clearance = announce.customed_id;
      this.form.region_id = announce.region_id;
      this.form.lat = parseFloat(announce.latitude);
      this.form.lng = parseFloat(announce.longitude);
      this.form.price = this.numericPrice();
      this.form.currency = announce.currency_id;
      this.form.tradeable = announce.tradeable;

      this.form.owner_type = announce.owners;
      this.form.owners = announce.owners;
      this.form.year = announce.year;

      this.form.guaranty = announce.guaranty;
      this.form.car_number = announce.car_number;
      this.form.show_car_number = announce.show_car_number;
      this.form.show_vin = announce.show_vin;
      this.form.vin = announce.vin;

      if (
        (announce.moto_brand !== undefined) ||
        (announce.scooter_brand !== undefined) ||
        (announce.moto_atv_model !== undefined)
      ) {
        this.form.brand = announce.moto_brand?.id || announce.scooter_brand?.id || announce.moto_atv_brand?.id || null;
        this.form.model = announce.moto_model?.id || announce.scooter_model?.id || announce.moto_atv_model?.id || null;
        this.form.selectedBrand = announce.moto_brand?.slug || announce.scooter_brand?.slug || announce.moto_atv_brand?.slug || null;
        this.form.selectedModel = announce.moto_model?.slug || announce.scooter_brand?.slug || announce.moto_atv_model?.slug || null;
      }
      this.form.engine = announce.engine_type_id;
      this.form.power = announce.power;
      this.form.comment = announce.comment;


      this.form.engine = this.default_data['engine']
      this.form.volume = this.default_data['volume'];
      this.form.power = this.default_data['power'];
      this.form.cylinders = this.default_data['cylinders'];
      this.form.box = this.default_data['box'];
      this.form.cylinder_placement = this.default_data['cylinder_placement'];
      this.form.number_of_vehicles = this.default_data['number_of_vehicles'];
      this.form.drive = this.default_data['drive'];
      this.form.capacity = this.default_data['capacity'];

      if (announce.youtube_id) this.getYoutube(announce.youtube_id);

    }
  },

  mounted() {

    this.$nuxt.$on('custom_modal_open', (val) => {

      if (val) {
        this.popup = true;
        document.querySelector('body').classList.add('popup_open')
      } else {
        this.popup = false;
        document.querySelector('body').classList.remove('popup_open')
      }
    });
    document.body.addEventListener('click', () => {
      this.show = {};
    });
  },

  beforeDestroy() {
    this.$nuxt.$off('publish_post')
    this.$toasted.clear();
  },

  methods: {
    ...mapActions([
      'setSellPreviewData',
    ]),
    handleBackList() {
      if (this.admin_user.admin_group == 2) {
        location.href = '/alvcp/resources/announce-moderators';
      } else {
        location.href = '/alvcp/resources/announcements';
      }
    },
    async handleBackToList() {
      await this.$axios.$post('/ticket/detach/' + this.announceId + '/' + this.getRedirectUrl)
      location.href = '/alvcp/resources/' + this.getRedirectUrl;
    },

    ifPopularCommentsEmpty() {
      if (this.getPopularComments.length) {
        return this.getPopularComments
      } else {
        return {}
      }
    },
    getValue(key, value) {
      if (key === 'status') {
        let status = [this.$t('rejected'), this.$t('active'), this.$t('pending')];
        return status[value];
      } else {
        return value;
      }
    },
    addComment(e) {
      if (this.form.comment === null) this.form.comment = '';
      this.form.comment = this.form.comment + e + ' ';
    },
    async deleteByIndex(index) {
      if (this.saved_images[index]) {
        this.deleteArr.push(this.saved_images[index])
      } else {
        await this.$axios.$post('/remove_temporary_image/' + this.saved_images[index]);
      }
      this.saved_images.splice(index, 1);
    },
    changeReason(rejectKey) {
      if (rejectKey === 'image') {
        this.showPhotoReject = true;
      } else {
        if (this.rejectArray.includes(rejectKey)) {
          this.rejectArray.splice(this.rejectArray.indexOf(rejectKey), 1);
        } else {
          this.rejectArray.push(rejectKey);
        }
      }
    },
    async addFiles(v) {
      await Promise.all(
        v.map(async (image) => {
          let formData = new FormData()
          formData.append('temp_id', this.date)
          formData.append('images[]', image);
          try {
            const data = await this.$axios.$post('/upload_temporary_images', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            this.saved_images = this.saved_images.concat(data.ids)
            this.$store.commit('setSavedImageUrls', data.images);
            this.$nuxt.$emit('remove_image_loading_by_index', this.saved_images.length);
          } catch ({response: {data: {data}}}) {
            this.$nuxt.$emit('remove_image_by_index', this.saved_images.length);
            this.$nuxt.$emit('remove_image_on_catch');
            this.errors = []
            this.$toasted.clear()
            Object.keys(data).map((key) => {
              this.$toasted.show(data[key], {type: 'error'});
            })
          }
        })
      )
    },
    deleteArrHandler(v) {
      this.deleteArr = v;
    },
    progressing(i) {
      if (i === 0) this.progress_width = 0;
      else this.progress_width = (100 / 10) * i;
    },

    getOldYears(first, second) {
      let dates = [];
      for (let i = (new Date().getFullYear()); i >= 1900; i--) {
        dates.push(i);
      }
      return dates.slice(first, second);
      if (first === 11) {
        return dates.slice(first, dates.length);
      }
    },
    changeCategory(v) {
      this.form.category = v;
      this.breadcrumbs = [];
      this.form.selectedBrand = '';
      this.form.selectedModel = '';
      this.form.selectedType = '';
    },
    async componentValueChange(id, item) {
      this.form[item] = id;
    },
    async handleChange(v) {
      switch (v.key) {
        case 'brand':
          // console.log("braand", this.brand)
          // console.log("--v---", v)
          // console.log("this.default_data.category", this.default_data.category)
          this.brand = 0;
          this.form.model = null;
          if (this.default_data.category == "1")
            await this.$store.dispatch('getMotoModels', {id: v.value, index: 0, category: this.default_data.category})
          else if (this.default_data.category === "2")
            await this.$store.dispatch('getScooterModels', {
              id: v.value,
              index: 0,
              category: this.default_data.category
            })
          else
            await this.$store.dispatch('getAtvModels', {
              id: v.value,
              index: 0,
              category: this.default_data.category
            })
        case 'model':
          this.model = 0;
        case 'type':
        // this.$route.query.type = 0;
        case 'year':
          this.year = 0;
      }
      if (v.value && v.value.key) {
        this[v.key] = v.value.key;
      }
      this.refresh += 15;
    },
    Sections(col, items) {
      return items.slice(col * Math.ceil(items.length / 4), (col + 1) * Math.ceil(items.length / 4));
    },
    passBase64Images(val) {
      this.imagesBase64 = val;

    },

    getColor() {
      return this.colors.find(item => item.id === this.form.selectedColor);
    },
    getLatLng(latLng) {
      this.form.lat = latLng.lat;
      this.form.lng = latLng.lng;
      this.lat = latLng.lat;
      this.lng = latLng.lng;
    },
    getAddress(address) {
      this.removeFromError('address');
      this.form.address = address;
      this.address = address;

    },
    closeModal() {
      this.modalIsActive = false;
    },
    openModal() {
      this.modalIsActive = true;
    },
    closePopup() {
      this.showPhotoReject = false;
      this.show = {};
    },

    handleMultiselect(v) {
      this.removeFromError(v.key);
      this.form[v.key] = v.value.key;
    },

    saveToData(v) {
      this.selectedIndex[v.index] = v.index;
      this.form.part[v.index] = v.data;
      this.changeProgressSingle('part')

    },

    removeFromData(v) {
      delete this.selectedIndex[v.index];
      delete this.form.part[v.index];
      this.changeProgressSingle('part')
    },

    savePhotoIssues(v) {
      var validCheckbox = true;
      Object.keys(v.data).map((key) => {
        if (this.rejectArray.includes(key)) {
          this.rejectArray.splice(this.rejectArray.indexOf(key), 1);
        }

        if (v.data[key]) {
          validCheckbox = false;
          this.rejectArray.push(key);
        }
      })

      this.$nuxt.$emit('image-checkbox-change', validCheckbox);
    },

    handleAllOptions(v) {
      let key = Object.keys(v)[0];
      if (v[key] || (v.value && v.value.key)) {
        if (v.key) this.form.all_options[v.key] = v.value.key;
        else this.form.all_options[key] = v[key];
      } else {
        if (v.key) delete this.form.all_options[v.key];
        else delete this.form.all_options[key];
      }

      this.changeProgressSingle('all_options')
    },

    showSellModal(index) {
      this.show = {};
      this.show[index] = index;
    },

    _can_upload_file(key) {
      let file = this.files[key];

      if (file.attempted || file.bad_size) {
        return false;
      }
      return true;
    },

    async transferToSupervisor(withRejectReason = false) {
      this.button_loading = true;

      if (withRejectReason) {
        this.transferComment = this.rejectArray;
      }

      await this.$axios.$post('/ticket/transfer/moto/' + this.announceId + '/' + this.$route.query.type, {comment: this.transferComment});

      let moto = {
        'moto': 'motorcycles',
        'scooters': 'scooters',
        'moto_atv': 'moto-atvs',
      };

      if (this.admin_user.admin_group == 2) {
        location.href = '/alvcp/resources/announce-moderators';
      } else {
        location.href = '/alvcp/resources/' + moto[this.$route.query.type];
      }
    },

    async sendData(status = 2) {
      if (this.saved_images.length !== this.imagesBase64.length) {
        this.$toasted.show(this.$t('please_wait_for_all_image_loading'), {type: 'error'});
        return false;
      }
      let formData = new FormData();
      this.form.status = status;
      // this.form.model = this.model;
      this.form.year = this.year;
      this.form.type = this.type;
      this.form.rejectArray = this.rejectArray;
      this.form.selectedYear = this.form.year;

      this.form.saved_images = this.saved_images;
      // delete this.form.btl_cookie;
      // delete this.form.credit;
      // delete this.form.fuel_type;
      // delete this.form.is_autosalon;
      // delete this.form.mileage_measure;
      // delete this.form.selectedBrand;
      // delete this.form.selectedModel;
      // delete this.form.selectedYear;
      // delete this.form.type;


      formData.append('data', JSON.stringify(this.form));
      formData.append('deletedImages', JSON.stringify(this.deleteArr));

      this.$nuxt.$emit('loading_status', true);
      this.button_loading = true;
      try {
        await this.$axios.$post('/ticket/moto/' + this.announceId + '/' + this.type,
          formData
        );
        let moto = {
          'moto': 'motorcycles',
          'scooters': 'scooters',
          'moto_atv': 'moto-atvs',
        };

        if (this.admin_user.admin_group == 2) {
          // location.href = '/alvcp/resources/announce-moderators';
        } else {
          // location.href = '/alvcp/resources/' + moto[this.$route.query.type];
        }

      } catch ({response: {data: {data}}}) {
        this.$nuxt.$emit('loading_status', false);
        this.button_loading = false;
        this.errors = [];
        this.$toasted.clear();
        Object.keys(data).reverse().map((key) => {
          this.errors.push(key);
          this.$toasted.show(data[key][0], {
            type: 'error',
            duration: 0,
            action: {
              text: 'Go to fix',
              onClick: (e, toastObject) => {
                if (document.querySelector('#' + key))
                  document.querySelector('#' + key).scrollIntoView({behavior: 'smooth', block: 'center'});
                toastObject.goAway(0);

              }
            }
          })
        })
      }


    },

    addImages(v) {
      this.files = v;

      this.$nuxt.$emit('progress_change', {type: 'images', count: Object.keys(this.files).length});
    },
    move(input, from, to) {
      let numberOfDeletedElm = 1;
      const elm = input.splice(from, numberOfDeletedElm)[0];
      numberOfDeletedElm = 0;
      input.splice(to, numberOfDeletedElm, elm);
    },
    replaceImage(object) {
      if (this.saved_images.length !== this.imagesBase64.length) return;
      this.imagesBase64 = object.images;
      this.move(this.saved_images, object.v.oldIndex, object.v.newIndex);
    },
    removeImage(v) {
      this.files = v;
    },
    getChangeOption(v) {
      if (v) this.option_toggle = 0;
      else this.option_toggle = 1;
    },
    checkboxChanged(v) {
      let key = Object.keys(v)[0];
      this.form[key] = v[key];
      if (key === 'customs_clearance') this.form.car_number = '';
    },
    getCurrency(v) {
      this.form.currency = v.key;

    },
    addNewBadge(v) {
      this.selectedBadges.push(...v);
      this.form.new_badges = v;

    },
    changeBadge(v) {
      this.selectedBadges.push(...v);
      this.form.badges = v;

    },
    removeFromError(type) {
      var index = this.errors.indexOf(type);
      if (index !== -1) this.errors.splice(index, 1);
    },
    getChange(v, type) {
      this.removeFromError(type);
      this.form[type] = v;
      if (type === 'mileage' || type === 'selectedColor')
        this.changeProgress('mileage', 'selectedColor');
      if (type === 'price' || type === 'name')
        this.changeProgress('price', 'name');
    },
    changeProgressSingle(key) {
      let status = 0;
      if (Object.keys(this.form[key]).length) {
        status = 2;
      }
      this.$nuxt.$emit('progress_change', {type: key, count: status})
    },
    changeProgress(key1, key2) {
      let status = 0;

      if (this.form[key1]) {
        status = 1;

      }
      if (this.form[key2]) {
        status = 1;

      }
      if (this.form[key1] && this.form[key2]) {
        status = 2;

      }
      this.$nuxt.$emit('progress_change', {type: key1 + '_' + key2, count: status})
    },

    getYoutube(val) {
      this.form.youtube.id = val;
      this.form.youtube.thumb = `https://img.youtube.com/vi/${val}/hqdefault.jpg`

    },

    numericPrice() {
      return this.single_announce.price.replace(/\D/g, '');
    },

    //  ------------
    formatDate(dte) {
      return moment(dte).format('DD.MM.YYYY HH:mm')
    },
    getBrandName(id, arr) {
      return arr.find(element => element.key == id);
    },
    removeError(field, force = false) {
      if (!force && (!this.form[field] || this.form[field] === '')) return;
      if (this.errors.includes(field)) {
        this.errors = this.errors.filter(key => key !== field);
        this.toasts[field].goAway(100);

      }
    },
    updatePreview(key) {
      if (!key || key === 'region')
        this.setSellPreviewData({
          value: this.form.region_id,
          key: 'region',
        })
      if (!key || key === 'price')
        this.setSellPreviewData({value: this.form.price, key: 'price'})
      if (!key || key === 'currency')
        this.setSellPreviewData({
          value: this.getCurrencyOptions.find(
            (o) => o.key === this.form.currency,
          )?.sign,
          key: 'currency',
        })
      if (!key || key === 'mileage')
        this.setSellPreviewData({value: this.form.mileage, key: 'mileage'})
      if (!key || key === 'mileage_measure')
        this.setSellPreviewData({
          value: this.getMileageOptions.find(
            (o) => o.key === this.form.mileage_measure,
          )?.name,
          key: 'mileage_measure',
        })
      return
    },
    updateMileage(is_new) {
      if (!is_new) {
        this.isInvalid('mileage') && this.removeError('mileage')
      } else {
        let mileage = this.form.mileage
        this.form.mileage =
          mileage > (this.form.mileage_measure === 2 ? 310.686 : 500) ||
          !mileage
            ? 0
            : mileage
      }
      this.updatePreview('mileage')
    },
    isInvalid(field) {
      return this.errors.includes(field);
    },
    updateAddress(address) {
      this.form.address = address
      this.removeError('address')
    },
    updateLatLng({lat, lng}) {
      this.form.lat = lat
      this.form.lng = lng
    },
    showCarNumberDisclaimer() {
      if (this.readCarNumberDisclaimer) {
        this.$nuxt.$emit('close-popover', 'car-number')
      } else {
        this.$nuxt.$emit('show-popover', 'car-number')
        this.readCarNumberDisclaimer = true
      }
    },
    updateSellFilter(key, value) {
      if (value === '') this.$delete(this.form, key)
      else this.$set(this.form, key, value)
    },

    //  sell filters
    selectOption(key, value) {
      this.$emit('update-sell-filter', key, value);
      this.$emit('remove-error', key);
    },
    getKey(item) {
      return item.search_key || item.field;
    },
    getValues(item) {
      let options = this.options && this.options[item.type_key];
      let sell_values = item.sell_values && item.sell_values[parseInt(this.selected.category)];
      let values = options || sell_values || item.values;//this.$sortBy(options || sell_values || item.values, a => a.name[this.locale] || this.$t(a.name));
      return this.type === 'commercial' && this.getType(item) === 'input-radio' && !item.required
        ? [...values, {key: 0, name: this.$t('not_set')}]
        : values;
    },
    getPlaceholder(item) {
      return this.$t(item.placeholder) || this.$t(item.type_key.replace('engine', 'fuel'));
    },
    hasError(item) {
      let field = this.getKey(item);
      return this.errors.includes(field);
    },
    getSuffix(field, sep = '') {
      switch (field) {
        case 'volume':
          return sep + this.$t('char_sm_cube');
        case 'power':
          return sep + this.$t('char_h_power');
        case 'capacity':
          return sep + this.$t('char_sm_cube');
        case 'mileage':
          return sep + this.$t('char_kilometre');
        case 'weight':
          return sep + this.$t('char_kilogramm');
        default:
          return '';
      }
    },
    getType(item) {
      switch (item.component_add || item.component) {
        case 'select-checkbox':
        case 'any-type-selector':
        case 'truck-types':
          return 'input-radio';
        case 'animated-input':
        case 'input-component':
          return 'input-numeric';
      }
    }
  },

  computed: {
    getBrands() {
      let types = {
        moto: '',
        moto_atv: 'atv_',
      }
      let dates = [];
      var brands;
      if (this.$route.query.type == "scooters") {
        brands = this.moto_options.scooter_brands || [];
      } else {
        brands = this.moto_options[types[this.$route.query.type] + 'brands'] || [];
      }
      for (const key in brands) {
        dates.push({
          key: brands[key].id,
          name: brands[key].name,
        });
      }
      return dates;
    },
    type() {
      return this.$route.query.type
    },
    getBtlUserName() {
      return this.single_announce.btl_announces.length ? this.single_announce.btl_announces.find(item => item.announce_id === this.single_announce.id).get_user.full_name : ''
    },

    getModels() {
      let types = {
        moto: 'moto_',
        scooters: 'scooter_',
        moto_atv: 'moto_atv_',
      }
      let dates = [];
      let models = this[types[this.$route.query.type] + 'models'][0];
      for (const key in models) {
        dates.push({
          key: models[key].id,
          name: models[key].name,
        });
      }
      return dates;
    },
    getOldType() {
      return this.getTypes.find(item => item.key === this.old_type)
    },
    getYears() {
      let dates = [];
      for (let i = (new Date().getFullYear()); i >= 1900; i--) {
        dates.push({
          key: i,
          name: i,
        });
      }
      return dates
    },
    getTypes() {
      let types = {
        moto: '',
        moto_atv: 'atv_',
      }
      let dates = [];
      let moto_types = this.moto_options[types[this.$route.query.type] + 'types'];
      for (const key in moto_types) {
        dates.push({
          key: moto_types[key].id,
          name: moto_types[key].name[this.locale],
        });
      }
      return dates;
    },
    item() {
      return {
        ...this.form, color: this.getColor(), car_catalog: {
          brand: this.single_announce.moto_brand || this.single_announce.scooter_brand || this.single_announce.moto_atv_brand,
          model: this.single_announce.moto_model || this.single_announce.scooter_model || this.single_announce.moto_atv_model,
          moto_options: this.moto_options.config
        }
      };
    },
    getTitle() {
      if (this.single_announce.moto_brand) return this.single_announce.moto_brand.name + ' ' + this.single_announce.moto_model.name;
      if (this.single_announce.scooter_brand) return this.single_announce.scooter_brand.name + ' ' + this.single_announce.scooter_model.name;
    },
    semiActiveModel() {
      return this.form.selectedBrand && !this.form.selectedModel
    },
    exactlyActiveModel() {

      return this.form.selectedBrand && this.form.selectedModel
    },
    getRedirectUrl() {
      let moto = {
        'moto': 'motorcycles',
        'scooters': 'scooters',
        'moto_atv': 'moto-atvs',
      };

      return moto[this.$route.query.type];
    },
    ...mapGetters({
      colors: 'colors',
      sell_options: 'sellOptions',
      all_sell_options: 'allSellOptions',
      badges: 'badges',
      moto_options: 'motoOptions',
      scooter_options: 'scooterOptions',
      single_announce: 'single_announce',
      moto_models: 'motorcycleModels',
      scooter_models: 'scooterModels',
      moto_atv_models: 'atvModels',
      getPopularComments: 'getPopularComments'
    }),

    color() {
      return this.getColor();
    },
    crumbs() {
      return [
        // { name: this.$t('my_announces'), route: `/profile/announcements` },
        // { name: `#${this.myAnnouncement.id_unique}`, route: `/cars/announcement/16642054490` },
        {name: this.$t('moderator')},
      ]
    },
    isModerator() {
      return this.user.admin_group && (this.user.admin_group == 2);
    },
    getCurrencyOptions() {
      return [
        {key: 1, name: 'AZN', sign: '₼'},
        {key: 2, name: 'USD', sign: '$'},
        {key: 3, name: 'EUR', sign: '€'},
      ]
    },
    getOwnerOptions() {
      return [
        {key: "0", name: 'first',},
        {key: "1", name: 'second_and_more',},
      ]
    },
    announceType() {
      const lastDigit = String(this.announceId).slice(-1)
      if (lastDigit == 2) {
        return 'scooter'
      } else if (lastDigit == 3) {
        return 'motoatv'
      } else if (lastDigit == 4) {
        return 'commercial'
      } else if (lastDigit == 5) {
        return 'part'
      } else return 'moto'
    },
    // single_announce:{
    //   get() {
    //     return this.value;
    //   },
    //   set(value) {
    //     this.$emit('input', (this.disabled || (this.value.length > 1000)) ? this.value : value);
    //   }
    // }
  },

}
</script>


<style lang="scss" scoped>
section {
  position: relative;

  &.disable:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
}

.timer {
  font-size: 18px;
  color: #fff;
  letter-spacing: 2px;
  background: #050a25;
  padding: 6px 10px 0 10px;
  display: inline-block;
  height: 34px;
  border-radius: 4px;
  width: 160px;
}

.old_value {
  position: relative;
  left: -16px;
  font-size: 14px;
}

.logs {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;

  .log {
    background: #fff;
    display: inline-block;
    margin-top: 20px;
    max-height: 80%;
    overflow-y: auto;

    & > div {
      padding: 10px;
    }

    .title {
      position: relative;

      span {
        position: absolute;
        right: 0;
        top: 0;
        padding: 5px 10px;
        cursor: pointer;
        color: #b90026;
      }
    }

    .body {
      border-top: 1px solid rgba(0, 0, 0, 0.5);
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      text-align: left;

      & > div {
        border-bottom: 1px dashed #000000;
        margin: 5px 0;
        padding: 5px 0;
      }
    }

    .foot {
      .closeBtn {
        display: inline-block;
        padding: 5px 22px;
        background: #b90026;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>


<!--moto 1-->
<!--motoatv 3-->
<!--scooter 2-->
<!--commer 4-->
<!--commer 5 part-->
