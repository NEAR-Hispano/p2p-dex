<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/near-protocol-near-logo.png" />
        <span class="title">{{ systemName }}</span>
      </div>
      <div class="desc">{{ $t("title") }}</div>
    </div>
    <div class="login">
      <a-button
        :loading="logging"
        style="width: 100%;margin-top: 24px"
        size="large"
        htmlType="submit"
        type="primary"
        @click="onSubmit()"
        >{{ $t("login") }}</a-button
      >
      <div style="cursor: pointer;font-weight: bold;margin-top:20px">
          <a-dropdown class="lang header-item">
            <div>
              <a-icon type="global"/> {{langAlias}}
            </div>
            <a-menu @click="val => setLang(val.key)" :selected-keys="[lang]" slot="overlay">
              <a-menu-item v-for=" lang in langList" :key="lang.key">{{lang.key.toLowerCase() + ' ' + lang.name}}</a-menu-item>
            </a-menu>
          </a-dropdown>
      </div>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { mapState, mapMutations } from "vuex";
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";
const { connect, keyStores, WalletConnection } = nearAPI;

export default {
  name: "Login",
  components: { CommonLayout },
  i18n: require("./i18n"),
  
  data() {
    return {
      logging: false,
      error: "",
      langList: [
        {key: 'ES', name: 'Español Latinoaméricano', alias: 'Español'},
        {key: 'US', name: 'English', alias: 'English'}
      ],
      form: this.$form.createForm(this),
    };
  },
  computed: {
    ...mapState('setting', ['lang']),
    systemName() {
      return this.$store.state.setting.systemName;
    },
    langAlias() {
      let lang = this.langList.find(item => item.key == this.lang)
      return lang.alias
    },
  },
  methods: {
    ...mapMutations("setting", ["setLang"]),
    async onSubmit() {
      this.logging = true;
      // connect to NEAR
      //const CONTRACT_NAME = process.env.VUE_APP_CONTRACT_NAME;
      //const NOMBRE = process.env.VUE_APP_NAME;
      const near = await connect(CONFIG(new keyStores.BrowserLocalStorageKeyStore()));
      //const BASE_URL = process.env.VUE_APP_API_BASE_URL
      // create wallet connection
       const CONTRACT_NAME = process.env.VUE_APP_CONTRACT_NAME;
      const wallet = new WalletConnection(near);
      wallet.requestSignIn(
        CONTRACT_NAME, // contract requesting access
        "NEAR P2P", // optional
        "http://localhost:8080/#/redirect", // optional
        "http://localhost:8080/403" // optional
        //"https://nearp2p.com/#/redirect", // optional
        //"https://nearp2p.com/403" // optional,
        //"https://testnet.nearp2p.com/#/redirect", // optional
        //"https://testnet.nearp2p.com/403" // optional,
        //"https://app.nearp2p.com/#/redirect", // optional
        //"https://app.nearp2p.com/403" // optional,
      );
    },
  }
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
      a {
        text-decoration: none;
      }
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 33px;
        color: @title-color;
        font-family:"Lato", "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
