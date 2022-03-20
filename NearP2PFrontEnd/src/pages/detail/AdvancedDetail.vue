<template>
  <page-layout :title="number">
    <detail-list size="large" :col="2" slot="headerContent">
      <detail-list-item :term="tmerchant"
        ><span style="color:#0071ce; font-size: 16px">{{ merchant }}</span>
        <a-icon
            type="check-circle"
            :style="{ fontSize: '20px', marginLeft: '10px' }"
            two-tone-color="#ffce3b"
            theme="twoTone"
          />
        </detail-list-item
      >
      <detail-list-item :term="ttime"
        ><span style="color:black; font-size: 16px">{{ time }}</span
        ><span style="margin-left:8px">{{  tminutes }}</span></detail-list-item
      >
      <detail-list-item :term="tamount"
        ><span style="color:rgb(218, 25, 25); font-size: 16px">{{ amount }}</span></detail-list-item
      >
      <detail-list-item :term="tasset"
        ><span style="color:black; font-size: 16px">NEAR</span></detail-list-item
      >
      <detail-list-item :term="texchange_rate"
        ><span style="color:rgb(218, 25, 25); font-size: 16px">{{ exchange_rate }}</span></detail-list-item
      >
      <detail-list-item :term="tfiat_method"
        ><span style="color:black; font-size: 16px">{{ fiat }}</span></detail-list-item
      >
      <detail-list-item :term="tpayment_method"
        ><span class="payment-detail"
          >Zelle: micuenta@gmail.com</span
        ></detail-list-item
      >
    </detail-list>
    <template slot="extra">
      <head-info :title="tstate" :content="state" />
      <head-info :title="torder_amount" :content="order_amount" />
    </template>
    <template slot="action">
      <a-button-group style="margin-right: 8px;">
        <a-button>{{ cancel }}</a-button>
        <a-button type="primary">{{ mediation }}</a-button>
      </a-button-group>
      <a-button type="primary" class="button-near-detail" @click="aprove"
        ><a-icon type="like" />{{ baprove }}</a-button
      >
    </template>
    <a-card :bordered="false" :title="tprogress">
      <a-row type="flex">
        <a-col :xxl="12" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
          <div style="padding-bottom: 15px">
            <flip-countdown
              :deadline="deadline"
              :showDays="false"
              @timeElapsed="timeElapsedHandler"
            ></flip-countdown>
          </div>
        </a-col>
        <a-col :xxl="12" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <div>
        <chat-p2p></chat-p2p>
        </div>
        </a-col>
      </a-row>
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import { mapState } from "vuex";
import HeadInfo from "@/components/tool/HeadInfo";
import FlipCountdown from "vue2-flip-countdown";
import ChatP2p from "./Chat";
import { CONFIG } from "@/services/api";
import * as nearAPI from "near-api-js";
const { connect, keyStores, WalletConnection, Contract } = nearAPI;
import moment from 'moment';
// import moment from "moment";

const DetailListItem = DetailList.Item;
// const fmt = "YYYY-MM-DD HH:mm:ss";

export default {
  name: "TradeDetail",
  i18n: require("./i18n"),
  components: {
    HeadInfo,
    DetailListItem,
    DetailList,
    PageLayout,
    FlipCountdown,
    ChatP2p
  },
  computed: {
    ...mapState("setting", ["isMobile"]),
  },
  mounted() {
    localStorage.removeItem("accepted_order");
    this.fetch();
  },
  data() {
    return {
      // deadline: "2022-02-23 23:40:07",
      deadline: "",
      data: [],
      merchat:this.$t("sellNEAR"),
      number: 0,
      merchant: "",
      time: "",
      exchange_rate: "",
      amount: "",
      order_amount: "",
      listFiats: [],
      fiat: "",
      tmerchant: this.$t("merchant"),
      ttime: this.$t("time"),
      tamount: this.$t("amount"),
      tasset: this.$t("asset"),
      tfiat_method: this.$t("fiat_method"),
      texchange_rate: this.$t("exchange_rate"),
      tpayment_method: this.$t("payment_method"),
      tstate: this.$t("state"),
      torder_amount: this.$t("order_amount"),
      tminutes: this.$t("minutes"),
      cancel: this.$t("cancel"),
      mediation: this.$t("mediation"),
      baprove: this.$t("aprove"),
      tprogress: this.$t("progress"),
      state: "",
    };
  },
  methods: {
    timeElapsedHandler: function() {
      console.log('Count Down Elapsed!!!')
    },
    async fetch() {
      this.loading = true;
      this.merchants = [];
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
        if(this.$route.query.type == "sell"){
          this.data = await contract.get_order_sell({
            order_id: parseInt(this.$route.query.order),
          });
        } else {  
          this.data = await contract.get_order_buy({
            order_id: parseInt(this.$route.query.order),
          });
        } 
      }
      this.number = this.$t("number") + ' ' + this.data[0].order_id;    
      this.merchant = this.data[0].owner_id;
      this.time = this.data[0].time;
      this.exchange_rate = this.data[0].exchange_rate;
      this.fiat = this.listFiats.filter(fiat => fiat.id == this.data[0].fiat_method)[0].fiat_method.split(" - ")[0]
      this.amount = this.data[0].operation_amount;
      this.order_amount = parseFloat(this.amount * this.exchange_rate).toFixed(2);
      this.deadline = moment(this.data[0].datetime).add(this.time,'minutes').format("YYYY-MM-DD HH:mm:ss");
      if(this.data[0].confirmation_signer_id == "0" && this.data[0].confirmation_owner_id == "0"){
        this.state = this.$t("status0");
      } else if(this.data[0].confirmation_signer_id == "1" && this.data[0].confirmation_owner_id == "0"){
        this.state = this.$t("status1");
      } else if(this.data[0].confirmation_signer_id == "1" && this.data[0].confirmation_owner_id == "0"){
        this.state = this.$t("status2");
      }
        //console.log(this.data[0].datetime);
        //this.deadline = this.data[0].datetime;
    },
    aprove(){
      this.$message.success(this.$t("pc"));
    }
  }
};
</script>

<style lang="less">
@import "index";
</style>
