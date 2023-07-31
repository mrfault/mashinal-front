<template>
   <div class="cars-search-form form">
      <div class="cars-search-form__inner">
         <div class="d-flex align-items-center justify-content-between mb-5">
            <form-buttons
               class="announce_types"
               :options="getMileageOptions"
               :group-by="3"
               :btnClass="'blue-new'"
               v-model="form.announce_type"
            />

            <form-buttons
               class="justify-content-end"
               :options="getSearchTabs"
               :group-by="2"
               :btnClass="'blue-new'"
               v-model="form.searchType"
            />
         </div>

         <template v-if="form.searchType === 1">
            <template v-if="assistant">
               <div class="col-12">
                  <car-body-shortcuts v-model="formAssistant.body"/>
               </div>

               <div class="col-12">
                  <car-option-packs v-model="formAssistant.packs"/>
               </div>
            </template>

            <div class="cars-search-form__grid" v-else>
               <!--            <div class="cars-search-form__grid-item">-->
               <form-select
                  :label="$t('mark')"
                  :options="existsBrands"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :input-placeholder="$t('mark_search')"
                  v-model="form.additional_brands[0]['brand']"
                  @change="setBrand($event, 0)"
                  has-search
               />

               <form-select
                  :label="$t('model')"
                  :options="carModels[0]"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :input-placeholder="$t('model_search')"
                  v-model="form.additional_brands[0]['model']"
                  :disabled="form.additional_brands[0]['brand'] && !carModels[0].length"
                  @change="setModel($event, 0)"
                  has-search
               />

               <form-select
                  :label="$t('generation')"
                  :options="carGenerations[0]"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :input-placeholder="$t('generation_search')"
                  v-model="form.additional_brands[0]['generation']"
                  :disabled="form.additional_brands[0]['model'] &&!carGenerations[0].length"
                  @change="setGeneration($event, 0)"
                  has-search
                  has-generations
               />

               <div class="form-merged">
                  <form-select
                     :label="$t('from_year')"
                     :options="getYearOptions(false, form.max_year)"
                     v-model="form.min_year"
                     :show-label-on-select="false"
                     :clear-option="false"
                     in-select-menu
                  />

                  <form-select
                     :label="$t('to')"
                     :options="getYearOptions(form.min_year, false)"
                     v-model="form.max_year"
                     :show-label-on-select="false"
                     :clear-option="false"
                     in-select-menu
                  />
               </div>
               <!--            </div>-->

               <template v-for="(key, i) in rows"  v-if="key > 0">
                  <form-select
                     :key="'1' +i"
                     :label="$t('mark')"
                     :options="existsBrands"
                     :clear-placeholder="true"
                     :clear-option="false"
                     :input-placeholder="$t('mark_search')"
                     v-model="form.additional_brands[key]['brand']"
                     @change="setBrand($event, key)"
                     has-search
                  />

                  <form-select
                     :key="'2' +i"
                     :label="$t('model')"
                     :options="carModels[key]"
                     :clear-placeholder="true"
                     :clear-option="false"
                     :input-placeholder="$t('model_search')"
                     v-model="form.additional_brands[key]['model']"
                     :disabled="form.additional_brands[key]['brand'] && !carModels[key].length"
                     @change="setModel($event, key)"
                     has-search
                  />

                  <form-select
                     :key="'3' +i"
                     :label="$t('generation')"
                     :options="carGenerations[key]"
                     :clear-placeholder="true"
                     :clear-option="false"
                     :input-placeholder="$t('generation_search')"
                     v-model="form.additional_brands[key]['generation']"
                     :disabled="form.additional_brands[key]['model'] &&!carGenerations[key].length"
                     @change="setGeneration($event, key)"
                     has-search
                     has-generations
                  />

                  <button
                     :key="'4' +i"
                     type="button"
                     :class="['btn', 'full-width', 'btn--white', { 'pointer-events-none': pending }]"
                     @click="removeSearchRow(key)"
                  >
                     {{ $t('remove_search') }}

                     <icon name="minus" />
                  </button>
               </template>

               <!--            <div class="cars-search-form__grid-item">-->
               <form-select
                  :label="$t('price')"
                  custom
                  :suffix="getOptionValue('Currency', form.currency)"
                  :values="{from: form.price_from, to: form.price_to, suffix: getSuffix}"
                  @clear=";(form.price_from = ''), (form.price_to = '')"
               >
                  <div class="form-merged flex-column price">
                     <form-buttons
                        :options="getCurrencyOptions"
                        :group-by="3"
                        :btnClass="'blue-new-light'"
                        v-model="form.currency"
                     />

                     <div class="form-merged__inputs d-flex">
                        <form-numeric-input
                           :placeholder="$t('from')"
                           v-model="form.price_from"
                        />

                        <form-numeric-input
                           :placeholder="$t('to')"
                           v-model="form.price_to"
                        />
                     </div>


                     <!--                                 <form-select-->
                     <!--                                    :label="'AZN'"-->
                     <!--                                    :options="getCurrencyOptions"-->
                     <!--                                    v-model="form.currency"-->
                     <!--                                    :allow-clear="false"-->
                     <!--                                    :clear-option="false"-->
                     <!--                                    in-select-menu-->
                     <!--                                 />-->
                  </div>
               </form-select>

               <form-select
                  :label="$t('mileage')"
                  custom
                  :suffix="$t('char_kilometre')"
                  :values="{ from: form.mileage_from, to: form.mileage_to }"
                  @clear=";(form.mileage_from = ''), (form.mileage_to = '')"
               >
                  <div class="form-merged">
                     <form-numeric-input
                        :placeholder="$t('from')"
                        v-model="form.mileage_from"
                        :suffix="$t('char_kilometre')"
                     />
                     <form-numeric-input
                        :placeholder="$t('to')"
                        v-model="form.mileage_to"
                        :suffix="$t('char_kilometre')"
                     />
                  </div>
               </form-select>

               <form-select
                  :label="$t('capacity')"
                  custom
                  :suffix="$t('char_litre')"
                  :values="{ from: form.min_capacity, to: form.max_capacity }"
                  @clear=";(form.min_capacity = ''), (form.max_capacity = '')"
               >
                  <div class="form-merged">
                     <form-select
                        :label="$t('from')"
                        v-model="form.min_capacity"
                        :options="bodyOptions.main.custom_options['capacity'].values"
                        :show-label-on-select="false"
                        :clear-option="false"
                        in-select-menu
                        :suffix="$t('char_litre')"
                     />

                     <form-select
                        :label="$t('to')"
                        v-model="form.max_capacity"
                        :options="
                      bodyOptions.main.custom_options['capacity'].values
                    "
                        :show-label-on-select="false"
                        :clear-option="false"
                        in-select-menu
                        :suffix="$t('char_litre')"
                     />
                  </div>
               </form-select>

               <div class="checkboxes">
                  <form-checkbox
                     :label="$t('credit')"
                     :show-input="false"
                     input-name="exchange_possible"
                     v-model="form.exchange_possible"
                  />

                  <form-checkbox
                     :label="$t('exchange')"
                     :show-input="false"
                     input-name="credit"
                     v-model="form.credit"
                  />

                  <form-checkbox
                     :label="$t('with_video')"
                     :show-input="false"
                     input-name="with_video"
                     v-model="form.with_video"
                  />
               </div>
               <!--            </div>-->

               <template v-if="showMore">
                  <!--               <div class="cars-search-form__grid-item">-->
                  <form-select
                     :label="$t('city')"
                     :options="sellOptions.regions"
                     :clear-placeholder="true"
                     :clear-option="false"
                     :input-placeholder="$t('city_search')"
                     v-model="form.region"
                     has-search
                  />

                  <form-select
                     :label="$t('korobka')"
                     v-model="form.korobka"
                     :options="bodyOptions.main.default_options['korobka'].values"
                     :clear-placeholder="true"
                     :clear-option="false"
                     multiple
                     name-in-value
                     translate-options
                  />

                  <form-select
                     :label="$t('fuel')"
                     v-model="form.engine_type"
                     :options="bodyOptions.main.default_options['tip-dvigatelya'].values"
                     :clear-placeholder="true"
                     :clear-option="false"
                     multiple
                     name-in-value
                     translate-options
                  />
                  <!--               <pre>{{bodyOptions.main.default_options['tip-dvigatelya'].values}}</pre>-->

                  <div class="btns">
                     <form-checkbox
                        :label="$t('in_garanty')"
                        :show-input="false"
                        v-model="form.in_garanty"
                        input-name="in_garanty"
                     />

                     <form-checkbox
                        :label="$t('external_salon')"
                        :show-input="false"
                        v-model="form.external_salon"
                        input-name="external_salon"
                     />
                  </div>
                  <!--               </div>-->

                  <!--               <div class="cars-search-form__grid-item">-->
                  <form-select
                     :label="$t('carcase')"
                     v-model="form.body"
                     :options="bodyOptions.main.default_options['body'].values"
                     :clear-placeholder="true"
                     :clear-option="false"
                     multiple
                     name-in-value
                     translate-options
                  />

                  <form-select
                     :label="$t('privod')"
                     v-model="form.gearing"
                     :options="bodyOptions.main.default_options['privod'].values"
                     :clear-placeholder="true"
                     :clear-option="false"
                     multiple
                     name-in-value
                     translate-options
                  />

                  <form-select
                     :label="$t('customs')"
                     v-model="form.customs"
                     :options="getCustomsOptions"
                     :clear-placeholder="true"
                     :clear-option="false"
                  />

                  <form-select
                     :label="$t('damage')"
                     v-model="form.damage"
                     :options="getDamageOptions"
                     :clear-placeholder="true"
                     :clear-option="false"
                  />
                  <!--               </div>-->

                  <!--               <div class="cars-search-form__grid-item">-->
                  <form-select
                     :label="$t('count_of_seats')"
                     v-model="form.n_of_seats"
                     multiple
                     name-in-value
                     translate-options
                     :options="allSellOptions2?.n_of_seats?.options"
                     :clear-placeholder="true"
                     :clear-option="false"
                  />

                  <form-select
                     :label="$t('color')"
                     v-model="form.colors"
                     multiple
                     translate-options
                     :options="colors"
                     :clear-placeholder="true"
                     :clear-option="false"
                  />

                  <form-select
                     :label="$t('color')"
                     v-model="form.colors"
                     multiple
                     translate-options
                     :options="colors"
                     :clear-placeholder="true"
                     :clear-option="false"
                  />

                  <button
                     type="button"
                     :class="[
                               'btn',
                               'full-width',
                               'btn--white',
                               { 'pointer-events-none': pending },
                               { 'disabled': rows.length > 4 },
                              ]"
                     @click="addSearchRow(rows.length - 1)"
                  >
                     {{ $t('add_next', { count: rows.length + 1 }) }}

                     <icon name="plus" />
                  </button>
                  <!--               </div>-->
               </template>

               <!--            <div class="cars-search-form__grid-item">-->
               <button
                  type="button"
                  class="btn btn--red-opacity full-width"
                  @click="showExcludeModal = true"
               >
                  {{ $t('exclude') }}

                  <inline-svg :src="'/icons/eye-slash.svg'" />

                  <template v-if="getExcludeCount">({{ getExcludeCount }})</template>
               </button>

               <div class="btns" v-if="!onlySavedSearch">
                  <button
                     v-if="!hasValue"
                     type="button"
                     :class="[
                               'btn',
                               'full-width',
                               'btn--white',
                               { 'pointer-events-none': pending },
                             ]"
                     @click="resetForm(!(advanced || assistant))"
                  >
                     {{ $t('clear_search2') }}

                     <icon name="cross" />
                  </button>

                  <button
                     v-else
                     type="button"
                     :class="[
                               'btn',
                               'full-width',
                               'btn--blue-new-light-2',
                               { 'pointer-events-none': pending },
                           ]"
                     @click="savedSearch = true; $nuxt.$emit('login-popup', 'saved-search')"
                  >
                     {{ $t('search_save') }}

                     <inline-svg :src="'/icons/save-search.svg'" />
                  </button>
               </div>

               <div class="btns">
                  <button
                     v-if="hasValue"
                     type="button"
                     :class="[
                               'btn',
                               'full-width',
                               'btn--white',
                               { 'pointer-events-none': pending },
                             ]"
                     @click="resetForm(!(advanced || assistant))"
                  >
                     {{ $t('clear_search') }}

                     <icon name="cross" />
                  </button>

                  <button class="btn btn--grey-new-2 full-width" @click="showMore = !showMore">
                     <template v-if="!showMore">
                        {{ hasValue ? $t('detail') : $t('advanced_search') }}
                     </template>

                     <template v-else>
                        {{ $t('less_2') }}
                     </template>

                     <inline-svg :src="'/icons/setting-2.svg'" v-if="!showMore" />

                     <icon name="chevron-up" v-else />
                  </button>
               </div>

               <button
                  type="button"
                  :class="['btn', 'full-width', 'btn--green', { pending }]"
                  @click="submitForm()"
               >
                  {{ $t('find') }}

                  <inline-svg :src="'/icons/search_new.svg'" />
               </button>
               <!--            </div>-->

               <template v-if="advanced">
                  <div class="col-6 col-lg-2 mb-2 mb-lg-3">
                     <form-select
                        :label="$t('mileage')"
                        custom
                        anchor="right"
                        :suffix="$t('char_kilometre')"
                        :values="{ from: form.mileage_from, to: form.mileage_to }"
                        @clear=";(form.mileage_from = ''), (form.mileage_to = '')"
                     >
                        <div class="form-merged">
                           <form-numeric-input
                              :placeholder="$t('from')"
                              v-model="form.mileage_from"
                              :suffix="$t('char_kilometre')"
                           />
                           <form-numeric-input
                              :placeholder="$t('to')"
                              v-model="form.mileage_to"
                              :suffix="$t('char_kilometre')"
                           />
                        </div>
                     </form-select>
                  </div>

                  <div class="col-6 col-lg-2 mb-2 mb-lg-3" v-if="isMobileBreakpoint">
                     <form-select
                        :label="$t('fuel')"
                        v-model="form.engine_type"
                        :options="bodyOptions.main.default_options['tip-dvigatelya'].values"
                        multiple
                        name-in-value
                        translate-options
                     />
                  </div>

                  <div class="col-12">
                     <car-filters
                        :is-search-page="isSearchPage"
                        :values="form.all_options"
                        name-in-value
                        popular
                        @change-filter="setCarFilter"
                     />
                  </div>
               </template>
            </div>
         </template>

         <template v-else>
            <div class="cars-search-form__grid">
               <form-select
                  :label="$t('mark')"
                  :options="existsBrands"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :input-placeholder="$t('mark_search')"
                  v-model="form.additional_brands[0]['brand']"
                  @change="setBrand($event, 0)"
                  has-search
               />

               <form-select
                  :label="$t('model')"
                  :options="carModels[0]"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :input-placeholder="$t('model_search')"
                  v-model="form.additional_brands[0]['model']"
                  :disabled="form.additional_brands[0]['brand'] && !carModels[0].length"
                  @change="setModel($event, 0)"
                  has-search
               />

               <form-select
                  :label="$t('generation')"
                  :options="carGenerations[0]"
                  :clear-placeholder="true"
                  :clear-option="false"
                  :input-placeholder="$t('generation_search')"
                  v-model="form.additional_brands[0]['generation']"
                  :disabled="form.additional_brands[0]['model'] &&!carGenerations[0].length"
                  @change="setGeneration($event, 0)"
                  has-search
                  has-generations
               />

               <div class="form-merged">
                  <form-select
                     :label="$t('from_year')"
                     :options="getYearOptions(false, form.max_year)"
                     v-model="form.min_year"
                     :show-label-on-select="false"
                     :clear-option="false"
                     in-select-menu
                  />

                  <form-select
                     :label="$t('to')"
                     :options="getYearOptions(form.min_year, false)"
                     v-model="form.max_year"
                     :show-label-on-select="false"
                     :clear-option="false"
                     in-select-menu
                  />
               </div>

               <template v-for="(key, i) in rows"  v-if="key > 0">
                  <form-select
                     :key="'1' +i"
                     :label="$t('mark')"
                     :options="existsBrands"
                     :clear-placeholder="true"
                     :clear-option="false"
                     :input-placeholder="$t('mark_search')"
                     v-model="form.additional_brands[key]['brand']"
                     @change="setBrand($event, key)"
                     has-search
                  />

                  <form-select
                     :key="'2' +i"
                     :label="$t('model')"
                     :options="carModels[key]"
                     :clear-placeholder="true"
                     :clear-option="false"
                     :input-placeholder="$t('model_search')"
                     v-model="form.additional_brands[key]['model']"
                     :disabled="form.additional_brands[key]['brand'] && !carModels[key].length"
                     @change="setModel($event, key)"
                     has-search
                  />

                  <form-select
                     :key="'3' +i"
                     :label="$t('generation')"
                     :options="carGenerations[key]"
                     :clear-placeholder="true"
                     :clear-option="false"
                     :input-placeholder="$t('generation_search')"
                     v-model="form.additional_brands[key]['generation']"
                     :disabled="form.additional_brands[key]['model'] &&!carGenerations[key].length"
                     @change="setGeneration($event, key)"
                     has-search
                     has-generations
                  />

                  <button
                     :key="'4' +i"
                     type="button"
                     :class="['btn', 'full-width', 'btn--white', { 'pointer-events-none': pending }]"
                     @click="removeSearchRow(key)"
                  >
                     {{ $t('remove_search') }}

                     <icon name="minus" />
                  </button>
               </template>
            </div>
         </template>
      </div>

      <div
         v-if="!onlySavedSearch"
         class="announcements-sorting"
         v-show="routeName !== 'index' && totalCount && !(advanced || assistant)"
      >
         <div class="row">
            <div class="col-6 ml-auto col-lg-2 mt-3 mt-lg-5 mb-n6 mb-lg-n1">
               <div class="form-info no-bg text-green" v-if="isMobileBreakpoint">
                  {{ $readPlural(totalCount, $t('plural_forms_announcements')) }}
               </div>
            </div>
<!--            <div class="col-6 col-lg-2 mt-3 mt-lg-5 mb-n6 mb-lg-n1">-->
<!--               <button @click="showExcludeModal = true;" type="button" class="btn btn&#45;&#45;dark-blue full-width">-->
<!--                  {{ $t('exclude') }}-->
<!--                  <template v-if="getExcludeCount">({{ getExcludeCount }})</template>-->
<!--               </button>-->
<!--            </div>-->
            <div class="col-6 col-lg-2 mt-3 mt-lg-5 mb-n6 mb-lg-n1">
               <form-select
                  :label="$t('sorting')"
                  :options="getSortingOptions"
                  v-model="form.sorting"
                  @change="submitForm"
                  :allow-clear="false"
                  :clear-option="false"
                  skip-select-first
                  has-no-bg
               />
            </div>
         </div>
      </div>

      <modal-popup
         :modal-class="'exclude-popup'"
         :toggle="showExcludeModal"
         :title="$t('exclude_models')"
         :overflow-hidden="false"
         @close="showExcludeModal = false"
      >
         <template>
            <div class="col-12 mb-2" v-for="(key, index) in excludeRows" :key="key">
               <div class="row">
                  <div class="col-3 col-lg-4">
                     <form-select
                        :label="$t('mark')"
                        :options="existsBrands"
                        v-model="form.exclude_additional_brands[key]['brand']"
                        @change="setBrandExclude($event, key)"
                        has-search
                     />
                  </div>
                  <div class="col-3 col-lg-4">
                     <form-select
                        :label="$t('model')"
                        :options="carModelsExclude[key]"
                        v-model="form.exclude_additional_brands[key]['model']"
                        :disabled="
                      form.exclude_additional_brands[key]['brand'] &&
                      !carModelsExclude[key].length
                    "
                        @change="setModelExclude($event, key)"
                        has-search
                     />
                  </div>
                  <div class="col-lg-4"
                       :class="{ 'col-4': index === 0 || !canAddRowExclude(index),'col-3': canAddRowExclude(index) }">
                     <div
                        :class="[
                      'row','flex-nowrap',
                      {
                        'has-add-btn': canAddRowExclude(index),
                        'has-remove-btn': canRemoveRowExclude(),
                      },
                    ]"
                     >
                        <div class="col">
                           <form-select
                              :label="$t('generation')"
                              :options="carGenerationsExclude[key]"
                              v-model="form.exclude_additional_brands[key]['generation']"
                              :disabled="
                          form.exclude_additional_brands[key]['model'] &&
                          !carGenerationsExclude[key].length
                        "
                              @change="setGenerationExclude($event, key)"
                              has-search
                              has-generations
                           />
                        </div>
                        <div class="col-auto">
                           <div class="form-counter">
                              <div
                                 class="form-info mr-1"
                                 v-if="canAddRowExclude(index)"
                                 @click="addSearchRowExclude(key)"
                              >
                                 <icon name="plus"/>
                              </div>
                              <div
                                 class="form-info"
                                 v-if="canRemoveRowExclude()"
                                 @click="removeSearchRowExclude(key)"
                              >
                                 <icon name="minus"/>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="d-flex justify-content-end mr-1 mt-2">
               <button @click="showExcludeModal = false;submitForm()" class="btn btn--green">OK</button>
            </div>
         </template>
      </modal-popup>
      <modal-popup
         :toggle="showIntervalModal"
         :title="$t('receive_notifications')"
         :overflow-hidden="false"
         @close="showIntervalModal = false"
      >
         <form class="form" @submit.prevent="updateNotifications" novalidate>
            <div class="mb-2 mb-lg-3">
               <form-select
                  v-model="interval"
                  :options="getNotificationOptions"
                  :clear-option="false"
                  :allow-clear="false"
                  :skip-select="true"
                  :show-label-only-on-action-bar="true"
                  :label="$t('receive_notifications')"
               />
            </div>
            <qrcode-box/>
            <button
               type="submit"
               :class="['btn btn--green full-width', { pending2 }]"
            >
               {{ $t('confirm') }}
            </button>
         </form>
      </modal-popup>
   </div>
</template>

<script>
   import {mapGetters, mapActions} from 'vuex'
   import {SearchMixin} from '~/mixins/search'
   import ColorOptions from '~/components/options/ColorOptions'
   import CarFilters from '~/components/cars/CarFilters'
   import CarBodyShortcuts from '~/components/cars/CarBodyShortcuts'
   import CarOptionPacks from '~/components/cars/CarOptionPacks'
   import QrcodeBox from '~/components/login/Qrcode-box'

   export default {
      components: {
         QrcodeBox,
         ColorOptions,
         CarFilters,
         CarBodyShortcuts,
         CarOptionPacks,
      },

      mixins: [SearchMixin],

      props: {
         totalCount: {
            type: Number,
            default: 0,
         },
         isSearchPage: {
            type: Boolean,
            default: false,
         },
         onlySavedSearch: {
            default: false,
            type: Boolean,
         },
         pending: Boolean,
         advanced: Boolean,
         assistant: Boolean,
         inMobileScreen: {
            type: Boolean,
            default: false
         }
      },

      data() {
         return {
            showMore: false,
            showExcludeModal: false,
            showIntervalModal: false,
            rows: ['0'],
            excludeRows: ['0'],
            selected: [],
            pending2: false,
            searchAppliedCustom: false,
            firstTimeUpdated: true,
            interval: 1440,
            form: {
               sorting: 'created_at_desc',
               additional_brands: {0: {}, 1: {}, 2: {}, 3: {}, 4: {}},
               exclude_additional_brands: {0: {}, 1: {}, 2: {}, 3: {}, 4: {}},
               all_options: {},
               announce_type: 1,
               searchType: 1,
               external_salon: false,
               currency: 1,
               min_capacity: '',
               max_capacity: '',
               min_year: '',
               max_year: '',
               price_from: '',
               price_to: '',
               mileage_from: '',
               mileage_to: '',
               region: '',
               damage: '',
               customs: '',
               body: [],
               korobka: [],
               engine_type: [],
               gearing: [],
               n_of_seats: [],
               colors: [],
               is_matte: false,
               in_garanty: false,
               with_video: false,
               exchange_possible: false,
               credit: false,
            },
            formAssistant: {
               body: {},
               packs: [],
               price: [5000, 100000],
            },
         }
      },

      computed: {
         ...mapGetters([
            'brands',
            'existsBrands',
            'carModels',
            'carModelsExclude',
            'carGenerations',
            'carGenerationsExclude',
            'bodyOptions',
            'sellOptions',
            'allSellOptions2',
            'singleSavedSearch',
            'colors'
         ]),

         getExcludeCount() {
            return Object.values(this.form.exclude_additional_brands).filter(item => item.brand).length;
         },

         getSuffix() {
            switch (this.form.currency) {
               case 1:
                  return '₼';
               case 2:
                  return '$';
               case 3:
                  return '€';
            }
         },

         getNotificationOptions() {
            return [
               {
                  name: this.$t('do_not_receive_notifications'),
                  selected_name: this.$t('do_not_receive_notifications_selected'),
                  key: 0,
               },
               {
                  name: this.$t('receive_notifications_every_hour'),
                  selected_name: this.$t('receive_notifications_every_hour_selected'),
                  key: 60,
               },
               {
                  name: this.$t('receive_notifications_every_3_hours'),
                  selected_name: this.$t(
                     'receive_notifications_every_3_hours_selected',
                  ),
                  key: 180,
               },
               {
                  name: this.$t('receive_notifications_once_a_day'),
                  selected_name: this.$t('receive_notifications_once_a_day_selected'),
                  key: 1440,
               },
               {
                  name: this.$t('receive_notifications_once_a_weak'),
                  selected_name: this.$t('receive_notifications_once_a_weak_selected'),
                  key: 10080,
               },
            ]
         },
         // meta data
         meta() {
            return {
               type: 'cars',
               path: '/cars',
               param: 'car_filter',
            }
         },

         hasValue() {
            return !!(this.form.additional_brands[0].brand ||
                   this.form.additional_brands[0].model ||
                   this.form.additional_brands[0].generation ||
                   this.form.min_year || this.form.max_year ||
                   this.form.price_from || this.form.price_to ||
                   this.form.mileage_from || this.form.mileage_to ||
                   this.form.min_capacity || this.form.max_capacity ||
                   this.form.exchange_possible || this.form.credit ||
                   this.form.with_video || this.form.region || this.form.korobka.length ||
                   this.form.engine_type.length || this.form.in_garanty || this.form.external_salon ||
                   this.form.body.length || this.form.gearing.length || this.form.customs ||
                   this.form.damage || this.form.n_of_seats.length || this.form.colors.length)
         }
      },

      watch: {
         form: {
            handler() {
               if (!this.firstTimeUpdated) {
                  this.searchAppliedCustom = true;
               } else {
                  this.firstTimeUpdated = false;
               }
            },
            deep: true,
         }
      },

      mounted() {
         this.$nuxt.$on('saved-search-created', () => {
            if (this.singleSavedSearch.id) {
               this.selected.push(this.singleSavedSearch.id)
               this.showIntervalModal = true
            }
         })
      },

      methods: {
         ...mapActions([
            'getModelsArray',
            'getModelsArrayExclude',
            'getModelGenerationsArray',
            'getModelGenerationsArrayExclude',
            'updateSavedSearchNotificationsInterval',
         ]),
         handleExclude() {

         },
         saveSearch() {
            if (this.searchAppliedCustom) {
               this.submitForm()
               this.savedSearch = true
            }
         },
         async updateNotifications() {
            if (this.pending2) return
            this.pending2 = true
            try {
               await this.updateSavedSearchNotificationsInterval({
                  id: this.selected,
                  type: this.interval,
               })
               this.pending2 = false
               this.showIntervalModal = false
               this.$toasted.success(this.$t('saved_changes'))
               this.handleSelectAll(false)
            } catch (err) {
               this.pending2 = false
            }
         },
         async setBrand(id, index) {
            let brand = this.existsBrands.find((option) => option.id == id)
            let slug = brand?.slug || ''
            this.$set(this.form.additional_brands[index], 'brand', id)
            this.$set(this.form.additional_brands[index], 'brand_slug', slug);
            [
               'model',
               'model_slug',
               'model_name',
               'generation',
               'generation_slug',
               'generation_name',
            ].map((key) => {
               this.$set(this.form.additional_brands[index], key, '')
            })

            if (id) {
               this.getModelsArray({value: slug, index})
            }
         },

         async setBrandExclude(id, index) {
            let brand = this.existsBrands.find((option) => option.id == id)
            let slug = brand?.slug || ''
            this.$set(this.form.exclude_additional_brands[index], 'brand', id)
            this.$set(this.form.exclude_additional_brands[index], 'brand_slug', slug);
            [
               'model',
               'model_slug',
               'model_name',
               'generation',
               'generation_slug',
               'generation_name',
            ].map((key) => {
               this.$set(this.form.exclude_additional_brands[index], key, '')
            })
            if (id) await this.getModelsArrayExclude({value: slug, index})
         },
         async setModel(id, index) {
            let model = this.carModels[index].find((option) => option.id == id)
            let slug = model?.slug || '',
               name = model?.name || ''
            let brand_slug = this.form.additional_brands[index].brand_slug
            this.$set(this.form.additional_brands[index], 'model', id)
            this.$set(this.form.additional_brands[index], 'model_slug', slug)
            this.$set(this.form.additional_brands[index], 'model_name', name)
            ;['generation', 'generation_slug', 'generation_name'].map((key) => {
               this.$set(this.form.additional_brands[index], key, '')
            })
            if (id) {
               this.getModelGenerationsArray({value: slug, brand_slug, index})
            }
         },
         async setModelExclude(id, index) {
            let model = this.carModelsExclude[index].find((option) => option.id == id)
            let slug = model?.slug || '',
               name = model?.name || ''
            let brand_slug = this.form.exclude_additional_brands[index].brand_slug
            this.$set(this.form.exclude_additional_brands[index], 'model', id)
            this.$set(this.form.exclude_additional_brands[index], 'model_slug', slug)
            this.$set(this.form.exclude_additional_brands[index], 'model_name', name)
            ;['generation', 'generation_slug', 'generation_name'].map((key) => {
               this.$set(this.form.exclude_additional_brands[index], key, '')
            })
            if (id)
               await this.getModelGenerationsArrayExclude({value: slug, brand_slug, index})
         },
         async setGeneration(id, index = 0) {
            let generation = this.carGenerations[index].find(
               (option) => option.id == id,
            )
            this.$set(this.form.additional_brands[index], 'generation', id)
            this.$set(
               this.form.additional_brands[index],
               'generation_slug',
               generation?.short_name || '',
            )
            this.$set(
               this.form.additional_brands[index],
               'generation_name',
               generation?.name || '',
            )
         },
         async setGenerationExclude(id, index) {
            let generation = this.carGenerationsExclude[index].find(
               (option) => option.id == id,
            )
            this.$set(this.form.exclude_additional_brands[index], 'generation', id)
            this.$set(
               this.form.exclude_additional_brands[index],
               'generation_name',
               generation?.name || '',
            )
         },
         setCarFilter(key, value) {
            if (
               value === false ||
               value === '' ||
               (typeof value === 'object' && !Object.keys(value).length)
            )
               this.$delete(this.form.all_options, key)
            else this.$set(this.form.all_options, key, value)
         },
      },

      created() {
         this.$nuxt.$on('extend-options', this.goToSearch)
         if (this.routeName === 'index')
            this.$nuxt.$on('reset-search-form', this.resetForm)
      },

      beforeDestroy() {
         this.$nuxt.$off('extend-options', this.goToSearch)
         if (this.routeName === 'index')
            this.$nuxt.$off('reset-search-form', this.resetForm)
      }
   }
</script>

<style lang="scss">
   .cars-search-form {
      padding: 24px;
      border-radius: 12px;
      background-color: #FFFFFF;

      &__grid {
         display: grid;
         grid-template-columns: repeat(1, 1fr);
         grid-gap: 20px;

         //&-item {
         //   display: grid;
         //   grid-template-columns: repeat(1, 1fr);
         //   grid-gap: 20px;
         //}
      }

      .form-buttons {
         &.announce_types {
            .btn {
               width: 110px;
            }
         }
      }

      .btns {
         display: flex;
         grid-gap: 12px;
         height: 52px;

         i {
            &:before {
               font-size: 14px;
            }
         }
      }

      .btn {
         height: 52px;
      }

      .checkboxes {
         display: flex;
         align-items: center;
         column-gap: 12px;
         height: max-content;
      }

      .form-group {
         height: max-content;
      }
   }

   .dark-mode {
      .cars-search-form {
         background-color: #1B2434;
      }
   }

   @media (min-width: 992px) {
      .cars-search-form {
         &__grid {
            grid-template-columns: repeat(3, 1fr);
         }
      }
   }

   @media (min-width: 1150px) {
      .cars-search-form {
         &__grid {
            grid-template-columns: repeat(4, 1fr);
         }
      }
   }
</style>
