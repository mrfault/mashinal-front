<template>
  <div class="sell_preview">
    <div :class="['img-bg', {'no-img': !sellPreviewData.image}]" 
         :style="sellPreviewData.image ? {backgroundImage: `url('${sellPreviewData.image}')`} : {}">
    </div>
    <h4>{{ brand.name }} {{ model.name }}</h4>
    <p>{{ form.year || form.selectedYear }} {{ $t('year') }}, {{ sellPreviewData.mileage || 0 }} {{ $t('char_kilometre') }}</p>
    <p class="price">{{ sellPreviewData.price || 0 }} {{ sellPreviewData.currency === 2 ? '$' : '₼' }}</p>
    <p>{{ sellPreviewData.region || $t('baku') }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    form: {},
    brand: {},
    model: {}
  },
  computed: {
    ...mapGetters(['sellPreviewData'])
  }
}
</script>