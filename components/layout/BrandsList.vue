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
         searchBrand(brand) {
            const url = {
               "sorting": "created_at_desc",
               "additional_brands": {
                  "0":{ "brand": 129, "brand_slug": "bmw" },
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

            this.$router.push({
               path: 'masinlar',
               query: { car_filter: JSON.stringify(url) }
            })
         }
      },

      computed: {
         ...mapGetters({
            brands: 'comparison/brands'
         })
      },

      async fetch() {
         await this.$store.dispatch('comparison/getBrands');
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