<template>
    <div class="card with-margins salon-card">
        <div class="d-flex">
            <div class="salon-logo">
                <img :src="getLogo(salon.logo)" :alt="salon.name"/>
            </div>

            <div class="salon-info">
                <h3>
                    <template v-if="!salon.is_official">
                        {{ $t(isShop ? 'shop' : 'autosalon') }} "{{ salon.name }}"
                    </template>

                    <template v-else> {{ salon.name }}</template>
                </h3>

                <div class="salon-info_bottom-line d-flex justify-content-between">
                  <span class="d-inline-flex align-items-center">
                    <icon name="phone-call" v-if="getConcatPhones(salon.phones, 1, false)" />
                    <client-only>
                        <span v-html="getConcatPhones(salon.phones, 1, false)"></span>
                    </client-only>
                  </span>

<!--                    <span class="d-inline-flex align-items-center">-->
<!--                        <inline-svg v-if="!isShop" class="salon-car-icon" src="/images/car_icon.svg"/>-->
<!--                        <inline-svg v-else class="salon-car-icon" src="/images/settings.svg"/>-->
<!--                  </span>-->
                </div>

                <span class="salon-announce">{{ getTotalCount(salon) }} {{ $t('announce_count') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { SalonsMixin } from '~/mixins/salons';

    export default {
        props: {
            salon: {}
        },
        mixins: [SalonsMixin],
        computed: {
            isShop() {
                return this.routeName.includes('parts')
            },
        }
    }
</script>
