<template>
  <div class="socials" @click.stop style="display: flex;">
    <a v-for="(social, index) in socials[type]" :key="index" :href="getLink(social)" rel="noopener" target="_blank" :style="social === 'tiktok' ? 'display: flex;' : ''">
      <icon v-if="social!='tiktok'" :name="social" />
      <inline-svg class="tiktok" src="/icons/tiktok.svg" v-else />
    </a>
  </div>
</template>
<style lang="scss">
.page-footer {
  a:hover .tiktok {
    path {
      fill: #1C1C1E;
    }
  }
}
.pages-contact-us {
  .tiktok {
    path {
      fill: #246EB2;
    }
  }
}
.dark-mode {
  .pages-contact-us {
    .tiktok {
      path {
        fill: white;
      }
      &:hover {
        path {
          fill: #F2EABD;
        }
      }
    }
  }
}

</style>
<script>
  export default {
    props: {
      path: String,
      type: String
    },
    data() {
      return {
        link: encodeURI(`https://mashin.al${this.path || this.$route.path}`),
        socials: {
          contact: ['facebook', 'instagram','telegram','tiktok'],
          publish: ['facebook', 'whatsapp','telegram', 'twitter'],
        }
      }
    },
    methods: {
      getLink(social) {
        if (this.type === 'contact')
          return this.getContactLink(social);
        else if (this.type === 'publish')
          return this.getPublishLink(social);
      },
      getContactLink(social) {
        switch(social) {
          case 'instagram': return 'https://instagram.com/mashin.al';
          case 'facebook': return 'https://facebook.com/mashinal';
          case 'telegram': return 'https://t.me/mashin_al';
          case 'tiktok': return 'https://www.tiktok.com/@mashin.al?_t=8YADho8g5mU&_r=1';
        }
      },
      getPublishLink(social) {
        switch(social) {
          case 'facebook': return 'https://facebook.com/sharer/sharer.php?u=' + this.link;
          case 'whatsapp': return 'https://wa.me/?text=' + this.link;
          case 'telegram': return 'https://t.me/share/url?url=' + this.link;
          case 'twitter': return 'https://twitter.com/share?url=' + this.link;
        }
      }
    }
  }
</script>
