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
      <h1 style="font-size: 44px; align: center">{{ $t("redirect") }}</h1>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { avatars } from "@/services/user";
import { setAuthorization } from "@/utils/request";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Login",
  components: { CommonLayout },
  i18n: require("./i18n"),
  
  data() {
    return {
      error: "",
      avatar: avatars[Math.floor((Math.random() * 10))],
      form: this.$form.createForm(this),
      wallet: [],
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
  mounted () {
    //console.log(localStorage.getItem(process.env.VUE_APP_NEAR_KEY))
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    //console.log(urlParams.get('public_key'));
    //console.log(urlParams.get('account_id'));
    if (urlParams.get('all_keys') !== null) {
      //console.log('aqui')
      var selFiles = urlParams;
      //selFiles = JSON.parse(urlParams);
      //console.log(selFiles)
      this.afterLogin(selFiles)
    }
  },
  methods: {
    ...mapMutations("account", ["setUser", "setUserInfo", "setUserAvatar"]),
    ...mapMutations("setting", ["setLang"]),
    afterLogin(res) {
      var today = new Date();
      const loginRes = res;
      // var selFiles = JSON.parse(selFiles);
      this.setUserInfo(loginRes.get('account_id'))
      this.setUser(loginRes.get('account_id'))
      this.setUserAvatar(this.avatar)
      setAuthorization({token: loginRes.get('all_keys'), expireAt: new Date(today.setHours(today.getHours() + 24))})
      this.$router.push("/dashboard/wallet");
      this.$message.success(this.$t("welcome") + ' ' + loginRes.get('account_id'), 5);
    }
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
    text-align: center;
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
