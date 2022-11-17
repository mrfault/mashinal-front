<template>
  <div>
    <div class="offer_items">
      <div class="offer_item" :class="selected_offer_item==index ? 'active' : null"
           v-for="(offer_item,index) in offer_items" @click="selectOfferItem(index)">
        <img :src="offer_item.generations[0].img" alt="">
        <div class="offer_item_detail pl-1">
          <div class="d-flex">
            <div class="offer_price" v-if="offer_item.minPrice">{{ offer_item.minPrice }} - </div>
            <div class="offer_price">{{ offer_item.maxPrice }} ₼</div>
          </div>

          <div class="offer_brand_model">{{ offer_item.brand }} {{ offer_item.model }}</div>
          <span>{{ offer_item.generations[0].end_year }}  </span>
        </div>
      </div>
    </div>
    <div>
      <div class="offerDetailContent">
        <div class="offerDetailItem">
          <p>Brand</p>
          <span>{{ offer_items[selected_offer_item].brand }}</span>
        </div>
        <div class="offerDetailItem">
          <p>Model </p>
          <span>{{ offer_items[selected_offer_item].model }} </span>
        </div>
        <div class="offerDetailItem">
          <p>Nəsil </p>
          <div>
            <div v-for=" (generation,index) in offer_items[selected_offer_item].generations"> {{ generation.name }}
              <div v-if="index != offer_items[selected_offer_item].generations.length - 1">,</div>
            </div>
          </div>
        </div>
        <div class="offerDetailItem">
          <p>Sürətlər qutusu </p>
          <div>
                <div v-for=" (gearbox,index) in offer_items[selected_offer_item].gear_boxes">
                               {{ $t('box_values')[gearbox.gear_box_key] }}

                  <div v-if="index != offer_items[selected_offer_item].gear_boxes.length - 1">,</div>
                </div>

          </div>
        </div>
        <div class="offerDetailItem">
          <p>Yanacaq növü </p>
          <div>
                <div v-for=" (fuel_type,index) in offer_items[selected_offer_item].fuel_types">

                  {{ $t('engine_values')[fuel_type.fuel_type_key] }} <div
                  v-if="index != offer_items[selected_offer_item].fuel_types.length - 1">,</div>

                </div>
          </div>
        </div>

        <div class="offerDetailItem">
          <p>Rəng </p>
          <div>
                <div v-for=" (color,index) in offer_items[selected_offer_item].colors">
                    <span class="color-box" :style="`background-color:${color.code}`"></span>
                </div>
          </div>
        </div>
        <div>
          <pre>
            {{offer_item}}
          </pre>
          <p>
            {{offer_items[selected_offer_item].comment}}
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "offerItems",
  props: {
    offer_items: [],
  },
  data() {
    return {
      selected_offer_item: 0,
    }
  },
  methods: {
    selectOfferItem(index) {
      this.selected_offer_item = index
    },
  },

}
</script>

<style scoped>

</style>
