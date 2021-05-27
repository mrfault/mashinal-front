<template>
  <div class="card pt-0 pt-lg-3">
    <slot name="before" />
    <template v-if="comment">
      <h2 class="title-with-line full-width">
        <span>{{ $t('seller_comment') }}</span>
      </h2>
      <div class="comment">
        <p>{{ comment.trim() }}</p>
      </div>
    </template>
    <slot name="after" />
  </div>
</template>

<script>
export default {
  props: {
    comment: String
  }
}
</script>