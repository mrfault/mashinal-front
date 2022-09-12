<template>
  <div class="form-group" :class="{'ma-input--white': isPromotionsPage}">
    <div :class="['text-input', {[`${blockClass}`]:blockClass}]">
      <icon :name="iconName" v-if="iconName" :class="{invalid, disabled}" />
      <img :src="imgSrc" v-if="imgSrc" :class="{disabled}" />
      <template v-if="inputDate">
        <date-picker
          @click="open = false"
          v-model="inputValue"
          value-type="format"
          :popup-style="{ top: '100%', left: 0 }"
          :append-to-body="false"
          :format="dateFormat"
          :placeholder="placeholder"
          :type="dateType"
          :open.sync="open"
          :lang="locale"
          :input-attr="{readonly: 'readonly', id, maxlength, disabled}"
          :input-class="{invalid, valid, disabled, [`${inputClass}`]:inputClass}"
          :disabled-date="disabledDate"
        >
          <template #icon-clear>
            <icon name="cross" />
            <!-- <inline-svg src="/icons/cross.svg" height="14"/> -->
          </template>
        </date-picker>
      </template>
      <template v-else>
        <input
          :id="id"
          :type="showPassword ? 'text' : type"
          :placeholder="placeholder"
          :maxlength="maxlength"
          :disabled="disabled"
          :class="{invalid, valid, disabled, [`${inputClass}`]:inputClass}"
          :autocomplete="autocomplete"
          :readonly="readonly"
          v-mask="mask"
          v-model="inputValue"
          @focus="$emit('focus', $event)"
          @keypress="$emit('keypress',$event)"


        />
        <span v-if="type === 'password' && !invalid" class="show-password" @click="showPassword = !showPassword">
          <icon :name="showPassword ? 'eye' : 'hide'" />
        </span>
      </template>
      <icon name="alert-circle" v-if="invalid && !inputDate && !hasPopover" class="invalid" />
      <icon name="check-circle" v-else-if="valid && type !== 'password'" class="valid" />
      <slot name="default" />
    </div>
    <div class="form-group_inputs" v-if="hasInputs">
      <slot name="inputs" />
    </div>
  </div>
</template>

<script>
  import DatePicker from 'vue2-datepicker';
  import 'vue2-datepicker/locale/az';
  import 'vue2-datepicker/locale/ru';

  export default {
    props: {
      value: {},
      id: String,
      iconName: String,
      imgSrc: String,
      type: {
        type: String,
        default: 'text'
      },
      dateFormat: {
        type: String,
        default: 'DD.MM.YYYY'
      },
      dateType: {
        type: String,
        default: 'date'
      },
      valueType: {
        type: String,
        default: 'format'
      },
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
      },
      autocomplete: {
        type: String,
        default: 'off'
      },
      mask: {
        default: false
      },
      inputClass: String,
      blockClass: String,
      inputDate: Boolean,
      readonly: Boolean,
      hasInputs: Boolean,
      hasPopover: Boolean,
      disabledDate: {
        default: () => (() => {})
      },
      isPromotionsPage: Boolean,
    },
    components: {
      DatePicker
    },
    data() {
      return {
        prevValue: this.value,
        showPassword: false,
        timeout: -1,
        open:false,
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
      showDatepicker(show) {
        this.open = show;
       // document.body.classList[show ? 'add' : 'remove']('date-picker-open');
      }
    },
    beforeDestroy() {
      if (this.inputDate) {
        this.showDatepicker(false);
      }
    }
  }
</script>
