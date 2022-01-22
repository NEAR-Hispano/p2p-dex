<template>
  <div>
    <a-row type="flex">
      <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <a-form style="max-width: 500px; margin: 40px auto 0;">
          <a-form-item>
            <div class="amount-input-wrapper">
              <a-input
                class="input"
                style="font-size: 70px;"
                v-decorator="[
                  'amount',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
                placeholder="0"
              />
            </div>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              block
              :size="large"
              @click="nextStep"
              class="button-near-send"
              >{{ $t("nextStep") }}</a-button
            >
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "Step1",
  i18n: require("./i18n"),
  methods: {
    nextStep() {
      this.$emit("nextStep");
    }
  }
};
</script>

<style scoped></style>
