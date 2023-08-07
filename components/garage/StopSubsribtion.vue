<template>
   <div class="protocol-payment-button">
      <button
         :class="[
                   'btn',
                   'full-width',
                   'btn--white',
                   'btn-dark-text',
                         { 'pointer-events-none': pending },
                 ]"
         type="button"
         @click="showModal = true"
      >
         {{ $t('stop_subsciption') }}
      </button>
      <modal-popup
         :modal-class="!isMobileBreakpoint ? 'midsize': 'larger'"
         :title="$t('stop_subsciption')"
         :toggle="showModal"
         @close="showModal = false">
         <div class="remove-vehicle-modal">
            <p>{{ $t('stop_subscription_desc1') }}</p>
            <p class="remove-vehicle-modal__text-with-info">
               <inline-svg src="/icons/info-1.svg"/>
               {{ $t('remove_vehicle_desc2') }}
            </p>
            <div class="protocol-payment-modal__actions">
               <button
                  :class="{ 'pointer-events-none': pending }"
                  class="btn btn--white btn-dark-text"
                  type="button"
                  @click="showModal = false"
               >
                  {{ $t('reject') }}
               </button>
               <button
                  :class="{ 'pointer-events-none': pending }"
                  class="btn btn--white btn-dark-text"
                  type="button"
                  @click="removeVehicle"
               >
                  {{ $t('stop_subsciption') }}
               </button>
            </div>

         </div>
      </modal-popup>
   </div>
</template>

<script>
import RadioGroup from "~/components/moderator/RadioGroup";
import CustomRadio from "~/components/elements/CustomRadio";
import {mapActions} from "vuex";

export default {
   props: {
      title: {
         type: String,
         default: 'make_payment'
      },
      fullWidth: Boolean,
      vehicle: Object,
   },
   components: {CustomRadio, RadioGroup},
   data() {
      return {
         showModal: false,
         paymentOptions: [
            {
               label: 'pay_with_card',
               id: 0,
            },
            {
               label: 'balans',
               id: 1,
            },
         ],
         pay_with_card: false,
         balance: false,
         index: 1,
         selectedCard: null,
         cardOptions: [
            {
               name: 'payment_with_other_card',
               value: null,
            },
            {
               name: 'Pasha Bank card',
               value: '1234 5678 7897 3454'
            }
         ],
         pending: false,
      }
   },
   methods: {
      ...mapActions({
         deactivate: 'garage/deactivateCar'
      }),
      async removeVehicle() {
         if (this.pending) return;
         this.pending = true;
         console.log("removeVehicle")
         try {
            console.log("removeVehicle try")
            await this.deactivate({ id: this.vehicle.id });
            console.log("removeVehicle response")
            this.$toasted.success(this.$t('car_deactivated'));
            this.pending = false;
            this.showModal = false;
            this.scrollReset();
            this.$emit("carDeactivated", true)
         } catch (err) {
            console.log("removeVehicle catch")
            this.pending = false;
         }
      }
   }
}
</script>


<style lang="scss">
.remove-vehicle-modal {
   p {
      width: 100%;
      font: 400 18px/22px 'TTHoves';
      color: #364152;
      margin-bottom: 25px;
   }

   &__text-with-info {
      display: flex;
      align-items: center;

      svg {
         margin-bottom: 5px;
         margin-right: 11px;
      }
   }
}
</style>

