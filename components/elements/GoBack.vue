<template>
  <div class="go-back d-lg-none">
    <div class="container">
      <div class="d-flex align-items-center justify-space-between">
        <icon name="chevron-left" @click="$emit('go')" class="cursor-pointer" />
        <span>{{ title || $t('return_back') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  }
}
</script>