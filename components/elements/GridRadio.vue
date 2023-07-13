<template>
  <div class="grid_radio">
    <label v-if="label">{{ label }}</label>
    <div class="grid_container">
      <div
        :class="['grid_item', { active: selected === item.id }]"
        v-for="item in items"
        :key="item.id"
        @click="setSelected(item.id)"
      >
        <inline-svg
          :src="'/icons/filled_circled_check.svg'"
          class="check_icon"
          v-if="selected === item.id"
        />
        <slot :item="item" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
    },
    items: Array,
  },
  data() {
    return {
      selected: 0,
    };
  },
  methods: {
    setSelected(id) {
      this.selected = id;
      this.$emit("onChange", id);
    },
  },
};
</script>

<style scoped lang="scss">
.grid_radio {
  padding: 16px;
  border: 1px solid #cdd5df;
  border-radius: 8px;

  label {
    margin-bottom: 16px;
  }

  .grid_container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    .grid_item {
      position: relative;
      background-color: #eff4ff;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid transparent;

      &.active {
        border-color: #155eef;
      }

      .check_icon {
        position: absolute;
        top: 16px;
        left: 16px;
        width: 16px;
        height: 16px;
        color: #155eef;
        z-index: 10;
      }
    }
  }
}
</style>