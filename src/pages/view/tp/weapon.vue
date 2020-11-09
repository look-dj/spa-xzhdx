// 武器展示
<template>
  <v-container
    fluid
    :class="$vuetify.breakpoint.xs ? 'moble_container' : 'px-12'"
  >
    <v-subheader>{{
      $vuetify.breakpoint.xs ? "武器" : "武器展示"
    }}</v-subheader>
    <v-card class="px-6">
      <v-toolbar flat>
        <v-btn
          text
          @click="dialog = true"
          :style="[theme.bg_p, theme.co]"
          :small="$vuetify.breakpoint.xs ? true : false"
          >+添加新武器</v-btn
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
        show-select
        :footer-props="{
          showFirstLastPage: false,
          prevIcon: 'iconfont iconfont-ic_left_linedefuben',
          nextIcon: 'iconfont iconfont-ic_right_line',
        }"
      >
        <!-- <template v-slot:item.id="{item}">{{item-key}}</template> -->
        <template v-slot:[`item.oper`]="{ item }">
          <v-btn
            fab
            x-small
            depressed
            title="删除"
            class="mx-1"
            @click="weaponDelete(item)"
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
            @click="weaponEdit(item)"
            :style="[theme.bg_a, theme.co_p]"
          >
            <v-icon>iconfont iconfont-basepermissionapproveApply</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog" fullscreen persistent hide-overlay>
        <v-card
          flat
          class="d-flex flex-column align-center justify-center"
          v-if="dialog"
        >
          <v-card-title>{{
            dialogType === "add" ? "添加新武器" : "修改武器信息"
          }}</v-card-title>
          <v-col cols="12" md="8">
            <v-row>
              <v-col
                cols="6"
                class="py-0"
                :class="$vuetify.breakpoint.xs ? '' : 'px-10'"
              >
                <v-text-field
                  label="境界名称"
                  v-model="weaponModel.name"
                ></v-text-field>
              </v-col>
              <v-col
                cols="6"
                class="py-0"
                :class="$vuetify.breakpoint.xs ? '' : 'px-10'"
              >
                <v-text-field
                  label="主人"
                  v-model="weaponModel.owner"
                ></v-text-field>
              </v-col>
              <v-col
                cols="6"
                class="py-0"
                :class="$vuetify.breakpoint.xs ? '' : 'px-10'"
              >
                <v-text-field
                  label="当前排序"
                  v-model="weaponModel.order"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                class="py-0"
                :class="$vuetify.breakpoint.xs ? '' : 'px-10'"
              >
                <upload
                  type="auto"
                  cols="6"
                  v-model="imgFile"
                  :src="weaponModel.pic"
                ></upload>
              </v-col>
              <v-col
                cols="12"
                class="py-0"
                :class="$vuetify.breakpoint.xs ? '' : 'px-10'"
              >
                <v-textarea
                  label="大致介绍"
                  solo
                  auto-grow
                  v-model="weaponModel.introduce"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-col>
          <v-card-actions>
            <v-btn
              class="mx-2"
              :style="[theme.bg_a, theme.co_p]"
              @click="submit"
              >{{ dialogType === "add" ? "添加新武器" : "修改武器" }}</v-btn
            >
            <v-btn
              class="mx-2"
              @click="weaponModelReset"
              :style="[theme.bg_a, theme.co_p]"
              >关闭</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import { checkObjectIsEmpty, format } from "@/plugins/util.js";
import { Api, upload, deleteFile } from "@api";
export default {
  data: () => ({
    items: [],
    api: new Api("weapon"),
    headers: [
      { text: "ID", value: "id", align: "center" },
      { text: "名称", value: "name", align: "center" },
      { text: "武器主人", value: "owner", align: "center" },
      { text: "时间", value: "date", align: "center" },
      { text: "排序", value: "order", align: "center" },
      { text: "操作", value: "oper", align: "center" },
    ],
    dialog: false,
    weaponModel: {
      name: "",
      order: "",
      owner: "",
      pic: "",
      introduce: "",
    },
    imgFile: {},
    dialogType: "add",
  }),
  mounted() {
    let that = this;
    that.weaponQueryAll();
  },
  methods: {
    weaponModelReset(type = null) {
      let that = this;
      that.weaponModel = {
        name: "",
        order: "",
        owner: "",
        pic: "",
        introduce: "",
      };
      that.imgFile = {};
      that.dialog = false;
      that.dialogType = "add";
      if (type) that.weaponQueryAll();
    },
    async weaponQueryAll() {
      let that = this;
      try {
        let result = await that.api.queryAll({}, that);
        that.items =
          result.code === 200
            ? result.data.map((d) => {
                d.date = format.call(new Date(Number(d.date)), "yyyy-MM-dd hh:mm");
                return d;
              })
            : [];
        that.$hint({
          msg: result.msg,
          type: result.code === 200 ? "success" : "error",
        });
      } catch (e) {
        console.log(e);
        that.$hint({ msg: "获取武器列表失败", type: "error" });
      }
    },
    async submit() {
      let that = this;
      if (that.dialogType !== "add") return that.weaponUpdate();
      if (checkObjectIsEmpty(that.imgFile))
        return that.$hint({ msg: "请选择上传的武器图片", type: "error" });
      let imgResult = await upload(that.imgFile, that);
      if (imgResult.code !== 200) {
        return that.$hint({ msg: "上传图片失败", type: "error" });
      }
      that.weaponModel.pic = imgResult.path;
      that.weaponModel.date = new Date().valueOf();
      try {
        let result = await that.api.add(that.weaponModel, that);
        if (result.code === 200) {
          that.$hint({ msg: "添加武器信息成功" });
          that.weaponModelReset(1);
        }
      } catch (e) {
        console.log(e);
        that.$hint({ msg: "添加武器信息失败，请稍后重试", type: "error" });
      }
    },
    weaponEdit(item) {
      let that = this;
      that.weaponModel = item;
      that.dialogType = "edit";
      that.dialog = true;
    },

    async weaponUpdate() {
      let that = this;
      if (!checkObjectIsEmpty(that.imgFile)) {
        let pic_params = that.$store.state.isDeleteFile
          ? that.weaponModel.pic
          : "";
        let imgResult = await upload(that.imgFile, that, pic_params);
        if (imgResult.code !== 200) {
          return that.$hint({ msg: "上传图片失败", type: "error" });
        }
        console.log(imgResult);
        that.weaponModel.pic = imgResult.path;
        that.weaponModel.date = new Date().valueOf();
        try {
          let result = await that.api.update(that.weaponModel, that);
          if (result.code === 200) {
            that.$hint({ msg: "添加武器信息成功" });
            that.weaponModelReset(1);
          }
        } catch (e) {
          console.log(e);
          that.$hint({ msg: "更新武器信息失败，请稍后重试", type: "error" });
        }
      }
    },
    weaponDelete(params) {
      let that = this;
      that.$toast({ msg: "确认要删除这条信息吗？" });
      that.bus.$on("toastConfirm", async function () {
        let pic_params = that.$store.state.isDeleteFile ? params.pic : "";
        try {
          let result = await that.api.delete({ id: params.id });
          if (result.code === 200) {
            that.weaponModelReset(1);
            that.$hint({ msg: "删除成功" });
            if (params.pic.length > 0 && that.$store.state.isDeleteFile)
              deleteFile(params.pic);
          }
        } catch (e) {
          console.log(e);
          that.$hint({ msg: "删除信息失败，请稍后重试", type: "error" });
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

<style>
</style>
