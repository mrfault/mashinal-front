<template>
  <div class="collapse-content" :class="{'offer-collapsed' : collapsed}">
    <div  :class="'title-with-line'" @click="collapse">
      <div class="d-flex align-items-center">
        <slot name="title"></slot>
        <div class="text-right ml-5 mr-5">
          <icon :name="`chevron-${collapsed ? 'down' : 'up'}`" class="cursor-pointer" />
        </div>

      </div>

    </div>
    <component :is="animate ? 'transition-expand' : 'div'">
      <div v-show="!collapsed">
        <hr v-if="titleWithHr"/>
        <slot />
      </div>
    </component>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    firstCollapsed: Boolean,
    titleWithLine: Boolean,
    titleWithHr: Boolean,
    animate: Boolean
  },
  data() {
    return {
      collapsed: this.firstCollapsed
    }
  },
  methods:{
    collapse(){
      this.collapsed=!this.collapsed
    },



  },
  beforeDestroy() {
    this.collapsed = false;
  },
  watch:{
    firstCollapsed(newVal,oldVal){
      this.collapsed=newVal
    }
  }
}
</script>
