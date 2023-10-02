<template>
   <div class="form-group">
      <div class="text-input textarea">
         <icon v-if="iconName" :class="{invalid, disabled}" :name="iconName"/>
         <textarea
            :id="id"
            v-model="inputValue"
            :class="{invalid, valid, disabled}"
            :disabled="disabled"
            :maxlength="maxlength"
            :placeholder="placeholder"
            @keydown="validate()"
         ></textarea>
         <icon v-if="invalid" class="invalid" name="alert-circle"/>
         <icon v-else-if="valid" class="valid" name="check-circle"/>
         <slot/>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      value: {},
      id: String,
      iconName: String,
      placeholder: {
         type: String,
         default: ' '
      },
      maxlength: {
         type: Number,
         default: 500
      },
      disabled: {
         type: Boolean,
         default: false
      },
      invalid: {
         type: Boolean,
         default: false
      },
      valid: {
         type: Boolean,
         default: false
      }
   },
   data() {
      return {
         prevValue: this.value
      }
   },
   computed: {
      inputValue: {
         get() {
            return this.value;
         },
         set(value) {
            value = (this.disabled || (this.value.length > this.maxlength)) ? this.value : value;
            this.$emit('input', value);
            // check if value was changed
            if (value !== this.prevValue) {
               this.$emit('change', value);
               this.prevValue = value;
            }
         }
      }
   },
   methods: {
      validate() {
         if (this.value.length >= this.maxlength) {
            this.inputValue = this.value.substring(0, this.maxlength);
            this.valid = true;
         }
      }
   },
}
</script>

<style lang="scss">
.text-input input.disabled, .text-input textarea.disabled, .ma-input input.disabled, .ma-input textarea.disabled{
   -webkit-text-fill-color: #697586 !important;
}
</style>
