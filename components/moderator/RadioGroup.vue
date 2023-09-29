<template>
   <div>
      <form-radio v-for="(option,index) in options"
                  :id="`${option.key}-${option.name}-${keyItem}-${keyValue}`"
                  :key="option.key" v-model="computedValue"
                  :label="$t(option.name)" :radio-value="option.key"
                  :disabled="disabledAll"
                  bigLabel/>
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
      disabledAll: Boolean
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
