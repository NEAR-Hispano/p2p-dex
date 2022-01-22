<template>
  <div>
    <a-card title="Peer to Peer options" class="card">
      <a-row type="flex">
        <a-col :xxl="2" :xl="4" :lg="4" :md="24" :sm="24" :xs="24">
          <a-radio-group default-value="b" button-style="solid">
            <a-radio-button value="a">
              Buy
            </a-radio-button>
            <a-radio-button value="b">
              Sell
            </a-radio-button>
          </a-radio-group>
        </a-col>
        <a-col :xxl="22" :xl="20" :lg="20" :md="24" :sm="24" :xs="24">
          <a-tabs default-active-key="1" @change="callback">
            <a-tab-pane key="1" tab="NEAR">
              <a-row type="flex">
                <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
                  <a-form-item :label="$t('amount')" style="margin-top:5px">
                    <a-input-search
                      placeholder="Enter amount"
                      enter-button="Search"
                      style="width: 95%"
                      @search="onSearch"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
                  <a-form-item :label="$t('fiat')">
                    <a-select
                      show-search
                      placeholder="Select Fiat"
                      option-filter-prop="children"
                      :filter-option="filterOptionFlag"
                      style="width: 95%;margin-top: 5px"
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
                <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
                  <a-form-item :label="$t('payments')">
                    <a-select
                      show-search
                      placeholder="All Payments"
                      option-filter-prop="children"
                      style="width: 95%;margin-top: 5px"
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
                <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
                  <p2p-table-usdt
                    @edit="showDrawerEdit"
                    @delete="showDrawerDelete"
                    @save="save"
                    ref="table"
                  ></p2p-table-usdt>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="2" tab="USDT" force-render>
              <a-row type="flex">
                <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
                  <a-form-item :label="$t('amount')" style="margin-top:5px">
                    <a-input-search
                      placeholder="Enter amount"
                      enter-button="Search"
                      style="width: 95%"
                      @search="onSearch"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
                  <a-form-item :label="$t('fiat')">
                    <a-select
                      show-search
                      placeholder="Select Fiat"
                      option-filter-prop="children"
                      :filter-option="filterOptionFlag"
                      style="width: 95%;margin-top: 5px"
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
                <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
                  <a-form-item :label="$t('payments')">
                    <a-select
                      show-search
                      placeholder="All Payments"
                      option-filter-prop="children"
                      style="width: 95%;margin-top: 5px"
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
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";

export default {
  name: "P2P",
  components: {
    P2pTableUsdt
  },
  i18n: require("./i18n"),
  data() {
    return {
      listPayments: [],
      listFiats: []
    };
  },
  mounted() {
    this.fetchSelects();
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    handleBlur() {
      console.log("blur");
    },
    handleFocus() {
      console.log("focus");
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
        viewMethods: ["get_payment_method", "get_fiat_method"],
        changeMethods: ["set_payment_method"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        this.listPayments = await contract.get_payment_method();
        this.listFiats = await contract.get_fiat_method();
        this.list = await contract.get_offers_sell({ campo: "%", valor: "%" });
        this.listPayments.sort((a, b) =>
          a.payment_method > b.payment_method ? 1 : -1
        );
        this.listFiats.sort((a, b) => (a.fiat_method > b.fiat_method ? 1 : -1));
      }
    }
  }
};
</script>
<style lang="less">
@import "index";
</style>
