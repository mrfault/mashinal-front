<template>
  <div class="card">
    <template v-if="comment">
      <h2 class="title-with-line full-width">
        <span>{{ $t('seller_comment') }}</span>
      </h2>
      <div class="comment">
        <p>{{ comment.trim() }}</p>
      </div>
    </template>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    comment: String
  }
}
</script>