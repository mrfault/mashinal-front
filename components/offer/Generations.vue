<template>
  <div class="row mb-n2 mb-lg-n3">
    <template v-for="item in generations">
      <div class="col-6 col-lg-1-5 mb-2 mb-lg-3 " @click="selectGeneration(item.id)" :key="item.id">
        <a class="catalog-grid_item">
          <div class="card" :class="{selectedGeneration: selectedGenerations.includes(item.id) }">
            <div class="item-img">
              <img :src="getImage(item)" :alt="getTitle(item)" v-if="getImage(item)" />
              <img src="/img/car.svg" alt="" class="no-img" v-else/>
            </div>
            <h3 class="text-truncate" v-html="getTitle(item)"></h3>
          </div>
        </a>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "Generations",
  data(){
    return {
      selectedGenerations:[]
    }
  },
  watch:{
    selected() {
      if(this.selected.length === 1) {
        this.$set(this,'selectedGenerations',this.selected);
      }
    }
  },
  methods:{
    selectGeneration(id){
      if (!this.selectedGenerations.includes(id)){
        if (this.selectedGenerations.length==1){
          this.$toast.error('Yalnız 1 nəsil seçə bilərsiniz')
        }else{
          this.selectedGenerations.push(id)

        }

      }
      else{
        let index = this.selectedGenerations.findIndex((item)=> item ===id)
        this.selectedGenerations.splice(index,1)
      }
      this.$emit('change', this.selectedGenerations);

    },
    getTitle(item) {
      const { brand, model, generation } = {...this.$route.query};
      if (model) {
        if (generation)
          return item?.car_type.name[this.locale];
        else
          return `${this.$translateHard(item.short_name)}<br/>${item.start_year} — ${item.end_year || this.currentYear}`;
      } else {
        return (!brand ? (item.parent.name + ' ') : '') + this.$translateHard(item.name);
      }
    },
    getLink(item) {
      const { brand, model, generation } = {...this.$route.query};
      const { filter } = {...this.$route.query}
      let path = model
        ? (generation ? `/catalog/${brand}/${model}/${generation}/${item.car_type_id}` : `/catalog/${brand}/${model}/${item.id}`)
        : (`/catalog/${item.parent.slug}/${item.slug}`);
      return filter ? `${path}?filter=${filter}` : path;
    },
    getImage(item) {
      const { model, generation } = {...this.$route.query};
      if (!model) {
        return item?.transformed_media ? this.$withBaseUrl(item.thumb || item.transformed_media) : false;
      } else {
        let media = generation ? item?.transformed_media?.thumb : (item?.car_type_generation?.find(type => type.car_type_id === item.fav_car_type_id) || item.car_type_generation[0])?.transformed_media?.thumb;
        return media?.length ? this.$withBaseUrl(media[0]) : false;
      }
    },
  },
  props:{
    generations:{},
    selected: {
      default: []
    }
  }
}
</script>

<style scoped>

</style>
