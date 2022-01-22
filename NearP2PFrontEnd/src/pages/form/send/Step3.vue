<template>
  <div style="max-width: 500px; margin: 40px auto 0; text-align: center">
    <result :title="$t('success')" :is-success="true" style="padding-top: 25px" />
    <a-button type="primary" block :size="large" class="button-near-send"  @click="doOnceAgin">{{$t('doAgain')}}</a-button>
  </div>
</template>

<script>
import Result from '@/components/result/Result'
export default {
  name: 'Step3',
  i18n: require('./i18n'),
  components: {Result},
  methods: {
    doOnceAgin () {
      this.$emit('finish')
    }
  }
}
</script>

<style scoped>

</style>
