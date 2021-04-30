<template>
  <i :class="'icon-'+name" aria-hidden="true"></i>
</template>

<script>
export default {
  props: {
    name: String
  }
}
</script>