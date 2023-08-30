<template>
   <div class="pages-sell">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>
         <div class="announce_container">
            <div class="card">
               <form class="add_announce_form">
                  <part_form isEdit :announcement="announcement" :isReady="isReady" :preview="partPreview"
                             @getForm="getPartForm($event)"/>
                  <button type="button" @click="onClick()" class="btn full-width btn--pale-green-outline active">
                     {{ $t("place_announcement") }}
                  </button>
               </form>
               <div :class="['vehicle_card_info', {default_imgs: partPreview.image.startsWith('/img/')}]"
                    v-if="!isMobileBreakpoint">
                  <client-only>
                     <grid-item :announcement="partPreview"/>
                  </client-only>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

import SellProgress from '~/components/sell/SellProgress';
import SellPreview from '~/components/sell/SellPreview';
import SellPartsForm from '~/components/sell/SellPartsForm';
import Part_form from "~/components/sell/part_form.vue";
import GridItem from "~/components/announcements/GridItem.vue";

export default {
   name: 'pages-parts-announcement-edit',
   middleware: 'auth_general',
   nuxtI18n: {
      paths: {
         az: '/ehtiyat-hisseleri/elan/:id/redakte'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('your_announcements')
      });
   },
   data() {
      return {
         partPreview: {
            title: this.$t('headline'),
            description: this.$t('additional_info'),
            image: "",
            price: "0 AZN",
            created_at: "",
         },
         isReady: false
      }
   },
   async asyncData({store, route}) {
      store.dispatch('setSellPreviewData', {value: {}});
      await Promise.all([
         store.dispatch('getMyAnnouncement', route.params.id),
         store.dispatch('getPartCategories'),
      ]);
   },
   components: {
      GridItem,
      Part_form,
      SellProgress,
      SellPreview,
      SellPartsForm
   },
   computed: {
      ...mapGetters({
         announcement: 'myAnnouncement',
         form: 'parts/form'
      }),
      crumbs() {
         return [
            {name: this.$t('my_announces'), route: `/profile/announcements`},
            {name: `#${this.$route.params.id}`, route: `/parts/announcement/${this.$route.params.id}`},
            {name: this.$t('edit_ad')}
         ]
      }
   },
   methods: {
      ...mapActions(['partEdit']),
      getMainImage(img) {
         this.partPreview.image = img || this.onChangePartType(this.announcement.category_id)
      },
      async getPartForm({form, deletedImages}) {
         const formData = new FormData()
         formData.append('data', JSON.stringify(form))
         formData.append('deletedImages', JSON.stringify(deletedImages))
         try {
            await this.partEdit({id: this.$route.params.id.slice(0, -1), form: formData})
            this.$router.push(this.$localePath('/profile/announcements'))
         } catch (e) {
         }
      },
      onClick() {
         this.isReady = !this.isReady
      },
      onChangePartType(id) {
         switch (id) {
            case 19:
               return this.partPreview.image = "/img/tyre.svg"
            case 20:
               return this.partPreview.image = "/img/disc.svg"
            case 21:
               return this.partPreview.image = "/img/oil.svg"
            case 27:
               return this.partPreview.image = "/img/battery.svg"
            default:
               return this.partPreview.image = "/img/parts.svg"
         }
      },
      getCurrencyName() {
         switch (this.announcement.currency_id) {
            case 1:
               return 'AZN';
            case 2:
               return 'USD';
            case 3:
               return 'EUR';
            default:
               return 'AZN'
         }
      },
   },
   mounted() {
      this.$nuxt.$on("get-main-image", this.getMainImage)

      this.partPreview = {
         title: this.announcement.title,
         description: this.announcement.description,
         image: this.announcement.defaultImages[0],
         price: this.announcement.price + ' ' + this.getCurrencyName(),
         created_at: this.$formatDate(this.announcement.created_at, 'D.MM.YYYY')[this.locale]
      }

   }
}
</script>

<style lang="scss">
.pages-sell {
   padding: 40px 0 160px 0;

   .announce_container {
      display: flex;
      column-gap: 16px;

      .card {
         flex-grow: 3;
         display: flex;
         gap: 20px;

         .add_announce_form {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            gap: 20px;
         }
      }
   }

   .vehicle_card_info {
      position: sticky;
      top: 128px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: min-content;
      width: 260px;
      min-width: 260px;

      &_description {
         background-color: #EEF2F6;
         border-radius: 8px;
         padding: 10px;
         text-align: center;
      }

      &_help {
         display: flex;
         padding: 16px 12px;
         flex-direction: column;
         gap: 16px;
         border-radius: 12px;
         border: 1px solid #CDD5DF;
         background-color: #F8FAFC;

         &_inner {
            display: flex;
            align-items: center;
            gap: 10px;

            svg {
               min-width: 24px;
               min-height: 24px;
            }
         }
      }

      &.default_imgs {

         .item-bg {
            background-repeat: no-repeat;
            background-size: inherit;
         }
      }
   }
}
</style>
