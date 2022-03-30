<template>
  <div>
    <a-drawer
      width="auto"
      placement="right"
      :bodyStyle="{ maxWidth: '750px' }"
      :closable="true"
      :visible="visible"
      @close="onClose"
    >
      <p :style="[pStyle, pStyle2]">
        {{ $t("profileinfo") }}
      </p>
      <a-row :gutter="30">
        <a-col :xxl="12" :xl="12" :lg="12" :md="12" :sm="12" :xs="12">
          <p style="font-weight:bold">{{ $t('accountData') }}:</p>
        </a-col>
        <a-col :xxl="12" :xl="12" :lg="12" :md="12" :sm="12" :xs="12">
          <p>
          {{ user_id }}
          </p>
        </a-col>
      </a-row>
      <a-row :gutter="30">
        <a-col :span="12">
          <p style="font-weight:bold">{{ $t('name') }}:</p>
        </a-col>
        <a-col :span="12">
          <p>
          {{ name }}
          </p>
        </a-col>
      </a-row>
      <a-row :gutter="30">
        <a-col :span="12">
          <p style="font-weight:bold">{{ $t('lastname') }}:</p>
        </a-col>
        <a-col :span="12">
          <p>
          {{ last_name }}
          </p>
        </a-col>
      </a-row>
      <a-row :gutter="30">
        <a-col :span="12">
          <p style="font-weight:bold;" class="image-responsive-lg image-responsive-md image-responsive-sm">{{ $t('email') }}:</p>
        </a-col>
        <a-col :span="12">
          <p>
          {{ email }}
          </p>
        </a-col>
      </a-row>
      <a-divider />
      <p :style="pStyle">
        {{ $t("profilesettings") }}
      </p>
      <a-row :gutter="30">
        <a-col :span="12">
          <p style="font-weight:bold">{{ $t('typeuser') }}:</p>
        </a-col>
        <a-col :span="12">
          <p>
          {{ admin }}
          </p>
        </a-col>
      </a-row>
      <a-row :gutter="30">
        <a-col :span="12">
          <p style="font-weight:bold">{{ $t('typeactive') }}:</p>
        </a-col>
        <a-col :span="12">
          <p>
          {{ is_active }}
          </p>
        </a-col>
      </a-row>
    </a-drawer>
  </div>
</template>
<script>
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";
import { mapGetters } from "vuex";

export default {
  i18n: require("./i18n"),
  computed: {
    ...mapGetters("account", ["userInfo"])
  },
  data() {
    return {
      visible: false,
      data: [],
      user_id: "",
      name: "",
      last_name: "",
      email: "",
      mediator: "",
      admin: "",
      is_active: "",
      pStyle: {
        fontSize: "16px",
        color: "rgba(0,0,0,0.85)",
        lineHeight: "24px",
        display: "block",
        marginBottom: "16px"
      },
      pStyle2: {
        marginBottom: "24px"
      }
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    async fetch() {
      this.loading = true;
      const { connect, keyStores, WalletConnection, Contract } = nearAPI;
      // connect to NEAR
      const CONTRACT_NAME = process.env.VUE_APP_CONTRACT_NAME;
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      // create wallet connection
      // const account = await near.account();
      const wallet = new WalletConnection(near);
      // console.log(near);
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ["get_user"],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        this.data = await contract.get_user({
          user_id: this.userInfo
        });
      }
      this.user_id = this.data[0].user_id;
      this.name = this.data[0].name;
      this.last_name = this.data[0].last_name;
      this.email = this.data[0].email;
      this.mediator = this.data[0].mediator;
      this.admin = this.data[0].admin;
      this.is_active = this.data[0].is_active;
    }
  }
};
</script>
<style lang="less">
@import "index";
</style>