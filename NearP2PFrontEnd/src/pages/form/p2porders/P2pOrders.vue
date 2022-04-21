<template>
  <page-layout>
    <div slot="headerContent">
      <div class="subtitle">
        <h3>{{ $t("pageDesc") }}</h3>
      </div>
    </div>
    <template slot="extra">
      <a-alert v-if="isdispute"
        :message="$t('warning')"
        :description="$t('dispute')"
        type="warning"
        show-icon
      />
      <head-info
        class="split-right"
        :title="$t('ranking')"
        :content="percentage_complete || '0%'"
      />
    </template>
    <div>
      <a-card :title="title" class="card" style="width:94%; margin-left:3%">
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="sell" :tab="sell">
            <a-table :columns="columns" :data-source="data" :loading="loading">
              <template slot="operation_amount" slot-scope="text">
                <span style="font-size:0.7rem; padding-left: 2px"
                  >{{ text }} NEAR</span
                >
              </template>
               <template slot="fee_deducted" slot-scope="text">
                <span style="font-size:0.7rem; padding-left: 2px"
                  >{{ text }} NEAR</span
                >
              </template>
              <template slot="fiat_method" slot-scope="text, record">
                <span style="font-size:0.7rem; padding-left: 2px">{{
                  getFiat(record.fiat_method)
                }}</span>
              </template>
              <template slot="action" slot-scope="text, record">
                <a-button
                  type="primary"
                  @click="detail(record.order_id)"
                  :class="computedClass"
                >
                  {{ buttonText }}
                  <a-icon type="branches" />
                </a-button>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="buy" :tab="buy">
            <a-table
              :columns="columns"
              :data-source="databuy"
              :loading="loading"
            >
              <template slot="operation_amount" slot-scope="text">
                <span style="font-size:0.7rem; padding-left: 2px"
                  >{{ text }} NEAR</span
                >
              </template>
               <template slot="fee_deducted" slot-scope="text">
                <span style="font-size:0.7rem; padding-left: 2px"
                  >{{ text }} NEAR</span
                >
              </template>
              <template slot="fiat_method" slot-scope="text, record">
                <span style="font-size:0.7rem; padding-left: 2px">{{
                  getFiat(record.fiat_method)
                }}</span>
              </template>
              <template slot="action" slot-scope="text, record">
                <a-button
                  type="primary"
                  @click="detail(record.order_id)"
                  :class="computedClass"
                >
                  {{ buttonText }}
                  <a-icon type="branches" />
                </a-button>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </page-layout>
</template>
<script>
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";
import { mapGetters } from "vuex";

const dataSource = [];

export default {
  name: "P2POrders",
  components: {
    PageLayout,
    HeadInfo
  },
  i18n: require("./i18n"),
  computed: {
    desc() {
      return this.$t("pageDesc");
    },
    computedClass() {
      let className = "button-near-sell";
      if (this.typeoffer == "sell") {
        className = "button-near-sell";
      } else {
        className = "button-near-buy";
      }
      return className;
    },
    ...mapGetters("account", ["userInfo"])
  },
  data() {
    return {
      columns: [
        {
          title: this.$t("merchant"),
          dataIndex: "owner_id",
          key: "owner_id"
        },
        {
          title: this.$t("amount"),
          dataIndex: "operation_amount",
          key: "operation_amount",
          scopedSlots: { customRender: "operation_amount" }
        },
        {
          title: this.$t("amountd"),
          dataIndex: "fee_deducted",
          key: "fee_deducted",
          scopedSlots: { customRender: "fee_deducted" }
        },
        {
          title: this.$t("fiat"),
          dataIndex: "fiat_method",
          key: "fiat_method",
          scopedSlots: { customRender: "fiat_method" }
        },
        {
          title: this.$t("exchange_rate"),
          dataIndex: "exchange_rate",
          key: "exchange_rate"
        },
        {
          title: this.$t("ordernumber"),
          dataIndex: "order_id",
          key: "order_id"
        },
        {
          title: this.$t("action"),
          scopedSlots: { customRender: "action" },
          width: "15%"
        }
      ],
      data: [],
      listMechants: [],
      user: [],
      percentage_complete: "0",
      listFiats: [],
      databuy: [],
      typeoffer: "sell",
      loading: false,
      title: this.$t("title"),
      buttonText: this.$t("action"),
      sell: this.$t("ordersSell"),
      buy: this.$t("ordersBuy"),
      dataSource,
      isdispute: false
    };
  },
  mounted() {
    this.fetch();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get("transactionHashes") !== null) {
      this.success(
        process.env.VUE_APP_API_BASE_URL_EXPLORER +
          urlParams.get("transactionHashes")
      );
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/#/trade/p2pdetail"
      );
    }

    if (urlParams.get("order") !== null) {
      window.history.pushState({}, document.title, "/#/trade/p2pdetail");
    }
  },
  methods: {
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
        viewMethods: [
          "get_order_sell",
          "get_order_buy",
          "get_fiat_method",
          "get_merchant",
          "get_user"
        ],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        this.listFiats = await contract.get_fiat_method();
        this.data = await contract.get_order_sell({
          signer_id: this.userInfo
        });
        this.databuy = await contract.get_order_buy({
          signer_id: this.userInfo
        });

        this.user = await contract.get_user({
          user_id: this.userInfo
        });
        if (this.user.length == 0) {
          this.$router.push("/account/myaccount");
        }

        this.listMechants = await contract.get_merchant({
          user_id: this.userInfo
        });
        this.percentage_complete =
          this.listMechants[0].percentaje_completion.toFixed(2) + "%";
      }

      //If there is a dispute got to detail in buy or sell
        for(var i = 0; i < this.databuy.length; i++){
          if(this.databuy[i].status == 3){
            this.isdispute = true;
          }
        }
 
        for(var x = 0; x < this.data.length; x++){
          if(this.data[x].status == "3"){
            this.isdispute = true;
          }
        }
      ////////////////////////////////////////////////////  
      this.loading = false;
    },
    callback(key) {
      this.typeoffer = key;
    },
    detail(record) {
      this.$router.push({
        path: "/trade/tradedetail",
        query: { order: record, type: this.typeoffer }
      });
    },
    getFiat(value) {
      // console.log(this.listFiats.filter(fiat => fiat.id == value)[0].fiat_method.split(" - ")[0]);
      return this.listFiats
        .filter(fiat => fiat.id == value)[0]
        .fiat_method.split(" - ")[0];
    }
  }
};
</script>
<style lang="less">
@import "index";
</style>
