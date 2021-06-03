<template>
  <div class="collapse-content">
    <h3 @click="collapsed = !collapsed">
      <span>{{ title }}</span>
      <icon :name="`chevron-${collapsed ? 'down' : 'up'}`" class="cursor-pointer" />
    </h3>
    <transition-expand>
      <div v-if="!collapsed">
        <slot />
      </div>
    </transition-expand>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    firstCollapsed: Boolean
  },
  data() {
    return {
      collapsed: this.firstCollapsed
    }
  }
}
</script>