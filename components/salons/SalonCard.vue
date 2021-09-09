<template>
  <div :class="['salon-card', 'card with-margins']">
    <div class="d-flex align-items-center">
      <div class="salon-logo">
        <img :src="getLogo(salon.logo || salon.media)" :alt="salon.name" />
      </div>
      <div class="salon-info">
        <h3>{{ $t('is_autosalon') }} "{{ salon.name }}"</h3>
        <div class="salon-info_bottom-line d-flex justify-content-between">
          <span class="d-inline-flex align-items-center">
            <icon name="phone-call" v-if="getConcatPhones(salon.phones, 1)" />
            <span v-html="getConcatPhones(salon.phones, 1)"></span>
          </span>
          <span class="d-inline-flex align-items-center">
            <icon name="img" /> 
            <span>{{ getTotalCount(salon) }}</span>
          </span>
        </div>
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
  mixins: [SalonsMixin]
}
</script>