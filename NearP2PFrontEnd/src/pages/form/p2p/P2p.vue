<template>
  <page-layout>
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
      <a-card :title="title" class="card" style="width:94%; margin-left:3%">
        <a-row type="flex">
          <a-col :xxl="2" :xl="4" :lg="4" :md="24" :sm="24" :xs="24">
            <a-radio-group default-value="sell" button-style="solid">
              <a-tooltip :title="$t('longbuy')">
                <a-radio-button value="buy" @click="fetchBuy">
                  {{ buy }}
                </a-radio-button>
              </a-tooltip>
              <a-tooltip :title="$t('longsell')">
                <a-radio-button value="sell" @click="fetchSell">
                  {{ sell }}
                </a-radio-button>
              </a-tooltip>
            </a-radio-group>
          </a-col>
          <a-col :xxl="22" :xl="20" :lg="20" :md="24" :sm="24" :xs="24">
            <a-tabs default-active-key="1" @change="callback">
              <a-tab-pane key="1" tab="NEAR">
                <a-row type="flex" gutter="4">
                  <a-col :xxl="6" :xl="6" :lg="6" :md="24" :sm="24" :xs="24">
                    <a-form-item :label="$t('amount')" style="margin-top:5px">
                      <a-input-search
                        :placeholder="enteramount"
                        :enter-button="search"
                        v-model="amount"
                        style="width: 99%"
                        @search="amountHandleChange"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :xxl="6" :xl="6" :lg="6" :md="24" :sm="24" :xs="24">
                    <a-form-item :label="$t('fiat')">
                      <a-select
                        show-search
                        :placeholder="selectfiat"
                        option-filter-prop="children"
                        @change="fiatHandleChange"
                        :filter-option="filterOptionFlag"
                        style="width: 99%;margin-top: 5px"
                      >
                        <a-select-option
                          v-for="i in listFiats"
                          :key="i.id"
                          :value="i.id"
                        >
                          <img
                            :src="i.flagcdn"
                            width="16"
                            height="12"
                            style="margin-right: 10px"
                            alt="flagcdn"
                          />
                          {{ i.fiat_method }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xxl="6" :xl="6" :lg="6" :md="24" :sm="24" :xs="24">
                    <a-form-item :label="$t('payments')">
                      <a-select
                        show-search
                        :placeholder="allpayments"
                        option-filter-prop="children"
                        @change="paymentHandleChange"
                        style="width: 99%;margin-top: 5px"
                      >
                        <a-select-option
                          v-for="i in listPayments"
                          :key="i.id"
                          :value="i.id"
                          :filter-option="filterOption"
                        >
                          {{ i.payment_method }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xxl="6" :xl="6" :lg="6" :md="24" :sm="24" :xs="24">
                    <a-checkbox
                      @change="onChange"
                      :checked="checked"
                      style="margin-top: 50px; margin-left: 15px;"
                    >
                      {{ merchantad }}
                    </a-checkbox>
                  </a-col>
                  <a-col :xxl="22" :xl="22" :lg="24" :md="24" :sm="24" :xs="24">
                    <p2p-table-near ref="tablenear"></p2p-table-near>
                  </a-col>
                </a-row>
              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>
      </a-card>
    </div>
  </page-layout>
</template>
<script>
import P2pTableNear from "./P2pTableNEAR";
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import HeadInfoOrders from "@/components/tool/HeadInfoOrders";
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";
import { mapGetters } from "vuex";

export default {
  name: "P2P",
  components: {
    P2pTableNear,
    PageLayout,
    HeadInfo,
    HeadInfoOrders
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
      listPayments: [],
      listFiats: [],
      orderssell: [],
      ordersbuy: [],
      disputesell: [],
      disputebuy: [],
      active_orders: "0",
      listMechants: [],
      percentage_complete: "0",
      checked: true,
      merchantad: this.$t("merchantad"),
      buy: this.$t("buy"),
      sell: this.$t("sell"),
      enteramount: this.$t("enteramount"),
      selectfiat: this.$t("selectfiat"),
      allpayments: this.$t("allpayments"),
      globalkey: "1",
      title: this.$t("title"),
      search: this.$t("search"),
      amount: "",
      user: [],
    };
  },
  mounted() {
    this.fetchSelects();
  
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get("transactionHashes") !== null) {
      this.success(
        process.env.VUE_APP_API_BASE_URL_EXPLORER +
          urlParams.get("transactionHashes")
      );
      history.replaceState(null, location.href.split("?")[0], '/#/trade/p2p');
      //window.history.pushState({});
    }
  },
  methods: {
    fiatHandleChange(value) {
      this.$refs.tablenear.filter_fiat_method = value;
      this.$refs.tablenear.fetch();
    },
    paymentHandleChange(value) {
      //console.log(value)
      this.$refs.tablenear.filter_payment_method = value;
      this.$refs.tablenear.fetch();
    },
    amountHandleChange() {
      this.$refs.tablenear.filter_amount = parseInt(this.amount);
      this.$refs.tablenear.fetch();
    },
    callback(key) {
      if (key === "1") {
        this.$refs.tablenear.fetch();
      } else {
        this.$refs.tableusdt.fetch();
      }
    },
    onChange(e) {
      this.checked = e.target.checked;
      this.$refs.tablenear.filter_is_merchant = this.checked;
      this.$refs.tablenear.fetch();
    },
    fetchBuy() {
      this.$refs.tablenear.typeoffer = "buy";
      this.$refs.tablenear.fetch();
    },
    fetchSell() {
      this.$refs.tablenear.typeoffer = "sell";
      this.$refs.tablenear.fetch();
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    filterOptionFlag(input, option) {
      return (
        option.componentOptions.children[1].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    async fetchSelects() {
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
        viewMethods: [
          "get_payment_method",
          "get_fiat_method",
          "get_merchant",
          "get_order_sell",
          "get_order_buy",
          "get_user",
        ],
        changeMethods: ["set_payment_method"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        this.listPayments = await contract.get_payment_method();
        this.listFiats = await contract.get_fiat_method();
        this.listPayments.sort((a, b) =>
          a.payment_method > b.payment_method ? 1 : -1
        );
        this.listFiats.sort((a, b) => (a.fiat_method > b.fiat_method ? 1 : -1));

        this.orderssell = await contract.get_order_sell({
            signer_id: this.userInfo,
        });
   
        this.user = await contract.get_user({
            user_id: this.userInfo,
        });
        if(this.user.length == 0){
          this.$router.push("/account/myaccount");
        }

        this.ordersbuy = await contract.get_order_buy({
            signer_id: this.userInfo,
        });

        this.listMechants = await contract.get_merchant({
            user_id: this.userInfo,
        });
        this.percentage_complete = this.listMechants[0].percentaje_completion.toFixed(2) + '%';

        this.active_orders = parseInt(this.orderssell.length) + parseInt(this.ordersbuy.length);

        this.checkDispute();
      }
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
