<template>
  <page-layout :col="12">
    <div slot="headerContent">
      <div class="subtitle">
        <h3>{{ $t("pageDesc") }}</h3>
      </div>
    </div>
    <template slot="extra">
      <head-info-orders
        class="split-right"
        style="color: red !important"
        :title="$t('project')"
        :content="active_orders"
      />
      <head-info class="split-right" :title="$t('ranking')" content="90%" />
    </template>
    <div>
      <a-card :title="$t('accountData')" class="card">
        <a-form :form="form" @submit="handleSubmit">
          <a-row type="flex">
            <a-col :xxl="4" :xl="4" :lg="4" />
            <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
              <a-form-item :label="$t('description')" style="margin-top:5px">
                <a-select
                  show-search
                  :placeholder="allpayments"
                  option-filter-prop="children"
                  style="width: 90%;margin-top: 5px"
                  v-decorator="[
                      'payment_method_id',
                      {
                        rules: [
                          { required: true, message: $t('requiredfield') }
                        ]
                      }
                    ]"
                >
                  <a-select-option
                    v-for="i in listPayments"
                    :key="i.id"
                    :value="i.id"
                  >
                    {{ i.payment_method }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
              <a-form-item :label="$t('info1')" style="margin-top:5px">
                <a-input
                  v-decorator="[
                    'input1',
                    {
                      rules: [{ required: true, message: $t('requiredfield') }]
                    }
                  ]"
                  :placeholder="$t('info1')"
                  style="width: 90%"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :xxl="4" :xl="4" :lg="4" />
            <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
              <a-form-item :label="$t('info2')" style="margin-top:5px">
                <a-input
                  v-decorator="[
                    'input2',
                    {
                      rules: [{ required: true, message: $t('requiredfield') }]
                    }
                  ]"
                  :placeholder="$t('input2')"
                  style="width: 90%"
                />
              </a-form-item>
            </a-col>
            <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
              <a-form-item :label="$t('info3')" style="margin-top:5px">
                <a-input
                  v-decorator="[
                    'input3',
                    {
                      rules: [{ required: true, message: $t('requiredfield') }]
                    }
                  ]"
                  :placeholder="$t('info3')"
                  style="width: 90%"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :xxl="4" :xl="4" :lg="4" />
            <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
              <a-form-item :label="$t('info4')" style="margin-top:5px">
                <a-input
                  v-decorator="[
                    'input4',
                    {
                      rules: [{ required: true, message: $t('requiredfield') }]
                    }
                  ]"
                  :placeholder="$t('info4')"
                  style="width: 90%"
                />
              </a-form-item>
            </a-col>
            <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
              <a-form-item :label="$t('info5')" style="margin-top:5px">
                <a-input
                  v-decorator="[
                    'input5',
                    {
                      rules: [{ required: true, message: $t('requiredfield') }]
                    }
                  ]"
                  :placeholder="$t('info5')"
                  style="width: 90%"
                />
              </a-form-item>
              <a @click="showDrawer" style="padding-top:15px">{{
                $t("profile")
              }}</a>
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :xxl="4" :xl="4" :lg="4" />
            <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
              <a-button
                type="primary"
                class="button-near-account"
                icon="save"
                html-type="submit"
              >
                {{ $t("save") }}
              </a-button>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </div>
    <user-info ref="userinfo"></user-info>
  </page-layout>
</template>

<script>
import HeadInfo from "@/components/tool/HeadInfo";
import HeadInfoOrders from "@/components/tool/HeadInfoOrders";
import PageLayout from "@/layouts/PageLayout";
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";
import { mapGetters } from "vuex";
import UserInfo from "./UserInfo";
const { connect, keyStores, WalletConnection, Contract } = nearAPI;


export default {
  name: "Account",
  components: {
    PageLayout,
    HeadInfo,
    HeadInfoOrders,
    UserInfo
  },
  i18n: require("./i18n"),
  computed: {
    desc() {
      return this.$t("pageDesc");
    },
    ...mapGetters("account", ["userInfo"])
  },
  data() {
    return {
      form: this.$form.createForm(this),
      active_orders: "0",
      orderssell: [],
      ordersbuy: [],
      listPayments: [],
      allpayments: this.$t("allpayments"),
      url: "",
      message: ""
    };
  },
  mounted() {
    this.fetch();
    this.$refs.userinfo.fetch();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get("transactionHashes") !== null) {
      this.success(
        process.env.VUE_APP_API_BASE_URL_EXPLORER +
          urlParams.get("transactionHashes")
      );
      window.history.pushState(
        {},
        document.title,
        "/nearp2p/#/account/myaccount"
      );
    }
  },
  methods: {
    async fetch() {
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
        viewMethods: ["get_order_sell", "get_order_buy", "get_payment_method"],
        changeMethods: ["set_payment_method"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        this.orderssell = await contract.get_order_sell({
          user_id: this.userInfo
        });
        this.ordersbuy = await contract.get_order_buy({
          user_id: this.userInfo
        });
        this.listPayments = await contract.get_payment_method();
        this.active_orders =
          parseInt(this.orderssell.length) + parseInt(this.ordersbuy.length);
      }
    },
    async handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          //console.log("Received values of form: ", values);
          this.set_payment_method_user(values.payment_method_id, values.input1, values.input2, values.input3, values.input4, values.input5);
        }
      });
    },
    async set_payment_method_user(payment_method_id, input1, input2, input3, input4, input5) {
      this.$message.success(this.$t("pc"));
      const CryptoJS = require("crypto-js")
      const passphrase = 'Andromeda2018#';
      //this.loading = true;
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
        changeMethods: ["set_payment_method_user"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {     
          await contract.set_payment_method_user({
            user_id: this.userInfo,
            payment_method_id: payment_method_id,
            input1: CryptoJS.AES.encrypt(input1, passphrase).toString(),
            input2: CryptoJS.AES.encrypt(input2, passphrase).toString(),
            input3: CryptoJS.AES.encrypt(input3, passphrase).toString(),
            input4: CryptoJS.AES.encrypt(input4, passphrase).toString(),
            input5: CryptoJS.AES.encrypt(input5, passphrase).toString(),
          },
          "300000000000000", // attached GAS (optional)
          "1" // attached deposit in yoctoNEAR (optional)
          );} 
      },
    showDrawer() {
      this.$refs.userinfo.showDrawer();
    },
    success(url) {
      //console.log(url);
      this.url = url;
      this.message = this.$t("explorer");
      //var dir = process.env.NEAR_EXPLORER + url
      this.$success({
        title: "LOG",
        // JSX support
        content: (
          <div>
            <p>
              <a href={this.url} target="_blank">
                {this.message}
              </a>
            </p>
          </div>
        )
      });
    }
  }
};
</script>
<style lang="less">
@import "index";
</style>
