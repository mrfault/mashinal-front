<template>
  <h2 class="title-with-line full-width">
    <span>{{ $t(title) }}</span>
  </h2>
</template>

<script>
export default {
    props:{
        title:{
            type: String,
            default: 'Title'
        }
    }
}
</script>

<style></style>
