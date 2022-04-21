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
        :title="$t('project')"
        :content="active_orders"
      />
      <head-info
        class="split-right"
        :title="$t('ranking')"
        :content="percentage_complete || '0%'"
      />
    </template>
    <div>
      <a-card :title="title" class="card" style="width:94%; margin-left:3%">
        <a-row type="flex">
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-tabs default-active-key="1" @change="callback">
              <a-tab-pane key="sell" :tab="sell">
                <a-form-item :label="$t('status')">
                  <a-select
                    default-value="2"
                    show-search
                    :placeholder="select"
                    option-filter-prop="children"
                    @change="handleChangeFilter"
                    class="select-responsive-lg select-responsive-md select-responsive-sm select-responsive-xs"
                    v-decorator="[
                      'value',
                      {
                        rules: [
                          { required: true, message: $t('requiredfield') }
                        ]
                      }
                    ]"
                  >
                    <a-select-option value="2">
                      {{ $t("close") }}
                    </a-select-option>
                    <a-select-option value="4">
                      {{ $t("canceled") }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-table
                  :columns="columns"
                  :data-source="data"
                  :loading="loading"
                >
                  <template slot="status" slot-scope="text, record">
                    {{ statusOrder(record.status) }}
                  </template>
                  <template slot="fiat_method" slot-scope="text, record">
                    {{ getFiat(record.fiat_method) }}
                  </template>
                </a-table>
              </a-tab-pane>
              <a-tab-pane key="buy" :tab="buy">
                <a-form-item :label="$t('status')">
                  <a-select
                    show-search
                    default-value="2"
                    :placeholder="select"
                    option-filter-prop="children"
                    @change="handleChangeFilter"
                    class="select-responsive-lg select-responsive-md select-responsive-sm select-responsive-xs"
                    v-decorator="[
                      'value',
                      {
                        rules: [
                          { required: true, message: $t('requiredfield') }
                        ]
                      }
                    ]"
                  >
                    <a-select-option value="2">
                      {{ $t("close") }}
                    </a-select-option>
                    <a-select-option value="4">
                      {{ $t("canceled") }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-table
                  :columns="columns"
                  :data-source="databuy"
                  :loading="loading"
                >
                  <template slot="status" slot-scope="text, record">
                    {{ statusOrder(record.status) }}
                  </template>
                </a-table>
              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>
      </a-card>
    </div>
  </page-layout>
</template>
<script>
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import HeadInfoOrders from "@/components/tool/HeadInfoOrders";
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";
import { mapGetters } from "vuex";

export default {
  name: "P2POrders",
  components: {
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
      columns: [
        {
          title: this.$t("ordernumber"),
          dataIndex: "order_id",
          key: "order_id"
        },
        {
          title: this.$t("exchange_rate"),
          dataIndex: "exchange_rate",
          key: "exchange_rate"
        },
        {
          title: this.$t("amount"),
          dataIndex: "operation_amount",
          key: "operation_amount"
        },
        {
          title: this.$t("amountd"),
          dataIndex: "fee_deducted",
          key: "fee_deducted"
        },
        {
          title: this.$t("merchant"),
          dataIndex: "owner_id",
          key: "owner_id"
        },
        {
          title: this.$t("status"),
          dataIndex: "status",
          key: "status",
          scopedSlots: { customRender: "status" }
        },
        {
          title: this.$t("fiat_method"),
          dataIndex: "fiat_method",
          key: "fiat_method",
          scopedSlots: { customRender: "fiat_method" }
        },
        {
          title: this.$t("date"),
          dataIndex: "datetime",
          key: "datetime",
          sorter: (a, b) => a.datetime.localeCompare(b.datetime)
        }
      ],
      data: [],
      editform: [],
      listMechants: [],
      user: [],
      percentage_complete: "0",
      status: 2,
      update: false,
      listFiats: [],
      databuy: [],
      opc: "buy",
      listPayments: [],
      loading: false,
      orderssell: [],
      ordersbuy: [],
      disputesell: [],
      disputebuy: [],
      active_orders: "0",
      formvalue: "",
      title: this.$t("title"),
      amount: this.$t("amount"),
      updateid: "",
      buttonText: this.$t("action"),
      sell: this.$t("ordersSell"),
      buy: this.$t("ordersBuy"),
      add: this.$t("add"),
      select: this.$t("select"),
      asset: this.$t("asset"),
      allpayments: this.$t("allpayments"),
      selectfiat: this.$t("selectfiat"),
      form: this.$form.createForm(this),
      visible: false,
      drawertittle: this.$t("drawertittle")
    };
  },
  mounted() {
    this.fetch();
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
          "get_order_history_sell",
          "get_order_history_buy",
          "get_fiat_method",
          "get_payment_method",
          "get_order_sell",
          "get_order_buy",
          "get_merchant",
          "get_user",
        ],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        this.listFiats = await contract.get_fiat_method();
        this.data = await contract.get_order_history_sell({
          signer_id: this.userInfo,
          status: parseInt(this.status)
        });
        this.databuy = await contract.get_order_history_buy({
          signer_id: this.userInfo,
          status: parseInt(this.status)
        });

        this.user = await contract.get_user({
            user_id: this.userInfo,
        });
        if(this.user.length == 0){
          this.$router.push("/account/myaccount");
        }

        this.orderssell = await contract.get_order_sell({
          signer_id: this.userInfo
        });
        this.ordersbuy = await contract.get_order_buy({
          signer_id: this.userInfo
        });
        this.active_orders =
          parseInt(this.orderssell.length) + parseInt(this.ordersbuy.length);

        this.listMechants = await contract.get_merchant({
          user_id: this.userInfo
        });
        this.percentage_complete = this.listMechants[0].percentaje_completion.toFixed(2) + '%';
      }
      this.checkDispute();
      this.loading = false;
    },
    callback(key) {
      this.opc = key;
    },
    detail(record) {
      this.$router.push({
        path: "/d/trade/detail",
        query: { order: record, type: this.opc }
      });
    },
    getFiat(value) {
      // console.log(this.listFiats.filter(fiat => fiat.id == value)[0].fiat_method.split(" - ")[0]);
      return this.listFiats
        .filter(fiat => fiat.id == value)[0]
        .fiat_method.split(" - ")[0];
    },
    getPaymentDescription(value) {
      // console.log(this.listFiats.filter(fiat => fiat.id == value)[0].fiat_method.split(" - ")[0]);
      return this.listPayments.filter(pay => pay.id == value)[0].payment_method;
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    handleChange(value) {
      this.opc = value;
      //console.log(value);
    },
    handleChangeFilter(value) {
      this.status = value;
      this.fetch();
    },
    statusOrder(val) {
      //console.log(val);
      switch (val) {
        case 2:
          return this.$t("close");
        case 3:
          return this.$t("ondiput");
        case 4:
          return this.$t("canceled");
        default:
          return this.$t("close");
      }
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
