<template>
  <div class="head-info">
    <span>{{title}}</span>
    <p @click="handleClick">{{content}}</p>
  </div>
</template>

<script>
export default {
  name: 'HeadInfoOrders',
  props: ['title', 'content', 'bordered'],
  methods: {
    handleClick() {
      this.$router.push({
        name: 'p2pdetail'
      })
    },
  },
}
</script>

<style lang="less" scoped>
  .head-info{
    text-align: center;
    padding: 0 24px;
    flex-grow: 1;
    flex-shrink: 0;
    align-self: center;
    span{
      color: @text-color-second;
      display: inline-block;
      font-size: 14px;
      margin-bottom: 4px;
    }
    p{
      color: red;
      font-size: 24px;
      font-weight: bold;
      margin: 0;
      cursor: pointer
    }
  }
</style>
