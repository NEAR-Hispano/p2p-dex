<template>
  <page-layout title="Number：234231029431">
    <detail-list size="large" :col="3" slot="headerContent">
      <detail-list-item term="Merchant"
        ><span style="color:#0071ce; font-size: 16px">carla.testnet</span>
        <a-icon
            type="check-circle"
            :style="{ fontSize: '20px', marginLeft: '10px' }"
            two-tone-color="#ffce3b"
            theme="twoTone"
          />
        </detail-list-item
      >
      <detail-list-item term="Time"
        ><span style="color:black; font-size: 16px">15:00</span
        ><span style="margin-left:8px">Minutes</span></detail-list-item
      >
      <detail-list-item term="Fiat Method"
        ><span style="color:black; font-size: 16px">Dolar</span></detail-list-item
      >
      <detail-list-item term="Exchange rate"
        ><span style="color:rgb(218, 25, 25); font-size: 16px">11</span></detail-list-item
      >
      <detail-list-item term="Asset"
        ><span style="color:black; font-size: 16px">NEAR</span></detail-list-item
      >
      <detail-list-item term="Payment method"
        ><span class="payment-detail"
          >Zelle: micuenta@gmail.com</span
        ></detail-list-item
      >
    </detail-list>
    <template slot="extra">
      <head-info title="State" content="Pending approval" />
      <head-info title="The order amount" content="10.967" />
    </template>
    <template slot="action">
      <a-button-group style="margin-right: 8px;">
        <a-button>Cancel</a-button>
        <a-button type="primary">Mediation</a-button>
      </a-button-group>
      <a-button type="primary" class="button-near" @click="aprove"
        ><a-icon type="like" />Aprove</a-button
      >
    </template>
    <a-card :bordered="false" title="Process progress">
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
      deadline: moment().add(15, 'minutes').format("YYYY-MM-DD HH:mm:ss").toString(),
      data: [],
      merchat:this.$t("sellNEAR"),
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
        viewMethods: ["get_order_sell"],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
          this.data = await contract.get_order_sell({
            user_id: "info.testnet",
          });
        }    
        console.log(this.data[0].datetime);
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
