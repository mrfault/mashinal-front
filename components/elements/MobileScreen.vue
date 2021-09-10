<template>
  <portal to="mobile-screen">
    <action-bar :title="barTitle" @back="$emit('back')" @action="$emit('action')" :action-icon="actionIcon" :disable-action="disableAction" />
    <div class="mobile-screen">
      <div :class="{'container': !hideContainer, 'has-min-height': !heightAuto}" :style="{height: hideContainer ? '100%' : 'auto'}">
        <slot />
      </div>
    </div>
  </portal>
</template>

<script>
export default {
  props: {
    barTitle: String,
    hideContainer: Boolean,
    heightAuto: Boolean,
    actionIcon: String,
    disableAction: Boolean
  },
  mounted() {
    this.setBodyOverflow('hidden', 'mobile-screen-open');
  },
  beforeDestroy() {
    this.setBodyOverflow('scroll', 'mobile-screen-open');
  }
}
</script>