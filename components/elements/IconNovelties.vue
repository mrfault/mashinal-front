<template>
    <span class="iconNovelties">
        {{ locale === 'az' ? 'yeni' : 'новинка' }}
    </span>
</template>

<script>

</script>

<style lang="scss" scoped>
.iconNovelties {
   height: 18px;
   padding: 0 6px;
   font-weight: 500;
   font-size: 13px;
   line-height: 16px;
   color: #FFFFFF;
   border-radius: 2px;
   background-color: #F81734;
}
</style>
