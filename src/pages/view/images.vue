<template>
  <div>
    <v-card-title>瀑布流展示图片</v-card-title>
  </div>
</template>
<script>
// 项目介绍
import { getImageList } from "@api";
export default {
  name: "images",
  data: () => ({
    data: "",
  }),
  methods: {
    async fetchImageList() {
      let that = this;
      let imageResult = await getImageList({ limit: 15, offset: 0 }, that);
      console.log(imageResult);
    },
  },
  watch: {},
  components: {},
  mounted() {
    let that = this;
    that.fetchImageList();
    // that.$toast({msg:'确定要这么做吗？'})
  },
};
</script>
<style lang="scss" scoped>
</style>