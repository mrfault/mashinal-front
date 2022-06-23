<template>
<div v-if="layoutCondition" class="bn-wrapper"
     :style="data.background ? `background-image:url('${data.background}')`:''"
     :class="[
       {'bn-with-background': data.background },
       `bn-${type}`,
       { 'bn-sticky':absolute },
       {'bn-fixed': bnFixed && ['left','right'].includes(type) }
       ]"
>
  <span @click="go" class="cursor-pointer" :class="`bn-image-container-${type}`" style="width: 100%;"  >
    <img alt="" :src="data.image+'?v='+timestamp"/>
  </span>
</div>
</template>

<script>
import {mapState} from "vuex";

export default {
  props:{
    type:{},
    absolute:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data:{},
    }
  },
  beforeDestroy() {
    this.$nuxt.$off('route-changed');
  },
  async mounted() {
    await this.fetchBanner();
    this.$nuxt.$on('route-changed',() => {
      console.log(this.type); this.fetchBanner()
    })
  },
  computed: {
    ...mapState(['bnFixed','timestamp']),
    layoutCondition() {
      return this.data && ['left','right'].includes(this.type)  ? !this.isMobileBreakpoint : this.data
    }
  },
  methods:{
    async fetchBanner() {
      try {
        this.data = await this.$axios.$get(`/site-banners/${this.type}`);
      }catch (e) {}
    },
    go() {
      if(!this.data) return ;
      window.open(this.data.link, '_blank');
    }
  }
}
</script>

<style scoped lang="scss">
.bn-wrapper {
  width: calc((100% - 1250px) / 2);
  top: 0;
  z-index: 1;
}
.bn-with-background {
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100vh 100vh;
  background-position: top;
}
.bn-image-container-left {
  display: flex;
  justify-content: flex-end;
}
.bn-right {
  display: flex;
  justify-content: flex-end;
  right: 0;

}
.bn-left,.bn-right {
  img {
    max-width: 340px;
  }

}
.bn-top {
  width: 100%;
  img {
    width: 100%;
    max-height: 100px;
    object-fit: contain;
  }
}

.bn-top-margin {
  margin-top:20px;
}
.bn-sticky {
  position: absolute;
  top: -160px;
  overflow: hidden;
  height: 100vh;
}
.bn-fixed {
  position:fixed;
  top: 0;
}
.bn-left {
   left:0;
 }
</style>
