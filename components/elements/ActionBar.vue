<template>
  <div class="action-bar d-lg-none">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between">
        <icon name="chevron-left" @click.native.stop="back" class="cursor-pointer" />
        <!-- <inline-svg src="/icons/chevron-left.svg" :height="14"  @click.native.stop="$router.back()" class="cursor-pointer" /> -->
        <span>{{ title || $t('return_back') }}</span>
        <icon :name="actionIcon" @click.native.stop="$emit('action')" :class="['cursor-pointer', {'disabled':disableAction}]" v-if="actionIcon" />
        <icon name="check" @click.native.stop="$emit('accept')" class="cursor-pointer" v-else-if="showCheck" />
        <icon name="check no-pointer-events opacity-0" v-else/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    useBack: {
      default: true,
      type: Boolean
    },
    title: String,
    showCheck: Boolean,
    actionIcon: String,
    disableAction: Boolean
  },
  methods: {
    back() {
      if(this.useBack) this.$router.back();
      else this.$emit('back');
    }
  }
}
</script>
