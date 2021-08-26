<template>
  <div :class="[`row ${rowClass}`, {'mb-n2 mb-lg-n3': isMultirow}]">
    <div :class="[`col${groupBy > 0 ? ('-' + ([1,2,3,4,6,12].includes(groupBy) ? 12 / groupBy : 'auto')) : ''}`, {'mb-2 mb-lg-3': isMultirow}, {'active': isActive(option)}]" v-for="(option, index) in formattedOptions" :key="index">
      <div class="form-group">
        <button type="button" :class="[`btn full-width btn--${btnClass}`, {'active': isActive(option), 'disabled':isDisabled(option)}]"
            @click="selectedValue = option.key">
          <slot name="icon" :button="option" />
          <slot name="custom" :button="option" />
          <span>{{ option.name }}</span>
          <slot name="badge" :button="option" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {},
      options: {},
      groupBy: {
        type: Number,
        default: 3
      },
      disabled: {
        type: Boolean,
        default: false
      },
      btnClass: {
        default: 'pale-red-outline'
      },
      rowClass: {
        default: ''
      }
    },
    data() {
      return {
        prevValue: this.value
      }
    },
    methods: {
      isActive(option) {
        return this.selectedValue === option.key;
      },
      isDisabled(option) {
        if (option.disabled) return true;
        return this.disabled;
      }
    },
    computed: {
      formattedOptions() {
        return this.options.map(option => {
          return {
            ...option,
            key: this.$notUndefined(option.id, option.key),
            name: this.$notUndefined(option.name[this.locale], option.name.ru, option.name)
          }
        })
      },
      selectedValue: {
        get() {
          return this.value;
        },
        set(value) {
          value = this.disabled ? this.value : value;
          this.$emit('input', value);
        }
      },
      isMultirow() {
        return this.formattedOptions.length > this.groupBy;
      }
    },
    watch: {
      value(value) {
        // check if value was changed
        if (value !== this.prevValue) {
          this.$emit('change', value);
          this.prevValue = value;
        }
      }
    }
  }
</script>