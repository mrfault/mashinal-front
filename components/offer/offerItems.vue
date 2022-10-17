<template>
  <div>
  <div class="offer_items">
    <div class="offer_item" :class="selected_offer_item==index ? 'active' : null"
         v-for="(offer_item,index) in offer_items" @click="selectOfferItem(index)">
      <!--                  <img :src="offer_item.generations[0].img" alt="">-->
      <img :src="'https://mashin.al/storage/3069082/1.jpeg'" alt="">
      <div class="offer_item_detail">
        <div class="offer_price">{{offer_item.maxPrice}} ₼</div>
        <div class="offer_brand_model">{{offer_item.brand}} {{offer_item.model}}</div>
        <span>
                          {{offer_item.generations[0].end_year}}
                        </span>
      </div>
    </div>
  </div>
  <div v-for="(offer_item,index) in offer_items" v-if="index==selected_offer_item">

    <div class="offerDetailContent">
      <div class="offerDetailItem">
        <p>Brand</p>
        <span>{{ offer_item.brand }}</span>
      </div>
      <div class="offerDetailItem">
        <p>Model </p>
        <span>
                  {{ offer_item.model }}
                </span>
      </div>

      <div class="offerDetailItem">
        <p>Nəsil </p>
        <div>
                  <span v-for=" (generation,index) in offer_item.generations">
                  {{ generation.name }}
                                      <div v-if="index != offer_item.generations.length - 1">,</div>
                </span>


        </div>

      </div>
      <div class="offerDetailItem">

        <p>Sürətlər qutusu </p>
        <div>
                <span v-for=" (gearbox,index) in offer_item.gear_boxes">
                               {{ $t('box_values')[gearbox.gear_box_key] }}

                  <div v-if="index != offer_item.gear_boxes.length - 1">,</div>
                </span>

        </div>
      </div>
      <div class="offerDetailItem">
        <p>Yanacaq növü </p>
        <div>
                <span v-for=" (fuel_type,index) in offer_item.fuel_types">

                  {{ $t('engine_values')[fuel_type.fuel_type_key] }} <div
                  v-if="index != offer_item.fuel_types.length - 1">,</div>

                </span>
        </div>
      </div>

      <div class="offerDetailItem">
        <p>Rəng </p>
        <div>
                <span v-for=" (color,index) in offer_item.colors">
                    <span class="color-box" :style="`background-color:${color.code}`"></span>


                </span>
        </div>
      </div>

    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: "offerItems",
  props:{
    offer_items:[],
  },
  data(){
    return{
      selected_offer_item:0,
    }
  },
  methods:{
    selectOfferItem(index){
      this.selected_offer_item=index
    },
  }
}
</script>

<style scoped>

</style>
