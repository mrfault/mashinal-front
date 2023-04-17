<template>
   <div class="brandsList">
      <div class="container">
<!--         <pre>{{brands.length}}</pre>-->

         <div class="brandsList__inner">
<!--            <ul class="brandsList__list" >-->
<!--               <li class="brandsList__list-item" v-for="item in brands">-->
<!--                  <a class="brandsList__list-link" href="#0">-->
<!--                     {{ item.name }}-->
<!--                  </a>-->
<!--               </li>-->
<!--            </ul>-->

            <ul class="brandsList__list" v-for="item in $chunk(brands, Math.ceil(brands.length / 8))">
               <li class="brandsList__list-item" v-for="(brand, i) in item.slice(0, 38)" @click="searchBrand(brand)">
<!--                  <a class="brandsList__list-link" href="#0">-->
                     {{ brand.name }} ({{ i + 1 }})
<!--                  </a>-->
               </li>
            </ul>
         </div>
      </div>
   </div>
</template>

<script>
   import { mapGetters } from "vuex";

   export default {
      methods: {
         async searchBrand(brand) {
            let qty = 1;
            let url = {
               "sorting": "created_at_desc",
               "additional_brands": {
                  "0":{ "brand": brand.id, "brand_slug": brand.slug },
                  "1":{},
                  "2":{},
                  "3":{},
                  "4":{}
               },
               // "exclude_additional_brands": {
               //    "0":{},
               //    "1":{},
               //    "2":{},
               //    "3":{},
               //    "4":{}
               // },
               // "all_options": {},
               "announce_type": 1,
               "currency":1
            }

            // first = 2;
            this.$router.push({
               path: 'masinlar',
               query: { car_filter: JSON.stringify(url) }
            }, () => {
               // if (this.loggedIn && this.meta.type === 'cars') {
               //    this.fetchSavedSearch({ car_filter: `masinlar?${JSON.stringify(url)}` });
               // }
               window.location.reload(true);
               // window.location.replace();
               // this.$router.go(-100)
               // this.$router.go(100)
               // if (!first) {
               //    console.log('aaaaaaaaaaaaaaaa')
               //    window.location.assign(`masinlar${window.location.search}`)
               // }
               // console.log('search', window.location.search);

               this.scrollTo('.cars-search-form', [0, 0], 1000)

               // console.log('window.location', window.location)
            })
         }
      },

      // created() {
      //    let urlParams = new URLSearchParams(window.location.search);
      //    console.log(urlParams.has('yourParam')); // true
      //    console.log(urlParams.get('yourParam')); // "MyParam"
      // },

      computed: {
         ...mapGetters({
            brands: 'brands'
         })
      },

      async fetch() {
         await this.$store.dispatch('getBrands');
      }
   }
</script>

<style lang="scss" scoped>
   .brandsList {
      margin-bottom: 20px;

      &__inner {
         display: flex;
         justify-content: space-between;
      }

      &__list {
         list-style-type: none;
         margin: 0;
         padding: 0;

         &-item {
            font-size: 14px;
            font-weight: 500;
            line-height: 30px;
            color: inherit;
            cursor: pointer;
         }
      }
   }
</style>