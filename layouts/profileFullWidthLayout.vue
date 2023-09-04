<template>
   <page-layout>
      <template #nuxt>
         <div class="container-fluid max-container">
            <div class="row breadcrumbs_main" v-if="!isMobileBreakpoint">
               <div class="container">
                  <portal-target name="breadcrumbs"/>
               </div>
            </div>
            <div class="row">
               <div class="container">
                  <nuxt/>
               </div>
            </div>
         </div>
      </template>
   </page-layout>
</template>

<script>
import PageLayout from '~/components/layout/PageLayout';
import {MenusDataMixin} from "~/mixins/menus-data";
import {UserDataMixin} from "~/mixins/user-data";

export default {
   name: 'garage',
   middleware: ['main'],
   mixins: [MenusDataMixin, UserDataMixin],
   components: {
      PageLayout
   },
   mounted(){
      this.$axios.$get('/new-notifications-count')
   }
}
</script>

<style lang="scss">
.container-fluid{
   background-color: #fff!important;
   min-height: 900px;
}
.breadcrumbs_main{
   background-color: #EEF2F6;
}

.dark-mode{
   .breadcrumbs_main{
      background-color: #121926;
   }
   .max-container{
      background-color: #121926!important;
   }
   .ma-garage__nav--item__title{
      color: #9AA4B2!important;
   }
   .ma-garage__nav--profile__name{
      color: #fff!important;
      width: calc(100% - 40px);
   }
}


</style>
