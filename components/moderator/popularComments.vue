<template>
  <div id="components-global-popular_comments">
    <div class="popular-comments">
      <span v-for="(item, i) in comments" @click="sendComment(item.text[locale])" :key="i" class="single-popular-comment">{{item.text[locale]}}</span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    sendComment(e){
      this.$emit('getComment',e);
    }
  },
  created(){
    this.$store.dispatch('popularComments')
  },
  computed: {
    comments(){
      return this.$store.getters.getPopularComments;
    }
  }
}
</script>

<style lang="scss" >
#components-global-popular_comments{
  display: flex;
  flex-wrap: wrap;
  width: 50%;
  padding: 0 15px 10px 15px;
  .single-popular-comment{
    display: inline-flex;
    margin: 0 5px 5px 5px;
    padding: 0 10px;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    line-height: 1.5;
    color: #050b26;
    height: 30px;
    border-radius: 2px;
    border: solid 1px #e6e8f2;
    background-color: #fff;
    cursor: pointer;
    &:hover{
      border: solid 1px #4787c4;
      background-color: #f7fbff;
      color: #2e80cc;
    }
  }
}
</style>
