<template>
  <div class="row">
    <div v-for="input in options" :key="input.name"
         class="col-lg-4 mb-2 mb-lg-3">
      <form-radio
        v-model="value"
        :input-name="getKey(item)"
        :invalid="hasError(item)"
        :label="input.name[locale] || $t(input.name)"
        :radio-value="$notUndefined(input.id,input.key)"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      prevValue: this.value,
      errors:[],
    }
  },
  props:{
    value:{},
    options: Array,
    label: String,
    item: Object,
  },
  computed:{
    inputValue:{
      get(){
        return this.value;
      },
      set(value) {
        value = this.disabled ? this.value : value;
        this.$emit('input', value);
        // check if value was changed
        if (value !== this.prevValue) {
          this.$emit('change', value);
          this.prevValue = value;
        }
      }
    }
  },
  methods:{
    getKey(item) {
      return item.search_key || item.field;
    },
    hasError(item) {
      let field = this.getKey(item);
      return this.errors.includes(field);
    },
  }
}
</script>
