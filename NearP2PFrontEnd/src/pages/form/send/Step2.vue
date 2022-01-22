<template>
  <div>
    <a-row type="flex">
      <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <a-form style="max-width: 500px; margin: 40px auto 0;">
          <a-alert
            :closable="true"
            :message="$t('note')"
            style="margin-bottom: 24px;"
          />
          <a-form-item
            :label="$t('transferAmount')"
            :labelCol="{ span: 24 }"
            :wrapperCol="{ span: 24 }"
            class="stepFormText balance-send"
          >
            29
          </a-form-item>
          <a-form-item>
            <a-button
              :loading="loading"
              block
              :size="large"
              class="button-near-send"
              type="primary"
              @click="nextStep"
              >{{ $t("submit") }}</a-button
            >
            <a-button block :size="large" class="button-near-back" @click="prevStep">{{
              $t("preStep")
            }}</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "Step2",
  i18n: require("./i18n"),
  data() {
    return {
      loading: false
    };
  },
  methods: {
    nextStep() {
      let _this = this;
      _this.loading = true;
      setTimeout(function() {
        _this.$emit("nextStep");
      }, 1500);
    },
    prevStep() {
      this.$emit("prevStep");
    }
  }
};
</script>

<style lang="less" scoped>
.stepFormText {
  margin-bottom: 24px;
  :global {
    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }
}
</style>
