<template>
  <v-container
    fluid
    :class="$vuetify.breakpoint.xs ? 'moble_container' : 'px-12'"
  >
    <v-subheader>{{
      $vuetify.breakpoint.xs ? "节点" : "节点设置"
    }}</v-subheader>
    <v-card class="px-6">
      <v-toolbar flat>
        <v-btn
          text
          @click="dialog = true"
          :style="[theme.bg_p, theme.co]"
          class="mr-2"
          :small="$vuetify.breakpoint.xs ? true : false"
          >+添加</v-btn
        >
        <v-btn
          text
          :style="[theme.bg_p, theme.co]"
          :small="$vuetify.breakpoint.xs ? true : false"
          >更新</v-btn
        >
      </v-toolbar>
      <v-data-table
        align="center"
        :headers="headers"
        disable-sort
        :items="items"
        :footer-props="{
          showFirstLastPage: false,
          prevIcon: 'iconfont iconfont-ic_left_linedefuben',
          nextIcon: 'iconfont iconfont-ic_right_line',
        }"
      >
        <template v-slot:item.cid="{ item }">{{
          item.pid == 1 ? "Layout" : item.pid
        }}</template>
        <template v-slot:item.oper="{ item }">
          <v-btn
            fab
            x-small
            depressed
            title="删除"
            class="mx-1"
            @click="nodeDelete(item)"
            :style="[theme.bg_a, theme.co_p]"
            v-if="item.canD == 1"
          >
            <v-icon>iconfont iconfont-customerarchivesrecycleBin</v-icon>
          </v-btn>
          <v-btn
            fab
            x-small
            depressed
            title="修改"
            class="mx-1"
            @click="editnode(item.id)"
            v-if="item.canD == 1"
            :style="[theme.bg_a, theme.co_p]"
          >
            <v-icon>iconfont iconfont-basepermissionapproveApply</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialog"
      persistent
      class="v-dialog"
      :fullscreen="$vuetify.breakpoint.xs ? true : false"
    >
      <v-row justify="center" class="ma-0" v-if="dialog">
        <v-col cols="12" md="8" class="pa-0 ma-0">
          <v-card class="pa-5">
            <v-card-title class="justify-center text-uppercase text-h5 py-2"
              >{{ dialogType == "add" ? "添加" : "更新" }}节点</v-card-title
            >
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="节点名"
                    v-model="nodeModel.call"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="文档TIETLE"
                    v-model="nodeModel.title"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                    label="选择VUE组件"
                    v-model="nodeModel.component"
                    :items="vueComponents"
                    item-text="name"
                    item-value="path"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    label="父节点"
                    v-model="nodeModel.pid"
                    :items="parentNode"
                    item-text="call"
                    item-value="self"
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="URL路径==>VUE"
                    v-model="nodeModel.component_path"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" class="d-flex flex-row align-center">
                  <span>节点权限</span>
                  <v-radio-group row class="ml-10" v-model="nodeModel.auth">
                    <v-radio
                      label="用户"
                      value="user"
                      off-icon="iconfont-weixuan"
                      on-icon="iconfont-xuanzhong"
                    ></v-radio>
                    <v-radio
                      label="管理员"
                      value="admin"
                      off-icon="iconfont-weixuan"
                      on-icon="iconfont-xuanzhong"
                    ></v-radio>
                  </v-radio-group>
                </v-col>

                <v-col cols="12" class="pt-0">
                  <v-subheader class="px-0">选择节点图标</v-subheader>
                  <v-sheet>
                    <v-btn
                      icon
                      v-for="(icon, idx) in icons"
                      :key="idx"
                      class="mx-1"
                      :color="
                        nodeModel.icon === icon ? theme.bg_p.background : ''
                      "
                      @click="nodeModel.icon = icon"
                      :title="icon"
                    >
                      <v-icon>{{ icon }}</v-icon>
                    </v-btn>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-subtitle class="pa-0">
              <p class="red--text">*注意</p>
              <p>1.侧边栏路由更新可能需要刷新页面</p>
            </v-card-subtitle>
            <v-card-actions class="justify-center">
              <v-btn
                width="120"
                class="mx-2"
                @click="submit(dialogType)"
                :style="[theme.bg_p, theme.co]"
                >{{ dialogType == "add" ? "提交" : "更新节点" }}</v-btn
              >
              <v-btn
                width="120"
                class="mx-2"
                @click="nodeModelReset(1)"
                :style="[theme.bg_p, theme.co]"
                >关闭</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-dialog>
  </v-container>
</template>
<script>
import { Api } from "@api";
import { icons as _icons } from "@/plugins/static.js";
export default {
  name: "nodeConfig",
  data: () => ({
    headers: [
      {
        text: "ID",
        value: "id",
      },
      {
        text: "节点名称",
        value: "call",
      },
      {
        text: "组件NAME",
        value: "component_name",
      },
      {
        text: "父节点",
        value: "cid",
      },
      {
        text: "路径",
        value: "component_path",
      },
      {
        text: "操作",
        value: "oper",
      },
    ],
    items: [],
    dialog: false,
    dialogType: "add",
    nodeModel: {
      title: "",
      call: "",
      component_name: "",
      icon: "",
      pid: "",
      component: "",
      component_path: "",
      auth: "user",
    },
    icons: _icons,
    columns: [],
    api: new Api("node"),
    vueComponents: [],
  }),
  async mounted() {
    let that = this;
    that.nodeQueryAll();
    that.nodeModel.pid = that.parentNode[0].self;
    that.getVueComponents();
  },
  methods: {
    getVueComponents() {
      let that = this;
      let components = require.context("../view/", false, /\.vue$/).keys();
      // let ignore = ["column"];
      that.vueComponents = components.map((c) => {
        return {
          name: c.split("/")[1],
          path: c.split(".")[1].split(".")[0],
        };
      });
      console.log(that.vueComponents);
    },
    nodeModelReset(type = null) {
      let that = this;
      that.nodeModel = {
        title: "",
        call: "",
        component_name: "",
        icon: "",
        pid: that.parentNode[0].self,
        component: that.vueComponents[0].path,
        component_path: "",
        auth: "user",
      };
      that.dialogType = "add";
      that.imgFile = {};
      that.dialog = false;
      if (!type) that.nodeQueryAll();
    },
    async submit(type) {
      let that = this;
      let _node = JSON.parse(that.nodeModel.pid);
      if (_node.deep > 3)
        return that.$hint({
          msg: "节点过深",
          type: "error",
        });
      that.nodeModel.pid = _node.id;
      that.nodeModel.deep = Number(_node.deep) + 1;
      that.nodeModel.component_name = that.nodeModel.component.split("/")[1];
      if (type !== "add") return that.nodeUpdate();
      try {
        let result = await that.api.add(that.nodeModel, that);
        // console.log(result);
        // that.$store.dispatch("getRouter");
        that.$hint({
          msg: result.msg,
          type: result.code === 200 ? "success" : "error",
        });
        that.nodeModelReset();
      } catch (e) {
        console.log(e);
      }
    },
    async editnode(id) {
      let that = this;
      that.nodeModel = await that.nodeRead(id);
      that.nodeModel.pid = that.parentNode.find(
        (n) => n.id == that.nodeModel.pid
      );
      that.nodeModel.pid = that.nodeModel.pid.self;
      if (!that.nodeModel) return that.nodeModelReset(1);
      that.dialogType = "edit";
      that.dialog = true;
    },
    async nodeRead(id) {
      let that = this;
      try {
        let result = await that.api.read({
          id,
        });
        return result.data;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async nodeUpdate() {
      let that = this;
      try {
        let result = await that.api.update(that.nodeModel);
        if (result.code === 200) {
          that.$store.dispatch("getRouter");
          that.$hint({
            msg: "更新成功",
          });
        } else {
          that.$hint({
            msg: "更新失败",
            type: "error",
          });
        }
        that.nodeModelReset();
      } catch (e) {
        console.log(e);
      }
    },
    async nodeQueryAll() {
      let that = this;
      try {
        let result = await that.api.queryAll();
        that.items = result.code === 200 ? result.data : [];

        // that.items.sort((a, b) => a.order - b.order);
        console.log(that.items);
      } catch (e) {
        console.log(e);
      }
    },
    async nodeDelete(params) {
      let that = this;
      that.$toast({
        msg: "确认删除吗？",
      });
      that.bus.$on("toastConfirm", async function () {
        try {
          let result = await that.api.delete({
            id: params.id,
          });
          if (result.code === 200) {
            that.$store.dispatch("getRouter");
            that.nodeQueryAll();
            return that.$hint({
              msg: "删除成功",
            });
          }
          that.$hint({
            msg: "删除失败",
          });
        } catch (e) {
          console.error(e);
          that.$hint({
            msg: "删除失败",
          });
        }
      });
    },
  },
  computed: {
    theme() {
      return this.$store.getters.getTheme;
    },
    parentNode() {
      let that = this;
      let _items = [];
      that.items.forEach((n) => {
        _items.push(n);
      });
      _items.unshift({
        call: "顶级节点",
        pid: "0",
        deep: 0,
        id: 1,
      });
      _items.map((a) => (a.self = JSON.stringify(a)));
      return _items;
    },
  },
  components: {
    // upload: () => import("@components/upload.vue"),
  },
};
</script>
<style lang="scss">
.v-dialog {
  box-shadow: none !important;
}
</style>
