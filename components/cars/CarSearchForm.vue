<template>
    <div class="cars-search-form form" :class="{'pt-0': inMobileScreen}">
        <div class="card pt-2 pt-lg-4 mb-2 mb-lg-0">
            <div class="row">
                <div class="col-lg-12 col-xl-4 mb-2 mb-lg-3">
                    <form-buttons
                        :options="getMileageOptions"
                        :group-by="3"
                        v-model="form.announce_type"
                    />
                </div>

<!--                <div class="col-lg-12 col-xl-6 offset-xl-2 mb-2 mb-lg-3 d-none d-lg-block">-->
<!--                    <div class="row">-->
<!--                        <div class="col-4" v-if="!onlySavedSearch">-->
<!--                            <nuxt-link-->
<!--                                custom-->
<!--                                exact-->
<!--                                :to="$localePath('/cars')"-->
<!--                                v-slot="{ href }"-->
<!--                            >-->
<!--                                <a-->
<!--                                    :href="href"-->
<!--                                    class="btn btn&#45;&#45;pale-red full-width"-->
<!--                                    :class="{ active: ['cars', 'index'].includes(routeName) }"-->
<!--                                    @click.prevent="goToSearch(href)"-->
<!--                                >-->
<!--                                    <icon name="search"/>-->
<!--                                    {{ $t('regular_search') }}-->
<!--                                </a>-->
<!--                            </nuxt-link>-->
<!--                        </div>-->

<!--                        <div class="col-4" v-if="!onlySavedSearch">-->
<!--                            <nuxt-link-->
<!--                                custom-->
<!--                                exact-->
<!--                                :to="$localePath('/cars/advanced-search')"-->
<!--                                v-slot="{ href }"-->
<!--                            >-->
<!--                                <a-->
<!--                                    :href="href"-->
<!--                                    class="btn btn&#45;&#45;pale-red full-width"-->
<!--                                    :class="{ active: routeName === 'cars-advanced-search' }"-->
<!--                                    @click.prevent="goToSearch(href)"-->
<!--                                >-->
<!--                                    <icon name="options"/>-->
<!--                                    {{ $t('advanced_search') }}-->
<!--                                </a>-->
<!--                            </nuxt-link>-->
<!--                        </div>-->

<!--                        <div class="col-4" v-if="!onlySavedSearch">-->
<!--                            <nuxt-link-->
<!--                                custom-->
<!--                                exact-->
<!--                                :to="$localePath('/cars/assistant')"-->
<!--                                v-slot="{ href }"-->
<!--                            >-->
<!--                                <a-->
<!--                                    :href="href"-->
<!--                                    class="btn btn&#45;&#45;pale-red full-width"-->
<!--                                    :class="{ active: routeName === 'cars-assistant' }"-->
<!--                                    @click.prevent="goToSearch(href)"-->
<!--                                >-->
<!--                                    <icon name="flag"/>-->
<!--                                    {{ $t('helper_search') }}-->
<!--                                </a>-->
<!--                            </nuxt-link>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->

                <template v-if="assistant">
                    <div class="col-12">
                        <car-body-shortcuts v-model="formAssistant.body"/>
                    </div>
                    <div class="col-12">
                        <car-option-packs v-model="formAssistant.packs"/>
                    </div>
                </template>

                <template v-else>
                    <template v-if="isMobileBreakpoint">
                        <div class="col-6 mb-2">
                            <form-select
                                :label="$t('mark')"
                                :options="brands"
                                v-model="form.additional_brands[rows[0]]['brand']"
                                @change="setBrand($event, rows[0])"
                                has-search
                                :clear-option="false"
                                :popular-options="[129, 483, 8, 1, 767, 117]"
                                img-key="transformed_media"
                            />
                        </div>
                        <div class="col-6 mb-2">
                            <form-select
                                :label="$t('model')"
                                :options="carModels[rows[0]]"
                                v-model="form.additional_brands[rows[0]]['model']"
                                :disabled="
                                  form.additional_brands[rows[0]]['brand'] &&
                                  !carModels[rows[0]].length
                                "
                                @change="setModel($event, rows[0])"
                                has-search
                            />
                        </div>
                        <div class="col-6 mb-2">
                            <form-select
                                :label="$t('generation')"
                                :options="carGenerations[rows[0]]"
                                v-model="form.additional_brands[rows[0]]['generation']"
                                :disabled="
                  form.additional_brands[rows[0]]['model'] &&
                  !carGenerations[rows[0]].length
                "
                                @change="setGeneration($event, rows[0])"
                                has-search
                                has-generations
                            />
                        </div>
                    </template>

                    <template v-else>
                        <div class="col-12 mb-3" v-for="(key, index) in rows" :key="key">
                            <div class="row">
                                <div class="col-3">
                                    <form-select
                                        :label="$t('mark')"
                                        :options="brands"
                                        v-model="form.additional_brands[key]['brand']"
                                        @change="setBrand($event, key)"
                                        has-search
                                    />
                                </div>

                                <div class="col-3">
                                    <form-select
                                        :label="$t('model')"
                                        :options="carModels[key]"
                                        v-model="form.additional_brands[key]['model']"
                                        :disabled="
                                          form.additional_brands[key]['brand'] &&
                                          !carModels[key].length
                                        "
                                        @change="setModel($event, key)"
                                        has-search
                                    />
                                </div>

                                <div class="col-3">
<!--                                    <div :class="['row', {'has-add-btn': canAddRow(index),'has-remove-btn': canRemoveRow()}]">-->
<!--                                        <div class="col">-->
                                            <form-select
                                                :label="$t('generation')"
                                                :options="carGenerations[key]"
                                                v-model="form.additional_brands[key]['generation']"
                                                :disabled="
                                                  form.additional_brands[key]['model'] &&
                                                  !carGenerations[key].length
                                                "
                                                @change="setGeneration($event, key)"
                                                has-search
                                                has-generations
                                            />
<!--                                        </div>-->
<!--                                        <div class="col-auto">-->
<!--                                            <div class="form-counter">-->
<!--                                                <div-->
<!--                                                    class="form-info"-->
<!--                                                    v-if="canAddRow(index)"-->
<!--                                                    @click="addSearchRow(key)"-->
<!--                                                >-->
<!--                                                    <icon name="plus"/>-->
<!--                                                </div>-->
<!--                                                <div-->
<!--                                                    class="form-info"-->
<!--                                                    v-if="canRemoveRow()"-->
<!--                                                    @click="removeSearchRow(key)"-->
<!--                                                >-->
<!--                                                    <icon name="minus"/>-->
<!--                                                </div>-->
<!--                                            </div>-->
<!--                                        </div>-->
<!--                                    </div>-->
                                </div>

                                <div class="col-3">
                                    <MinMaxSearch
                                        :className="'dropdown'"
                                        :placeholder="['İl , min.', 'maks.']"
                                        :options="getYearOptions(false, form.min_year)"
                                        @change="form.min_year = $event.min, form.max_year = $event.max"
                                    />
<!--                                    <form-select-->
<!--                                        :label="$t('years')"-->
<!--                                        custom-->
<!--                                        :values="{ from: form.min_year, to: form.max_year, read: false }"-->
<!--                                        @clear=";(form.min_year = ''), (form.max_year = '')"-->
<!--                                    >-->
<!--                                        <div class="form-merged">-->
<!--                                            <form-select-->
<!--                                                :label="$t('from')"-->
<!--                                                :options="getYearOptions(false, form.max_year)"-->
<!--                                                v-model="form.min_year"-->
<!--                                                :show-label-on-select="false"-->
<!--                                                :clear-option="false"-->
<!--                                                in-select-menu-->
<!--                                            />-->
<!--                                            <form-select-->
<!--                                                :label="$t('to')"-->
<!--                                                :options="getYearOptions(form.min_year, false)"-->
<!--                                                v-model="form.max_year"-->
<!--                                                :show-label-on-select="false"-->
<!--                                                :clear-option="false"-->
<!--                                                in-select-menu-->
<!--                                            />-->
<!--                                        </div>-->
<!--                                    </form-select>-->
                                </div>
                            </div>
                        </div>
                    </template>

                    <div class="col-12 mb-3">
                        <component :is="isMobileBreakpoint && !advanced ? 'transition-expand' : 'div'">
                            <div
                                class="row"
                                v-if="!isMobileBreakpoint || advanced || !collapsed"
                            >
                                <template v-if="isMobileBreakpoint && !advanced && !collapsed">
                                    <div class="col-6 col-lg-3 mb-2 mb-lg-3">
                                        <form-select
                                            :label="$t('fuel')"
                                            v-model="form.engine_type"
                                            :options="
                                                bodyOptions.main.default_options['tip-dvigatelya']
                                                  .values
                                              "
                                            multiple
                                            name-in-value
                                            translate-options
                                        />
                                    </div>
                                    <div class="col-6 col-lg-3 mb-2 mb-lg-3">
                                        <form-select
                                            :label="$t('korobka')"
                                            v-model="form.korobka"
                                            :options="
                                                bodyOptions.main.default_options['korobka'].values
                                              "
                                            multiple
                                            name-in-value
                                            translate-options
                                        />
                                    </div>
                                </template>

                                <div class="col-3">
                                    <MinMaxSearch
                                        :placeholder="['Qiymət, min.', 'maks.']"
                                        :selectedValue="{ min: form.price_from, max: form.price_to }"
                                        @change="form.price_from = $event[0].value, form.price_to = $event[1].value"
                                    />

<!--                                    <form-select-->
<!--                                        :label="$t('price')"-->
<!--                                        custom-->
<!--                                        :suffix="getOptionValue('Currency', form.currency)"-->
<!--                                        :values="{-->
<!--                                          from: form.price_from,-->
<!--                                          to: form.price_to,-->
<!--                                          suffix: getSuffix,-->
<!--                                        }"-->
<!--                                        @clear=";(form.price_from = ''), (form.price_to = '')"-->
<!--                                    >-->
<!--                                        <div class="form-merged">-->
<!--                                            <form-numeric-input-->
<!--                                                :placeholder="$t('from')"-->
<!--                                                v-model="form.price_from"-->
<!--                                            />-->
<!--                                            <form-numeric-input-->
<!--                                                :placeholder="$t('to')"-->
<!--                                                v-model="form.price_to"-->
<!--                                            />-->
<!--                                            <form-select-->
<!--                                                :label="'AZN'"-->
<!--                                                :options="getCurrencyOptions"-->
<!--                                                v-model="form.currency"-->
<!--                                                :allow-clear="false"-->
<!--                                                :clear-option="false"-->
<!--                                                in-select-menu-->
<!--                                            />-->
<!--                                        </div>-->
<!--                                    </form-select>-->
                                </div>

                                <div class="col-3">
                                    <MinMaxSearch
                                        :placeholder="['Yürüş, min.', 'maks.']"
                                        :selectedValue="{ min: form.mileage_from, max: form.mileage_to }"
                                        @change="form.mileage_from = $event[0].value, form.mileage_to = $event[1].value"
                                    />

<!--                                    <form-select-->
<!--                                        :label="$t('city')"-->
<!--                                        :options="sellOptions.regions"-->
<!--                                        v-model="form.region"-->
<!--                                        has-search-->
<!--                                    />-->
                                </div>

                                <div class="col-3">
                                    <MinMaxSearch
                                        :placeholder="['Motor, min.', 'maks.']"
                                        :selectedValue="{ min: form.min_capacity, max: form.max_capacity }"
                                        @change="form.min_capacity = $event[0].value, form.max_capacity = $event[1].value"
                                    />

<!--                                    <form-select-->
<!--                                        :label="$t('city')"-->
<!--                                        :options="sellOptions.regions"-->
<!--                                        v-model="form.region"-->
<!--                                        has-search-->
<!--                                    />-->
                                </div>

<!--                                <div class="col-3" v-if="!isMobileBreakpoint">-->
<!--                                    <form-select-->
<!--                                        :label="$t('fuel')"-->
<!--                                        v-model="form.engine_type"-->
<!--                                        :options="-->
<!--                                            bodyOptions.main.default_options['tip-dvigatelya']-->
<!--                                              .values-->
<!--                                          "-->
<!--                                        multiple-->
<!--                                        name-in-value-->
<!--                                        translate-options-->
<!--                                    />-->
<!--                                </div>-->

                                <div class="col-3">
                                    <div class="row">
                                        <div class="col-4">
                                            <CustomCheckbox
                                                :id="'credit'"
                                                :text="$t('credit')"
                                                @check="form.credit = $event"
                                            />

<!--                                            <form-checkbox-->
<!--                                                v-tooltip="$t('barter')"-->
<!--                                                v-model="form.exchange_possible"-->
<!--                                                input-name="exchange_possible"-->
<!--                                                icon-name="barter"-->
<!--                                            />-->
                                        </div>

                                        <div class="col-4">
                                            <CustomCheckbox
                                                :id="'barter'"
                                                :text="$t('barter')"
                                                @check="form.exchange_possible = $event"
                                            />
<!--                                            <form-checkbox-->
<!--                                                v-tooltip="$t('credit')"-->
<!--                                                v-model="form.credit"-->
<!--                                                input-name="credit"-->
<!--                                                icon-name="percent"-->
<!--                                            />-->
                                        </div>

                                        <div class="col-4">
                                            <CustomCheckbox
                                                :id="'with_video'"
                                                :text="'360'"
                                                @check="form.with_video = $event"
                                            />
<!--                                            <form-checkbox-->
<!--                                                :label="$t('with_video')"-->
<!--                                                v-model="form.with_video"-->
<!--                                                input-name="with_video"-->
<!--                                            />-->
                                        </div>
                                    </div>
                                </div>

<!--                                <div class="col-6 col-lg-2 mb-2 mb-lg-3" v-if="isMobileBreakpoint">-->
<!--                                    <form-checkbox-->
<!--                                        :label="$t('with_video')"-->
<!--                                        v-model="form.with_video"-->
<!--                                        input-name="with_video"-->
<!--                                    />-->
<!--                                </div>-->

                                <div
                                    class="col-6 col-lg-3 mb-2 mb-lg-3"
                                    v-if="isMobileBreakpoint"
                                >
                                    <form-checkbox
                                        :label="$t('external_salon')"
                                        v-model="form.external_salon"
                                        input-name="external_salon"
                                    />
                                </div>
                            </div>
                        </component>
                    </div>

                    <div class="col-12">
                        <div class="row">
                            <div class="col-3">
                                <div class="btn btn--pale-red full-width">
                                    {{ $t('exclude') }}

                                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.0299 9.46992L9.96992 14.5299C9.31992 13.8799 8.91992 12.9899 8.91992 11.9999C8.91992 10.0199 10.5199 8.41992 12.4999 8.41992C13.4899 8.41992 14.3799 8.81992 15.0299 9.46992Z" stroke="#F81734" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M18.3201 5.76998C16.5701 4.44998 14.5701 3.72998 12.5001 3.72998C8.97009 3.72998 5.68009 5.80998 3.39009 9.40998C2.49009 10.82 2.49009 13.19 3.39009 14.6C4.18009 15.84 5.10009 16.91 6.10009 17.77" stroke="#F81734" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M8.91992 19.5299C10.0599 20.0099 11.2699 20.2699 12.4999 20.2699C16.0299 20.2699 19.3199 18.1899 21.6099 14.5899C22.5099 13.1799 22.5099 10.8099 21.6099 9.39993C21.2799 8.87993 20.9199 8.38993 20.5499 7.92993" stroke="#F81734" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M16.0099 12.7C15.7499 14.11 14.5999 15.26 13.1899 15.52" stroke="#F81734" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M9.97 14.53L2.5 22" stroke="#F81734" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M22.5 2L15.03 9.47" stroke="#F81734" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>

                                    <!--                                    <icon name="options"/>-->
                                </div>
                            </div>

                            <div class="col-3">
                                <button
                                    type="button"
                                    :class="[
                                      'btn',
                                      'btn-close',
                                      'full-width',
                                      { 'pointer-events-none': pending },
                                    ]"
                                    @click="resetForm(!(advanced || assistant))"
                                >
                                    {{ $t('clear_search') }}

                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.8877 1.12784C12.8491 1.08925 12.8033 1.05864 12.7529 1.03776C12.7025 1.01687 12.6485 1.00611 12.5939 1.00611C12.5393 1.00611 12.4853 1.01687 12.4349 1.03776C12.3845 1.05864 12.3387 1.08925 12.3001 1.12784L7.00926 6.41872L1.71838 1.12784C1.64179 1.0482 1.53671 1.00224 1.42624 1.00008C1.31577 0.997921 1.20897 1.03974 1.12933 1.11632C1.0497 1.19291 1.00374 1.29799 1.00158 1.40846C0.999418 1.51893 1.04123 1.62573 1.11782 1.70537L1.12784 1.71537L6.41872 7.00626L1.12784 12.2971C1.0482 12.3737 1.00224 12.4788 1.00008 12.5893C0.997921 12.6997 1.03974 12.8065 1.11632 12.8862C1.19291 12.9658 1.29799 13.0118 1.40846 13.0139C1.51893 13.0161 1.62573 12.9743 1.70537 12.8977L1.71537 12.8877L7.00626 7.59681L12.2971 12.8877C12.3751 12.9656 12.4807 13.0094 12.5909 13.0094C12.7011 13.0094 12.8068 12.9656 12.8847 12.8877C12.9626 12.8098 13.0064 12.7041 13.0064 12.5939C13.0064 12.4837 12.9626 12.3781 12.8847 12.3002L7.5938 7.00926L12.8847 1.71838C12.9233 1.6798 12.9539 1.634 12.9748 1.5836C12.9957 1.53319 13.0064 1.47917 13.0064 1.4246C13.0064 1.37004 12.9957 1.31602 12.9748 1.26561C12.9539 1.21521 12.9233 1.1694 12.8847 1.13083L12.8877 1.12784Z" fill="#081A3E" stroke="#081A3E" stroke-width="0.9"/>
                                    </svg>

                                    <!--                                    <icon name="close"/>-->
                                </button>
                            </div>

                            <div class="col-3">
                                <div class="btn btn-advancedSearch full-width">
                                    {{ $t('advanced_search') }}
                                    <icon name="options"/>
                                </div>

<!--                                <nuxt-link-->
<!--                                    custom-->
<!--                                    exact-->
<!--                                    :to="$localePath('/cars/advanced-search')"-->
<!--                                    v-slot="{ href }"-->
<!--                                >-->
<!--                                    <a-->
<!--                                        :href="href"-->
<!--                                        class="btn full-width"-->
<!--                                        :class="{ active: routeName === 'cars-advanced-search' }"-->
<!--                                        @click.prevent="goToSearch(href)"-->
<!--                                    >-->
<!--                                        {{ $t('advanced_search') }}-->
<!--                                        <icon name="options"/>-->
<!--                                    </a>-->
<!--                                </nuxt-link>-->
                            </div>

                            <div class="col-3">
                                <button
                                    type="button"
                                    :class="['btn', 'full-width', 'btn--green', { pending }]"
                                    @click="submitForm()"
                                >
                                    {{ $t('find') }}

                                    <svg v-if="!pending" width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.66667 15.8333C13.3486 15.8333 16.3333 12.8486 16.3333 9.16667C16.3333 5.48477 13.3486 2.5 9.66667 2.5C5.98477 2.5 3 5.48477 3 9.16667C3 12.8486 5.98477 15.8333 9.66667 15.8333Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M18 17.5L14.375 13.875" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>

<!--                                    <icon name="search"/>-->
                                </button>
                            </div>
                        </div>
                    </div>

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
                                :options="
                                  bodyOptions.main.default_options['tip-dvigatelya'].values
                                "
                                multiple
                                name-in-value
                                translate-options
                            />
                        </div>
                        <div class="col-6 col-lg-2 mb-2 mb-lg-3">
                            <form-select
                                :label="$t('korobka')"
                                v-model="form.korobka"
                                :options="bodyOptions.main.default_options['korobka'].values"
                                multiple
                                name-in-value
                                translate-options
                            />
                        </div>
                        <div class="col-6 col-lg-2 mb-2 mb-lg-3">
                            <form-select
                                :label="$t('carcase')"
                                v-model="form.body"
                                :options="bodyOptions.main.default_options['body'].values"
                                multiple
                                name-in-value
                                translate-options
                            />
                        </div>
                        <div class="col-6 col-lg-2 mb-2 mb-lg-3">
                            <form-select
                                :label="$t('privod')"
                                v-model="form.gearing"
                                :options="bodyOptions.main.default_options['privod'].values"
                                multiple
                                name-in-value
                                translate-options
                            />
                        </div>
                        <div class="col-6 col-lg-2 mb-2 mb-lg-3">
                            <form-select
                                :label="$t('damage')"
                                v-model="form.damage"
                                :options="getDamageOptions"
                                :show-label-on-select="true"
                            />
                        </div>
                        <div class="col-6 col-lg-2 mb-2 mb-lg-3">
                            <form-select
                                :label="$t('customs')"
                                v-model="form.customs"
                                :options="getCustomsOptions"
                                :show-label-on-select="true"
                            />
                        </div>
                        <div class="col-6 col-lg-2 mb-2 mb-lg-3">
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
                                        :options="
                                      bodyOptions.main.custom_options['capacity'].values
                                    "
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
                        </div>
                        <div class="col-6 col-lg-2 mb-2 mb-lg-3">
                            <form-select
                                :label="$t(allSellOptions2.n_of_seats.placeholder)"
                                v-model="form.n_of_seats"
                                multiple
                                name-in-value
                                translate-options
                                :options="allSellOptions2.n_of_seats.options"
                            />
                        </div>
                        <div class="col-6 col-lg-2 mb-2 mb-lg-3">
                            <form-checkbox
                                :label="$t('in_garanty')"
                                v-model="form.in_garanty"
                                input-name="in_garanty"
                            />
                        </div>
                        <div class="col-6 col-lg-2 mb-2 mb-lg-3" v-if="!isMobileBreakpoint">
                            <form-checkbox
                                :label="$t('with_video')"
                                v-model="form.with_video"
                                input-name="with_video"
                            />
                        </div>
                        <div class="col-6 col-lg-2 mb-2 mb-lg-3" v-if="!isMobileBreakpoint">
                            <form-checkbox
                                :label="$t('external_salon')"
                                v-model="form.external_salon"
                                input-name="external_salon"
                            />
                        </div>
                        <div class="col-12">
                            <color-options
                                v-model="form.colors"
                                :matt="form.is_matte"
                                @change-matt="form.is_matte = $event"
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

<!--                    <div class="col-3" v-if="!isMobileBreakpoint && !advanced">-->
<!--                        <form-checkbox-->
<!--                            :label="$t('with_video')"-->
<!--                            v-model="form.with_video"-->
<!--                            input-name="with_video"-->
<!--                        />-->
<!--                    </div>-->
                </template>
            </div>

<!--            <div-->
<!--                :class="[-->
<!--                    'row',-->
<!--                        {-->
<!--                        'stick-to-bottom pt-2 pt-lg-3 pb-2 pb-lg-3 mb-n2 mb-lg-n3': advanced,-->
<!--                    },-->
<!--                ]"-->
<!--            >-->
<!--                <div class="col-12">-->
<!--                    <div-->
<!--                        :class="[-->
<!--                              'row',-->
<!--                              {-->
<!--                                'flex-column-reverse flex-lg-row': !assistant,-->
<!--                                'align-items-end': assistant,-->
<!--                              },-->
<!--                            ]"-->
<!--                        >-->
<!--                        <div class="col-lg-6" v-if="assistant">-->
<!--                            <form-range-->
<!--                                v-model="formAssistant.price"-->
<!--                                :min="5000"-->
<!--                                :max="100000"-->
<!--                                :step="5000"-->
<!--                            >-->
<!--                                <div class="row mt-2 mt-lg-3 mb-2 mb-lg-0">-->
<!--                                    <div class="col-6">-->
<!--                                        <div class="form-info">-->
<!--                                            {{ $readNumber(formAssistant.price[0]) }} ₼-->
<!--                                        </div>-->
<!--                                    </div>-->
<!--                                    <div class="col-6">-->
<!--                                        <div class="form-info">-->
<!--                                            {{ $readNumber(formAssistant.price[1]) }} ₼-->
<!--                                        </div>-->
<!--                                    </div>-->
<!--                                </div>-->
<!--                            </form-range>-->
<!--                        </div>-->
<!--                        <div class="col-lg-12 col-xl-8" v-else>-->
<!--                            <div class="row">-->
<!--                                <template v-if="!advanced && !assistant && !isMobileBreakpoint">-->
<!--                                    <div class="col-lg-3 mb-lg-0">-->
<!--                                        <form-select-->
<!--                                            :label="$t('korobka')"-->
<!--                                            v-model="form.korobka"-->
<!--                                            :options="-->
<!--                                                bodyOptions.main.default_options['korobka'].values-->
<!--                                              "-->
<!--                                            multiple-->
<!--                                            name-in-value-->
<!--                                            translate-options-->
<!--                                        />-->
<!--                                    </div>-->
<!--                                    <div class="col-lg-3 mb-lg-0">-->
<!--&lt;!&ndash;                                        <form-select&ndash;&gt;-->
<!--&lt;!&ndash;                                            :label="$t('mileage')"&ndash;&gt;-->
<!--&lt;!&ndash;                                            custom&ndash;&gt;-->
<!--&lt;!&ndash;                                            :suffix="$t('char_kilometre')"&ndash;&gt;-->
<!--&lt;!&ndash;                                            :values="{ from: form.mileage_from, to: form.mileage_to }"&ndash;&gt;-->
<!--&lt;!&ndash;                                            @clear=";(form.mileage_from = ''), (form.mileage_to = '')"&ndash;&gt;-->
<!--&lt;!&ndash;                                        >&ndash;&gt;-->
<!--&lt;!&ndash;                                            <div class="form-merged">&ndash;&gt;-->
<!--&lt;!&ndash;                                                <form-numeric-input&ndash;&gt;-->
<!--&lt;!&ndash;                                                    :placeholder="$t('from')"&ndash;&gt;-->
<!--&lt;!&ndash;                                                    v-model="form.mileage_from"&ndash;&gt;-->
<!--&lt;!&ndash;                                                    :suffix="$t('char_kilometre')"&ndash;&gt;-->
<!--&lt;!&ndash;                                                />&ndash;&gt;-->
<!--&lt;!&ndash;                                                <form-numeric-input&ndash;&gt;-->
<!--&lt;!&ndash;                                                    :placeholder="$t('to')"&ndash;&gt;-->
<!--&lt;!&ndash;                                                    v-model="form.mileage_to"&ndash;&gt;-->
<!--&lt;!&ndash;                                                    :suffix="$t('char_kilometre')"&ndash;&gt;-->
<!--&lt;!&ndash;                                                />&ndash;&gt;-->
<!--&lt;!&ndash;                                            </div>&ndash;&gt;-->
<!--&lt;!&ndash;                                        </form-select>&ndash;&gt;-->
<!--                                    </div>-->
<!--                                    <div-->
<!--                                        class="col-6 col-lg-3 mb-2 mb-lg-3"-->
<!--                                        v-if="!isMobileBreakpoint && !advanced"-->
<!--                                    >-->
<!--                                        <form-checkbox-->
<!--                                            :label="$t('external_salon')"-->
<!--                                            v-model="form.external_salon"-->
<!--                                            input-name="external_salon"-->
<!--                                        />-->
<!--                                    </div>-->
<!--                                    &lt;!&ndash;                  <div-->
<!--                                                        class="col-6 col-lg-3 mb-2 mb-lg-3"-->
<!--                                                        v-if="!isMobileBreakpoint && !advanced"-->
<!--                                                      >-->
<!--                                                        <div class="form-info text-green">-->
<!--                                                          {{ $readPlural(totalCount, $t('plural_forms_announcements')) }}-->
<!--                                                        </div>-->
<!--                                                      </div>&ndash;&gt;-->
<!--                                </template>-->

<!--                                <template v-if="!onlySavedSearch">-->
<!--                                    <div-->
<!--                                        class="col-lg-3 mt-2 mt-lg-0 mb-3"-->
<!--                                        v-show="searchApplied"-->
<!--                                    >-->
<!--                                        <form-checkbox-->
<!--                                            :label="$t('search_save')"-->
<!--                                            v-model="savedSearch"-->
<!--                                            skip-truncate-->
<!--                                            input-name="savedSearch"-->
<!--                                            transparent-->
<!--                                            :disabled="!loggedIn"-->
<!--                                            @try="$nuxt.$emit('login-popup', 'saved-search')"-->
<!--                                        />-->
<!--                                    </div>-->
<!--                                </template>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                        <div-->
<!--                            v-if="!onlySavedSearch"-->
<!--                            :class="[{ 'col-lg-6 col-xl-4 mt-lg-2 mt-xl-0 offset-lg-6 offset-xl-0': !assistant, 'col-lg-6': assistant }]"-->
<!--                        >-->
<!--                            <div-->
<!--                                :class="[-->
<!--                                  'row',-->
<!--                                  {-->
<!--                                    'mb-1 mb-lg-0': !searchApplied && !(advanced || assistant),-->
<!--                                  },-->
<!--                                ]"-->
<!--                            >-->
<!--                                <div class="col-6">-->
<!--                                    <button-->
<!--                                        type="button"-->
<!--                                        :class="[-->
<!--                                          'btn',-->
<!--                                          'full-width',-->
<!--                                          'btn&#45;&#45;red-outline',-->
<!--                                          { 'pointer-events-none': pending },-->
<!--                                        ]"-->
<!--                                        @click="resetForm(!(advanced || assistant))"-->
<!--                                    >-->
<!--                                        <icon name="reset"/>-->
<!--                                        {{ $t('clear_search') }}-->
<!--                                    </button>-->
<!--                                </div>-->
<!--                                <div class="col-6">-->
<!--                                    <button-->
<!--                                        type="button"-->
<!--                                        :class="['btn', 'full-width', 'btn&#45;&#45;green', { pending }]"-->
<!--                                        @click="submitForm()"-->
<!--                                    >-->
<!--                                        <icon name="search"/>-->
<!--                                        {{ $t('find') }}-->
<!--                                    </button>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                        <div-->
<!--                            v-else-->
<!--                            :class="[{ 'col-lg-4': !assistant, 'col-lg-6': assistant }]"-->
<!--                        >-->
<!--                            <div-->
<!--                                :class="[-->
<!--                                  'row',-->
<!--                                  {-->
<!--                                    'mb-1 mb-lg-0': !searchApplied && !(advanced || assistant),-->
<!--                                  },-->
<!--                                ]"-->
<!--                            >-->
<!--                                <div class="col-6">-->
<!--                                    <button-->
<!--                                        type="button"-->
<!--                                        :class="[-->
<!--                      'btn',-->
<!--                      'full-width',-->
<!--                      'btn&#45;&#45;red-outline',-->
<!--                      { 'pointer-events-none': pending },-->
<!--                    ]"-->
<!--                                        @click="resetForm(!(advanced || assistant))"-->
<!--                                    >-->
<!--                                        <icon name="reset"/>-->
<!--                                        {{ $t('clear_search') }}-->
<!--                                    </button>-->
<!--                                </div>-->
<!--                                <div class="col-6">-->
<!--                                    <button-->
<!--                                        type="button"-->
<!--                                        :class="[-->
<!--                      'btn',-->
<!--                      'full-width',-->
<!--                      'btn&#45;&#45;green',-->
<!--                      { pending, 'btn-disabled': !searchAppliedCustom },-->
<!--                    ]"-->
<!--                                        @click="saveSearch"-->
<!--                                    >-->
<!--                                        <icon name="search"/>-->
<!--                                        {{ $t('search_and_save') }}-->
<!--                                    </button>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->

<!--            <div-->
<!--                class="collapse-toggle"-->
<!--                v-if="isMobileBreakpoint && !(advanced || assistant)"-->
<!--            >-->
<!--                <button type="button" class="btn" @click="collapsed = !collapsed">-->
<!--                    <span>{{ $t(`search_${collapsed ? 'more' : 'less'}`) }}</span>-->
<!--                    <icon :name="`chevron-${collapsed ? 'down' : 'up'}`"/>-->
<!--                </button>-->
<!--            </div>-->
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
                <div class="col-6 col-lg-2 mt-3 mt-lg-5 mb-n6 mb-lg-n1">
                    <button @click="showExcludeModal = true;" type="button" class="btn btn--dark-blue full-width">
                        {{ $t('exclude') }}
                        <template v-if="getExcludeCount">({{ getExcludeCount }})</template>
                    </button>
                </div>
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
                                :options="brands"
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

<style>
.btn-disabled {
    opacity: 0.2;
    pointer-events: none;

}

@media screen and (min-width: 768px) {
    .exclude-popup {
        width: 50%;
    }
}

</style>
<script>
import {mapGetters, mapActions} from 'vuex'

import {SearchMixin} from '~/mixins/search'

import ColorOptions from '~/components/options/ColorOptions'
import CarFilters from '~/components/cars/CarFilters'
import CarBodyShortcuts from '~/components/cars/CarBodyShortcuts'
import CarOptionPacks from '~/components/cars/CarOptionPacks'
import QrcodeBox from '~/components/login/Qrcode-box'
import MinMaxSearch from "~/components/elements/MinMaxSearch.vue";
import CustomCheckbox from "~/components/elements/CustomCheckbox.vue";

export default {
    components: {
        CustomCheckbox,
        MinMaxSearch,
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
            'carModels',
            'carModelsExclude',
            'carGenerations',
            'carGenerationsExclude',
            'bodyOptions',
            'sellOptions',
            'allSellOptions2',
            'singleSavedSearch',
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
    },
    watch: {
        form: {
            handler() {
                if (!this.firstTimeUpdated) {
                    this.searchAppliedCustom = true
                } else {
                    this.firstTimeUpdated = false
                }
            },
            deep: true,
        },
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
            let brand = this.brands.find((option) => option.id == id);
            let slug = brand?.slug || '';

            this.$set(this.form.additional_brands[index], 'brand', id);
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
            let brand = this.brands.find((option) => option.id == id)
            let slug = brand?.slug || ''
            this.$set(this.form.exclude_additional_brands[index], 'brand', id)
            this.$set(this.form.exclude_additional_brands[index], 'brand_slug', slug)
            ;[
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
        async setGeneration(id, index) {
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
    },
}
</script>
