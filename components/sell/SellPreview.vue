<template>
  <div class="sell_preview">
    <div :class="['img-bg', {'no-img': !sellPreviewData.image}]" 
         :style="sellPreviewData.image ? {backgroundImage: `url('${sellPreviewData.image}')`} : {}">
    </div>
    <h4>{{ announcementTitle }}</h4>
    <p>{{ announcementDescription }}</p>
    <p class="price">
      {{ announcementPrice }}
    </p>
    <p>{{ sellPreviewData.region || $t('baku') }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    form: {
      type: Object,
      required: false
    },
    brand: {
      type: [Object, String],
      required: false
    },
    model: {
      type: [Object, String],
      required: false
    }
  },
  computed: {
    ...mapGetters(['sellPreviewData']),
    announcementTitle() {
      if (this.sellPreviewData.title) {
        return this.sellPreviewData.title
      } else if (this.brand.name || this.model.name) {
        return [this.brand.name, this.model.name].join(' ')
      } else {
        return this.$t('announcement_name')
      }
    },
    announcementDescription() {
      if (this.form.year || this.form.selectedYear || this.sellPreviewData.mileage) {
        return [
          this.form.year || this.form.selectedYear,
          this.$t('year') + ',',
          this.$readNumber(this.sellPreviewData.mileage || 0),
          this.sellPreviewData.mileage_measure
        ].join(' ')
      } else if (this.sellPreviewData.shine_width && this.sellPreviewData.height && this.sellPreviewData.diameter) {
        return (
          this.sellPreviewData.shine_width + '/' +
          this.sellPreviewData.height + '/' +
          this.sellPreviewData.diameter
        )
      }
    },
    announcementPrice() {
      if (this.sellPreviewData.is_negotiable) {
        return this.$t('negotiable')
      } else {
        return (''+this.$readNumber(this.sellPreviewData.price) || 0) + (this.sellPreviewData.currency || '₼')
      }
    }
  }
}
</script>