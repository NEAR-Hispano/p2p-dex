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
      <head-info class="split-right" :title="$t('ranking')" :content="percentage_complete || '0%'" />
    </template>
    <div>
      <a-card :title="title" class="card" style="width:94%; margin-left:3%">
         <a-row type="flex">
          <a-col :xxl="21" :xl="21" :lg="20" :md="0" :sm="0" :xs="0"></a-col>
          <a-col :xxl="3" :xl="3" :lg="4" :md="24" :sm="24" :xs="24">
          <a-button
            type="primary"
            class="button-near-account"
            @click="showDrawer"
            icon="plus"
            html-type="submit"
          >
            {{ $t("add") }}
          </a-button>
          </a-col>
         </a-row>
        <a-row type="flex">
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-table
              :columns="columns"
              :data-source="data"
              :row-key="record => record.payment_method_id"
              :loading="loading"
            >
              <template slot="info1" slot-scope="text">
                <span>{{ decrypt(text) }}</span>
              </template>
              <template slot="info2" slot-scope="text">
                <span>{{ decrypt(text) }}</span>
              </template>
              <template slot="info3" slot-scope="text">
                <span>{{ decrypt(text) }}</span>
              </template>
              <template slot="info4" slot-scope="text">
                <span>{{ decrypt(text) }}</span>
              </template>
              <template slot="info5" slot-scope="text">
                <span>{{ decrypt(text) }}</span>
              </template>
              <span slot="action" slot-scope="record">
                <a @click="edit(record.payment_method_id)">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ $t("edit") }}</span>
                    </template>
                    <a-icon
                      type="edit"
                      theme="twoTone"
                      two-tone-color="#52c41a"
                    />
                  </a-tooltip>
                </a>
                <a-popconfirm
                  placement="top"
                  :ok-text="yes"
                  :cancel-text="no"
                  @confirm="
                    delete_payment_method_user(record.payment_method_id)
                  "
                >
                  <template slot="title">
                    <p>{{ $t("messagedelete") }}</p>
                  </template>
                  <a style="margin-left:10px">
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span>{{ $t("delete") }}</span>
                      </template>
                      <a-icon
                        type="delete"
                        theme="twoTone"
                        two-tone-color="#f5222f"
                      />
                    </a-tooltip>
                  </a>
                </a-popconfirm>
              </span>
            </a-table>
          </a-col>
        </a-row>
      </a-card>
    </div>
    <a-drawer
      width="auto"
      :title="drawertittle"
      placement="right"
      :bodyStyle="{ maxWidth: '750px' }"
      :closable="true"
      :visible="visible"
      @close="onClose"
    >
      <a-form :form="form" @submit="handleSubmit">
        <a-row type="flex">
          <p style="font-weight:bold;" class="image-responsive-lg image-responsive-md image-responsive-sm">{{ $t('drawerinfo') }}:</p>
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item :label="$t('description')" style="margin-top:5px">
              <a-select
                show-search
                :placeholder="allpayments"
                option-filter-prop="children"
                style="width: 90%;margin-top: 5px"
                v-decorator="[
                  'payment_method_id',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
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
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item :label="$t('info1')" style="margin-top:5px">
              <a-input
                v-decorator="[
                  'input1',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
                :placeholder="$t('info1')"
                style="width: 90%"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item :label="$t('info2')" style="margin-top:5px">
              <a-input
                v-decorator="[
                  'input2',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
                :placeholder="$t('info2')"
                style="width: 90%"
              />
            </a-form-item>
          </a-col>
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item :label="$t('info3')" style="margin-top:5px">
              <a-input
                v-decorator="[
                  'input3',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
                :placeholder="$t('info3')"
                style="width: 90%"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item :label="$t('info4')" style="margin-top:5px">
              <a-input
                v-decorator="[
                  'input4',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
                :placeholder="$t('info4')"
                style="width: 90%"
              />
            </a-form-item>
          </a-col>
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24" >
            <a-form-item :label="$t('info5')">
              <a-input
                v-decorator="[
                  'input5',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
                :placeholder="$t('info5')"
                style="width: 90%"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-button
              type="primary"
              class="button-near-account"
              icon="save"
              html-type="submit"
            >
              {{ $t("save") }}
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-drawer>
  </page-layout>
</template>
<script>
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import HeadInfoOrders from "@/components/tool/HeadInfoOrders";
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";
import { mapGetters } from "vuex";
const { connect, keyStores, WalletConnection, Contract } = nearAPI;
const CryptoJS = require("crypto-js");

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
          title: this.$t("description"),
          dataIndex: "payment_method",
          key: "payment_method"
        },
        {
          title: this.$t("info1"),
          dataIndex: "input1",
          key: "input1",
          scopedSlots: { customRender: "info1" }
        },
        {
          title: this.$t("info2"),
          dataIndex: "input2",
          key: "input2",
          scopedSlots: { customRender: "info2" }
        },
        {
          title: this.$t("info3"),
          dataIndex: "input3",
          key: "input3",
          scopedSlots: { customRender: "info3" }
        },
        {
          title: this.$t("info4"),
          dataIndex: "input4",
          key: "input4",
          scopedSlots: { customRender: "info4" }
        },
        {
          title: this.$t("info5"),
          dataIndex: "input5",
          key: "input5",
          scopedSlots: { customRender: "info5" }
        },
        {
          title: this.$t("action"),
          scopedSlots: { customRender: "action" },
          width: "10%"
        }
      ],
      data: [],
      editform: [],
      form: this.$form.createForm(this),
      listFiats: [],
      listPayments: [],
      databuy: [],
      listMechants: [],
      disputesell: [],
      disputebuy: [],
      user: [],
      percentage_complete: "0",
      active_orders: "0",
      allpayments: this.$t("allpayments"),
      orderssell: [],
      ordersbuy: [],
      typeoffer: "sell",
      loading: false,
      title: this.$t("title"),
      buttonText: this.$t("action"),
      sell: this.$t("detail"),
      buy: this.$t("add"),
      yes: this.$t("yes"),
      no: this.$t("no"),
      save: this.$t("save"),
      opc: "1",
      visible: false,
      drawertittle: this.$t("drawertittle"),
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
      history.replaceState(null, location.href.split("?")[0], '/#/account/bank');
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
          "get_payment_method_user",
          "get_payment_method",
          "get_merchant",
          "get_user",
        ],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        this.listPayments = await contract.get_payment_method();
        this.data = await contract.get_payment_method_user({
          user_id: this.userInfo
        });
        this.orderssell = await contract.get_order_sell({
          signer_id: this.userInfo
        });
        this.ordersbuy = await contract.get_order_buy({
          signer_id: this.userInfo
        });
        this.user = await contract.get_user({
            user_id: this.userInfo,
        });
        if(this.user.length == 0){
          this.$router.push("/account/myaccount");
        }
        this.active_orders =
          parseInt(this.orderssell.length) + parseInt(this.ordersbuy.length);
        this.listMechants = await contract.get_merchant({
            user_id: this.userInfo,
        });
        this.percentage_complete = this.listMechants[0].percentaje_completion.toFixed(2) + '%';
      }
      this.checkDispute();
      this.loading = false;
    },
    async handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          //console.log("Received values of form: ", values);
          this.set_payment_method_user(
            values.payment_method_id,
            values.input1,
            values.input2,
            values.input3,
            values.input4,
            values.input5
          );
        }
      });
    },
    async set_payment_method_user(
      payment_method_id,
      input1,
      input2,
      input3,
      input4,
      input5
    ) {
      this.$message.success(this.$t("pc"));
      //this.loading = true;
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
        changeMethods: ["set_payment_method_user", "put_payment_method_user"],
        sender: wallet.account()
      });
      const passphrase = process.env.VUE_APP_PASSPHRASE;
      if (wallet.isSignedIn()) {
        if (this.opc == "1") {
          console.log(passphrase)
          await contract.set_payment_method_user(
            {
              user_id: this.userInfo,
              payment_method_id: payment_method_id,
              input1: CryptoJS.AES.encrypt(input1, passphrase).toString(),
              input2: CryptoJS.AES.encrypt(input2, passphrase).toString(),
              input3: CryptoJS.AES.encrypt(input3, passphrase).toString(),
              input4: CryptoJS.AES.encrypt(input4, passphrase).toString(),
              input5: CryptoJS.AES.encrypt(input5, passphrase).toString()
            },
            "300000000000000", // attached GAS (optional)
            "1" // attached deposit in yoctoNEAR (optional)
          );
        } else {
          await contract.put_payment_method_user(
            {
              user_id: this.userInfo,
              payment_method_id: payment_method_id,
              input1: CryptoJS.AES.encrypt(input1, passphrase).toString(),
              input2: CryptoJS.AES.encrypt(input2, passphrase).toString(),
              input3: CryptoJS.AES.encrypt(input3, passphrase).toString(),
              input4: CryptoJS.AES.encrypt(input4, passphrase).toString(),
              input5: CryptoJS.AES.encrypt(input5, passphrase).toString()
            },
            "300000000000000", // attached GAS (optional)
            "1" // attached deposit in yoctoNEAR (optional)
          );
        }
      }
    },
    async delete_payment_method_user(value) {
      this.$message.success(this.$t("pc"));
      //this.loading = true;
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
        changeMethods: ["delete_payment_method_user"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        console.log(value);
        await contract.delete_payment_method_user(
          {
            payment_method_id: parseInt(value)
          },
          "300000000000000", // attached GAS (optional)
          "1" // attached deposit in yoctoNEAR (optional)
        );
      }
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
    async edit(id) {
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
        viewMethods: ["get_payment_method_user"],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        this.editform = await contract.get_payment_method_user({
          user_id: this.userInfo,
          method_id: parseInt(id)
        });
        if (this.editform.length > 0) {
          this.visible = true;
          this.opc = "2";
          this.form.setFieldsValue({
            payment_method_id: this.editform[0].payment_method_id,
            input1: this.decrypt(this.editform[0].input1),
            input2: this.decrypt(this.editform[0].input2),
            input3: this.decrypt(this.editform[0].input3),
            input4: this.decrypt(this.editform[0].input4),
            input5: this.decrypt(this.editform[0].input5)
          });
          this.$forceUpdate();
          setTimeout(() => {
            this.form.setFieldsValue({
              payment_method_id: this.editform[0].payment_method_id,
              input1: this.decrypt(this.editform[0].input1),
              input2: this.decrypt(this.editform[0].input2),
              input3: this.decrypt(this.editform[0].input3),
              input4: this.decrypt(this.editform[0].input4),
              input5: this.decrypt(this.editform[0].input5)
            });
          }, 300);
          this.$forceUpdate();
        }
      }
    },
    decrypt(val) {
      const passphrase = process.env.VUE_APP_PASSPHRASE;
      return CryptoJS.AES.decrypt(val, passphrase).toString(CryptoJS.enc.Utf8);
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
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
