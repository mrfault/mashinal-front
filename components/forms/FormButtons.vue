<template>
  <div class="row">
    <div :class="`col${groupBy > 0 ? ('-' + 12 / groupBy) : ''}`" v-for="(option, index) in formattedOptions" :key="index">
      <div class="form-group">
        <button type="button" :class="['btn', 'full-width', 'btn--pale-red-outline', {'active': isActive(option), 'disabled':isDisabled(option)}]"
                @click="selectedValue = option.key">
          {{ option.name }}
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
        if(option.disabled) return true;
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
          // check if value was changed
          if(value !== this.prevValue) {
            this.$emit('change', value);
            this.prevValue = value;
          }
        }
      }
    }
  }
</script>