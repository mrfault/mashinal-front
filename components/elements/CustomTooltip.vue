<template>
   <div class="customTooltip">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 1C5.9247 1 1 5.9247 1 12C1 18.0753 5.9247 23 12 23C18.0753 23 23 18.0753 23 12C23 5.9247 18.0753 1 12 1ZM12 6.5C12.6072 6.5 13.1 6.9928 13.1 7.6C13.1 8.2072 12.6072 8.7 12 8.7C11.3928 8.7 10.9 8.2072 10.9 7.6C10.9 6.9928 11.3928 6.5 12 6.5ZM10.9 9.8C11.0782 9.8 11.8614 9.8 12 9.8C12.6941 9.8 13.2023 10.4259 13.0659 11.1068L12.2409 15.3H13.1C13.7072 15.3 14.2 15.7928 14.2 16.4C14.2 17.0072 13.7072 17.5 13.1 17.5H12C10.6987 17.5 9.7857 16.3703 10.0409 15.0932L10.6932 11.9318C10.1949 11.8262 9.8 11.4302 9.8 10.9C9.8 10.2928 10.2928 9.8 10.9 9.8Z" fill="#CDD5DF"/>
      </svg>

      <div class="customTooltip__content">
         <slot name="content" />
      </div>
   </div>
</template>

<script>
   export default {

   }
</script>

<style lang="scss" scoped>
   .customTooltip {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;

      svg {
         cursor: pointer;

         &:hover {
            & + .customTooltip__content {
               opacity: 1;
               visibility: visible;
               transition: opacity .3s, visibility;

            }
         }
      }

      &__content {
         position: absolute;
         top: 50%;
         transform: translateY(-50%);
         margin-left: 40px;
         min-width: 200px;
         font-weight: 500;
         font-size: 14px;
         line-height: 16px;
         color: #FFFFFF;
         padding: 8px 12px;
         border-radius: 8px;
         background-color: #121926;

         opacity: 0;
         visibility: hidden;
         transition: opacity .3s, visibility .3s;

         &:before {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%) rotate(45deg);
            left: -6px;
            width: 12px;
            height: 12px;
            background-color: #121926;
         }
      }
   }
</style>