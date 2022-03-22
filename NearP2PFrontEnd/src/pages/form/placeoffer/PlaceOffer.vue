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
      <head-info class="split-right" :title="$t('ranking')" content="90%" />
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
              </a-tab-pane>
              <a-tab-pane key="sell" :tab="sell">
                <a-table
                  :columns="columns"
                  :data-source="data"
                  :loading="loading"
                >
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
      bodyStyle="max-width:750px"
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
                <a-select-option value="1">
                  {{ $t("ordersBuy") }}
                </a-select-option>
                <a-select-option value="2">
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
                  'payment_method_id',
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
            <a-form-item :label="$t('amount')" style="margin-top:5px">
              <a-input-number
                v-decorator="[
                  'amount',
                  {
                    rules: [{ required: true, message: $t('requiredfield') }]
                  }
                ]"
                :placeholder="$t('amount')"
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
                    rules: [{ required: true, message: $t('requiredfield') }]
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
      listFiats: [],
      databuy: [],
      typeoffer: "sell",
      listPayments: [],
      loading: false,
      orderssell: [],
      ordersbuy: [],
      opc: "",
      active_orders: "0",
      title: this.$t("title"),
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
    if (localStorage.getItem("userlength") == 0) {
      this.$router.push("/account/myaccount");
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
          "get_offers_buy"
        ],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        this.listFiats = await contract.get_fiat_method();
        this.listPayments = await contract.get_payment_method();
        this.data = await contract.get_offers_buy({
          owner_id: this.userInfo
        });
        this.databuy = await contract.get_offers_sell({
          owner_id: this.userInfo
        });

        this.orderssell = await contract.get_order_sell({
          signer_id: this.userInfo
        });
        this.ordersbuy = await contract.get_order_buy({
          signer_id: this.userInfo
        });
        this.active_orders =
          parseInt(this.orderssell.length) + parseInt(this.ordersbuy.length);
      }
      this.loading = false;
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
          //console.log("Received values of form: ", values);
          this.set_payment_method_user(
            values.payment_method_id,
            values.input1,
            values.input2,
            values.input3,
            values.input4,
            values.input5,
            "1"
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
      terms_conditions
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
        changeMethods: ["set_offers_sell", "set_offers_buy"],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
        if (this.opc == "1") {
          await contract.set_offers_sell(
            {
              owner_id: this.userInfo,
              asset: asset,
              exchange_rate: exchange_rate,
              amount: amount,
              min_limit: min_limit,
              max_limit: max_limit,
              payment_method: payment_method,
              fiat_method: fiat_method,
              time: time,
              terms_conditions: terms_conditions
            },
            "300000000000000", // attached GAS (optional)
            "1" // attached deposit in yoctoNEAR (optional)
          );
        } else {
          await contract.set_offers_buy(
            {
              owner_id: this.userInfo,
              asset: asset,
              exchange_rate: exchange_rate,
              amount: amount,
              min_limit: min_limit,
              max_limit: max_limit,
              payment_method: payment_method,
              fiat_method: fiat_method,
              time: time,
              terms_conditions: terms_conditions
            },
            "300000000000000", // attached GAS (optional)
            "1" // attached deposit in yoctoNEAR (optional)
          );
        }
      }
    },
    handleChange(value) {
      this.opc = value;
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    }
  }
};
</script>
<style lang="less">
@import "index";
</style>
