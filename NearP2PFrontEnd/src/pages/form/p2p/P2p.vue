<template>
  <div>
    <a-card :title="title" class="card">
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
                      style="width: 99%"
                      @search="onSearch"
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
                  <p2p-table-near
                    @filter="tablefilter"
                    ref="tablenear"
                  ></p2p-table-near>
                </a-col>
              </a-row>
            </a-tab-pane>
            <!--TAB USDT -->
            <a-tab-pane key="2" tab="USDT" force-render>
              <a-row type="flex" gutter="4">
                <a-col :xxl="6" :xl="6" :lg="6" :md="24" :sm="24" :xs="24">
                  <a-form-item :label="$t('amount')" style="margin-top:5px">
                    <a-input-search
                      :placeholder="enteramount"
                      :enter-button="search"
                      style="width: 99%"
                      @search="onSearch"
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
                <!--Table Usdt -->
                <a-col :xxl="22" :xl="22" :lg="24" :md="24" :sm="24" :xs="24">
                  <p2p-table-usdt
                    @filter="tablefilter"
                    ref="tableusdt"
                  ></p2p-table-usdt>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import P2pTableUsdt from "./P2pTableUsdt";
import P2pTableNear from "./P2pTableNEAR";
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";

export default {
  name: "P2P",
  components: {
    P2pTableUsdt,
    P2pTableNear
  },
  i18n: require("./i18n"),
  data() {
    return {
      listPayments: [],
      listFiats: [],
      checked: true,
      merchantad: this.$t("merchantad"),
      buy: this.$t("buy"),
      sell: this.$t("sell"),
      enteramount: this.$t("enteramount"),
      selectfiat: this.$t("selectfiat"),
      allpayments: this.$t("allpayments"),
      title: this.$t("title"),
      search: this.$t("search")
    };
  },
  mounted() {
    this.fetchSelects();
  },
  methods: {
    fiatHandleChange(value) {
      this.$refs.tablenear.filter_value = "fiat_method";
      this.$refs.tablenear.value = value;
      this.$refs.tablenear.fetch();
    },
    paymentHandleChange(value) {
      this.$refs.tablenear.filter_value = "payment_method";
      this.$refs.tablenear.value = value;
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
    },
    fetchBuy() {
      // console.log("fetchBuy");
      this.$refs.tableusdt.typeoffer = "buy";
      this.$refs.tablenear.typeoffer = "buy";
      this.$refs.tablenear.fetch();
      this.$refs.tableusdt.fetch();
    },
    fetchSell() {
      // console.log("fetchSell");
      this.$refs.tableusdt.typeoffer = "sell";
      this.$refs.tablenear.typeoffer = "sell";
      this.$refs.tablenear.fetch();
      this.$refs.tableusdt.fetch();
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
        viewMethods: ["get_payment_method", "get_fiat_method", "get_merchant"],
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
      }
    },
  }
};
</script>
<style lang="less">
@import "index";
</style>
