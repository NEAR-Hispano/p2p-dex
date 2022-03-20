<template>
  <page-layout>
    <div slot="headerContent">
      <div class="subtitle">
        <h3>{{ $t("pageDesc") }}</h3>
      </div>
    </div>
    <template slot="extra">
      <head-info class="split-right" :title="$t('ranking')" content="90%" />
    </template>
    <div>
      <a-card :title="title" class="card">
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="sell" :tab="sell">
            <a-table :columns="columns" :data-source="data" :loading="loading">
              <template slot="operation_amount" slot-scope="text">
                <span style="font-size:0.7rem; padding-left: 2px">{{
                  text }} NEAR</span>
              </template>
              <template slot="fiat_method" slot-scope="text, record">
                <span style="font-size:0.7rem; padding-left: 2px">{{
                  getFiat(record.fiat_method) }}</span>
              </template>
              <template slot="action" slot-scope="text, record">
                <a-button
                  type="primary"
                  size="large"
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
              <template slot="action" slot-scope="text, record">
                <a-button
                  type="primary"
                  size="large"
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
      listFiats: [],
      databuy: [],
      typeoffer: "sell",
      loading: false,
      title: this.$t("title"),
      buttonText: this.$t("action"),
      sell: this.$t("ordersSell"),
      buy: this.$t("ordersBuy"),
      dataSource
    };
  },
  mounted() {
    this.fetch();
    if(localStorage.getItem("userlength") == 0){
      this.$router.push("/account/myaccount");
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
        viewMethods: ["get_order_sell", "get_order_buy", "get_fiat_method"],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        this.listFiats = await contract.get_fiat_method();
        this.data = await contract.get_order_sell({
          user_id: this.userInfo
        });
        this.databuy = await contract.get_order_buy({
          user_id: this.userInfo
        });
      }
      this.loading = false;
    },
    callback(key) {
      this.typeoffer = key;
    },
    detail(record) {
      this.$router.push({
        path: "/d/trade/detail",
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
