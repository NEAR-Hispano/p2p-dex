<template>
  <div>
  <a-table :columns="columns" :data-source="data">
    <a slot="name" slot-scope="text">{{ text }}</a>
  </a-table>  
  </div>
</template>

<script>
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";

export default {
  name: "CountriesTable",
  i18n: require("./i18n"),
  data() {
    return {
      value: 1,
      recent: "",
      searchText: null,
      text: this.$t("messagedelete"),
      yes: this.$t("yes"),
      no: this.$t("no"),
      columns: [
        {
          title: this.$t("name"),
          dataIndex: "owner_id",
          key: "owner_id",
          defaultSortOrder: "ascend",
          sorter: (a, b) => a.owner_id.localeCompare(b.owner_id),
        },
        {
          title: this.$t("name"),
          dataIndex: "min_limit",
          key: "min_limit",
          defaultSortOrder: "ascend",
          sorter: (a, b) => a.asset.localeCompare(b.asset),
        },
        {
          title: this.$t("name"),
          dataIndex: "amount",
          key: "amount",
          defaultSortOrder: "ascend",
          sorter: (a, b) => a.amount.localeCompare(b.amount),
        },
      ],
      data: [],
      loading: false,
      sortOrder: "",
      searchInput: null,
      searchedColumn: "",
      params: {},
      listPaymets: [],
      title: ""
    };
  },
  mounted() {
    this.title = this.$t("title");
    this.recent = this.$t("recent");
    this.fetch();
  },
  computed: {
    desc() {
      return this.$t("pageDesc");
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
        viewMethods: ["get_offers_sell"],
        changeMethods: ["set_payment_method"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        //var array = await contract.get_offers_sell({"campo": "%", "valor": "%"});
        //var arrayToString = JSON.stringify(array);  // convert array to string
        //var stringToJsonObject = JSON.parse(arrayToString);  // convert string to json object
        this.data = await contract.get_offers_sell({"campo": "%", "valor": "%"});
        console.log(this.data);
        this.loading = false;
      }
    },
  }
};
</script>
<style lang="less">
@import "index";
</style>
