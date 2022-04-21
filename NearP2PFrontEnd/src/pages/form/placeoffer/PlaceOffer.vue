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
              class="button-near-place"
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
            <a-tabs default-active-key="1" @change="callback">
              <a-tab-pane key="buy" :tab="buy">
                <a-table
                  :columns="columns"
                  :data-source="databuy"
                  :loading="loading"
                >
                  <template slot="status" slot-scope="text, record">
                    <span>{{ statusOrder(record.status) }}</span>
                  </template>

                  <template slot="amount" slot-scope="text, record">
                    <span>{{ yoctoNEARNEAR(record.amount) }}</span>
                  </template>

                  <template slot="remaining_amount" slot-scope="text, record">
                    <span>{{ yoctoNEARNEAR(record.remaining_amount) }}</span>
                  </template>


                  <span slot="action" slot-scope="record">
                    <a @click="edit(record.offer_id)">
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
                        delete_offer(record.offer_id)
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
              </a-tab-pane>
              <a-tab-pane key="sell" :tab="sell">
                <a-table
                  :columns="columns"
                  :data-source="data"
                  :loading="loading"
                >
                  <template slot="status" slot-scope="text, record">
                    <span>{{ statusOrder(record.status) }}</span>
                  </template>

                  <span slot="action" slot-scope="record">
                    <a @click="edit(record.offer_id)">
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
                        delete_offer(record.offer_id)
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
              </a-tab-pane>
            </a-tabs>
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
          <p
            style="font-weight:bold;"
            class="image-responsive-lg image-responsive-md image-responsive-sm"
          >
            {{ $t("drawerinfo") }}:
          </p>
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item :label="$t('description')" style="margin-top:5px">
              <a-select
                show-search
                :placeholder="select"
                option-filter-prop="children"
                @change="handleChange"
                style="width: 90%;margin-top: 5px"
                v-decorator="[
                  'value',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
              >
                <a-select-option value="buy">
                  {{ $t("ordersBuy") }}
                </a-select-option>
                <a-select-option value="sell">
                  {{ $t("ordersSell") }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item :label="$t('asset')" style="margin-top:5px">
              <a-select
                show-search
                :placeholder="asset"
                option-filter-prop="children"
                style="width: 90%;margin-top: 5px"
                v-decorator="[
                  'asset',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
              >
                <a-select-option value="NEAR">
                  {{ $t("near") }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item :label="$t('exchange_rate')" style="margin-top:5px">
              <a-input-number
                v-decorator="[
                  'exchange_rate',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
                :placeholder="$t('exchange_rate')"
                style="width: 90%"
              />
            </a-form-item>
          </a-col>
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item :label="amount" style="margin-top:5px">
              <a-input-number
                v-decorator="[
                  'amount',
                  {
                    rules: [{ validator: validateRemaining }]
                  }
                ]"
                :placeholder="amount"
                style="width: 90%"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item :label="$t('min_limit')" style="margin-top:5px">
              <a-input-number
                v-decorator="[
                  'min_limit',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
                :placeholder="$t('min_limit')"
                style="width: 90%"
              />
            </a-form-item>
          </a-col>
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item :label="$t('max_limit')" style="margin-top:5px">
              <a-input-number
                v-decorator="[
                  'max_limit',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
                :placeholder="$t('max_limit')"
                style="width: 90%"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item :label="$t('allpayments')" style="margin-top:5px">
              <a-select
                show-search
                mode="multiple"
                :placeholder="allpayments"
                option-filter-prop="children"
                style="width: 90%;margin-top: 5px"
                v-decorator="[
                  'payment_method',
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
            <a-form-item :label="$t('fiat')">
              <a-select
                show-search
                :placeholder="selectfiat"
                option-filter-prop="children"
                :filter-option="filterOptionFlag"
                style="width: 90%;margin-top: 5px"
                v-decorator="[
                  'fiat_method',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
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
        </a-row>
        <a-row type="flex">
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item :label="$t('time')" style="margin-top:5px">
              <a-input-number 
                v-decorator="[
                  'time',
                  {
                    rules: [{ validator: validateNumber , message: $t('integer') }]
                  }
                ]"
                :placeholder="$t('time')"
                style="width: 90%"
              />
            </a-form-item>
          </a-col>
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item :label="$t('terms_conditions')" style="margin-top:5px">
              <a-input
                v-decorator="[
                  'terms_conditions',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
                :placeholder="$t('terms_conditions')"
                style="width: 90%"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <a-button
              type="primary"
              class="button-near-place"
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
      if (this.opc == "sell") {
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
          title: this.$t("asset"),
          dataIndex: "asset",
          key: "asset"
        },
        {
          title: this.$t("amount"),
          dataIndex: "amount",
          key: "amount"
        },
        {
          title: this.$t("remaining_amount"),
          dataIndex: "remaining_amount",
          key: "remaining_amount"
        },
        {
          title: this.$t("exchange_rate"),
          dataIndex: "exchange_rate",
          key: "exchange_rate"
        },
        {
          title: this.$t("status"),
          dataIndex: "status",
          key: "status",
          scopedSlots: { customRender: "status" }
        },
        {
          title: this.$t("action"),
          scopedSlots: { customRender: "action" },
          width: "15%"
        }
      ],
      data: [],
      editform: [],
      listMechants: [],
      user: [],
      percentage_complete: "0",
      status: 1,
      update: false,
      listFiats: [],
      databuy: [],
      disputesell: [],
      disputebuy: [],
      opc: "buy",
      listPayments: [],
      loading: false,
      orderssell: [],
      ordersbuy: [],
      active_orders: "0",
      formvalue: "",
      title: this.$t("title"),
      amount: this.$t('amount'),
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
      drawertittle: this.$t("drawertittle"),
      numberRule: v  => {
      if (!v.trim()) return true;
      if (!isNaN(parseFloat(v)) && v >= 0 && v <= 999) return true;
      return 'Number has to be between 0 and 999';
    },
    };
  },
  mounted() {
    this.fetch();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get('transactionHashes') !== null) {
      this.success(process.env.VUE_APP_API_BASE_URL_EXPLORER + urlParams.get('transactionHashes'));
      history.replaceState(null, location.href.split("?")[0], '/#/trade/offer');
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
          "get_payment_method",
          "get_offers_sell",
          "get_offers_buy",
          "get_merchant",
          "get_user"
        ],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        this.listFiats = await contract.get_fiat_method();
        this.listPayments = await contract.get_payment_method();
        this.data = await contract.get_offers_buy({
          owner_id: this.userInfo,
          status: parseInt(this.status)
        });
        this.databuy = await contract.get_offers_sell({
          owner_id: this.userInfo,
          status: parseInt(this.status)
        });

        this.orderssell = await contract.get_order_sell({
          signer_id: this.userInfo
        });

        this.user = await contract.get_user({
            user_id: this.userInfo,
        });
        if(this.user.length == 0){
          this.$router.push("/account/myaccount");
        }

        this.ordersbuy = await contract.get_order_buy({
          signer_id: this.userInfo
        });
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
    validateNumber(rule, value, callback) {
      if (!/^[1-9]\d*$|^$/.test(value) || value > 1440) {
        callback(this.$t("integer"));
      } else {
        callback();
      }
    },
    validateRemaining(rule, value, callback) {
      if (value > this.editform[0].amount) {
        callback(this.$t("requiredremaining"));
      } else {
        callback();
      }
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
      return this.listPayments
        .filter(pay => pay.id == value)[0]
        .payment_method;
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
    async handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let jsonArr = [];
          let input = values.payment_method
          for (let i = 0; i < input.length; i++) {
            jsonArr.push({"id":input[i],"payment_method":this.getPaymentDescription(input[i])});
            //console.log(input[i])
          }
          
          this.set_offer(
            values.asset,
            values.exchange_rate,
            values.amount,
            values.min_limit,
            values.max_limit,
            jsonArr,
            values.fiat_method,
            values.time,
            values.terms_conditions,
          );
        }
      });
    },
    async set_offer(
      asset,
      exchange_rate,
      amount,
      min_limit,
      max_limit,
      payment_method,
      fiat_method,
      time,
      terms_conditions,
    ) {
      this.$message.success(this.$t("pc"));
      this.amount = this.$t('amount');
      var attached_deposit = "1";
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
        changeMethods: ["set_offers_sell", "set_offers_buy", "put_offers_sell", "put_offers_buy"],
        sender: wallet.account()
      });
      //console.log(this.opc);
      if (wallet.isSignedIn()) {
        if (this.opc == "buy" && this.update == false) {         
          await contract.set_offers_sell(
            {
              owner_id: this.userInfo,
              asset: asset.toString(),
              exchange_rate: exchange_rate.toString(),
              amount: parseFloat(amount),
              min_limit: parseFloat(min_limit),
              max_limit: parseFloat(max_limit),
              payment_method: eval(payment_method),
              fiat_method: parseInt(fiat_method),
              time: parseFloat(time),
              terms_conditions: terms_conditions.toString()
            },
            "300000000000000", // attached GAS (optional)
            "1" // attached deposit in yoctoNEAR (optional)
          );
        } else if (this.opc == "sell" && this.update == false) { 
          await contract.set_offers_buy(
            {
              owner_id: this.userInfo,
              asset: asset.toString(),
              exchange_rate: exchange_rate.toString(),
              amount: Number(amount),
              min_limit: parseFloat(min_limit),
              max_limit: parseFloat(max_limit),
              payment_method: eval(payment_method),
              fiat_method: parseInt(fiat_method),
              time: parseFloat(time),
              terms_conditions: terms_conditions.toString()
            },
            "300000000000000", // attached GAS (optional)
            this.NEARyoctoNEAR(Number(amount)) // attached deposit in yoctoNEAR (optional)
          );
        } else if (this.opc == "buy" && this.update == true) {  
          await contract.put_offers_sell(
            {
              offer_id: this.updateid,
              asset: asset.toString(),
              exchange_rate: exchange_rate.toString(),
              remaining_amount: parseFloat(amount),
              min_limit: parseFloat(min_limit),
              max_limit: parseFloat(max_limit),
              payment_method: eval(payment_method),
              fiat_method: parseInt(fiat_method),
              time: parseFloat(time),
              terms_conditions: terms_conditions.toString()
            },
            "300000000000000", // attached GAS (optional)
            "1" // attached deposit in yoctoNEAR (optional)
          );
        } else if (this.opc == "sell" && this.update == true) {  
          //verify if the user needs to atach new doposit
          if(amount > this.data[0].remaining_amount){
            attached_deposit = this.NEARyoctoNEAR(parseFloat(amount) - parseFloat(this.editform[0].remaining_amount));
          } else {
            attached_deposit = "1";
          }
          await contract.put_offers_buy(
            {
              offer_id: this.updateid,
              asset: asset.toString(),
              exchange_rate: exchange_rate.toString(),
              remaining_amount: parseFloat(amount),
              min_limit: parseFloat(min_limit),
              max_limit: parseFloat(max_limit),
              payment_method: eval(payment_method),
              fiat_method: parseInt(fiat_method),
              time: parseFloat(time),
              terms_conditions: terms_conditions.toString()
            },
            "300000000000000", // attached GAS (optional)
            attached_deposit // attached deposit in yoctoNEAR (optional)
          );
        }
      }
      //this.opc = "buy";
    },
    async delete_offer(
      offer_id
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
        changeMethods: ["delete_offers_sell", "delete_offers_buy"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        if (this.opc == "buy") {         
          await contract.delete_offers_sell(
            {
              offer_id: parseInt(offer_id),
            },
          );
        } else {
          await contract.delete_offers_buy(
            {
              offer_id: parseInt(offer_id),
            },
          );
        }
        
        this.fetch();
      }
    },
    async edit(id) {
      this.amount = this.$t('remaining_amount'),
      this.update = true;
      this.updateid = id;
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
        viewMethods: ["get_offers_sell", "get_offers_buy"],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        if (this.opc == "buy") {     
        this.formvalue = "buy";
        this.editform = await contract.get_offers_sell({
          offer_id: parseInt(id)
        });
        } else {
          this.formvalue = "sell";
          this.editform = await contract.get_offers_buy({
            offer_id: parseInt(id)
          });
        }
        if (this.editform.length > 0) {
          this.visible = true;
          var obj = this.editform[0].payment_method;
          
          const keys = Object.keys(obj);
          const res = [];
          for(let i = 0; i < keys.length; i++){
              res.push(obj[keys[i]].id);
          }
          
          this.form.setFieldsValue({
            value: this.formvalue,
            asset: this.editform[0].asset,
            exchange_rate: this.editform[0].exchange_rate,
            amount: this.editform[0].remaining_amount,
            min_limit: this.editform[0].min_limit,
            max_limit: this.editform[0].max_limit,
            payment_method: res,
            fiat_method: this.editform[0].fiat_method,
            time: this.editform[0].time,
            terms_conditions: this.editform[0].terms_conditions,
          });
          this.$forceUpdate();
          setTimeout(() => {
            this.form.setFieldsValue({
            value: this.formvalue,
            asset: this.editform[0].asset,
            exchange_rate: this.editform[0].exchange_rate,
            amount: this.editform[0].remaining_amount,
            min_limit: this.editform[0].min_limit,
            max_limit: this.editform[0].max_limit,
            payment_method: res,
            fiat_method: this.editform[0].fiat_method,
            time: this.editform[0].time,
            terms_conditions: this.editform[0].terms_conditions,
            });
          }, 300);
          this.$forceUpdate();
        }
      }
    },
    handleChange(value) {
      this.opc = value;
      //console.log(value)
    },
    handleChangeFilter(value) {
      this.status = value;
      this.fetch();
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    statusOrder(val) {
      //console.log(val);
      switch (val) {
        case "1":
          return this.$t("Open");
        case "2":
          return this.$t("closed");
        case "3":
          return this.$t("ondiput");
        case "4":
          return this.$t("canceled");
        default:
          return this.$t("Open");
      }
    },
    success(url) {
      //console.log(url);
      this.url = url;
      this.message = this.$t("explorer");
      //var dir = process.env.NEAR_EXPLORER + url
      this.$success({
        title: 'LOG',
        // JSX support
        content: (
          <div>
            <p>
              <a href={this.url} target="_blank">
                {this.message}
              </a>
            </p>
          </div>
        ),
      });
    },
    yoctoNEARNEAR: function(yoctoNEAR) {
      const { utils } = nearAPI;
      const amountInNEAR = utils.format.formatNearAmount(yoctoNEAR.toString());
      // console.log(amountInNEAR);
      return amountInNEAR.toString();
    },
    NEARyoctoNEAR: function(NEARyocto) {
      const { utils } = nearAPI;
      const amountInYocto = utils.format.parseNearAmount(NEARyocto.toString());
      // console.log(amountInYocto);
      return amountInYocto.toString();
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
