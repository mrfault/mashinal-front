<template>
<div class="row">
  <form-radio class="mt-2 col-12 col-lg-4" :radio-value="option.key" v-model="computedValue" :label="$t(option.name)" v-for="option in options" bigLabel/>
</div>
</template>

<script>
import TitleWithLineAndRejectReason from '~/components/moderator/titleWithLineAndRejectReason'

export default {
  name: "RadioGroup",
  components:{
    TitleWithLineAndRejectReason
  },
  props: {
    value: Number,
    options: Array,
    form: Object,
    keyValue: String
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
