<template>
   <div class="infiniteLoadingData" v-if="isLoading">
      <loader />
   </div>
</template>

<script>
   export default {
      data() {
         return {
            page: 2,
            isLoading: false
         };
      },

      methods: {
         async loadMoreData() {
            if (!this.isLoading) {
               this.isLoading = true;
               try {
                  await this.$store.dispatch(this.action, { page: this.page });
                  this.page++;
               } finally {
                  this.isLoading = false;
               }
            }
         },

         handleScroll() {
            const bottomOfWindow = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 500;

            if (bottomOfWindow) {
               this.loadMoreData();
               // this.$emit('handleScroll', this.page);
            }
         },
      },

      props: {
         action: {
            type: String,
            required: true,
            default: ''
         },
      },

      mounted() {
         window.addEventListener('scroll', this.handleScroll);
      },

      beforeDestroy() {
         window.removeEventListener('scroll', this.handleScroll);
      }
   };
</script>

<style lang="scss">
   .infiniteLoadingData {
      position: relative;
      height: 100px;

      .loader {
         top: 0;
         transform: translateX(-50%);
      }
   }
</style>