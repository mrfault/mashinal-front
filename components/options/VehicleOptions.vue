<template>
  <div class="row mb-n2 mb-lg-n3">
    <div class="col-6 col-lg-4 mb-2 mb-lg-3" v-for="(option, index) in options" :key="option.title">
      <div :class="['selectable-block',{'active': selected === option.title}]" @click.stop="selected = { value: option.title, index }">
        <div class="block-icon">
          <icon :name="option.icon"/>
        </div>
        <span class="block-info">
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
    options: Array
  },
  computed: {
    selected: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  }
}
</script>