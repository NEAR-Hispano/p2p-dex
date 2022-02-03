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
              >{{ limit }}:</span
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
          @click="showDrawer(record.remaining_amount, record.exchange_rate, record.min_limit, record.max_limit)"
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
          {{ $t('terms') }}
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
            <a-col :xxl="8" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
              <p style="color:gray; font-size: 12px">
                {{ $t('price') }}: <span style="color:rgb(218, 25, 25)">{{ price }} USD</span>
              </p>
            </a-col>
            <a-col :xxl="8" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
              <p style="color:gray; font-size: 12px">
                {{ $t('amount') }}: <span style="color:black">{{ all }} NEAR</span>
              </p>
            </a-col>
            <a-col :xxl="8" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
              <p style="color:gray; font-size: 12px">
                {{ $t('payments') }}: <span style="color:green">mercantil Pago movil</span>
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
                      <a-form-item :label="$t('sellNEAR')">
                        <a-input-number
                          style="width:100%"
                          @change="onChangeToken"
                          v-decorator="[
                           'remaining_amount',
                            {
                              rules: [
                                { validator: checkPrice }
                              ]
                            }
                          ]"
                          placeholder="0.00"
                        />
                      </a-form-item>
                      <a-button
                        type="link"
                        @click="putAll"
                        style="font-size: 12px; font-weight: bold; margin-top: -20px !important; color:#ffce3b; float: right; margin-right: 13px;"
                      >
                        {{ $t('all') }}
                      </a-button>
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
                              rules: [
                                { validator: checkPriceReceive }
                              ]
                            }
                          ]"
                          placeholder="0.00"
                        />
                      </a-form-item>
                      <p
                        style="font-size: 12px; margin-top: -10px !important; color:green; opacity: 0.7; float: right; margin-right: 13px;"
                      >
                        {{ $t('fee') }}
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
                      <a-button block>{{ $t('method') }}</a-button>
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
                        {{ $t('next') }}
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
                      <a-form-item :label="$t('sellNEAR')">
                        <p
                          style="font-size: 16px; color: black; font-weigth: bold; margin-left:30px"
                        >
                          {{ this.form.getFieldValue('remaining_amount') }}
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
                          {{ this.form.getFieldValue('receive') }}
                        </p>
                      </a-form-item>
                      <p
                        style="color:gray; font-size: 12px; margin-top: -15px !important; color:green; opacity: 0.7;"
                      >
                        {{ $t('fee') }}
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
                {{ $t('next') }}
              </a-button>
              <a-button
                v-if="current == steps.length - 1"
                type="primary"
                class="button-near-drawer"
                @click="acceptOrder"
              >
                {{ $t('done') }}
              </a-button>
              <a-button
                v-if="current > 0"
                style="margin-left: 8px"
                @click="prev"
              >
                {{ $t('previous') }}
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
      loading: false,
      title: "",
      filter_value: "asset",
      value: "NEAR",
      typeoffer: "sell",
      buttonText: this.$t("sellNEAR"),
      available: this.$t("available"),
      limit: this.$t("limit"),
      orders: this.$t("orders"),
      completion: this.$t("completion"),
      visible: false,
      offer_id: "",
      amount: "",
      payment_method: "",
      accepted_offer: false,
      current: 0,
      form: this.$form.createForm(this),
      all: 0,
      fee: 0.003,
      price : 0,
      min: 0,
      max: 0,
      steps: [
        {
          title: this.$t('Addvalues'),
          content: "First-content"
        },
        {
          title: this.$t('Readvaluesloaded'),
          content: "Second-content"
        },
        {
          title: this.$t('Confirmtransaction'),
          content: this.$t('content')
        }
      ]
    };
  },
  mounted() {
    this.title = this.$t("title");
    this.fetch();
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
          this.buttonText = this.$t("sellNEAR");
          console.log(this.data);
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
        changeMethods: ["accept_offer"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        console.log("call accept_offer");
        // console.log(this.typeoffer);
        await contract.accept_offer(
          {
            offer_type: 1,
            offer_id: 1,
            amount: "1",
            payment_method: 1 // argument name and value - pass empty object if no args required
          },
          "300000000000000", // attached GAS (optional)
          "1000000000000000000000000" // attached deposit in yoctoNEAR (optional)
        );
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
    showDrawer(all, price, min, max) {
      this.all = all;
      this.price = price;
      this.min = min;
      this.max = max;
      // console.log(this.all)
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
      this.form.setFieldsValue({ ['remaining_amount']: this.all });
      //This fix the bug when the drawer is opened and the user clicks on a row, needed do it twice
      setTimeout(() => {this.form.setFieldsValue({ ['remaining_amount']: this.all });}, 1); 
      this.onChangeToken(this.all);
    },
    onChangeToken(e) {     
      var amount = (e * this.price) - (e * this.price * this.fee);
      //console.log(amount)
      this.form.setFieldsValue({ ['receive']: amount.toFixed(3) });
    },
    onChangeReceive(e) {
      var amount = (e / this.price) + (e / this.price * this.fee);
      this.form.setFieldsValue({ ['remaining_amount']: amount.toFixed(3) });
      this.total = amount.toFixed(3)
      console.log(this.total)
    },
    checkPrice(rule, value, callback) {
      if (value > this.all) {
        callback(this.$t('novalid'));
        this.form.setFieldsValue({ ['receive']: '' });
      } else if (value > this.max) {
        callback(this.$t('novalid'));
        this.form.setFieldsValue({ ['receive']: '' });
      } else if (value < this.min) {
        callback(this.$t('novalid'));
        this.form.setFieldsValue({ ['receive']: '' });  
      } else {
        callback();
      }
    },
    checkPriceReceive(rule, value, callback) {
      var amount = (value / this.price) + (value / this.price * this.fee);
      if (amount.toFixed(3) > this.all) {
        callback(this.$t('novalid'));
        this.form.setFieldsValue({ ['remaining_amount']: '' });
      } else if (amount.toFixed(3) > this.max) {
        callback(this.$t('novalid'));
        this.form.setFieldsValue({ ['remaining_amount']: '' });
      } else if (amount.toFixed(3) < this.min) {
        callback(this.$t('novalid'));
        this.form.setFieldsValue({ ['remaining_amount']: '' });  
      } else {
        callback();
      }
    },
  }
};
</script>
<style lang="less">
@import "index";
</style>
