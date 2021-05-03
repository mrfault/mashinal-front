<template>
  <div class="action-bar d-lg-none">
    <div class="container">
      <div class="d-flex align-items-center justify-space-between">
        <icon name="chevron-left" @click.native.stop="$emit('back')" class="cursor-pointer" />
        <span>{{ title || $t('return_back') }}</span>
        <icon name="check" @click.native.stop="$emit('accept')" class="cursor-pointer" v-if="showCheck" />
        <icon name="check no-pointer-events opacity-0" v-else/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    showCheck: Boolean
  }
}
</script>