<template>
   <div class="brandsList d-none d-md-block">
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
   export default {
      methods: {
         async searchBrand(brand) {
            let url = {
               "sorting": "created_at_desc",
               "additional_brands": {
                  "0":{ "brand": brand.id, "brand_slug": brand.slug },
                  "1":{},
                  "2":{},
                  "3":{},
                  "4":{}
               },
               "announce_type": 1,
               "currency":1
            }

            this.$router.push({
               path: 'masinlar',
               query: { car_filter: JSON.stringify(url) }
            }, () => {
               window.location.reload();
               this.scrollTo('.announcements-grid', [0, 0], 1000);
            })
         }
      },

      props: {
         options: {
            type: Array,
            default() { return [] }
         }
      }
   }
</script>

<style lang="scss" scoped>
   .brandsList {
      padding: 56px 0;
      background-color: #FFFFFF;

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
</style>
