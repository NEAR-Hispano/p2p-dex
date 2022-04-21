<template>
  <div class="wrapper">
    <header>
      <h1 style="color: white">{{ this.$t("chat_text") }}</h1>
      <div v-if="imageData != null">
        <img class="img.preview" :src="picture" />
        <br />
      </div>
    </header>
    <section>
      <main>
        <div
          v-for="(msg, index) in messages"
          v-bind:key="'index-' + index"
          :class="['message', sentOrReceived(msg.userUID)]"
        >
          <div
            v-if="msg.photoURL"
            class="photo-sended"
            :style="{ 'background-image': `url(${msg.photoURL})` }"
          ></div>
          <p v-if="msg.text">
            {{ msg.text }}
          </p>
        </div>

        <div ref="scrollable"></div>
      </main>

      <form @submit="sendMessage">
        <input
          v-model="message"
          ref="input"
          type="text"
          :placeholder="tmessage"
        />

        <div
          v-if="photo"
          @click="photo = null"
          class="photo-preview"
          :style="{ 'background-image': `url(${messagePhoto})` }"
        ></div>

        <button
          @click="$refs.file.click()"
          type="button"
          class="button"
        >
          <a-icon type="cloud-upload" />
        </button>
        <input
          @change="onFileChange"
          ref="file"
          type="file"
          class="inputfile"
          style="display: none !important;"
          autofocus
        />

        <button type="submit">
          <a-icon type="caret-right" />
        </button>
      </form>
    </section>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import { db } from "./fire";
import { getAuth, signInAnonymously } from "firebase/auth";
import { mapGetters } from "vuex";

export default {
  name: "Chat",
  i18n: require("./i18n"),
  data() {
    return {
      user: firebase.auth().currentUser,
      db: firebase.firestore(),
      message: "",
      tmessage: this.$t("enter_message"),
      messages: [],
      photos: [],
      photo: null,
      //fileURL: null,
      //isloading: false,
      uploadValue: 0,
      imageData: null,
      room: "room" + this.$route.query.order
      //picture: 'url',
    };
  },
  computed: {
    messagePhoto() {
      return URL.createObjectURL(this.photo);
    },
    ...mapGetters("account", ["userInfo"])
  },
  async mounted() {
    // RUTINA PARA CREAR LA SALA DE CHAT
    const room1Ref = db.collection(this.room);
    const snapshot = await room1Ref.where("displayName", "==", "NEAR");
    if (!snapshot.empty) {     
      const auth = getAuth();
      signInAnonymously(auth).then(() => {
        this.user = auth.currentUser;
        /*
        const messageInfo = {
          userUID: this.user.uid,
          displayName: "NEAR",
          //text: this.$t("helloFrom") + " " + this.userInfo,
          created: 0
        };*/
        db.collection(this.room)
          .orderBy("created")
          .onSnapshot(querySnap => {
            this.messages = querySnap.docs.map(doc => doc.data());
          });
        this.$refs["scrollable"].scrollIntoView({ behavior: "smooth", block: "end" });

        return;
      });
      
    }
    return;
  },
  methods: {
    onFileChange(event) {
      this.photo = event.target.files[0];
      this.$refs.input.focus();
    },

    async Confirmar() {
      const query = await db
        .collection(this.room)
        .where("created", ">", 0)
        .orderBy("created")
        .get();

      query.forEach(querySnapshot => console.log(querySnapshot.data()));
    },

    sentOrReceived(userUID) {
      return userUID === this.user.uid ? "sent" : "received";
    },

    async sendMessage(event) {
      event.preventDefault();

      if (this.photo) {
        const timestamp = Date.now();
        const storageRef = firebase
          .storage()
          .ref(`${timestamp}${this.photo.name}`)
          .put(this.photo);
        storageRef.on(`state_changed`, () => {
          storageRef.snapshot.ref.getDownloadURL().then(url => {
            this.picture = url;
            //console.log(url)
            this.Grabar();
          });
        });
      } else {
        const messageInfo = {
          userUID: this.user.uid,
          displayName: this.userInfo,
          photoURL: null,
          text: this.message,
          created: Date.now(),
          room: this.room
        };
        await this.db.collection(this.room).add(messageInfo);
        this.message = "";
        this.$refs["scrollable"].scrollIntoView({ behavior: "smooth" });
      }
    },
    async Grabar() {
      const messageInfo = {
        userUID: this.user.uid,
        displayName: this.userInfo,
        photoURL: this.picture,
        text: this.message,
        created: Date.now(),
        room: this.room
      };
      await db.collection(this.room).add(messageInfo);
      this.message = "";
      this.photo = null;
      this.$refs["scrollable"].scrollIntoView({ behavior: "smooth" });
    },
  }
};
</script>

<style lang="less">
@import "index";
</style>
