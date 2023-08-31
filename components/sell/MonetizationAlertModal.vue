<template>
   <form class="monetization_alert" @submit.prevent="$emit('onSubmit')">
      <div class="image">
         <img src="/img/comment.png" alt="info">
      </div>
      <div class="content">

         <h3>Vacib məlumat</h3>
         <p>Nəzərinizə çatdırırıq ki, siz ödənişli elan seçimini etmisiniz və “irəli” düyməsinə basdıqda ödəniş
            səhifəsinə
            yönləndiriləcəksiniz</p>
      </div>
      <div class="buttons">
         <button type="button" class="btn full-width active" @click="$emit('close')">
            İmtina
         </button>
         <button
            :class="['btn', 'full-width', 'btn--blue-new', 'active', {pending}]">
            İrəli
         </button>
      </div>
   </form>
</template>

<script>
export default {
   props: {
      pending: {
         type: Boolean,
         default: false
      }
   }
}
</script>

<style lang="scss" scoped>
.monetization_alert {
   display: flex;
   flex-direction: column;
   align-items: center;

   .content {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 12px;
      margin-bottom: 32px;

      h2 {
         color: #121926;
         font-size: 24px;
         font-weight: 600;
      }

      p {
         color: #364152;
         font-size: 18px;
         font-weight: 400;
      }
   }

   .buttons {
      display: flex;
      width: 100%;
      gap: 12px;
   }
}

.dark-mode {
   .monetization_alert {
      .content {
         p {
            color: #fff;
         }
      }
   }
}
</style>
