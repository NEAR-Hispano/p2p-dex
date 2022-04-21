<template>
  <div>
    <a-table :columns="columns" :data-source="data" :loading="loading">
      <template slot="merchants" slot-scope="text, record, index">
        <p style="color:#0071ce; font-size: 16px">
          {{ record.owner_id }}
          <a-icon
            :type="merchants[index].badge"
            :style="{ fontSize: '20px' }"
            two-tone-color="#ffce3b"
            theme="twoTone"
          />
        </p>
        <span style="color:gray; font-size: 12px"
          >{{ merchants[index].orders_completed }} {{ orders }} |
          {{ merchants[index].percentaje_completion }} % {{ completion }}</span
        >
      </template>

      <template slot="exchange_rate" slot-scope="text, record">
        <span style="color:black; font-size:18px">{{ text }}</span>
        <span style="font-size:0.7rem; padding-left: 2px">{{
          getFiat(record.fiat_method)
        }}</span>
      </template>

      <template slot="limit" slot-scope="text, record">
        <a-row type="flex">
          <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
            <span style="color:gray; font-size: 12px">{{ available }}:</span>
          </a-col>
          <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
            <span style="color:black;">{{ text }} NEAR</span>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
            <span style="color:gray; font-size: 12px">{{ limit }}:</span>
          </a-col>
          <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
            <span style="color:black;"
              >{{ record.min_limit }} - {{ record.max_limit }}</span
            >
          </a-col>
        </a-row>
      </template>

      <template slot="payment_method" slot-scope="text">
        <li
          style="font-size: 12px; color: green"
          v-for="item in text"
          :key="item.id"
        >
          <a-tooltip :title="item.payment_method">
            {{ item.payment_method }}
          </a-tooltip>
        </li>
      </template>

      <template slot="action" slot-scope="text, record, index">
        <a-button
          type="primary"
          @click="
            showDrawer(
              record.remaining_amount,
              record.exchange_rate,
              record.min_limit,
              record.max_limit,
              record.offer_id,
              record.payment_method,
              record.time,
              record.owner_id,
              record.terms_conditions,
              merchants[index].badge,
              getFiat(record.fiat_method)
            )
          "
          :class="computedClass"
        >
          {{ buttonText }}
        </a-button>
      </template>
    </a-table>

    <!--- Drawer --->
    <a-drawer
      width="auto"
      :title="drawertittle"
      :bodyStyle="{ maxWidth: '750px' }"
      placement="right"
      :closable="true"
      :visible="visible"
      @close="onClose"
    >
      <a-row :gutter="16">
        <p
          style="font-weight:bold;"
          class="image-responsive-lg image-responsive-md image-responsive-sm"
        >
          {{ $t("drawerinfo") }}:
        </p>
        <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
          <p style="font-size: 16px; font-weight: bold;">
            {{ $t("terms") }}
          </p>
          <a-row :gutter="16">
            <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
              <p>
                {{ terms_conditions }}
              </p>
            </a-col>
            <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
              <p style="color:#0071ce; font-size: 16px">
                {{ owner_id }}
                <a-icon
                  :type="badge"
                  :style="{ fontSize: '20px' }"
                  two-tone-color="#ffce3b"
                  theme="twoTone"
                />
              </p>
            </a-col>
            <a-col :xxl="12" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
              <p style="color:gray; font-size: 14px">
                {{ $t("paymenttimelimit") }}:
                <span style="color:black; font-size: 16px"
                  >{{ time }} {{ $t("minutes") }}</span
                >
              </p>
            </a-col>
            <a-col :xxl="12" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
              <p style="color:gray; font-size: 14px">
                {{ $t("price") }}:
                <span style="color:rgb(218, 25, 25); font-size: 16px"
                  >{{ price }} {{ fiat }}</span
                >
              </p>
            </a-col>
            <a-col :xxl="12" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
              <p style="color:gray; font-size: 14px">
                {{ $t("amount") }}:
                <span style="color:black; font-size: 16px">{{ all }} NEAR</span>
              </p>
            </a-col>
            <a-col :xxl="12" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
              <p style="color:gray; font-size: 14px">
                {{ $t("payments") }}:
                <span
                  v-for="item in listPayments"
                  :key="item.id"
                  style="color:green"
                >
                  {{ item.payment_method }}</span
                >
              </p>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-divider />
      <a-row :gutter="16">
        <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
          <!--Step inside Drawer-->
          <div>
            <a-steps :current="current">
              <a-step
                v-for="item in steps"
                :key="item.title"
                :title="item.title"
              />
            </a-steps>
            <div class="steps-content">
              <div v-if="current === 0">
                <a-form :form="form" @submit="next">
                  <a-row :gutter="16">
                    <a-col
                      :xxl="24"
                      :xl="24"
                      :lg="24"
                      :md="24"
                      :sm="24"
                      :xs="24"
                    >
                      <a-form-item :label="$t('payments')">
                        <a-select
                          show-search
                          :placeholder="allpayments"
                          option-filter-prop="children"
                          @change="paymentHandleChange"
                          style="width: 99%;margin-top: 5px"
                          v-decorator="[
                            'empresa',
                            {
                              rules: [
                                { required: true, message: $t('requiredfield') }
                              ]
                            }
                          ]"
                        >
                          <a-select-option
                            v-for="(i, index) in listPayments"
                            :key="i.id"
                            :value="index"
                            :filter-option="filterOption"
                          >
                            {{ i.payment_method }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col
                      :xxl="24"
                      :xl="24"
                      :lg="24"
                      :md="24"
                      :sm="24"
                      :xs="24"
                    >
                      <a-form-item :label="buttonText">
                        <a-input-number
                          style="width:100%"
                          @change="onChangeToken"
                          v-decorator="[
                            'remaining_amount',
                            {
                              rules: [{ validator: checkPrice }]
                            }
                          ]"
                          placeholder="0.00"
                        />
                      </a-form-item>
                      <a-tooltip :title="$t('totalbalance')">
                        <a-button
                          type="link"
                          @click="putAll"
                          style="font-size: 14px; font-weight: bold; margin-top: -20px !important; color:#ffce3b; float: right; margin-right: 13px;"
                        >
                          {{ $t("all") }}
                        </a-button>
                      </a-tooltip>
                    </a-col>
                    <a-col
                      :xxl="24"
                      :xl="24"
                      :lg="24"
                      :md="24"
                      :sm="24"
                      :xs="24"
                    >
                      <a-form-item :label="$t('receive')">
                        <a-input-number
                          style="width:100%"
                          @change="onChangeReceive"
                          v-decorator="[
                            'receive',
                            {
                              rules: [{ validator: checkPriceReceive }]
                            }
                          ]"
                          placeholder="0.00"
                        />
                      </a-form-item>
                      <p
                        style="font-size: 12px; margin-top: -10px !important; color:green; opacity: 0.7; float: right; margin-right: 13px;"
                      >
                        {{ $t("fee") }}
                      </p>
                    </a-col>
                    <a-col
                      :xxl="24"
                      :xl="24"
                      :lg="24"
                      :md="24"
                      :sm="24"
                      :xs="24"
                    >
                      <a-button block @click="payment">{{
                        $t("method")
                      }}</a-button>
                    </a-col>
                    <a-col
                      :xxl="24"
                      :xl="24"
                      :lg="24"
                      :md="24"
                      :sm="24"
                      :xs="24"
                    >
                      <a-button
                        type="primary"
                        class="button-near-drawer"
                        html-type="submit"
                      >
                        {{ $t("next") }}
                      </a-button>
                    </a-col>
                  </a-row>
                </a-form>
              </div>
              <div v-if="current === 1">
                <a-form>
                  <a-row :gutter="16">
                    <a-col
                      :xxl="24"
                      :xl="24"
                      :lg="24"
                      :md="24"
                      :sm="24"
                      :xs="24"
                    >
                      <a-alert
                        :closable="true"
                        :message="$t('confirm')"
                        style="marging-top: 34px;"
                      />
                    </a-col>
                    <a-col
                      :xxl="24"
                      :xl="24"
                      :lg="24"
                      :md="24"
                      :sm="24"
                      :xs="24"
                    >
                      <a-form-item :label="$t('payments')">
                        <p
                          style="font-size: 16px; color: black; font-weigth: bold; margin-left:30px"
                        >
                          {{ payment_method_desc }}
                        </p>
                      </a-form-item>
                    </a-col>
                    <a-col
                      :xxl="24"
                      :xl="24"
                      :lg="24"
                      :md="24"
                      :sm="24"
                      :xs="24"
                    >
                      <a-form-item :label="buttonText">
                        <p
                          style="font-size: 16px; color: black; font-weigth: bold; margin-left:30px"
                        >
                          {{ totalremaining_amount }}
                        </p>
                      </a-form-item>
                    </a-col>
                    <a-col
                      :xxl="24"
                      :xl="24"
                      :lg="24"
                      :md="24"
                      :sm="24"
                      :xs="24"
                    >
                      <a-form-item
                        :label="$t('receive')"
                        style="margin-top: -10px"
                      >
                        <p
                          style="font-size: 16px; color: black; font-weigth: bold; margin-left:30px"
                        >
                          {{ totalreceive }}
                        </p>
                      </a-form-item>
                      <p
                        style="color:gray; font-size: 12px; margin-top: -15px !important; color:green; opacity: 0.7;"
                      >
                        {{ $t("fee") }}
                      </p>
                    </a-col>
                  </a-row>
                </a-form>
              </div>
              <div v-if="current === 2">
                <a-alert
                  message="Info"
                  :description="steps[current].content"
                  type="success"
                  show-icon
                />
              </div>
            </div>
            <div class="steps-action">
              <a-button
                v-if="current == 1"
                type="primary"
                class="button-near-drawer"
                @click="next1"
              >
                {{ $t("next") }}
              </a-button>
              <a-button
                v-if="current == steps.length - 1"
                type="primary"
                class="button-near-drawer"
                @click="acceptOrder"
              >
                {{ $t("done") }}
              </a-button>
              <a-button
                v-if="current > 0"
                style="margin-left: 8px"
                @click="prev"
              >
                {{ $t("previous") }}
              </a-button>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-drawer>
    <!--- Drawer --->
  </div>
</template>

<script>
import * as nearAPI from "near-api-js";
import { CONFIG, MAIL } from "@/services/api";
import { mapGetters } from "vuex";
const { connect, keyStores, WalletConnection, Contract, utils } = nearAPI;
import moment from "moment";

export default {
  name: "CountriesTable",
  i18n: require("./i18n"),
  data() {
    return {
      columns: [
        {
          title: this.$t("advertisers"),
          dataIndex: "owner_id",
          key: "owner_id",
          defaultSortOrder: "descend",
          scopedSlots: { customRender: "merchants" }
        },
        {
          title: this.$t("price"),
          dataIndex: "exchange_rate",
          key: "exchange_rate",
          scopedSlots: { customRender: "exchange_rate" }
        },
        {
          title: this.$t("limitavailable"),
          dataIndex: "remaining_amount",
          key: "remaining_amount",
          scopedSlots: { customRender: "limit" }
        },
        {
          title: this.$t("payment"),
          dataIndex: "payment_method",
          key: "payment_method",
          scopedSlots: { customRender: "payment_method" }
        },
        {
          title: this.$t("action"),
          scopedSlots: { customRender: "action" },
          width: "10%"
        }
      ],
      data: [],
      listPayments: [],
      listFiats: [],
      merchants: [],
      allpayments: this.$t("allpayments"),
      loading: false,
      title: "",
      filter_value: "asset",
      value: "NEAR",
      typeoffer: "sell",
      buttonText: this.$t("sellNEAR"),
      available: this.$t("available"),
      payments: this.$t("payments"),
      limit: this.$t("limit"),
      orders: this.$t("orders"),
      completion: this.$t("completion"),
      visible: false,
      offer_id: "",
      amount: "",
      totalremaining_amount: "",
      totalreceive: "",
      payment_method: "",
      time: "",
      payment_method_desc: "",
      terms_conditions: "",
      current: 0,
      owner_id: "",
      badge: "",
      fiat: "",
      form: this.$form.createForm(this),
      all: "",
      fee: 0.004,
      price: 0,
      min: 0,
      max: 0,
      steps: [
        {
          title: this.$t("Addvalues"),
          content: "First-content"
        },
        {
          title: this.$t("Readvaluesloaded"),
          content: "Second-content"
        },
        {
          title: this.$t("Confirmtransaction"),
          content: this.$t("content")
        }
      ],
      filter_amount: 0,
      filter_fiat_method: null,
      filter_payment_method: null,
      filter_is_merchant: true,
      drawertittle: this.$t("drawertittle"),
      user_mail: ""
    };
  },
  async mounted() {
    this.title = this.$t("title");
    this.fetch();
    this.getBalance();
  },
  beforeDestroy() {
     clearInterval(this.polling);
  },
  computed: {
    ...mapGetters("account", ["userInfo"]),
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
    }
  },
  methods: {
    async getBalance() {
      // connect to NEAR
      //console.log(new keyStores.BrowserLocalStorageKeyStore())
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      const wallet = new WalletConnection(near);
      //console.log(wallet.account());
      if (wallet.isSignedIn()) {
        const accountId = wallet.getAccountId();
        // gets account balance
        const account = await near.account(accountId);
        const balance = await account.getAccountBalance();
        //console.log(account.getAccountDetails());
        //const amountInNEAR = utils.format.formatNearAmount(balance);
        const dipo = utils.format.formatNearAmount(balance.available);
        const restar = utils.format.formatNearAmount("50000000000000000000000");
        // this.balance = parseFloat(balance.total)/10**24
        this.balance = (dipo - restar).toFixed(5);
        localStorage.setItem("wallet_balance", this.balance);
      }
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
        viewMethods: ["get_offers_sell", "get_offers_buy", "get_fiat_method"],
        changeMethods: [],
        sender: wallet.account()
      });
      var merchant = true;
      if (this.filter_is_merchant == true) {
        merchant = true;
      } else {
        merchant = null;
      }
      if (wallet.isSignedIn()) {
        this.listFiats = await contract.get_fiat_method();
        if (this.typeoffer == "sell") {
          this.data = await contract.get_offers_sell({
            amount: this.filter_amount,
            fiat_method: this.filter_fiat_method,
            payment_method: this.filter_payment_method,
            is_merchant: merchant
          });
          this.buttonText = this.$t("sellNEAR");
        } else {
          this.data = await contract.get_offers_buy({
            amount: this.filter_amount,
            fiat_method: this.filter_fiat_method,
            payment_method: this.filter_payment_method,
            is_merchant: merchant
          });
          this.buttonText = this.$t("buyNEAR");
        }
        for (var i = 0; i < this.data.length; i++) {
          await this.getMerchants(this.data[i].owner_id);
        }
        this.loading = false;
      }
    },
    async getMerchants(user_id) {
      var merchants = "";
      const CONTRACT_NAME = process.env.VUE_APP_CONTRACT_NAME;
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      // create wallet connection
      // const account = await near.account();
      const wallet = new WalletConnection(near);
      // console.log(near);
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ["get_merchant"],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        merchants = await contract.get_merchant({
          user_id: user_id
        });
      }
      this.merchants.push({
        badge: merchants[0].badge,
        orders_completed: merchants[0].orders_completed,
        percentaje_completion: merchants[0].percentaje_completion.toFixed(2)
      });
    },
    async acceptOrder() {
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
        viewMethods: ["get_user"],
        changeMethods: ["accept_offer"],
        sender: wallet.account()
      });
      var offer_type = null;
      var mail_info = "";
      var offer_id = parseInt(this.offer_id);
      var amount = Number(this.totalremaining_amount);
      var payment_method = parseInt(this.payment_method);
      var vlamount = "0";
      //Clear variables from localstorage
      localStorage.removeItem("wallet_balance");
      localStorage.removeItem("receive");
      localStorage.removeItem("remaining_amount");
      if (this.typeoffer == "sell") {
        offer_type = 1;
        mail_info = "buy";
        vlamount = this.NEARyoctoNEAR(this.totalremaining_amount);
      } else {
        offer_type = 2;
        mail_info = "buy";
        vlamount = "1";
      }
      var now = moment()
        .format("YYYY-MM-DD HH:mm:ss")
        .toString();
      if (wallet.isSignedIn()) {
        this.user_mail = await contract.get_user({
          user_id: this.owner_id
        });
        //console.log(this.user_mail[0].email);
        if (this.user_mail[0].email != "") {
          var request = new XMLHttpRequest();
          request.open(
            "GET",
            MAIL + this.user_mail[0].email + "/0/" + mail_info
          );
          request.send();
        }
        await contract.accept_offer(
          {
            offer_type: offer_type,
            offer_id: offer_id,
            amount: amount,
            payment_method: payment_method,
            datetime: now
          },
          "300000000000000", // attached GAS (optional)
          vlamount // attached deposit in yoctoNEAR (optional)
        );
      }
    },
    yoctoNEARNEAR: function(yoctoNEAR) {
      const { utils } = nearAPI;
      const amountInNEAR = utils.format.formatNearAmount(yoctoNEAR);
      // console.log(amountInNEAR);
      return amountInNEAR.toString();
    },
    NEARyoctoNEAR: function(NEARyocto) {
      const { utils } = nearAPI;
      const amountInYocto = utils.format.parseNearAmount(NEARyocto);
      // console.log(amountInYocto);
      return amountInYocto.toString();
    },
    showDrawer(
      all,
      price,
      min,
      max,
      offer_id,
      payment_method,
      time,
      owner_id,
      terms_conditions,
      badge,
      fiat
    ) {
      this.all = all;
      this.price = price;
      this.min = min;
      this.max = max;
      this.offer_id = offer_id;
      this.listPayments = payment_method;
      localStorage.setItem(owner_id, time);
      this.owner_id = owner_id;
      this.time = time;
      this.terms_conditions = terms_conditions;
      this.badge = badge;
      this.fiat = fiat;
      this.listPayments.sort((a, b) =>
        a.payment_method > b.payment_method ? -1 : 1
      );
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    next(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          this.current++;
        }
      });
    },
    next1() {
      this.current++;
    },
    prev() {
      this.current--;
    },
    putAll() {
      var balance = localStorage.getItem("wallet_balance");
      // console.log(balance);
      if (this.all > balance) {
        this.form.setFieldsValue({ ["remaining_amount"]: balance });
        //This fix the bug when the drawer is opened and the user clicks on a row, needed do it twice
        setTimeout(() => {
          this.form.setFieldsValue({ ["remaining_amount"]: balance });
        }, 1);
        this.onChangeToken(balance);
      } else {
        this.form.setFieldsValue({ ["remaining_amount"]: this.all });
        //This fix the bug when the drawer is opened and the user clicks on a row, needed do it twice
        setTimeout(() => {
          this.form.setFieldsValue({ ["remaining_amount"]: this.all });
        }, 1);
        this.onChangeToken(this.all);
      }
    },
    onChangeToken(e) {
      var amount = e * this.price - e * this.price * this.fee;
      //console.log(amount)
      this.form.setFieldsValue({ ["receive"]: amount.toFixed(3) });
      localStorage.setItem("remaining_amount", e);
      localStorage.setItem("receive", amount);
      this.totalremaining_amount = localStorage.getItem("remaining_amount");
      this.totalreceive = localStorage.getItem("receive");
    },
    onChangeReceive(e) {
      var amount = e / this.price + (e / this.price) * this.fee;
      this.form.setFieldsValue({ ["remaining_amount"]: amount.toFixed(3) });
      this.total = amount.toFixed(3);
      localStorage.setItem("remaining_amount", amount);
      localStorage.setItem("receive", e);
      this.totalremaining_amount = localStorage.getItem("remaining_amount");
      this.totalreceive = localStorage.getItem("receive");
    },
    checkPrice(rule, value, callback) {
      if (value > this.all) {
        callback(this.$t("novalid"));
        this.form.setFieldsValue({ ["receive"]: "" });
      } else if (value == "") {
        callback(this.$t("novalid"));
        this.form.setFieldsValue({ ["receive"]: "" });
      } else if (value == null) {
        callback(this.$t("novalid"));
        this.form.setFieldsValue({ ["receive"]: "" });
      } else if (value > this.max) {
        callback(this.$t("novalid"));
        this.form.setFieldsValue({ ["receive"]: "" });
      } else if (value < this.min) {
        callback(this.$t("novalid"));
        this.form.setFieldsValue({ ["receive"]: "" });
      } else if (value > localStorage.getItem("wallet_balance")) {
        callback(this.$t("nobalance"));
        this.form.setFieldsValue({ ["receive"]: "" });
      } else {
        callback();
      }
    },
    checkPriceReceive(rule, value, callback) {
      var amount = value / this.price + (value / this.price) * this.fee;
      if (amount.toFixed(3) > this.all) {
        callback(this.$t("novalid"));
        this.form.setFieldsValue({ ["remaining_amount"]: "" });
      } else if (amount.toFixed(3) > this.max) {
        callback(this.$t("novalid"));
        this.form.setFieldsValue({ ["remaining_amount"]: "" });
      } else if (amount.toFixed(3) < this.min) {
        callback(this.$t("novalid"));
        this.form.setFieldsValue({ ["remaining_amount"]: "" });
      } else if (amount > localStorage.getItem("wallet_balance")) {
        callback(this.$t("nobalance"));
        this.form.setFieldsValue({ ["remaining_amount"]: "" });
      } else {
        callback();
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    paymentHandleChange(value) {
      localStorage.setItem("payment_method", this.listPayments[value].id);
      localStorage.setItem(
        "payment_method_desc",
        this.listPayments[value].payment_method
      );
      this.payment_method = localStorage.getItem("payment_method");
      this.payment_method_desc = localStorage.getItem("payment_method_desc");
    },
    getFiat(value) {
      // console.log(this.listFiats.filter(fiat => fiat.id == value)[0].fiat_method.split(" - ")[0]);
      return this.listFiats
        .filter(fiat => fiat.id == value)[0]
        .fiat_method.split(" - ")[0];
    },
    payment() {
      this.$router.push({ path: "/account/bank" });
    },
    pollData() {
      this.polling = setInterval(() => {
        this.fetch();
      }, 60000);
    },
    
  }
};
</script>
<style lang="less">
@import "index";
</style>
