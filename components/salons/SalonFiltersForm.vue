<template>
    <div :class="['salon-filters-form form', {'has-sticky-screen-bottom': isMobileBreakpoint}]">
        <div :class="`card mt-lg-${short ? '0' : '3'}`">
            <div class="row mb-n2 mb-lg-n3">
                <div :class="[`col-12 ${short ? '' : (where === 'transport' ? 'col-lg-1-5' : 'col-lg-4-5')} mb-2 mb-lg-3`, {'order-lg-3': short}]">
                    <form-text-input
                        v-model="form.search"
                        icon-name="search"
                        block-class="placeholder-lighter"
                        :placeholder="$t(where === 'parts' ? 'shop_name' : 'salon_name')"
                        @change="filterAutosalons()"
                    />
                </div>

                <template v-if="where === 'transport'">
                    <div :class="[`col-12 ${short ? '' : 'col-lg-2-5'} mb-2 mb-lg-3`, {'order-lg-4': short}]">
                        <div
                            :class="['row', {'no-gutters checkbox-row bg-greyish-blue-2 round-4': !isMobileBreakpoint }]">
                            <div class="col-lg-auto">
                                <form-checkbox :label="$t('cars')" v-model="form.haveCar" input-name="haveCar"
                                               @change="filterAutosalons()" :transparent="isMobileBreakpoint"/>
                            </div>
                            <div class="col-lg-auto">
                                <form-checkbox :label="$t('moto')" v-model="form.haveMoto" input-name="haveMoto"
                                               @change="filterAutosalons()" :transparent="isMobileBreakpoint"/>
                            </div>
                            <div class="col-lg-auto">
                                <form-checkbox :label="$t('commercial')" v-model="form.haveCommercial"
                                               input-name="haveCommercial"
                                               @change="filterAutosalons()" :transparent="isMobileBreakpoint"/>
                            </div>
                        </div>
                    </div>
                </template>

                <div
                    :class="[`${isMobileBreakpoint ? 'col-12' : 'col-6'} ${!short ? 'col-lg-1-5' : 'order-lg-2'} mb-2 mb-lg-3`]"
                    v-if="where === 'transport'"
                >
                    <form-checkbox :label="$t('only_official')" v-model="form.officialOnly" input-name="officialOnly"
                                   @change="filterAutosalons()" :transparent="isMobileBreakpoint"
                    />
                </div>

                <div :class="[`col-6 ${short ? '' : 'col-lg-1-5'} mb-2 mb-lg-3`, {'order-lg-1': short}]"
                     v-if="!isMobileBreakpoint">
                    <div class="form-info text-green">
                        {{
                            $readPlural(count, $t(where === 'transport' ? 'plural_forms_salons' : 'plural_forms_shops'))
                        }}
                    </div>
                </div>
            </div>
        </div>

        <div class="stick-to-screen-bottom" v-if="isMobileBreakpoint">
            <button class="btn full-width btn--green" @click="filterAutosalons(true), $emit('filter')">{{
                    $t('find')
                }}
            </button>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
    props: {
        short: Boolean,
        count: Number,
        where: {
            type: String,
            default: 'transport'
        }
    },
    data() {
        return {
            form: {
                search: '',
                officialOnly: false,
                haveCar: false,
                haveMoto: false,
                haveCommercial: false
            }
        }
    },
    computed: {
        ...mapGetters(['salonsSearched', 'salonsFilters']),
    },
    methods: {
        ...mapActions(['updateSalonsFiltered', 'updateSalonsFilters']),

        filterAutosalons(runOnMobile = false) {
            if (this.isMobileBreakpoint && !runOnMobile) return;
            this.updateSalonsFilters({...this.form});
            let list = this.salonsSearched.filter((salon) => {
                let matches = true;
                if (this.form.search) matches &= this.$search(salon.name, this.form.search);
                if (this.form.officialOnly) matches &= salon.is_official;
                if (this.form.haveCar) matches &= salon.have_car;
                if (this.form.haveMoto) matches &= salon.have_moto;
                if (this.form.haveCommercial) matches &= salon.have_commercial;
                return matches;
            });
            this.updateSalonsFiltered(list);
            this.$emit('filter');
            this.$nuxt.$emit('filter-salons');
        }
    },
    created() {
        for (let key in this.salonsFilters)
            this.$set(this.form, key, this.salonsFilters[key]);
        this.$nuxt.$on('search-salons', this.filterAutosalons);
    },
    beforeDestroy() {
        this.$nuxt.$off('search-salons', this.filterAutosalons);
    }
}
</script>