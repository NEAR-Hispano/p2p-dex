<template>
  <div>
    <a-table :columns="columns" :data-source="data" :loading="loading">
      <template slot="merchants" slot-scope="text">
        <p style="color:#0071ce; font-size: 16px">
          {{ text }}
          <a-icon
            type="check-circle"
            style="margin-left:5px"
            two-tone-color="#ffce3b"
            theme="twoTone"
          />
        </p>
        <span style="color:gray; font-size: 12px"
          >948 {{ orders }} | 96.83% {{ completion }}</span
        >
      </template>

      <template slot="exchange_rate" slot-scope="text">
        <span style="color:black; font-size:18px">$ {{ text }} USD</span>
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
            <span style="color:gray; font-size: 12px"
              >{{ limit }} min - max:</span
            >
          </a-col>
          <a-col :xxl="8" :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
            <span style="color:black;"
              >${{ record.min_limit }} - ${{ record.max_limit }}</span
            >
          </a-col>
        </a-row>
      </template>

      <template slot="payment_method" slot-scope="text">
        <li
          style="font-size: 11px; color: green"
          v-for="item in text"
          :key="item.id"
        >
          <a-tooltip :title="item.payment_method">
            {{ item.payment_method }}
          </a-tooltip>
        </li>
      </template>

      <template slot="action" slot-scope="record">
        <a-button
          type="primary"
          size="large"
          @click="
            showDrawer(
              record.remaining_amount,
              record.exchange_rate,
              record.min_limit,
              record.max_limit,
              record.offer_type,
              record.offer_id,
              record.payment_method,
              record.time,
              record.owner_id
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
      width="650"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <a-row :gutter="16">
        <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
          <p style="font-size: 16px; font-weight: bold;">
            {{ $t("terms") }}
          </p>
          <a-row :gutter="16">
            <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
              <p>
                attention if you have perfect money Wallet only place order
                other way not 🚫🚫🚭🚫🚫 only perfect money account accepted for
                sending payment if you have not perfect money account kindly
                don't open trade
              </p>
            </a-col>
            <a-col :xxl="24" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
              <p style="color:#0071ce; font-size: 16px">
                carla.testnet
                <a-icon
                  type="check-circle"
                  style="margin-left:5px"
                  two-tone-color="#ffce3b"
                  theme="twoTone"
                />
              </p>
            </a-col>
            <a-col :xxl="12" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
              <p style="color:gray; font-size: 12px">
                {{ $t("paymenttimelimit") }}:
                <span style="color:black">{{ time }}</span>
              </p>
            </a-col>
            <a-col :xxl="12" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
              <p style="color:gray; font-size: 12px">
                {{ $t("price") }}:
                <span style="color:rgb(218, 25, 25)">{{ price }} USD</span>
              </p>
            </a-col>
            <a-col :xxl="12" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
              <p style="color:gray; font-size: 12px">
                {{ $t("amount") }}:
                <span style="color:black">{{ all }} NEAR</span>
              </p>
            </a-col>
            <a-col :xxl="12" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
              <p style="color:gray; font-size: 12px">
                {{ $t("payments") }}:
                <span style="color:green">mercantil Pago movil</span>
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
                      :xs="24">
                      <a-form-item :label="$t('payments')">
                        <a-select
                          show-search
                          :placeholder="allpayments"
                          option-filter-prop="children"
                          @change="paymentHandleChange"
                          style="width: 99%;margin-top: 5px"
                          v-decorator="[
                            {
                              rules: [
                                { required: true, message: $t('requiredfield') }
                              ]
                            }
                          ]"
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
                    <a-col
                      :xxl="24"
                      :xl="24"
                      :lg="24"
                      :md="24"
                      :sm="24"
                      :xs="24"
                    >
                      <a-form-item :label="$t('sellUSDT')">
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
                          style="font-size: 12px; font-weight: bold; margin-top: -20px !important; color:#ffce3b; float: right; margin-right: 13px;"
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
                      <a-button block>{{ $t("method") }}</a-button>
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
                      <a-form-item :label="$t('sellUSDT')">
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
import { CONFIG } from "@/services/api";
import { mapGetters } from "vuex";
const { connect, keyStores, WalletConnection, Contract, utils } = nearAPI;

export default {
  name: "CountriesTable",
  i18n: require("./i18n"),
  data() {
    return {
      columns: [
        {
          title: this.$t("advertisers"),
          dataIndex: "owner_id",
          defaultSortOrder: "ascend",
          sorter: (a, b) => a.owner_id.localeCompare(b.owner_id),
          scopedSlots: { customRender: "merchants" }
        },
        {
          title: this.$t("price"),
          dataIndex: "exchange_rate",
          defaultSortOrder: "ascend",
          sorter: (a, b) => a.asset.localeCompare(b.asset),
          scopedSlots: { customRender: "exchange_rate" }
        },
        {
          title: this.$t("limitavailable"),
          dataIndex: "amount",
          defaultSortOrder: "ascend",
          sorter: (a, b) => a.amount.localeCompare(b.amount),
          scopedSlots: { customRender: "limit" }
        },
        {
          title: this.$t("payment"),
          dataIndex: "payment_method",
          defaultSortOrder: "ascend",
          sorter: (a, b) => a.amount.localeCompare(b.amount),
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
      allpayments: this.$t("allpayments"),
      loading: false,
      title: "",
      filter_value: "asset",
      value: "USDT",
      typeoffer: "sell",
      buttonText: this.$t("sellUSDT"),
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
      time : "",
      payment_method_desc: "",
      current: 0,
      form: this.$form.createForm(this),
      all: 0,
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
      ]
    };
  },
  mounted() {
    this.title = this.$t("title");
    this.fetch();
    this.getBalance();
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
        changeMethods: ["set_payment_method"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        if (this.typeoffer == "sell") {
          this.data = await contract.get_offers_sell({
            campo: this.filter_value,
            valor: this.value.toString()
          });
          this.buttonText = this.$t("sellUSDT");
          // console.log(this.data);
        } else {
          this.data = await contract.get_offers_buy({
            campo: this.filter_value,
            valor: this.value.toString()
          });
          this.buttonText = this.$t("buyNEAR");
        }
        //console.log(this.data);
        this.loading = false;
      }
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
        changeMethods: ["accept_offer"],
        sender: wallet.account()
      });
      var offer_type = 1;
      if (this.typeoffer == "sell") {
        offer_type = 1;
      } else {
        offer_type = 2;
      }
      var offer_id = parseInt(this.offer_id);
      var amount = Number(this.totalremaining_amount);
      var payment_method = parseInt(this.payment_method);
      const now = new Date();
      if (wallet.isSignedIn()) {
        await contract.accept_offer(
          {
            offer_type: offer_type,
            offer_id: offer_id,
            amount: amount,
            payment_method: payment_method,
            time: now
          },
          "300000000000000", // attached GAS (optional)
          this.NEARyoctoNEAR(this.totalremaining_amount) // attached deposit in yoctoNEAR (optional)
        );
        //Clear variables from localstorage
        localStorage.removeItem("wallet_balance");
        localStorage.removeItem("receive");
        localStorage.removeItem("remaining_amount");
        localStorage.setItem("accepted_order", true);
      }
    },
    yoctoNEARNEAR: function(yoctoNEAR) {
      const { utils } = nearAPI;
      const amountInNEAR = utils.format.formatNearAmount(yoctoNEAR);
      // console.log(amountInNEAR);
      return amountInNEAR;
    },
    NEARyoctoNEAR: function(NEARyocto) {
      const { utils } = nearAPI;
      const amountInYocto = utils.format.parseNearAmount(NEARyocto);
      // console.log(amountInYocto);
      return amountInYocto;
    },
    showDrawer(all, price, min, max, offer_id, payment_method, time, owner_id) {
      this.all = all;
      this.price = price;
      this.min = min;
      this.max = max;
      this.offer_id = offer_id;
      this.listPayments = payment_method;
      this.time = time;
      localStorage.setItem(owner_id, time);
      this.listPayments.sort((a, b) =>
          a.payment_method > b.payment_method ? 1 : -1
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
          //console.log(values);
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
      if (this.all > localStorage.getItem("wallet_balance")) {
        this.form.setFieldsValue({
          ["remaining_amount"]: localStorage.getItem("wallet_balance")
        });
        //This fix the bug when the drawer is opened and the user clicks on a row, needed do it twice
        setTimeout(() => {
          this.form.setFieldsValue({
            ["remaining_amount"]: localStorage.getItem("wallet_balance")
          });
        }, 1);
      } else {
        this.form.setFieldsValue({ ["remaining_amount"]: this.all });
        //This fix the bug when the drawer is opened and the user clicks on a row, needed do it twice
        setTimeout(() => {
          this.form.setFieldsValue({ ["remaining_amount"]: this.all });
        }, 1);
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
      } else if (amount.toFixed(3) == 0) {
        callback(this.$t("novalid"));
        this.form.setFieldsValue({ ["remaining_amount"]: "" });
      } else if (amount.toFixed(3) == "") {
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
    paymentHandleChange(value) {
      localStorage.setItem("payment_method", value);
      localStorage.setItem("payment_method_desc", this.listPayments[value-1].payment_method);
      this.payment_method = localStorage.getItem("payment_method");
      this.payment_method_desc = localStorage.getItem("payment_method_desc");
    },
  }
};
</script>
<style lang="less">
@import "index";
</style>
