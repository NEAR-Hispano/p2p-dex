<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" :src="userAvatar" />
      <span class="name">{{ userInfo }}</span>
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px;" type="poweroff" />
        <span>{{ $t('logout') }}</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapGetters } from "vuex";
import { logout } from "@/services/user";
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";
const { connect, keyStores, WalletConnection } = nearAPI;

export default {
  name: "HeaderAvatar",
  i18n: require("./i18n"),
  computed: {
    ...mapGetters("account", ["userInfo","userInfoLastLogin","userAvatar"])
  },
  methods: {
    async logout() {
      logout();
      // logout();
      // connect to NEAR
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      //const near = await connect(config);
      // create wallet connection
      const wallet = new WalletConnection(near);
      wallet.signOut();
      this.$router.push("/login");
    },
  }
};
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;
  .avatar,
  .name {
    align-self: center;
  }
  .avatar {
    margin-right: 8px;
  }
  .name {
    font-weight: 500;
  }
}
.avatar-menu {
  width: 150px;
}
</style>
