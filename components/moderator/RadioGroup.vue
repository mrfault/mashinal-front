<template>
  <div class="row">
    <form-radio v-for="(option,index) in options"
                :id="`${option.key}-${option.name}-${keyItem}-${keyValue}`"
                :key="keyValue+keyValue" v-model="computedValue"
                :label="$t(option.name)" :radio-value="option.key"
                bigLabel class="mt-2 col-12 col-lg-4"/>
  </div>
</template>

<script>
import TitleWithLineAndRejectReason from '~/components/moderator/titleWithLineAndRejectReason'

export default {
  name: "RadioGroup",
  components: {
    TitleWithLineAndRejectReason
  },
  props: {
    value: Number,
    options: Array,
    form: Object,
    keyValue: String,
    keyItem: String,
  },
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
