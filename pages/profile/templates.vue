<template>
   <div class="pages-profile-templates">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>
      </div>
      <div class="templates_wrapper">
         <div class="container">
            <h1 class="title">{{ $t('my_searches') }}</h1>
            <div class="templates">
               <div class="template">
                  <div class="heading">
                     <h3>BMW 3-cü seriya</h3>
                     <div class="heading_wrapper">
                        <div class="heading_wrapper_icon" @click="openDropdown(1)">
                           <inline-svg :src="'/new-icons/dots-vertical-new.svg'"/>
                        </div>
                        <ul v-if="showDropdown === 1" class="template_dropdown">
                           <li v-for="menu in dropdownMenu" @click="openModal(menu)" :key="menu.id">
                              <inline-svg :src="menu.icon"/>
                              {{ menu.title }}
                           </li>
                        </ul>

                     </div>
                  </div>
                  <p>Bildirişlərdən imtina olunub</p>
               </div>
            </div>
            <div>
               <template v-for="(item, key) in getTemplateOptions(savedSearchList[0].search_filter)">
                  <div :key="key">{{ getTemplateKey(key) }} : {{ getTemplateValues(key, item) }}</div>
                  <br>
               </template>
            </div>
         </div>
      </div>
      <modal-popup
         :modal-class="'wider'"
         :toggle="showRules"
         :title="modalTitle"
         @close="showRules = false"
      >
         <div v-html="renderModal()"></div>
      </modal-popup>
   </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
   nuxtI18n: {
      paths: {
         az: '/profil/axtaris-sablonlari'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('my_searches')
      });
   },
   computed: {
      ...mapGetters(['savedSearchList', 'bodyOptions', 'popularOptions']),
      crumbs() {
         return [
            {name: this.$t('my_searches')}
         ]
      },

      getNotificationOptions() {
         return [
            {
               name: this.$t('do_not_receive_notifications'),
               selected_name: this.$t('do_not_receive_notifications_selected'),
               key: 0
            },
            {
               name: this.$t('receive_notifications_every_hour'),
               selected_name: this.$t('receive_notifications_every_hour_selected'),
               key: 60
            },
            {
               name: this.$t('receive_notifications_every_3_hours'),
               selected_name: this.$t('receive_notifications_every_3_hours_selected'),
               key: 180
            },
            {
               name: this.$t('receive_notifications_once_a_day'),
               selected_name: this.$t('receive_notifications_once_a_day_selected'),
               key: 1440
            },
            {
               name: this.$t('receive_notifications_once_a_weak'),
               selected_name: this.$t('receive_notifications_once_a_weak_selected'),
               key: 10080
            }
         ];
      }
   },
   data() {
      return {
         showDropdown: 0,
         showRules: false,
         modalTitle: "",
         modalType: "",
         dropdownMenu: [
            {
               id: 1,
               title: "Şablonun detalları",
               icon: "/new-icons/eye_v2.svg",
               key: "details"
            },
            {
               id: 2,
               title: "Bildirişlərə düzəliş",
               icon: "/new-icons/bell.svg",
               key: "edit"
            },
            {
               id: 3,
               title: "Şablonu sil",
               icon: "/new-icons/grid/trash_v2.svg",
               key: "delete"
            },
         ]
      }
   },
   async asyncData({store}) {
      await Promise.all([
         store.dispatch('getBodyOptions'),
         store.dispatch('getSavedSearch'),
         store.dispatch('getBrands'),
         store.dispatch('getPopularOptions'),
      ]);
   },
   methods: {
      openDropdown(id) {
         this.showDropdown = id;
      },
      openModal(menu) {
         this.modalTitle = menu.title
         this.modalType = menu.key;
         this.showRules = true
      },
      renderModal() {
         switch (this.modalType) {
            case 'details' :
               return `<h1>details</h1>`;
            case 'edit' :
               return `<h1>edit</h1>`;
            case 'delete' :
               return `<h1>delete</h1>`;

         }
      },
      getTemplateOptions(template) {
         return JSON.parse(template)
      },
      getTemplateKey(template) {
         return template;
      },
      getTemplateMultipleValues(values, options, fromStore = false) {
         if (fromStore) {
            return values.map(value => options.find(item => item.key === value.key).name).join(', ')
         }
         return values.map((value) => options[value.key]).join(', ')
      },
      getTemplateValues(key, values) {
         switch (key) {
            case 'exclude_additional_brands' :
               break;
            case 'all_options' :
               const parameters = values && Object.keys(values)
               return this.popularOptions.filter((opt) => parameters.includes(opt.name)).map((option) => this.$t(option.label)).join(", ");
            case 'announce_type' :
               break;
            case 'external_salon' :
               break;
            case 'currency' :
               break;
            case 'year_from' :
               return values;
            case 'year_to' :
               return values;
            case 'price_from' :
               return values;
            case 'price_to' :
               return values;
            case 'mileage_from' :
               return values;
            case 'mileage_to' :
               return values;
            case 'min_capacity' :
               return values;
            case 'max_capacity' :
               return values;
            case 'damage' :
               break;
            case 'customs' :
               break;
            case 'body' :
               return this.getTemplateMultipleValues(values, this.bodyOptions.main.default_options.body.values, true);
            case 'korobka' :
               return this.getTemplateMultipleValues(values, this.$t('box_values'))

            case 'engine_type' :
               return this.getTemplateMultipleValues(values, this.$t('engine_values'))

            case 'gearing' :
               break;
            case 'in_garanty' :
               break;
            case 'credit' :
               break;
         }
      }
   },
   mounted() {
      // console.log(this.$refs.dropdown)
   }
}
</script>

<style lang="scss" scoped>
.pages-profile-templates {

   .templates_wrapper {
      background-color: #fff;

      .title {
         font-size: 28px;
         font-weight: 700;
         padding: 32px 0;
      }

      .templates {
         display: grid;
         grid-template-columns: repeat(3, 1fr);
         gap: 20px;

         .template {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 24px;
            border: 1px solid #CDD5DF;
            border-radius: 12px;

            .heading {
               display: flex;
               align-items: center;
               justify-content: space-between;
               gap: 12px;
               color: #1B2434;
               font-size: 18px;
               font-weight: 600;

               &_wrapper {
                     position: relative;

                  &_icon {
                     display: flex;
                     align-items: center;
                     justify-content: center;
                     width: 32px;
                     height: 32px;
                     border-radius: 50%;
                     cursor: pointer;
                     transition: 0.2s;

                     &:hover {
                        background-color: #E3E8EF;
                     }

                  }

                  .template_dropdown {
                     position: absolute;
                     top: 100%;
                     left: 100%;
                     transform: translateX(-30px);
                     padding: 8px;
                     background-color: #fff;
                     border: 1px solid #CDD5DF;
                     border-radius: 8px;

                     li {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 12px 8px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 500;
                        white-space: nowrap;
                        cursor: pointer;
                        transition: 0.2s;

                        svg {
                           min-width: 20px;
                           min-height: 20px;
                        }

                        &:hover {
                           background-color: #E3E8EF;
                        }
                     }
                  }
               }
            }

            p {
               font-weight: 400;
               color: #364152;
            }
         }
      }
   }
}
</style>
