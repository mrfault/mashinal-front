<template>
    <div :class="['vehicle-specs pt-0 pt-lg-4', {'mb-lg-3': !brief}]">
        <h3 class="vehicle-specs__title">Avtomobilin məlumatları</h3>

        <div class="vehicle-specs__inner">
            <ul v-for="ul in announcementSpecsNew">
                <li
                    v-if="!(announcement.is_external_salon && spec.key === 'customs')"
                    v-for="spec in ul"
                    :key="spec.key"
                    :class="{'is-vin-number': (spec.key === 'vin')}"
                >
                    <div>
                        <img :src="`/icons/vehicle-specs/${spec.icon}.svg`" alt="icon">
                        <!--                  <icon v-if="spec.key === 'exchange'" name="barter"/>-->
                        <!--                  <icon v-else-if="spec.key === 'credit'" name="percent"/>-->
                    </div>

<!--                    v-if="spec.key !== 'vin'"-->
                    <div >
                        <span>{{ $t(spec.key === 'engine' ? 'engine_only' : spec.key) }}</span>
                        <span>{{ spec.value }}</span>
                    </div>

<!--                    <span v-else>-->
<!--                        <p class="mb-0" style="width: calc(100% - 30px)">{{ spec.value }}</p>-->
<!--                    </span>-->
                </li>
            </ul>
        </div>

        <nuxt-link
            v-if="catalog"
            :class="['btn']"
            :to="catalogLink"
        >
            <span>{{ $t('catalog_model_specifications') }}</span>
            <img src="/icons/arrow-right.svg" alt="arrow-right">
        </nuxt-link>

        <div v-if="isMobileBreakpoint && announcement.status != 3" class="mt-3 mt-lg-0">
            <floating-cta :announcement="announcement"/>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';

import {AnnouncementDataMixin} from '~/mixins/announcement';

import FloatingCta from '~/components/announcements/inner/FloatingCta';
import icon from "~/components/elements/Icon.vue";

export default {
    props: {
        type: String,
        brief: Boolean
    },
    components: {
        FloatingCta
    },
    mixins: [AnnouncementDataMixin],
    computed: {
        icon() {
            return icon
        },
        ...mapGetters(['announcement', 'catalog', 'sellOptions', 'motoOptions']),

        announcementSpecs() {
            const specs = [
                {key: 'years', value: this.announcement.year, class: 'car-year', icon: 'calendar'},
                {key: 'region', value: this.announcement.region?.name[this.locale], icon: 'location'},
                {key: 'country', value: this.announcement[`country_name_${this.locale}`], for: ['cars', 'commercial', 'moto']},
                {key: 'mileage', value: this.mileage + (this.announcement.is_new ? ', ' + this.$t('is_new').toLowerCase() : ''), class: 'car-mileage', for: ['cars', 'commercial', 'moto'], icon: 'speed'},
                // {key: 'condition', value: (this.announcement.broken || this.announcement.status_id || this.announcement.beaten) && this.$t('bitie')},
                // {key: 'guaranty', value: (this.announcement.in_garanty || this.announcement.guaranty) && this.$t('in_garanty')},
                // {key: 'com_equip_type', value: this.commercialType, for: ['commercial']},
                {key: 'carcase', value: this.bodyType, for: ['cars'], icon: 'car'},
                {key: 'color2', value: this.color, for: ['cars', 'commercial', 'moto'], icon: 'color'},
                {key: 'engine', value: this.engineSpecs, icon: 'engine'},
                {key: 'the_number_of_measures', value: this.tact, for: ['moto']},
                {key: 'cylinder_block', value: this.cylinderBlock, for: ['moto']},
                {key: 'fuel_type', value: this.fuelType, for: ['moto']},

                {key: 'box', value: this.box, icon: 'gearshift'},
                {key: 'privod', value: this.gear, icon: 'gear'},
                {key: 'type_of_brakes', value: this.brakeType, for: ['commercial']},
                {key: 'wheel_formula', value: this.wheelFormula, for: ['commercial']},
                {key: 'loading', value: this.loadingKg, for: ['commercial']},
                {key: 'number_of_axles', value: this.numberOfAxes, for: ['commercial']},
                {key: 'working_hours', value: this.announcement.moto_hours, for: ['commercial']},
                {key: 'com_truck_cabin', value: this.announcement.cabin_type?.name?.[this.locale], for: ['commercial']},
                {key: 'seat_count', value: this.announcement.seats, for: ['commercial']},
                {key: 'exhaust_class', value: this.exhaustClass, for: ['commercial']},
                {key: 'cab_suspension', value: this.cabinSuspension, for: ['commercial']},
                {key: 'chassis_suspension', value: this.chassisSuspension, for: ['commercial']},
                // { key: 'first_owner', value: (parseInt(this.announcement.owner_type || this.announcement.owners || this.announcement.owner)) ? this.$t('no') : this.$t('yes'), for: ['cars', 'commercial', 'moto'] },
                // {key: 'customs', value: (this.announcement.customs_clearance || this.announcement.customed_id || this.announcement.customed) ? this.$t('not_cleared') : this.$t('cleared'), for: ['cars', 'commercial', 'moto']},
                {key: 'product_code', value: this.announcement.product_code, for: ['parts']},
                {key: 'category', value: this.announcement?.category?.name[this.locale], for: ['parts']},
                {key: 'sub_category', value: this.announcement?.sub_category?.name[this.locale], for: ['parts']},
                {key: 'brand_name', value: this.announcement?.brand?.name, for: ['parts']},
                {key: 'vin', value: this.announcement.show_vin && this.announcement.vin, icon: 'vin'},
                {key: 'license_plate', value: this.announcement.show_car_number && this.announcement.car_number},
                // {key: 'exchange', value: (this.announcement.exchange_possible || this.announcement.tradeable) && this.$t('is_possible')},
                // {key: 'credit', value: this.announcement.credit && this.$t('is_in_credit')},
                {key: 'condition', value: this.condition, for: ['parts']},
                {key: 'is_original', value: this.announcement.is_original ? this.$t('yes') : this.$t('no'), for: ['parts']},
                {key: 'have_delivery', value: this.announcement.have_delivery ? this.$t('yes') : this.$t('no'), for: ['parts']},
                {key: 'have_warranty', value: this.announcement.have_warranty ? this.$t('yes') : this.$t('no'), for: ['parts']},
                {key: 'commercial_size', value: this.announcement.commercial_size}
            ];

            if (this.announcement.is_external_salon) {
                let index = specs.findIndex(item => item.key === 'region');
                delete specs[index]
            }

            let mergedKeys = [
                'shine_width', 'diameter', 'height'
            ];

            let mergedValues = {
                shine_width: '',
                height: '',
                diameter: ''
            };

            // Dynamic specs
            if (this.type === 'parts') {
                Object.keys(this.announcement.filters).forEach(filter => {
                    let value = this.announcement.filters[filter]

                    if (value) {
                        if (typeof value === 'boolean') {
                            value = value ? this.$t('yes') : this.$t('yes');
                        } else if (typeof value === 'object') {
                            value = this.$t(value.name)
                        }

                        if (mergedKeys.includes(filter)) {
                            mergedValues[filter] = value;
                        } else {
                            specs.push({
                                    key: filter.replace('capacity', 'battery_capacity'),
                                    value,
                                    for: ['parts']
                                }
                            )
                        }

                    }
                })

                if (mergedValues['shine_width'])
                    specs.push({
                        key: 'size',
                        value: mergedValues['shine_width'] + '/' + mergedValues['height'] + 'R' + mergedValues['diameter'],
                        for: ['parts']
                    })
                else if (mergedValues['diameter']) {
                    specs.push({
                        key: 'diameter',
                        value: mergedValues['diameter'],
                        for: ['parts']
                    })
                }
            }

            let filteredSpecs = specs.filter(spec => spec.value && (!spec.for || spec.for.includes(this.type)));
            return this.brief ? filteredSpecs.slice(0, 5) : filteredSpecs;
        },

        announcementSpecsNew() {
            const specsNew = [
                [
                    {key: 'years', value: this.announcement.year, class: 'car-year', icon: 'calendar'},
                    {key: 'region', value: this.announcement.region?.name[this.locale], icon: 'location'},
                    {key: 'mileage', value: this.mileage + (this.announcement.is_new ? ', ' + this.$t('is_new').toLowerCase() : ''), class: 'car-mileage', for: ['cars', 'commercial', 'moto'], icon: 'speed'},
                ],
                [
                    {key: 'carcase', value: this.bodyType, for: ['cars'], icon: 'car'},
                    {key: 'color2', value: this.color, for: ['cars', 'commercial', 'moto'], icon: 'color'},
                    {key: 'engine', value: this.engineSpecs, icon: 'engine'},
                ],
                [
                    {key: 'box', value: this.box, icon: 'gearshift'},
                    {key: 'privod', value: this.gear, icon: 'gear'},
                    {key: 'vin', value: this.announcement.show_vin && this.announcement.vin, icon: 'vin'},
                ]
            ];

            return specsNew
        },

        catalogLink() {
            let path = this.catalog && `/catalog/${this.catalog.brand.slug}/${this.catalog.model.slug}/${this.catalog.generation.id}/${this.catalog.car_type.id}/mod/${this.catalog.id}`;
            return path && this.$localePath(path);
        }
    }
}
</script>
