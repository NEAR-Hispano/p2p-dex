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
      <head-info class="split-right" :title="$t('ranking')" :content="percentage_complete || '0%'" />
    </template>
    <div>
      <a-card :title="$t('accountData')" class="card" style="width:94%; margin-left:3%">
        <a-form :form="form" @submit="handleSubmit">
          <a-row type="flex">
            <a-col :xxl="4" :xl="4" :lg="4" />
            <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
              <a-form-item :label="$t('name')" style="margin-top:5px">
                <a-input
                  v-decorator="[
                    'name',
                    {
                      rules: [{ required: true, message: $t('requiredfield') }]
                    }
                  ]"
                  :placeholder="$t('name')"
                  style="width: 90%"
                />
              </a-form-item>
            </a-col>
            <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
              <a-form-item :label="$t('lastname')" style="margin-top:5px">
                <a-input
                  v-decorator="[
                    'last_name',
                    {
                      rules: [{ required: true, message: $t('requiredfield') }]
                    }
                  ]"
                  :placeholder="$t('lastname')"
                  style="width: 90%"
                />
              </a-form-item>
              <a @click="showDrawer" style="padding-top:15px">{{ $t("profile") }}</a>
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :xxl="4" :xl="4" :lg="4" />
            <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
              <a-form-item :label="$t('email')" style="margin-top:5px">
                <a-input
                  v-decorator="[
                    'email',
                    {
                      rules: [{ required: true, type: 'email', message: $t('invalidmail') }]
                    }
                  ]"
                  :placeholder="$t('email')"
                  style="width: 90%"
                />
              </a-form-item>
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
      disputesell: [],
      disputebuy: [],
      listMechants: [],
      percentage_complete: "0",
      url: "",
      message : "",
    };
  },
  mounted() {
    this.fetch();
    this.$refs.userinfo.fetch();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get('transactionHashes') !== null) {
      this.success(process.env.VUE_APP_API_BASE_URL_EXPLORER + urlParams.get('transactionHashes'));
      history.replaceState(null, location.href.split("?")[0], '/#/account/myaccount');
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
        viewMethods: ["get_order_sell", "get_order_buy", "get_merchant"],
        changeMethods: ["set_payment_method"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        this.orderssell = await contract.get_order_sell({
          signer_id: this.userInfo
        });
        this.ordersbuy = await contract.get_order_buy({
          signer_id: this.userInfo
        });
        this.active_orders =
          parseInt(this.orderssell.length) + parseInt(this.ordersbuy.length);
      }
      this.listMechants = await contract.get_merchant({
            user_id: this.userInfo,
        });
      this.percentage_complete = this.listMechants[0].percentaje_completion.toFixed(2) + '%';
      this.checkDispute();
    },
    async handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          //console.log("Received values of form: ", values.name);
          this.setUser(values.name, values.last_name, values.email);
        }
      });
    },
    async setUser(name, last_name, email) {
      this.$message.success(this.$t("pc"));
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
        changeMethods: ["set_user", "put_user"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {     
        if(localStorage.getItem("userlength") == "0"){
          localStorage.setItem("userlength", "1");
          await contract.set_user({
            user_id: this.userInfo,
            name: name,
            last_name: last_name,
            phone: "000",
            email: email,
            country: "N/A"
          },
          "300000000000000", // attached GAS (optional)
          "1" // attached deposit in yoctoNEAR (optional)
          );} 
        else {  
        await contract.put_user(
          {
            name: name,
            last_name: last_name,
            phone: "000",
            email: email,
            country: "N/A"
          },
          "300000000000000", // attached GAS (optional)
          "1" // attached deposit in yoctoNEAR (optional)
        );
        }
      }
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
        title: 'LOG',
        // JSX support
        content: (
          <div>
            <p>
              <a href={this.url} target="_blank">
                {this.message}
              </a>
            </p>
          </div>
        ),
      });
    },
    /*This function searchs in order sell and order buy first from owner_id then signer_id, if ther is a dispute estatus redirect*/
    async checkDispute(){
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
        viewMethods: [
          "get_order_sell",
          "get_order_buy",
        ],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
      //Getting info from owner_id and status 3, buy and sell
      //Getting info from owner_id and status 3, buy and sell
      ////////////////////////////////////////////////////////
      this.disputebuy = await contract.get_order_buy({
            owner_id: this.userInfo,
            status: 3
      });
      this.disputesell = await contract.get_order_sell({
            owner_id: this.userInfo,
            status: 3
      });
      //If there is a dispute got to detail in buy or sell
        for(var i = 0; i < this.disputebuy.length; i++){
          if(this.disputebuy[i].status == 3 && this.disputebuy[i].owner_id == this.userInfo){
            this.$router.push("/trade/merchant");
          } 
        }
        for(var x = 0; x < this.disputesell.length; x++){
          if(this.disputesell[x].status == "3" && this.disputesell[i].owner_id == this.userInfo){
           this.$router.push("/trade/merchant");
          }
        }
      ////////////////////////////////////////////////////////
      //Repeat all get but using signer id
      //Getting info from signer_id and status 3, buy and sell
      ////////////////////////////////////////////////////////
      this.disputebuy = await contract.get_order_buy({
            signer_id: this.userInfo,
            status: 3
      });
      this.disputesell = await contract.get_order_sell({
            signer_id: this.userInfo,
            status: 3
      });
      //If there is a dispute got to detail in buy or sell
        for(var y = 0; y < this.disputebuy.length; y++){
          if(this.disputebuy[y].status == 3 && this.disputebuy[y].signer_id == this.userInfo){
            this.$router.push("/trade/p2pdetail");
          } 
        }
        for(var z = 0; z < this.disputesell.length; z++){
          if(this.disputesell[z].status == "3" && this.disputesell[z].signer_id == this.userInfo){
           this.$router.push("/trade/p2pdetail");
          }
        }
      }//Check signein
    }

  }
};
</script>
<style lang="less">
@import "index";
</style>
