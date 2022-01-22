<template>
  <div>
    <a-card :title="$t('accountData')" class="card">
      <a-row type="flex">
        <a-col :xxl="4" :xl="4" :lg="4" />
        <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
          <a-form-item :label="$t('name')" style="margin-top:5px">
            <a-input
              :placeholder="$t('name')"
              style="width: 90%"
              @search="onSearch"
            />
          </a-form-item>
        </a-col>
        <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
          <a-form-item :label="$t('lastname')" style="margin-top:5px">
            <a-input
              :placeholder="$t('lastname')"
              style="width: 90%"
              @search="onSearch"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row type="flex">
        <a-col :xxl="4" :xl="4" :lg="4" />
        <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
          <a-form-item :label="$t('email')" style="margin-top:5px">
            <a-input
              :placeholder="$t('email')"
              style="width: 90%"
              @search="onSearch"
            />
          </a-form-item>
        </a-col>
        <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
          <a-form-item :label="$t('phone')" style="margin-top:5px">
            <a-input
              :placeholder="$t('phone')"
              style="width: 90%"
              @search="onSearch"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row type="flex">
        <a-col :xxl="4" :xl="4" :lg="4" />
        <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
          <a-form-item :label="$t('country')" style="margin-top:5px">
            <a-input
              :placeholder="$t('country')"
              style="width: 90%"
              @search="onSearch"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row type="flex">
        <a-col :xxl="4" :xl="4" :lg="4" />
        <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
          <a-button
            type="primary" 
            shape="round" 
            size="large"
            @click="saveData()"
          >
            {{ $t('save') }}
          </a-button>
        </a-col>
      </a-row>
    </a-card>
  </div> 
</template>

<script>
//import PageView from '@/layouts/PageView'

export default {
  name: "Account",
  components: {
    // PageView,
  },
  i18n: require("./i18n"),
};
</script>
<style lang="less">
@import "index";
</style>
