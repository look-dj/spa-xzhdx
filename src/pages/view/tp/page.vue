<template>
  <v-container fluid :class="$vuetify.breakpoint.xs ? 'moble_container' : 'px-12'">
    <!-- <v-subheader>{{$vuetify.breakpoint.xs?'关于':'关于雪中'}}</v-subheader> -->
    <v-subheader v-if="sonColumn.length>0">
      <span>子栏目:</span>
      <v-btn small class="mx-2" text v-for="(item,idx) in sonColumn" :key="idx">{{item.name}}</v-btn>
    </v-subheader>
    <v-card flat color="transparent">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-textarea solo label="摘要" auto-grow v-model="pageModel.description"></v-textarea>
          </v-col>
          <v-col cols="12">
            <span class="mb-3 d-block">请编辑内容</span>
            <editor v-model="pageModel.content"></editor>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn
          width="100"
          class="mx-3"
          @click="submit(pageType)"
          :style="[theme.bg_p,theme.co]"
        >{{pageType==='add'?'提交':'确认修改'}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import { Api, readPageByNid } from "@api";
export default {
  inject: ["getSonColumn"],
  name: "page",
  data: () => ({
    pageType: "add",
    pageModel: {
      pid: null,
      content: "",
      description: "",
    },
    sonColumn: [],
    api: new Api("page"),
    nid: null,
  }),
  async mounted() {
    let that = this;
    that.nid = that.$route.query.nid; //节点id 通过节点id获得栏目信息 通过栏目信息获得文章
    that.readPage();
    that.sonColumn = that.getSonColumn(that.$route.query.nid);
  },
  methods: {
    async readPage() {
      let that = this;
      try {
        let result = await readPageByNid({ nid: that.nid }, that);
        if (result.data.pid) {
          that.pageModel.pid = result.data.pid;
        }
        if (!result.data.id) return (that.pageType = "add");
        that.pageModel = result.code === 200 ? result.data : {};
        that.pageType = "edit";
        that.pageModel.pid = result.data.pid;
      } catch (e) {
        console.log(e);
      }
    },
    async submit() {
      let that = this;
      if (that.pageType !== "add") return that.updatePage();
      if (that.pageModel.content === "")
        return that.$hint({ msg: "请输入内容" });
      that.pageModel.date = new Date().valueOf();
      that.pageModel.show = true;
      try {
        let result = await that.api.add(that.pageModel, that);
        that.$hint({
          msg: result.msg,
          type: result.code === 200 ? "success" : "error",
        });
      } catch (e) {
        console.log(e);
      }
    },
    async updatePage() {
      let that = this;
      if (that.pageModel.content === "")
        return that.$hint({ msg: "请输入内容" });
      that.pageModel.date = new Date().valueOf();
      try {
        let result = await that.api.update(that.pageModel, that);
        that.$hint({ msg: result.msg });
      } catch (e) {
        console.log(e);
      }
    },
  },
  components: {
    editor: () => import("@components/editor.vue"),
  },
  computed: {
    theme() {
      return this.$store.getters.getTheme;
    },
  },
  // wtach: {
  //   "pageModel.cid"(val, old) {
  //     console.log(val, old);
  //     if (val !== old) {
  //       this.$forceUpdate();
  //     }
  //   },
  // },
};
</script>
<style lang="scss" scoped>
</style>