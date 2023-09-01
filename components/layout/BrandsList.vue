<template>
   <div class="brandsList" :class="($nuxt.$route.path === '/ru' || $nuxt.$route.path === '/') ? 'd-md-block' : 'd-none d-md-block'">
      <div class="container">
         <div class="brandsList__inner">
            <ul class="brandsList__list" v-for="(item, i) in $chunk(options, Math.ceil(options.length / 6))" :key="i">
               <li class="brandsList__list-link" v-for="brand in item" @click="searchBrand(brand)">
                  {{ brand.name }} ({{ brand.announcements_count }})
               </li>
            </ul>
         </div>
      </div>
   </div>
</template>

<script>
   import { SearchMixin } from "~/mixins/search";
   import { mapActions } from "vuex";

   export default {
      mixins: [SearchMixin],

      data() {
        return {
           // watch: false
        }
      },

      methods: {
         ...mapActions(['getGridSearch']),

         async searchBrand(brand) {
            let url = {
               additional_brands: {
                  0: { brand: brand.id, brand_slug: brand.slug },
                  1: {},
                  2: {},
                  3: {},
                  4: {}
               },
               announce_type: 0,
               currency: 1,
               brandsList: true
            }

            await this.$router.push({
               path: '/cars',
               query: { car_filter: JSON.stringify(url) }
            });

            // let searchParams = { url: '/car', prefix: 'cars' }
            // let post = JSON.parse(this.$route.query?.car_filter || '{}');
            //
            // await this.getGridSearch({...searchParams, post});
            // await this.$store.dispatch('fetchMonetizedCarsSearch', post);
         }
      },

      watch: {
         '$route.query'() {
            let post = JSON.parse(this.$route.query?.car_filter || '{}');
            let page = this.$route.query?.page || 1;

            if (post?.brandsList) {
               this.$store.dispatch('getGridSearch', { url: '/car', prefix: 'cars', post, page });
               this.$store.dispatch('fetchMonetizedCarsSearch', post);
               this.scrollTo('.breadcrumbs', [20, -120]);
            }
        }
      },

      props: {
         options: {
            type: Array,
            default() { return [] }
         }
      },
      mounted() {

      }
   }
</script>

<style lang="scss" scoped>
   .brandsList {
      padding: 56px 0;
      background-color: #FFFFFF;
      border-top: 1px solid #eee;
      &__inner {
         display: flex;
         justify-content: space-between;
      }

      &__list {
         list-style-type: none;
         margin: 0;
         padding: 0;

         &-link {
            font-size: 14px;
            font-weight: 500;
            line-height: 30px;
            color: inherit;
            cursor: pointer;
            //transition: all .3s;

            &:hover {
               color: #F81734;
            }
         }
      }
   }

   .dark-mode {
      .brandsList {
         background-color: #1B2434;
         border-top: 1px solid #364152;
         &__list {
            &-link {
               color: #EEF2F6;

               &:hover {
                  color: #F81734;
               }
            }
         }
      }
   }

   @media (max-width: 960px) {
      .brandsList__inner {
         justify-content: unset;
         display: grid;
         gap: 30px 30px;
         grid-template-columns: auto auto auto;
      }
   }
</style>
