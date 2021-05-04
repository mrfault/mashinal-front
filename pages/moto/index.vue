<template>
  <div></div>
</template>

<script>
export default {
  middleware({ app, redirect }) {
    redirect(app.$localePath('/moto/'+app.i18n.t('slug_motorcycles')));
  }
}
</script>