<template>
  <div :class="['form-buttons', `row ${rowClass}`, {'mb-n2 mb-lg-n3': isMultirow}]">
    <div class="col-12" v-if="label">
      <h4 class="label">{{ label }}</h4>
    </div>
    <div
      :class="['d-flex flex-column', `col${groupBy > 0 ? ('-' + ([1,2,3,4,6,12].includes(groupBy) ? 12 / groupBy : 'auto')) : ''}`, {'mb-2 mb-lg-3': isMultirow}, {'active': isActive(option)}]"
      v-for="(option, index) in formattedOptions" :key="index">
      <div class="form-group flex-grow-1 d-flex flex-column">
        <button type="button"
                :class="[`btn full-width btn--${btnClass}`, {'active': isActive(option), 'disabled':isDisabled(option), 'height-auto': heightAuto,'selectedGeneration':selectedValues.includes(option.key) }]"
                @click="selectValue(option.key)">
          <slot name="icon" :button="option"/>
          <slot name="custom" :button="option"/>
          <span>{{ option.name }}</span>
          <slot name="badge" :button="option"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    values: [],
    options: {},
    label: {
      type: String,
      default: ''
    },
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
    },
    heightAuto: Boolean
  },
  data() {
    return {
      prevValue: this.value,
      selectedValues:[]
    }
  },
  methods: {
    isActive(option) {
      return this.selectedValue === option.key;
    },
    isDisabled(option) {
      if (option.disabled) return true;
      return this.disabled;
    },
    selectValue(id){
      if (!this.selectedValues.includes(id)){
          this.selectedValues.push(id)
      }
      else{
        let index = this.selectedValues.findIndex((item)=> item ===id)
        this.selectedValues.splice(index,1)
      }
      this.$emit('change', this.selectedValues);
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

}
</script>
<style>
@media (min-width: 481px) and (max-width: 1024px) {
  .btn--primary-outline:hover{
    background: unset;
  }
}

</style>
