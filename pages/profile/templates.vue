<template>
   <div class="pages-profile-templates">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>
      </div>
      <div class="templates_wrapper">
         <div class="container">
            <h1 class="title">{{ $t('my_searches') }}</h1>
            <div class="templates">
               <div class="template" v-for="searchList in savedSearchList" :key="searchList.id"
                    @click="goToSearch(searchList)">
                  <div class="heading">
                     <h3>{{ getTemplateTitle(getTemplateOptions(searchList.search_filter)) }}</h3>
                     <div class="heading_wrapper">
                        <div class="heading_wrapper_icon"
                             @click.stop="openDropdown(showDropdown === 0 ? searchList.id : 0, searchList)">
                           <inline-svg :src="'/new-icons/dots-vertical-new.svg'"/>
                        </div>

                        <ul v-if="showDropdown === searchList.id && !isMobileBreakpoint" class="template_dropdown"
                        >
                           <li v-for="menu in dropdownMenu" @click.stop="openModal(menu)"
                               :key="menu.id">
                              <inline-svg :src="menu.icon"/>
                              {{ menu.title }}
                           </li>
                        </ul>
                     </div>
                  </div>
                  <p>{{
                        getNotificationOptions.find((option) => option.key === searchList.notification_interval).name
                     }}</p>
               </div>
            </div>
         </div>
      </div>
      <modal-popup
         :modal-class="'wider'"
         :toggle="showModal"
         :overflow-hidden="modalType !== 'edit'"
         :title="modalTitle"
         @close="showModal = false"
      >
         <details-modal v-if="modalType === 'details'" :data="details"/>

         <template-edit-modal v-if="modalType === 'edit'" :get-notification-options="getNotificationOptions"
                              :defaultInterval="interval"
                              @onSubmit="updateNotifications($event, showDropdown)" :pending="pending"/>

         <delete-modal v-if="modalType === 'delete'" @cancel='showModal = false'
                       @onSubmit="onDeleteTemplate(showDropdown)" :pending="pending"/>
         <p v-if="modalType === 'mobile_dropdown'" class="mobile_dropdown_list" v-for="menu in dropdownMenu"
            @click="openModal(menu)"
            :key="menu.id">
            <inline-svg :src="menu.icon"/>
            {{ menu.title }}
         </p>

      </modal-popup>
      <no-results :text="$t('no_templates')" v-if="savedSearchList.length === 0">
         <nuxt-link style="max-width: 250px;" class="active btn btn--pale-green-outline d-flex full-width mt-2"
                    :to="$localePath('/cars?saved=true')">
            <i aria-hidden="true" class="icon-arrow-left"></i>
            {{ $t('new_saved_search') }}
         </nuxt-link>
      </no-results>
   </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import DeleteModal from "~/components/templates/DeleteModal.vue";
import DetailsModal from "~/components/templates/DetailsModal.vue";
import TemplateEditModal from "~/components/templates/TemplateEditModal.vue";
import NoResults from "~/components/elements/NoResults.vue";

export default {
   components: {NoResults, TemplateEditModal, DetailsModal, DeleteModal},
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
      ...mapGetters(['savedSearchList', 'bodyOptions', 'popularOptions', 'brands', 'sellOptions', 'colors']),
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
         pending: false,
         interval: 0,
         details: [],
         showDropdown: 0,
         showModal: false,
         modalTitle: "",
         modalType: "",
         dropdownMenu: [
            {
               id: 1,
               title: this.$t('template_details'),
               icon: "/new-icons/eye_v2.svg",
               key: "details"
            },
            {
               id: 2,
               title: this.$t('edit_notifications'),
               icon: "/new-icons/bell.svg",
               key: "edit"
            },
            {
               id: 3,
               title: this.$t('delete_template'),
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
         store.dispatch('getOptions'),
         store.dispatch('getColors'),
      ]);
   },
   methods: {
      ...mapActions(['deleteSavedSearch', 'updateSavedSearchNotificationsInterval']),

      async updateNotifications(interval, id) {
         if (this.pending) return;
         this.pending = true;
         try {
            await this.updateSavedSearchNotificationsInterval({id: [id], type: interval});
            this.pending = false;
            this.showModal = false;
            this.this.$toasted.success(this.$t('saved_changes'));
         } catch (err) {
            this.pending = false;
         }
      },
      async onDeleteTemplate(id) {
         if (this.pending) return;
         this.pending = true;
         try {
            await this.deleteSavedSearch(id);
            this.pending = false;
            this.showModal = false;
            this.$toasted.success(this.$t('my_templates_removed'));
         } catch (err) {
            this.pending = false;
         }
      },
      goToSearch(search) {
         let filter = search.search_filter;
         let url = search.search_url
            .replace('/cars', this.$localePath('/cars'));
         if (url?.[0] !== '/')
            url = `${this.$localePath('/cars')}?car_filter=${encodeURI(filter)}`;
         this.$router.push(url);
      },
      openDropdown(id, menu) {
         const values = []
         for (const key in this.getTemplateOptions(menu.search_filter)) {
            this.getTemplateValues(key, this.getTemplateOptions(menu.search_filter)[key]) && values.push({
               key: this.getTemplateKey(key),
               value: this.getTemplateValues(key, this.getTemplateOptions(menu.search_filter)[key])
            })
         }
         this.details = values
         this.interval = menu.notification_interval
         this.showDropdown = id;
         if (this.isMobileBreakpoint) {
            this.modalTitle = this.$t("transactions")
            this.modalType = "mobile_dropdown"
            this.showModal = true
         }
      },
      openModal(menu) {
         this.modalTitle = menu.title
         this.modalType = menu.key;
         this.showModal = true
      },
      getTemplateTitle(data) {
         const brand = this.brands.find((brand) => brand.id === data.additional_brands[0].brand)?.name || ""
         const model = brand && (data.additional_brands[0]?.model_name?.replace("series", this.$t('series')).replace('class', this.$t('class')) || "")
         const generation = brand && (data.additional_brands[0].generation_name?.[this.locale].replace("– 0", `– ${new Date().getFullYear()}`) || "")
         return brand ? `${brand} ${model} ${generation}` : this.$t('all_car_brands')
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
            case 'all_options' :
               const parameters = values && Object.keys(values)
               return this.popularOptions.filter((opt) => parameters.includes(opt.name)).map((option) => this.$t(option.label)).join(", ");
            case 'announce_type' :
               break;
            case 'colors' :
               return this.colors.filter((color) => values.includes(color.id)).map((option) => option.name[this.locale]).join(", ");
            case 'region' :
               return this.sellOptions.regions.find((region) => region.key === values).name
            case 'currency' :
               return values === 1 ? 'AZN' : values === 2 ? "USD" : 'EUR'
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
               return values === 1 ? this.$t('without_beaten') : this.$t('broken')
            case 'customs' :
               return values === 1 ? this.$t('cleared') : this.$t('not_cleared')
            case 'body' :
               return this.getTemplateMultipleValues(values, this.bodyOptions.main.default_options.body.values, true);
            case 'korobka' :
               return this.getTemplateMultipleValues(values, this.$t('box_values'))

            case 'engine_type' :
               return this.getTemplateMultipleValues(values, this.$t('engine_values'))

            case 'gearing' :
               return this.getTemplateMultipleValues(values, this.$t('box_values'))
            case 'in_garanty' :
               return values ? this.$t('in_garanty') : null;
            case 'credit' :
               return values ? this.$t('credit') : null;
         }
      }
   },
   mounted() {
      window.addEventListener("click", (e) => {
         const dropdown = document.querySelector('.template_dropdown')
         const clickedInside = dropdown && (dropdown.contains(e.target) || e.target.classList[0] === 'heading_wrapper_icon');

         if (!clickedInside && !this.isMobileBreakpoint) {
            this.showDropdown = 0
         }
      })

      console.log(JSON.parse(this.savedSearchList[3].search_filter))
   },
}
</script>

<style lang="scss">
.pages-profile-templates {
   padding-bottom: 120px;

   .templates_wrapper {
      background-color: #fff;
      min-height: 500px;
      padding: 32px 0;

      .title {
         font-size: 28px;
         font-weight: 700;
         padding-bottom: 32px;
      }

      .templates {
         display: grid;
         grid-template-columns: repeat(3, 1fr);
         gap: 20px;

         .template {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 12px;
            padding: 24px;
            border: 1px solid #CDD5DF;
            border-radius: 12px;
            cursor: pointer;

            .heading {
               display: flex;
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

                     svg {
                        pointer-events: none;
                     }

                     &:hover {
                        background-color: #E3E8EF;
                     }

                  }

                  .template_dropdown {
                     position: absolute;
                     top: 46px;
                     left: 100%;
                     transform: translateX(-30px);
                     padding: 8px;
                     background-color: #fff;
                     border: 1px solid #CDD5DF;
                     border-radius: 8px;
                     z-index: 1;

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

.dark-mode {
   .pages-profile-templates {

      .templates_wrapper {
         background-color: #1B2434;

         .templates {

            .template {
               border-color: #121926;
               background-color: #121926;

               .heading {
                  color: #fff;

                  &_wrapper {

                     &_icon {
                        &:hover {
                           background-color: #1B2434;
                        }

                     }

                     .template_dropdown {
                        background-color: #1B2434;
                        border-color: #364152;

                        li {

                           &:hover {
                              background-color: #121926;
                           }
                        }
                     }
                  }
               }

               p {
                  color: #fff;
               }
            }
         }
      }
   }
}

@media (max-width: 1150px) {
   .pages-profile-templates {
      .templates_wrapper {

         .title {
            font-size: 16px;
            font-weight: 600;
         }

         .templates {
            display: flex;
            flex-direction: column;
            gap: 20px;

            .template {
               gap: 4px;

               .heading {

                  h3 {
                     font-size: 16px;
                     font-weight: 600;
                  }
               }
            }
         }
      }

   }
   .mobile_dropdown_list {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 500;
      padding: 10px 0;
   }
}
</style>
