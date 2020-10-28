<template>
  <v-container
    ref="container"
    fluid
    :class="$vuetify.breakpoint.xs ? 'moble_container' : 'px-12'"
  >
    <v-card class="px-6 pb-3" elevation="1">
      <v-toolbar flat>
        <v-card-title>{{
          $vuetify.breakpoint.xs ? "栏目" : "栏目管理"
        }}</v-card-title>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-4"
          @click="c_addColumn"
          :style="[theme.bg_p, theme.co]"
          :small="$vuetify.breakpoint.xs ? true : false"
          >+添加栏目</v-btn
        >
        <v-btn
          :style="[theme.bg_p, theme.co]"
          :small="$vuetify.breakpoint.xs ? true : false"
          >更新排序</v-btn
        >
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="items"
        disable-sort
        :footer-props="{
          showFirstLastPage: false,
          prevIcon: 'iconfont iconfont-ic_left_linedefuben',
          nextIcon: 'iconfont iconfont-ic_right_line',
        }"
      >
        <!-- 名称 -->
        <template v-slot:item.name="{ item }">
          <span>{{ item.origin !== nid ? item.name : "|—" + item.name }}</span>
        </template>
        <!-- 是否显示 -->
        <template v-slot:item.show="{ item }">
          <span>{{ item.show ? "显示" : "隐藏" }}</span>
        </template>
        <!-- 操作 -->
        <template v-slot:item.oper="{ item }">
          <v-btn
            fab
            x-small
            depressed
            title="添加子项目"
            class="mx-1"
            @click="addSonCol(item)"
            :style="[theme.bg_a, theme.co_p]"
          >
            <v-icon>iconfont-ic_add_line</v-icon>
          </v-btn>
          <v-btn
            fab
            x-small
            depressed
            title="删除"
            class="mx-1"
            @click="deleteColumn(item)"
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
            @click="editCol(item)"
            :style="[theme.bg_a, theme.co_p]"
          >
            <v-icon>iconfont iconfont-basepermissionapproveApply</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <!-- 添加栏目 -->
    <v-dialog v-model="dialog" fullscreen persistent hide-overlay>
      <v-card class="d-flex align-center flex-column" v-if="dialog">
        <v-card-title class="justify-center text-h4"
          >{{ dialogType == "add" ? "添加" : "修改" }}栏目</v-card-title
        >
        <v-col md="6">
          <v-card-text>
            <v-row dense>
              <v-col cols="6">
                <v-text-field
                  label="*栏目名称"
                  v-model="columnModel.name"
                  required
                  @input="$v.columnModel.name.$touch()"
                  @blur="$v.columnModel.name.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="*栏目英文名称"
                  v-model="columnModel.ename"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select
                  label="所属栏目"
                  :items="parents"
                  item-text="name"
                  item-value="self"
                  v-model="columnModel.pid"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="columnModel.component"
                  label="*选择模板"
                  :items="vueComponents"
                  item-text="name"
                  item-value="path"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="columnModel.html_template"
                  label="*选择HTML模板"
                  :items="htmlList"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="链接地址"
                  v-model="columnModel.link"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="排序"
                  v-model="columnModel.order"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="关键词"
                  v-model="columnModel.keywords"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="d-flex flex-row align-center">
                <span>是否隐藏</span>
                <v-radio-group row class="ml-10" v-model="columnModel.show">
                  <v-radio
                    label="显示"
                    :value="1"
                    off-icon="iconfont-weixuan"
                    on-icon="iconfont-xuanzhong"
                  ></v-radio>
                  <v-radio
                    label="隐藏"
                    :value="0"
                    off-icon="iconfont-weixuan"
                    on-icon="iconfont-xuanzhong"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <upload
                v-model="imgFile"
                :type="$vuetify.breakpoint.xs ? 'card' : 'auto'"
                cols="12"
                :src="columnModel.pic"
                ref="upload"
              ></upload>
              <v-col cols="12">
                <v-textarea
                  label="栏目描述"
                  solo
                  auto-grow
                  v-model="columnModel.description"
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
            >{{ dialogType == "add" ? "提交" : "确认修改" }}</v-btn
          >
          <v-btn
            width="100"
            class="mx-3"
            @click="columnModelReset(1)"
            :style="[theme.bg_p, theme.co]"
            >关闭</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { Api, upload, deleteFile, getHtmlList } from "@api";
import { required } from "vuelidate/lib/validators";
import { checkObjectIsEmpty } from "@/plugins/util.js";
export default {
  inject: ["reload"],
  name: "column",
  validations: {
    columnModel: {
      name: {
        required,
      },
      template: {
        required,
      },
    },
  },
  data: () => ({
    headers: [
      {
        text: "ID",
        value: "id",
        align: "center",
      },
      {
        text: "名称",
        value: "name",
        align: "left",
      },
      {
        text: "显示",
        value: "show",
        align: "center",
      },
      {
        text: "排序",
        value: "order",
        align: "center",
      },
      {
        text: "操作",
        value: "oper",
        align: "center",
      },
    ],
    items: [],
    dialog: false,
    dialogType: "add",
    imgFile: {},
    columnModel: {
      pid: "1",
      name: "",
      show: "1",
      description: "",
      keywords: "",
      pic: "",
      order: "1",
      component: "",
      ename: "",
      link: "",
      html_template: "",
    },
    htmlList: [],
    nid: null,
    vueComponents: [],
  }),
  async mounted() {
    let that = this;
    that.nid = that.$route.query.nid;
    that.columnQueryAll();
    that.getHtmlList();
    that.getVueComponents();
  },
  watch: {
    pagination(val) {
      console.log(val);
    },
  },
  methods: {
    c_addColumn() {
      let that = this;
      that.dialog = true;
    },
    getVueComponents() {
      let that = this;
      let components = require.context("./tp/", false, /\.vue$/).keys();
      that.vueComponents = components.map((c) => {
        return {
          name: c.split("/")[1],
          path: "/tp"+ c.split(".")[1].split(".")[0],
        };
      });
      that.columnModel.component = that.vueComponents[0].path;
    },
    columnModelReset(type = null) {
      let that = this;
      that.columnModel = {
        pid: "1",
        name: "",
        show: "1",
        description: "",
        keywords: "",
        pic: "",
        order: "",
        component: "",
        ename: "",
        link: "",
        html_template: that.htmlList[0],
      };
      that.imgFile = {};
      // that.reload();
      that.dialog = false;
      that.dialogType = "add";
      if (!type) that.columnQueryAll();
    },
    checkLink(params) {
      let that = this;
      let { link } = params;
      if (that.columnModel.link === link) return false;
      return Boolean(that.items.find((ele) => ele.link === link));
    },
    async columnQueryAll() {
      let that = this;
      try {
        let result = await that.api.column.queryAll({}, that);
        if (result.code === 200) {
          that.items = result.data;
          that.columnModel.pid = that.parents[0].self;
        }
        that.items = result.code === 200 ? result.data : [];
      } catch (e) {
        console.log(e);
      }
    },
    async submit(type) {
      let that = this;
      let tempData = JSON.parse(that.columnModel.pid);
      that.columnModel.pid = tempData.nid;
      let nodeModel = {
        deep: tempData.deep + 1,
        pid: tempData.nid,
        call: that.columnModel.name,
        title: that.columnModel.name,
        component: that.columnModel.component,
        component_name: that.columnModel.component.split("/tp/")[1],
        component_path: that.columnModel.link,
        auth: "user",
        icon: "",
        canD: 1,
      };
      that.$v.columnModel.$touch();
      delete that.columnModel.component;
      if (type != "add") return that.updateColumn(nodeModel, that.columnModel);
      if (!checkObjectIsEmpty(that.imgFile)) {
        let imgResult = await upload(that.imgFile, that);
        if (imgResult.code !== 200) {
          return that.$hint({
            msg: "上传图片失败",
            type: "error",
          });
        }
        that.columnModel.pic = imgResult.path;
      } else {
        return that.$hint({
          msg: "请选择上传的图片",
          type: "error",
        });
      }
      try {
        let result = await that.api.column.add(
          { node: nodeModel, column: that.columnModel },
          that
        );
        that.$hint({
          msg: result.msg,
          type: result.code === 200 ? "success" : "error",
        });
        that.reload();
      } catch (e) {
        console.log(e);
      }
    },
    async readColumn(id) {
      let that = this;
      try {
        let result = await that.api.column.read(
          {
            id,
          },
          that
        );
        return result.data;
      } catch (e) {
        console.log(e);
      }
    },
    async editCol(params) {
      let that = this;
      that.columnModel = params;
      let pidModel = that.parents.find((p) => p.nid === params.nid);
      let component = that.vueComponents.find((c) =>
        params.component.endsWith(c.path)
      );
      console.log(params, pidModel, component);
      that.columnModel.component = component.path;
      that.columnModel.pid = pidModel.self;
      console.log(that.columnModel)
      that.dialogType = "edit";
      that.dialog = true;
    },
    async updateColumn(node, column) {
      let that = this;
      // that.$v.columnModel.$touch();
      // if(that.$v.columnModel.$invalid){
      //   return console.log('请填写必填项')
      // }
      delete that.columnModel.deep;
      if (!checkObjectIsEmpty(that.imgFile)) {
        let pic_params = that.$store.state.isDeleteFile ? column.pic : "";
        let imgResult = await upload(that.imgFile, that, pic_params);
        if (imgResult.code !== 200) {
          return that.$hint({
            msg: "上传图片失败",
            type: "error",
          });
        }
        column.pic = imgResult.path;
      }
      try {
        let result = await that.api.column.update({ node, column }, that);
        that.$hint({
          msg: result.msg,
          type: result.code === 200 ? "success" : "error",
        });
        if (result.code === 200) {
          that.columnModelReset();
        }
      } catch (e) {
        console.log(e);
      }
    },
    async deleteColumn(params) {
      let that = this;
      that.$toast({
        msg: "确认要删除这个栏目吗？",
      });
      that.bus.$on("toastConfirm", async function () {
        try {
          let result = await that.api.column.delete({
            id: params.id,
            nid: params.nid,
          });
          if (params.pic && that.$store.state.isDeleteFile) {
            deleteFile(params.pic);
          }
          that.$hint({
            msg: result.msg,
            type: result.code === 200 ? "success" : "error",
          });
          if (result.code === 200) that.columnModelReset();
        } catch (e) {
          console.log(e);
        }
      });
    },
    async addSonCol(column) {
      let that = this;
      if (column.origin !== -1)
        return that.$hint({
          msg: "不支持对子栏目添加栏目",
          type: "error",
        });
      that.columnModel.origin = column.id;
      that.dialog = true;
    },
    async getHtmlList() {
      let that = this;
      try {
        let result = await getHtmlList();
        if (result.code === 200) {
          that.htmlList = result.data;
          that.columnModel.html_template = result.data[0];
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.userModel.name.$dirty) return errors;
      !this.$v.userModel.name.required && errors.push("必填");
      return errors;
    },
    templateErrors() {
      const errors = [];
      if (!this.$v.userModel.template.$dirty) return errors;
      !this.$v.userModel.template.required && errors.push("必填");
      return errors;
    },
    api() {
      return {
        column: new Api("column"),
        node: new Api("node"),
        tmp: new Api("tmp"),
      };
    },
    parents() {
      let that = this;
      let arr = [];
      arr.push({
        name: "顶级栏目",
        nid: that.nid,
        deep: 1,
      });
      that.items.forEach((item) => {
        arr.push(item);
      });
      return arr.map((a) => {
        return {
          ...a,
          self: JSON.stringify(a),
        };
      });
    },
    theme() {
      return this.$store.getters.getTheme;
    },
  },
  components: {
    upload: () => import("@components/upload.vue"),
  },
};
</script>
<style lang="scss">
tbody > tr {
  cursor: pointer;
}
</style>
