<template>
  <div>
    <upload type="auto" v-model="file" accept="image"></upload>
    <editor></editor>
    <v-btn @click="test">测试</v-btn>
  </div>
</template>
<script>
// 项目介绍
import * as api from "@api";
export default {
  name: "introduce",
  data: () => ({
    file: {},
    data: "",
  }),
  methods: {
    async test() {
      let that = this;
      let result = await api.upload(that.file);
      console.log(result);
    },
  },
  watch: {
    data(val) {
      console.log(val);
    },
  },
  components: {
    upload: () => import("@components/upload.vue"),
    editor: () => import("@components/editor.vue"),
  },
  mounted() {
    // let that = this;
    
    // that.$toast({msg:'确定要这么做吗？'})
  },
};
</script>
<style lang="scss" scoped>
</style>