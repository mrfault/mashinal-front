<template>
  <div :class="['row', iconsOnly ? '' : 'mb-n2 mb-lg-n3']">
    <div :class="['mb-2 mb-lg-3', iconsOnly ? 'col-2 col-lg-1' : 'col-6 col-lg-4']" v-for="(option, index) in options" :key="option.title">
      <div :class="['selectable-block',{'active': selected === option.title || selected === getKey(option), 'icons-only': iconsOnly}]" @click.stop="selected = { value: option.title, index, key: getKey(option) }">
        <div class="block-icon">
          <icon :name="option.icon"/>
        </div>
        <span class="block-info" v-if="!iconsOnly">
          {{ $t(option.title) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
    options: Array,
    iconsOnly: Boolean
  },
  computed: {
    selected: {
      get() {
        return this.value;
      },
      set(value) {
        let isSame = this.value === value.title || this.value === value.key;
        this.$emit('input', value);
        if (!isSame) this.$emit('change', value);
      }
    }
  },
  methods: {
    getKey(option) {
      return this.options.find(item => item.title === option.title).icon.split('-').pop();
    }
  }
}
</script>