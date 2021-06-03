<template>
  <div class="socials" @click.stop>
    <a v-for="(social, index) in socials[type]" :key="index" :href="getLink(social)" rel="noopener" target="_blank">
      <icon :name="social" />
    </a>
  </div>
</template>

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
          contact: ['instagram', 'facebook'],
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