<template>
  <page-layout :title="number" v-if="render1">
    <detail-list size="large" :col="4" slot="headerContent">
      <detail-list-item :term="tmerchant"
        ><span style="color:#0071ce; font-size: 16px">{{ merchant }}</span>
        <a-icon
          type="check-circle"
          :style="{ fontSize: '20px', marginLeft: '10px' }"
          two-tone-color="#ffce3b"
          theme="twoTone"
        />
      </detail-list-item>
      <detail-list-item :term="ttime"
        ><span style="color:black; font-size: 16px">{{ time }}</span
        ><span style="margin-left:8px">{{ tminutes }}</span></detail-list-item
      >
      <detail-list-item :term="tamount"
        ><span style="color:rgb(218, 25, 25); font-size: 16px">{{
          amount
        }}</span></detail-list-item
      >
      <detail-list-item :term="tasset"
        ><span style="color:black; font-size: 16px"
          >NEAR</span
        ></detail-list-item
      >
      <detail-list-item :term="texchange_rate"
        ><span style="color:rgb(218, 25, 25); font-size: 16px">{{
          exchange_rate
        }}</span></detail-list-item
      >
      <detail-list-item :term="tfiat_method"
        ><span style="color:black; font-size: 16px">{{
          fiat
        }}</span></detail-list-item
      >
      <detail-list-item :term="tpayment_method"
        ><span class="payment-detail"
          >{{ detail_payment_method }}: {{ decrypt(detail_input1) }},
          {{ decrypt(detail_input2) }}, {{ decrypt(detail_input3) }},
          {{ decrypt(detail_input4) }}, {{ decrypt(detail_input5) }}</span
        ></detail-list-item
      >
    </detail-list>
    <template slot="extra">
      <head-info :title="state" :content="state" />
      <head-info :title="torder_amount" :content="order_amount" />
    </template>
    <template slot="action">
      <a-button-group style="margin-right: 8px;">
        <a-button @click="cancelorder()"
          ><a-icon type="dislike" />{{ cancel }}</a-button
        >
        <a-button type="primary" @click="disputeorder()">{{
          mediation
        }}</a-button>
        <a-button type="primary" class="button-near-detail" @click="aprove"
          ><a-icon type="like" />{{ baprove }}</a-button
        >
      </a-button-group>
    </template>
    <a-card :bordered="false" :title="tprogress">
      <a-row type="flex">
        <a-col :xxl="12" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
          <div style="padding-bottom: 15px">
            <flip-countdown
              :deadline="timer()"
              :showDays="false"
              @timeElapsed="timeElapsedHandler"
            ></flip-countdown>
            <h3 style="text-align: center; margin-top: 15px; font-weight: bold">
              <a-icon type="warning" theme="twoTone" two-tone-color="#eb2f96" />
              {{ $t("timer") }}
              <a-icon type="warning" theme="twoTone" two-tone-color="#eb2f96" />
            </h3>
            <h3 style="text-align: center; margin-top: 15px">
              {{ terms_conditions }}
            </h3>
            <a-divider />
            <a-steps :current="current" size="small">
              <a-step :title="waiting" />
              <a-step :title="aprove_buy" />
              <a-step :title="aprove_sell" />
            </a-steps>
            <a-divider />
            <a-result
              v-if="rendersellaprove"
              status="success"
              :title="$t('done')"
              :sub-title="number"
            >
              <template #extra>
                <a-button type="primary" @click="disputeorder()">{{
                  mediation
                }}</a-button>
                <a-button
                  type="primary"
                  class="button-near-detail"
                  @click="aprove"
                  ><a-icon type="like" />{{ baprove }}</a-button
                >
              </template>
            </a-result>
            <a-result
              v-if="renderbuyaprove"
              status="success"
              :title="$t('done')"
              :sub-title="number"
            >
              <template #extra>
                <a-button type="primary" @click="disputeorder()">{{
                  mediation
                }}</a-button>
                <a-button
                  type="primary"
                  class="button-near-detail"
                  @click="aprove"
                  ><a-icon type="like" />{{ baprove }}</a-button
                >
              </template>
            </a-result>
            <a-result
              v-if="rendersellcancel"
              status="error"
              :title="$t('cancelorder')"
              :sub-title="number"
            >
              <template #extra>
                <a-button type="primary" @click="disputeorder()">{{
                  mediation
                }}</a-button>
                <a-button type="danger" @click="cancelorder()"
                  ><a-icon type="dislike" />{{ cancel }}</a-button
                >
              </template>
            </a-result>
            <a-result
              v-if="renderbuycancel"
              status="error"
              :title="$t('cancelorder')"
              :sub-title="number"
            >
              <template #extra>
                <a-button type="danger" @click="cancelorder()"
                  ><a-icon type="dislike" />{{ cancel }}</a-button
                >
                <a-button type="primary" @click="disputeorder()">{{
                  mediation
                }}</a-button>
              </template>
            </a-result>
            <a-result
              v-if="rendersellmediation"
              status="warning"
              :title="$t('mediationorder')"
              :sub-title="number"
            >
              <template #extra>
                <a-button type="danger" @click="cancelorder()"
                  ><a-icon type="dislike" />{{ cancel }}</a-button
                >
                <a-button
                  type="primary"
                  class="button-near-detail"
                  @click="aprove"
                  ><a-icon type="like" />{{ baprove }}</a-button
                >
              </template>
            </a-result>
            <a-result
              v-if="renderbuymediation"
              status="warning"
              :title="$t('mediationorder')"
              :sub-title="number"
            >
              <template #extra>
                <a-button type="danger" @click="cancelorder()"
                  ><a-icon type="dislike" />{{ cancel }}</a-button
                >
                <a-button
                  type="primary"
                  class="button-near-detail"
                  @click="aprove"
                  ><a-icon type="like" />{{ baprove }}</a-button
                >
              </template>
            </a-result>
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
  <page-layout v-else>
    <a-result status="403" :title="noorders" :sub-title="m403">
      <template #extra>
        <a-button type="primary" @click="p2p()">
          {{ $t("gototrade") }}
        </a-button>
      </template>
    </a-result>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import { mapState, mapGetters } from "vuex";
import HeadInfo from "@/components/tool/HeadInfo";
import FlipCountdown from "vue2-flip-countdown";
import ChatP2p from "./Chat";
import { CONFIG, MAIL, MAILCANCEL, MAILDISPUTE } from "@/services/api";
import * as nearAPI from "near-api-js";
const { connect, keyStores, WalletConnection, Contract } = nearAPI;
import moment from "moment";
const CryptoJS = require("crypto-js");
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
    ...mapGetters("account", ["userInfo"])
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  mounted() {
    this.fetch();
    setTimeout(() => {
      if (this.$route.query.order != null) {
        this.render1 = true;
      } else {
        this.render1 = false;
      }
    }, 500);

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get("transactionHashes") !== null) {
      this.success(
        process.env.VUE_APP_API_BASE_URL_EXPLORER +
          urlParams.get("transactionHashes")
      );
      history.replaceState(null, "/#", location.href.split("?")[0]);
      this.$router.push({
        path: "/trade/p2p"
      });

    }

    this.pollData();

  },
  data() {
    return {
      // deadline: "2022-02-23 23:40:07",
      data: [],
      merchat: this.$t("sellNEAR"),
      number: 0,
      merchant: "",
      time: "",
      exchange_rate: "",
      amount: "",
      order_amount: "",
      payment_method: "",
      terms_conditions: "",
      listFiats: [],
      listPaymetMethodUser: [],
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
      detail_payment_method: "",
      detail_input1: "",
      detail_input2: "",
      detail_input3: "",
      detail_input4: "",
      detail_input5: "",
      user_mail: "",
      user_mail1: "",
      rendersellaprove: false,
      renderbuyaprove: false,
      rendersellcancel: false,
      renderbuycancel: false,
      rendersellmediation: false,
      renderbuymediation: false,
      polling: null,
      type_order: "",
      offer_type: "",
      waiting: this.$t("waiting"),
      aprove_buy: this.$t("aprove_buy"),
      aprove_sell: this.$t("aprove_sell"),
      current: "0",
      render1: true,
      m403: this.$t("m403"),
      noorders: this.$t("noorders"),
      room: "room" + this.$route.query.order,
    };
  },
  methods: {
    timeElapsedHandler: function() {
      //console.log("Count Down Elapsed!!!");
      this.auto_disputeorder();
    },
    async fetch() {
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
        viewMethods: [
          "get_order_sell",
          "get_order_buy",
          "get_fiat_method",
          "get_payment_method_user",
          "get_user"
        ],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        this.listFiats = await contract.get_fiat_method();
        if (this.$route.query.type == "sell") {
          this.type_order = this.$t("sell");
          this.offer_type = 1;
          this.data = await contract.get_order_sell({
            order_id: parseInt(this.$route.query.order)
          });
          //console.log("data", this.data);
          if (this.data.length > 0) {
             this.render1 = true;
          } else {
             this.render1 = false;
          }
          this.user_mail = await contract.get_user({
            user_id: this.data[0].signer_id
          });
          this.user_mail1 = await contract.get_user({
            user_id: this.data[0].owner_id
          });
          //About payment method
          this.listPaymetMethodUser = await contract.get_payment_method_user({
            user_id: this.data[0].signer_id,
            method_id: this.data[0].payment_method
          });

          this.detail_payment_method = this.listPaymetMethodUser[0].payment_method;
          this.detail_input1 = this.listPaymetMethodUser[0].input1;
          this.detail_input2 = this.listPaymetMethodUser[0].input2;
          this.detail_input3 = this.listPaymetMethodUser[0].input3;
          this.detail_input4 = this.listPaymetMethodUser[0].input4;
          this.detail_input5 = this.listPaymetMethodUser[0].input5;

        } else {
          this.type_order = this.$t("buy");
          this.offer_type = 2;
          this.data = await contract.get_order_buy({
            order_id: parseInt(this.$route.query.order)
          });
          //console.log("data", this.data);
          if (this.data.length > 0) {
             this.render1 = true;
          } else {
             this.render1 = false;
          }
          this.user_mail = await contract.get_user({
            user_id: this.data[0].owner_id
          });
          this.user_mail1 = await contract.get_user({
            user_id: this.data[0].signer_id
          });
          //About payment method
          this.listPaymetMethodUser = await contract.get_payment_method_user({
            user_id: this.data[0].owner_id,
            method_id: this.data[0].payment_method
          });

          this.detail_payment_method = this.listPaymetMethodUser[0].payment_method;
          this.detail_input1 = this.listPaymetMethodUser[0].input1;
          this.detail_input2 = this.listPaymetMethodUser[0].input2;
          this.detail_input3 = this.listPaymetMethodUser[0].input3;
          this.detail_input4 = this.listPaymetMethodUser[0].input4;
          this.detail_input5 = this.listPaymetMethodUser[0].input5;
        }
        //Validate length to render

        if(this.data[0].confirmation_signer_id=='0' && this.data[0].confirmation_owner_id>'0'){
          this.current = "1";
        }
        if(this.data[0].confirmation_signer_id>'0' && this.data[0].confirmation_owner_id=='0'){
          this.current = "1";
        }
        if(this.data[0].confirmation_signer_id>'0' && this.data[0].confirmation_owner_id>'0'){
          this.current = "2";
        }
        
        
        this.number =
          this.type_order +
          " " +
          this.$t("number") +
          " " +
          this.data[0].order_id;
        this.merchant = this.data[0].owner_id;
        this.time = this.data[0].time;
        this.payment_method = this.data[0].payment_method;
        this.terms_conditions = this.data[0].terms_conditions;
        this.exchange_rate = this.data[0].exchange_rate;
        this.fiat = this.listFiats
          .filter(fiat => fiat.id == this.data[0].fiat_method)[0]
          .fiat_method.split(" - ")[0];
        this.amount = this.data[0].fee_deducted;
        this.order_amount = parseFloat(
          (this.amount)  * this.data[0].exchange_rate
        ).toFixed(3);

      

        //Verify status
        this.notificationStatus(this.data[0].status);
      }
    },
    async fetchNotif() {
      // connect to NEAR
      //console.log('el ktire.com')
      const CONTRACT_NAME = process.env.VUE_APP_CONTRACT_NAME;
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      // create wallet connection
      // const account = await near.account();
      const wallet = new WalletConnection(near);
      // console.log(near);
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ["get_order_sell", "get_order_buy"],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        if (this.$route.query.type == "sell") {
          this.type_order = this.$t("sell");
          this.offer_type = 1;
          this.data = await contract.get_order_sell({
            order_id: parseInt(this.$route.query.order)
          });
        } else {
          this.type_order = this.$t("buy");
          this.offer_type = 2;
          this.data = await contract.get_order_buy({
            order_id: parseInt(this.$route.query.order)
          });
        }
        //Verify status
        if (this.data.length > 0) {
        this.notificationStatus(this.data[0].status);
        }

        if(this.data[0].confirmation_signer_id=='0' && this.data[0].confirmation_owner_id>'0'){
          this.current = "1";
        }
        if(this.data[0].confirmation_signer_id>'0' && this.data[0].confirmation_owner_id=='0'){
          this.current = "1";
        }
        if(this.data[0].confirmation_signer_id>'0' && this.data[0].confirmation_owner_id>'0'){
          this.current = "2";
        }
      }
      //Validate length to render
      if (this.data.length > 0) {
        this.render1 = true;
      } else {
        this.render1 = false;
      }
      this.$forceUpdate();
    },
    async aprove() {
      this.$message.success(this.$t("pc"));
      //console.log(this.offer_type);
      //console.log(this.data[0].order_id);
      //console.log(MAIL + this.user_mail[0].email + "/" + this.data[0].order_id + "/sell");
      //Validate order type
      var request = new XMLHttpRequest();
      //Aceptance
      if (this.user_mail[0].email != "") {          
          request.open(
            "GET",
            MAIL + this.user_mail[0].email + "/" + this.data[0].order_id + "/sell"
          );
          request.send();
      }  

      if (this.$route.query.type == "sell") {
          this.offer_type = 1;
        } else {
          this.offer_type = 2;
      }
      //Call method to confirmations
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
        viewMethods: [],
        changeMethods: ["order_confirmation"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        await contract.order_confirmation(
          {
            offer_type: parseInt(this.offer_type),
            order_id: parseInt(this.data[0].order_id)
          },
          "300000000000000", // attached GAS (optional)
          "1" // attached deposit in yoctoNEAR (optional)
        );
      }

    },
    async cancelorder() {
      this.$message.success(this.$t("pc"));
      //console.log("cancel");
      if (this.$route.query.type == "sell") {
        this.offer_type = 1;
      } else {
        this.offer_type = 2;
      }
      //Call method to confirmations
      // connect to NEAR

      if (this.user_mail[0].email != "" && this.user_mail1[0].email != "") {           
        var request = new XMLHttpRequest();
        request.open(
          "GET",
          MAILCANCEL + this.user_mail[0].email + "," + this.user_mail1[0].email
        );
        request.send();
      }

      const CONTRACT_NAME = process.env.VUE_APP_CONTRACT_NAME;
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      // create wallet connection
      // const account = await near.account();
      const wallet = new WalletConnection(near);
      // console.log(near);
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: [],
        changeMethods: ["cancel_order"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        await contract.cancel_order(
          {
            offer_type: parseInt(this.offer_type),
            order_id: parseInt(this.data[0].order_id)
          },
          "300000000000000", // attached GAS (optional)
          "1" // attached deposit in yoctoNEAR (optional)
        );
      }
      
    },
    async disputeorder() {
      this.$message.success(this.$t("pc"));
      //console.log(MAILDISPUTE + this.user_mail[0].email + "," + this.user_mail1[0].email);
      if (this.$route.query.type == "sell") {
        this.offer_type = 1;
      } else {
        this.offer_type = 2;
      }
      //Call method to confirmations
      // connect to NEAR
      //console.log(this.offer_type);.

      if (this.user_mail[0].email != "" && this.user_mail1[0].email != "") {
        var request = new XMLHttpRequest();
        request.open(
          "GET",
          MAILDISPUTE + this.user_mail[0].email + "," + this.user_mail1[0].email
        );
        request.send();
      }

      const CONTRACT_NAME = process.env.VUE_APP_CONTRACT_NAME;
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      // create wallet connection
      // const account = await near.account();
      const wallet = new WalletConnection(near);
      // console.log(near);
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: [],
        changeMethods: ["order_dispute"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        await contract.order_dispute(
          {
            offer_type: parseInt(this.offer_type),
            order_id: parseInt(this.data[0].order_id),
          },
          "300000000000000", // attached GAS (optional)
          "1" // attached deposit in yoctoNEAR (optional)
        );
      }

    },
    async auto_disputeorder() {
      this.$message.success(this.$t("pc"));
      //console.log(MAILDISPUTE + this.user_mail[0].email + "," + this.user_mail1[0].email);
    
      if (this.$route.query.type == "sell") {
        this.offer_type = 1;
      } else {
        this.offer_type = 2;
      }

      if (this.user_mail[0].email != "" && this.user_mail1[0].email != "") {
        var request = new XMLHttpRequest();
        request.open(
          "GET",
          MAILDISPUTE + this.user_mail[0].email + "," + this.user_mail1[0].email
        );
        request.send();
      }
      //Call method to confirmations
      // connect to NEAR
      //console.log(this.offer_type);
      const CONTRACT_NAME = process.env.VUE_APP_CONTRACT_NAME;
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      // create wallet connection
      // const account = await near.account();
      const wallet = new WalletConnection(near);
      // console.log(near);
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: [],
        changeMethods: ["dispute"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        await contract.dispute(
          {
            offer_type: parseInt(this.offer_type),
            order_id: parseInt(this.data[0].order_id),
            token: process.env.VUE_APP_TOKEN.toString()
          },
        );
      }
      this.fetch();
      this.$forceUpdate();
    },
    decrypt(val) {
      const passphrase = process.env.VUE_APP_PASSPHRASE;
      return CryptoJS.AES.decrypt(val, passphrase).toString(CryptoJS.enc.Utf8);
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
    pollData() {
      this.polling = setInterval(() => {
        this.fetchNotif();
      }, 15000);
    },
    timer() {
      return moment(this.data[0].datetime)
        .add(this.data[0].time, "minutes")
        .format("YYYY-MM-DD HH:mm:ss");
    },
    p2p() {
      this.$router.push({
        path: "/trade/p2p"
      });
    },
    notificationStatus(status) {
      //console.log(status);
      //Aprove status 2
      if (status == 2) {
        this.rendersellmediation = false;
        this.renderbuymediation = false;
        this.rendersellcancel = false;
        this.renderbuycancel = false;
        if (this.$route.query.type == "sell") {
          this.rendersellaprove = true;
        } else {
          this.renderbuyaprove = true;
        }
      }
      //Dispute status 3
      if (status == 3) {
        this.rendersellaprove = false;
        this.renderbuyaprove = false;
        this.rendersellcancel = false;
        this.renderbuycancel = false;
        if (this.$route.query.type == "sell") {
          this.rendersellmediation = true;
        } else {
          this.renderbuymediation = true;
        }
      }   
      //Cancelado status 4
      if (status == 4) {
        this.rendersellaprove = false;
        this.renderbuyaprove = false;
        this.rendersellmediation = false;
        this.renderbuymediation = false;
        if (this.$route.query.type == "sell") {
          this.rendersellcancel = true;
        } else {
          this.renderbuycancel = true;
        }
      }     
    }
  }
};
</script>

<style lang="less">
@import "index";
</style>