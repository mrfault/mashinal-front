<template>
  <div class="toggle_group">
    <label v-if="label">{{ label }}</label>
    <div class="toggle_container">
      <div
        :class="['toggle_item', { active: selected === item.id }]"
        v-for="item in items"
        :key="item.id"
        @click="setSelected(item.id)"
      >
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
.toggle_group {
  label {
    margin-bottom: 16px;
  }

  .toggle_container {
    display: flex;
    gap: 16px;

    .toggle_item {
      position: relative;
      flex: 1;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid #cdd5df;

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