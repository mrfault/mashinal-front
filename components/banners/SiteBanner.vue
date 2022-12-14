<template>
<div v-if="layoutCondition && showBanner" class="bn-wrapper"
     :style="data.background ? `background-image:url('${data.background}')`:''"
     :class="[
       {'bn-with-background': data.background },
       `bn-${type}`,
       { 'bn-sticky':absolute },
       {'bn-fixed': bnFixed && ['left','right'].includes(type) }
       ]">

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
    checkEmitting:{},
    absolute:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data:{},
      showBanner: true,
    }
  },
  beforeDestroy() {
    this.$nuxt.$off('route-changed');
  },
  async mounted() {
    await this.fetchBanner();

    if(['left','right'].includes(this.type)) {
      this.$nuxt.$on('showMapEvent',(state) => {
        this.showBanner = !state;
      })
    }
  },
  beforeCreate() {
    this.$nuxt.$on('route-changed',() => {
      this.showBanner = true;
      this.fetchBanner()
    })
  },
  computed: {
    ...mapState(['bnFixed','timestamp']),
    layoutCondition() {
      return this.data.image && ['left','right'].includes(this.type)  ? !this.isMobileBreakpoint : this.data.image
    }
  },
  watch:{
    checkEmitting() {
      this.showBanner = true;
      this.fetchBanner()
    }
  },
  methods:{
    async fetchBanner() {
      try {
        this.data = await this.$axios.$get(`/site-banners/${this.type}`);
      }catch (e) {
        this.data = {};
      }

      if(this.data.image) {
        this.$emit('bannerLoaded',true);
      }
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
  top: 0;
  z-index: 1;
}
.bn-with-background {
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: top;
}
.bn-image-container-left {
  display: flex;
  justify-content: flex-end;
}
.bn-in-announcement {
  max-width: 346px;
}
.bn-in-part-spare {
  margin-left: -10px;
  margin-right: -10px;
  img {
    width: 100%;
  }
}
.bn-right {
  display: flex;
  justify-content: flex-end;
  right: 0;

}
.bn-left,.bn-right {
  width: calc((100% - 1250px) / 2);
  img {
    max-width: 340px;
  }

}
.bn-in-part {
  img {
    width: 100%;
    //max-width: 225px;
  }
}
.bn-in-catalog {
  margin-bottom: 20px;
  img {
    max-width: 1200px;
  }
}
.bn-top {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  background-size: 100% 100%;
  width: 100%;
  padding: 0 5px;
  img {
    width: 100%;
    max-height: 100px;
    min-height: 100px;
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
  height: calc(100vh + 110px);
}
.bn-fixed {
  position:fixed;
  top: 0;
}
.bn-left {
   left:0;
 }
.bn-in-announcement-list {
 img {
   width: 590px;
 }
}
</style>
