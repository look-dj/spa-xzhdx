<template>
  <div class="box">
    <v-card
      v-if="type == 'setting'"
      flat
      :color="$vuetify.theme.dark ? '#1E1E1E' : '#f8f8f8'"
      class="v-card"
    >
      <v-card flat :color="$vuetify.theme.dark ? '#1E1E1E' : '#f8f8f8'">
        <v-card-title>
          <span>设置</span>
          <v-spacer></v-spacer>
          <v-btn small text @click="close">
            <v-icon>iconfont-guanbi1</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="px-2">
          <span class="text-h6 px-2">修改主题</span>
          <v-sheet
            :color="$vuetify.theme.dark ? '#1E1E1E' : '#f8f8f8'"
            class="px-2"
          >
            <v-chip
              class="ma-2"
              v-for="(item, idx) in themes"
              :key="idx"
              @click="changeTheme(item)"
              :color="active_theme == item ? theme.bg_p.background : ''"
            >
              <span
                :style="`color:${active_theme === item ? theme.co.color : ''};`"
                >{{ item }}</span
              >
            </v-chip>
            <v-card-text class="d-flex align-center pa-0">
              <v-subheader>深色模式</v-subheader>
              <v-spacer></v-spacer>
              <v-switch v-model="darkState"></v-switch>
            </v-card-text>
            <v-card-text class="d-flex align-center pa-0">
              <v-subheader>连同删除图片</v-subheader>
              <v-spacer></v-spacer>
              <v-switch v-model="isDeleteFile"></v-switch>
            </v-card-text>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-card>

    <v-card v-if="type == 'user'" flat color="#f8f8f8" class="v-card">
      <v-card flat color="#f8f8f8">
        <v-card-title>
          <span>我的信息</span>
          <v-spacer></v-spacer>
          <v-btn small text @click="close">
            <v-icon>iconfont-guanbi1</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-card class="d-flex">
            <v-card-title>
              <v-avatar>
                <v-img src="../assets/images/avater.png"></v-img>
              </v-avatar>
            </v-card-title>
            <v-card-text class="d-flex justify-center flex-column pa-0">
              <p class="ma-0">look-dj</p>
              <p class="ma-0">邮箱:look-dj@outlook.com</p>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text class="mr-5" :style="[theme.bg_p, theme.co]"
            >修改信息</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-card>
  </div>
</template>
<script>
import { theme as _theme } from "@/plugins/static.js";
export default {
  name: "theSide",
  data: () => ({
    dialog: false,
    active_theme: "",
    darkState: false,
    isDeleteFile: false,
  }),
  props: {
    type: String,
  },
  mounted() {
    let that = this;
    if (localStorage.getItem("theme"))
      that.active_theme = localStorage.getItem("theme");
    that.isDeleteFile = that.$store.state.isDeleteFile;
  },
  watch: {
    darkState(val) {
      if (val) {
        this.$store.commit("changeTheme", {
          primary: "#121212",
          assist: "#fff",
          color: "#fff",
        });
        localStorage.setItem("theme", "dark");
      } else {
        this.$store.commit("changeTheme", "light");
        localStorage.setItem("theme", "light");
      }
      this.$vuetify.theme.dark = val;
    },
    isDeleteFile(val) {
      this.$store.commit("setIsDeleteFile", val);
      localStorage.setItem("isDeleteFile", val ? 1 : 0);
    },
  },
  methods: {
    close() {
      let that = this;
      that.$emit("close");
    },
    changeTheme(theme) {
      let that = this;
      if (this.$vuetify.theme.dark) this.$vuetify.theme.dark = false;
      that.active_theme = theme;
      localStorage.setItem("theme", theme);
      that.$store.commit("changeTheme", theme);
    },
  },
  computed: {
    themes() {
      return Object.keys(_theme);
    },
    theme() {
      return this.$store.getters.getTheme;
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;
  // padding-bottom: 48px;
  & > .v-card {
    height: 100%;
    width: 100%;
  }
}
.chip_active {
  background-color: #222 !important;
}
</style>