<template>
  <page-layout :avatar="userAvatar">
    <div slot="headerContent">
      <div class="subtitle">
        <h1>{{ welcome.timeFix }}, {{ userInfo }}, {{ welcome.message }}</h1>
      </div>
    </div>
    <template slot="extra">
      <head-info class="split-right" style="color:red" :title="$t('project')" content="1" />
      <head-info class="split-right" :title="$t('ranking')" content="90%" />
    </template>
    <template>
      <a-row type="flex">
        <a-col :xxl="12" :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
          <a-card title="Wallet" class="card">
            <p
              style="fontSize: 16px;color: rgba(0, 0, 0, 0.85); marginBottom: 16px;fontWeight: bold"
            >
              <a-icon type="user" />
              Detail Account
            </p>
            <a-row type="flex" style="margin-top: 25px;">
              <a-col :xxl="14" :xl="14" :lg="14" :md="14" :sm="14" :xs="24">
                <p style="font-size: 18px">
                  Wallet ID:
                </p>
              </a-col>
              <a-col :xxl="10" :xl="10" :lg="10" :md="10" :sm="10" :xs="24">
                <p class="gZWbPN">
                  <a-icon type="user" />
                  {{ userInfo }}
                </p>
              </a-col>
            </a-row>
            <a-row type="flex" style="margin-top: 50px">
              <a-col :xxl="14" :xl="14" :lg="14" :md="14" :sm="14" :xs="24">
                <p style="font-size: 18px">
                  {{ $t('near') }}
                </p>
              </a-col>
              <a-col :xxl="10" :xl="10" :lg="10" :md="10" :sm="10" :xs="24">
                <p class="balance">
                  ≈ $ {{ balanceDollar | numericFormat(numericFormatConfig) }}
                </p>
                <p class="balance-near">{{ balance }} NEAR</p>
                <p class="balance-near">$ {{ lastPrice.lastPrice | numericFormat(numericFormatConfig) }}</p>
              </a-col>
            </a-row>
            <a-row type="flex" style="margin-top: 50px;">
              <a-col :xxl="14" :xl="14" :lg="14" :md="14" :sm="14" :xs="24">
                <p style="font-size: 18px">
                   {{ $t('tether') }}
                </p>
              </a-col>
              <a-col :xxl="10" :xl="10" :lg="10" :md="10" :sm="10" :xs="24">
                <p class="balance">= $ {{ tether/1000000 | numericFormat(numericFormatConfig) }}</p>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col
          :xxl="10"
          :xl="10"
          :lg="10"
          :md="24"
          :sm="24"
          :xs="24"
          class="col-recent"
        >
          <a-card title="Recent Activity" class="card">
            <a-list item-layout="horizontal" :data-source="data">
              <a-list-item slot="renderItem" slot-scope="item">
                <a-list-item-meta class="list" :description="item.from">
                  <a
                    slot="title"
                    :href="item.links"
                    target="_blank"
                    class="list"
                    >{{ item.title }}
                  </a>
                  <a-avatar slot="avatar" :src="item.avatar" />
                </a-list-item-meta>
                <div>{{ item.time }}</div>
              </a-list-item>
              <a-button
                type="link"
                size="large"
                block
                class="button-near-blockchain"
                @click="explorer()"
              >
                View All
              </a-button>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </template>
  </page-layout>
</template>

<script>
import { mapGetters } from "vuex";
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import * as nearAPI from "near-api-js";
import { BINANCE_NEAR } from "@/services/api";
import { CONFIG } from "@/services/api";
const { connect, keyStores, WalletConnection, providers, Contract, utils } = nearAPI;
const NOMBRE = process.env.VUE_APP_NAME;

export default {
  name: "Wallet",
  components: { HeadInfo, PageLayout },
  i18n: require("./i18n"),
  data() {
    return {
      data: [],
      tether: [],
      lastPrice: [],
      projects: [],
      loading: true,
      activities: [],
      teams: [],
      welcome: {
        timeFix: "",
        message: "",
      },
      design: [],
      balance: "",
      balanceblock: "",
      balanceDollar: "",
      numericFormatConfig: {
        decimalSeparator: ".",
        fractionDigitsMax: 2,
        fractionDigitsMin: 2,
        fractionDigitsSeparator: "",
        thousandsDigitsSeparator: ","
      }
    };
  },
  computed: {
    ...mapGetters("account", ["userInfo", "userAvatar"])
  },
  created() {
    const renderWelcomeMsg = (currentTime = new Date()) => {
      const currentHour = currentTime.getHours();
      const splitAfternoon = 12; // 24hr time to split the afternoon
      const splitEvening = 17; // 24hr time to split the evening

      if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
        // Between 12 PM and 5PM
        return this.$t("goodafternoon");
      } else if (currentHour >= splitEvening) {
        // Between 5PM and Midnight
        return this.$t("goodevening");
      }
      // Between dawn and noon
      return this.$t("goodmorning");
    };
    this.welcome.timeFix = renderWelcomeMsg();

    const message = [
      this.$t("message1"),
      this.$t("message2"),
      this.$t("message3"),
      this.$t("message4"),
      this.$t("message5"),
      this.$t("message6")
    ];
    this.welcome.message = message[Math.floor(Math.random() * message.length)];
    this.fetch();
    setTimeout(this.fetch(), 1000);
    setTimeout(this.fetch(), 1000);
    this.getBalance();
    this.getBalanceTether();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get('account_id') !== null) {
      this.$router.push({ path: '/dashboard/wallet', replace: true })
    }
  },
  methods: {
    fetch() {
      var request = new XMLHttpRequest();
      request.open("GET", BINANCE_NEAR);
      request.send();
      request.onload = () => {
        this.lastPrice = JSON.parse(request.responseText);
      };
    },
    async getBalance() {
      // connect to NEAR
      //console.log(new keyStores.BrowserLocalStorageKeyStore())
      const near = await connect(CONFIG(new keyStores.BrowserLocalStorageKeyStore()));
      const wallet = new WalletConnection(near);
      //console.log(wallet.account());
      if (wallet.isSignedIn()) {
        const accountId = wallet.getAccountId();
        // gets account balance
        const account = await near.account(accountId);
        const balance = await account.getAccountBalance();
        //const amountInNEAR = utils.format.formatNearAmount(balance);
        const dipo = utils.format.formatNearAmount(balance.available);
        const restar = utils.format.formatNearAmount("50000000000000000000000");
        // this.balance = parseFloat(balance.total)/10**24
        this.balance = (dipo - restar).toFixed(5);
        localStorage.setItem("wallet_balance", this.balance); 
        this.balanceDollar = this.balance * this.lastPrice.lastPrice;
        this.balanceblock = (0.25 * this.lastPrice.lastPrice).toFixed(2);
      }
    },
    async getBalanceTether() {
      // connect to NEAR
      const CONTRACT_NAME = process.env.VUE_APP_CONTRACT_NAME_TETHER;
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      // create wallet connection
      // const account = await near.account();
      const wallet = new WalletConnection(near);
      // console.log(near);
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ["ft_balance_of"],
        changeMethods: [],
        sender: wallet.account()
      });
      if (wallet.isSignedIn()) {
          this.tether = await contract.ft_balance_of({
            account_id: wallet.getAccountId(),
          });
        // console.log("tether", this.tether/1000000);
      }
    },
    async getTransactions() {
      //config.nodeUrl = "https://archival-rpc.testnet.near.org"
      //const near = await connect(config);
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      //  create wallet connection
      const wallet = new WalletConnection(near, NOMBRE); // autorizamos la conexion a una wallet
       //preguntamos si hay una sesion activa
      const accountId = wallet.getAccountId() 

      // block hash of query start (oldest block)
      //const startBlock = "7svwjRr6UWykHx5ArgtnySLvxu9UTb1uLM6sBVpiaGDL";
      // block hash of query end (newest block)
      const endBlock = "DDgKcVFw8j81CTkNDFuPNE4YZmqt35aYodtY4PiXCmAe";
      // contract ID or account ID you want to find transactions details for
      //const accountId = walletAccountId;

      // creates an array of block hashes for given range
      const blockArr = [];
      let blockHash = endBlock;
      let limite = 5;
      for(let i=0;i<limite;i++) {
        const currentBlock = await this.getBlockByID(blockHash);
        //console.log(currentBlock)
        blockArr.push(currentBlock.header.hash);
        blockHash = currentBlock.header.prev_hash;
        console.log(i, "working...", blockHash);
      }
      // returns block details based on hashes in array
      //console.log(near)
      const blockDetails = await Promise.all(
        blockArr.map((blockId) =>
          near.connection.provider.block({
            blockId,
          })
        )
      );

      // returns an array of chunk hashes from block details
      const chunkHashArr = blockDetails.flatMap((block) =>
        block.chunks.map(({ chunk_hash }) => chunk_hash)
      );

      //returns chunk details based from the array of hashes
      const chunkDetails = await Promise.all(
        chunkHashArr.map(chunk => near.connection.provider.chunk(chunk))
      );
      // checks chunk details for transactions
      // if there are transactions in the chunk we
      // find ones associated with passed accountId
      const transactions = chunkDetails.flatMap((chunk) =>
        (chunk.transactions || []).filter((tx) => tx.signer_id === accountId)
      );

      //creates transaction links from matchingTxs
      const txsLinks = transactions.map((txs) => ({
        //method: txs.actions[0].FunctionCall.method_name,
        link: `https://explorer.testnet.near.org/transactions/${txs.hash}`,
      }));
      console.log("MATCHING TRANSACTIONS: ", transactions);
      console.log("TRANSACTION LINKS: ", txsLinks);
      var title = ''
      if(transactions[0].actions[0].AddKey.access_key.permission == "FullAccess") {
        title = "Access Key added"
      }
      this.data = [
        {
          title: title,
          avatar: "https://img.icons8.com/material/24/26e07f/left-down2--v1.png",
          from: "From : " + transactions[0].signer_id,
          time: "1H",
          links: txsLinks[0].link,
        },
      ]
    },
    async getBlockByID(blockID) {
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      const blockInfoByHeight = await near.connection.provider.block({
        blockId: blockID,
      });
      return blockInfoByHeight;
    },
    async getState() {
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      //  create wallet connection
      const wallet = new WalletConnection(near, NOMBRE); // autorizamos la conexion a una wallet
       //preguntamos si hay una sesion activa
      const walletAccountId = wallet.getAccountId() 
      //network config (replace testnet with mainnet or betanet)
      const provider = new providers.JsonRpcProvider(
        "https://archival-rpc.testnet.near.org"
      );

      const txHash = "68Bv69wDzXEhHNSWyio8Avui7dGVN85oJeuaWW6B6ohh";
      // account ID associated with the transaction
      const accountId = walletAccountId;

      //getState(TX_HASH, ACCOUNT_ID);

      const result = await provider.txStatus(txHash, accountId);
      console.log("Result: ", result);
    },
    async explorer() {
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      // create wallet connection
      const wallet = new WalletConnection(near, NOMBRE); // creamos la conexion a una wallet
      const accountId = wallet.getAccountId();
      window.open("https://explorer.testnet.near.org/accounts/" + accountId)
    },
  }
};
</script>

<style lang="less">
@import "index";
</style>
