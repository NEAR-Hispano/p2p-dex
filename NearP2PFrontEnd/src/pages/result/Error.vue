<template>
    <a-card class="result-error" :bordered="false">
      <result style="margin-bottom: 16px; margin-top: 48px" :is-success="false" :title="title" :description="description">
        <template slot="action">
          <a-button type="primary" >Returns the modification</a-button>
        </template>
        <div>
          <div style="fontSize: 16px; fontWeight: 500; marginBottom: 16px">
            You submitted something with the following error:
          </div>
          <div style="margin-bottom: 16px">
            <a-icon class="error-icon" type="close-circle-o"/>
            Your account has been frozen
            <a style="margin-left: 16px">Thaw immediately <a-icon type="right" /></a>
          </div>
          <div>
            <a-icon class="error-icon" type="close-circle-o"/>
            Your account is not yet eligible to apply
            <a style="margin-left: 16px">Upgrade now <a-icon type="right" /></a>
          </div>
        </div>
      </result>
    </a-card>
</template>

<script>
import Result from '@/components/result/Result'
export default {
  name: 'Error',
  components: {Result},
  data () {
    return {
      title: 'The submission failed',
      description: 'Please check and modify the following information before resubmit.'
    }
  }
}
</script>

<style scoped lang="less">
.result-error{
  .error-icon{
    color: @red-6;
    margin-right: 8px
  }
}
</style>
