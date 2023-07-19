<template>
   <div class="socials" @click.stop>
      <a
         v-for="(social, index) in socials[type]"
         :key="index"
         :href="getLink(social)"
         rel="noopener"
         target="_blank"
         :style="{ color: iconsColor }"
      >
<!--         <icon v-if="social !== 'tiktok'" :name="social" />-->
         <inline-svg :src="social" />
      </a>
   </div>
</template>

<script>
   export default {
      props: {
         path: String,
         type: String,
         iconsColor: String
      },

      data() {
         return {
            link: encodeURI(`https://mashin.al${this.path || this.$route.path}`),
            socials: {
               contact: [
                  '/icons/facebook.svg',
                  '/icons/instagram.svg',
                  '/icons/telegram.svg',
                  '/icons/tiktok.svg',
                  '/icons/youtube.svg'
               ],
               publish: ['facebook', 'whatsapp', 'telegram', 'twitter'],
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
            switch (social) {
               case '/icons/instagram.svg':
                  return 'https://instagram.com/mashin.al';
               case '/icons/facebook.svg':
                  return 'https://facebook.com/mashinal';
               case '/icons/telegram.svg':
                  return 'https://t.me/mashin_al';
               case '/icons/tiktok.svg':
                  return 'https://www.tiktok.com/@mashin.al?_t=8YADho8g5mU&_r=1';
               case '/icons/youtube.svg':
                  return 'https://www.youtube.com/@mashinalchannel';
            }
         },

         getPublishLink(social) {
            switch (social) {
               case 'facebook':
                  return 'https://facebook.com/sharer/sharer.php?u=' + this.link;
               case 'whatsapp':
                  return 'https://wa.me/?text=' + this.link;
               case 'telegram':
                  return 'https://t.me/share/url?url=' + this.link;
               case 'twitter':
                  return 'https://twitter.com/share?url=' + this.link;
            }
         }
      }
   }
</script>

<style lang="scss">
   .socials {
      display: flex;

      &.socials_footer {
         margin-top: 38px;

         a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid #697586;
            transition: all .3s;

            svg {
               width: 20px;
               height: 20px;
            }

            &:not(:first-child) {
               margin-left: 24px;
            }

            &:hover {
               border-color: #155EEF;

               //svg {
               //   path {
               //      fill: #155EEF;
               //   }
               //}
            }
         }
      }
   }

   //.page-footer {
   //   a:hover .tiktok {
   //      path {
   //         fill: #1C1C1E;
   //      }
   //   }
   //}
   //
   //.pages-contact-us {
   //   .tiktok {
   //      path {
   //         fill: #246EB2;
   //      }
   //   }
   //}
   //
   //.dark-mode {
   //   .pages-contact-us {
   //      .tiktok {
   //         path {
   //            fill: white;
   //         }
   //
   //         &:hover {
   //            path {
   //               fill: #F2EABD;
   //            }
   //         }
   //      }
   //   }
   //}
</style>
