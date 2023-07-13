<template>
   <page-layout>
      <template #nuxt>
         <div class="container-fluid">
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
   computed: {
   }
}
</script>

<style lang="scss">
.container-fluid{
   background-color: #fff!important;
   margin-bottom: -112px;
   min-height: 900px;
}
.breadcrumbs_main{
   background-color: #EEF2F6;
}
</style>
