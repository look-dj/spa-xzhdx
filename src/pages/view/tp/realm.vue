<template>
  <v-container
    fluid
    :class="$vuetify.breakpoint.xs ? 'moble_container' : 'px-12'"
  >
    <!-- <v-subheader>{{$vuetify.breakpoint.xs?'境界':'境界介绍'}}</v-subheader> -->
    <v-subheader v-if="sonColumn.length > 0">
      <span>子栏目:</span>
      <v-btn
        small
        class="mx-2"
        text
        v-for="(item, idx) in sonColumn"
        :key="idx"
        >{{ item.name }}</v-btn
      >
    </v-subheader>
    <v-card class="px-6">
      <v-toolbar flat>
        <v-btn
          text
          @click="dialog = true"
          :style="[theme.bg_p, theme.co]"
          :small="$vuetify.breakpoint.xs ? true : false"
          >+添加新境界</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          text
          :style="[theme.bg_p, theme.co]"
          :small="$vuetify.breakpoint.xs ? true : false"
          >搜索</v-btn
        >
      </v-toolbar>
      <v-data-table
        disable-sort
        :items="items"
        :headers="headers"
        :footer-props="{
          showFirstLastPage: false,
          prevIcon: 'iconfont iconfont-ic_left_linedefuben',
          nextIcon: 'iconfont iconfont-ic_right_line',
        }"
      >
        <template v-slot:[`item.oper`]="{ item }">
          <v-btn
            fab
            x-small
            depressed
            title="删除"
            class="mx-1"
            @click="realmDelete(item)"
            :style="[theme.bg_a, theme.co_p]"
          >
            <v-icon>iconfont iconfont-customerarchivesrecycleBin</v-icon>
          </v-btn>
          <v-btn
            fab
            x-small
            depressed
            title="修改"
            class="mx-1"
            @click="realmEdit(item.id)"
            :style="[theme.bg_a, theme.co_p]"
          >
            <v-icon>iconfont iconfont-basepermissionapproveApply</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" fullscreen persistent hide-overlay>
      <v-card class="d-flex align-center flex-column" v-if="dialog">
        <v-card-title class="justify-center text-h5">{{
          dialogType === "add" ? "添加新境界" : "更新境界"
        }}</v-card-title>
        <v-col cols="12" md="8">
          <v-card-text>
            <v-row>
              <upload
                type="auto"
                cols="6"
                v-model="imgFile"
                :src="realmModel.pic"
              ></upload>
              <v-col cols="6" height="100">
                <v-text-field
                  label="境界名称"
                  v-model="realmModel.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" height="100">
                <v-textarea
                  label="大致介绍"
                  solo
                  auto-grow
                  v-model="realmModel.introduce"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
        <v-card-actions>
          <v-btn
            width="100"
            class="mx-3"
            @click="submit(dialogType)"
            :style="[theme.bg_p, theme.co]"
            >{{ dialogType === "add" ? "添加新境界" : "更新境界" }}</v-btn
          >
          <v-btn
            width="100"
            class="mx-3"
            @click="realmModelReset(1)"
            :style="[theme.bg_p, theme.co]"
            >关闭</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { Api, upload, deleteFile } from "@api";
import { checkObjectIsEmpty } from "@/plugins/util.js";
export default {
  inject: ["getSonColumn"],
  name: "faction",
  data: () => ({
    headers: [
      { text: "ID", value: "id", align: "center" },
      { text: "名称", value: "name", align: "center" },
      { text: "操作", value: "oper", align: "center" },
    ],
    items: [],
    realmModel: {
      name: "",
      introduce: "",
      pic: "",
    },
    dialog: false,
    imgFile: {},
    dialogType: "add",
    sonColumn: [],
    api: new Api("realm"),
  }),
  async mounted() {
    let that = this;
    that.realmModel.nid = that.$route.query.nid;
    that.realmQueryAll();
    that.sonColumn = that.getSonColumn(that.realmModel.nid);
    console.log(that.sonColumn);
  },
  methods: {
    realmModelReset(type = null) {
      let that = this;
      that.realmModel = {
        name: "",
        introduce: "",
        pic: "",
        nid: that.$route.query.nid,
      };
      that.dialog = false;
      that.dialogType = "add";
      if (!type) that.realmQueryAll();
    },
    async realmQueryAll() {
      let that = this;
      try {
        let result = await that.api.queryAll(
          { where: { nid: that.realmModel.nid }, offset: 0 },
          that
        );
        console.log(result);
        that.items = result.code === 200 ? result.data : [];
      } catch (e) {
        console.log(e);
      }
    },
    async submit() {
      let that = this;
      if (that.dialogType !== "add") return that.realmUpdate();
      console.log(that.imgFile);
      if (checkObjectIsEmpty(that.imgFile))
        return that.$hint({ msg: "请选择上传的图片", type: "error" });
      try {
        let imgResult = await upload(that.imgFile, that);
        if (imgResult.code !== 200) {
          return that.$hint({
            msg: "上传图片失败",
            type: "error",
          });
        }
        that.realmModel.pic = imgResult.path;
        that.realmModel.date = new Date().valueOf();
        let result = await that.api.add(that.realmModel, that);
        that.$hint({ msg: result.msg });
        that.realmModelReset();
      } catch (e) {
        console.log(e);
      }
    },
    async realmUpdate() {
      let that = this;
      if (!checkObjectIsEmpty(that.imgFile)) {
        let pic_params = that.$store.state.isDeleteFile
          ? that.realmModel.pic
          : "";
        let imgResult = await upload(that.imgFile, that, pic_params);
        if (imgResult.code !== 200) {
          return that.$hint({
            msg: "上传图片失败",
            type: "error",
          });
        }
        that.realmModel.pic = imgResult.path;
      }
      that.realmModel.date = new Date().valueOf();
      try {
        let result = await that.api.update(that.realmModel, that);
        that.realmModelReset();
        that.$hint({
          msg: result.msg,
          type: result.code === 200 ? "success" : "error",
        });
      } catch (e) {
        console.log(e);
      }
    },
    async realmRead(id) {
      let that = this;
      try {
        let result = await that.api.read({ id }, that);
        return result.data;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async realmEdit(id) {
      let that = this;
      let model = await that.realmRead(id);
      if (model) {
        that.realmModel = model;
        that.dialogType = "edit";
        that.dialog = true;
      }
    },
    async realmDelete(params) {
      let that = this;
      that.$toast({ msg: "确定要删除这方境界吗？" });
      that.bus.$on("toastConfirm", async function () {
        try {
          let result = await that.api.delete({ id: params.id }, that);
          that.$hint({
            msg: result.msg,
            type: result.code === 200 ? "success" : "error",
          });
					if (params.pic.length > 0 && that.$store.state.isDeleteFile)deleteFile(params.pic);
          that.realmQueryAll();
        } catch (e) {
          console.log(e);
        }
      });
    },
  },
  components: {
    upload: () => import("@components/upload.vue"),
  },
  computed: {
    theme() {
      return this.$store.getters.getTheme;
    },
  },
};
</script>
<style lang="scss">
</style>