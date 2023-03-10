<template>
  <div class="color-options row">
    <div
      class="col-2 col-lg-auto mb-2 mb-lg-3 custom-tooltip"
      v-for="(color, index) in interiorColors"
      :key="color.id"
    >
      <span
        :class="['color',{ selected: isSelected(color.id), contrast: index > 8 }]"
        :style="getStyles(color)"
        @click="selectedInteriorColor = color.id"
        v-tooltip="color.name[locale]"
      >
        <span class="sr-only">{{ color.name[locale] }}</span>
        <icon name="check" v-if="isSelected(color.id)"/>
      </span>
    </div>
    <div
      class="col-2 col-lg-auto mb-2 mb-lg-3 custom-tooltip"
    >
      <span
        :class="[
          'color',

        ]"
        :style="'background:url(/images/offer/other-color.png);background-size:cover'"
        @click="selectedInteriorColor = 'other-color'"
        v-tooltip="'Digər'"
      >
        <span class="sr-only">other color</span>
        <icon name="check" v-if="isSelected('other-color')"/>
      </span>
    </div>
  </div>
</template>
<style lang="scss">
.custom-tooltip {
  .tooltip-inner {
    background: #081A3E !important;
    color: #fff !important;
  }
}

.dark-mode {
  .custom-tooltip {
    .tooltip-inner {
      background: #fff !important;
      color: #000 !important;
    }
  }
}
</style>
<script>
import {mapGetters} from 'vuex'

export default {

  data() {
    return {
      interiorColors: [
        {
          code: "#FFFFFF",
          created_at: "2019-09-30T06:44:00.000000Z",
          deleted_at: null,
          id: 22,
          name: {az: "Ağ", en: "White", ru: "Белый"},
          sort_order: 11000,
          updated_at: "2020-09-30T13:01:36.000000Z",
        },
        {
          code: "#000000",
          created_at: "2019-10-07T12:11:55.000000Z",
          deleted_at: null,
          id: 24,
          name: {az: "Qara", en: "Black", ru: "Черный"},
          sort_order: 11004,
          updated_at: "2020-10-01T07:51:53.000000Z",
        }
      ]
    }
  },
  props: {
    value: {},
    matt: Boolean,
    multiple: {
      type: Boolean,
      default: true,
    },
    limit: Number,
    hideMatt: Boolean,
  },
  computed: {
    selectedInteriorColor: {
      get() {
        return this.value
      },
      set(color) {
        let value
        if (this.multiple) {
          if (this.isSelected(color)) {
            value = this.value.filter((c) => c !== color)
          } else {
            if (this.limit && this.value.length >= this.limit) return
            value = [...this.value, color]
          }
        } else {
          value = this.isSelected(color) ? '' : color
        }
        this.$emit('input', value)
        this.$emit('change', value)
      },
    },
  },
  methods: {
    getStyles(color) {
      return {
        backgroundColor: color.code,
        borderColor: color.code.includes('#FFFFFF') ? '#D6E4F8' : color.code,
      }
    },
    isSelected(color) {
      if (this.multiple) return this.selectedInteriorColor.includes(color)
      return this.selectedInteriorColor === color
    },
  },
}
</script>
