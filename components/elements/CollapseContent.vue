<template>
  <div class="collapse-content">
    <component :is="titleWithLine ? 'h2' : 'h3'" :class="{'title-with-line': titleWithLine}" @click="collapsed = !collapsed">
      <span>{{ title }}</span>
      <icon :name="`chevron-${collapsed ? 'down' : 'up'}`" class="cursor-pointer" />
    </component>
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
    firstCollapsed: Boolean,
    titleWithLine: Boolean
  },
  data() {
    return {
      collapsed: this.firstCollapsed
    }
  }
}
</script>