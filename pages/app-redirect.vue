<template>
<div></div>
</template>

<script>
export default {
  beforeMount() {
    const isIphone = this.$route.query.isIphone
    const isAndroid = this.$route.query.isAndroid
    const isIpad = this.$route.query.isIpad
    const location = this.$route.query.location
    if((isIphone === 'iPhone' || isAndroid === 'Android') && isIpad === 'null'){
      window.location = `ventures.al.mashinal://${location}`
    }
  },
  async mounted(){
    const isAndroid = this.$route.query.isAndroid
    const isIphone = this.$route.query.isIphone
    if(isAndroid || isIphone) {
      setTimeout(function(){
        if(isIphone === 'iPhone') {
          window.location.href = "https://apps.apple.com/app/id1588371190"
        } else if(isAndroid === 'Android'){
          window.location.href = "https://play.google.com/store/apps/details?id=ventures.al.mashinal"
        }
      },2500)
    }
  },
}
</script>

<style scoped>

</style>
