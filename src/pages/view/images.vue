<template>
  <div>
    <v-card-title class="py-0 water_head">瀑布流展示图片</v-card-title>
    <div class="water_body pl-4" v-if="images.length > 0">
      <waterfull :data="images"></waterfull>
    </div>
  </div>
</template>
<script>
// 项目介绍
import { getImageList } from "@api";
export default {
  name: "images",
  data: () => ({
    images: [],
  }),
  methods: {
    async fetchImageList() {
      let that = this;
      let imageResult = await getImageList({ limit: 10, offset: 0 }, that);
      that.images = imageResult.data;
    },
  },
  watch: {},
  components: {
    waterfull: () => import("@components/waterfull.vue"),
  },
  created() {
    let that = this;
    that.fetchImageList();
  },
  mounted() {
    // let that = this;
    // that.fetchImageList();
    // that.$toast({msg:'确定要这么做吗？'})
  },
};
</script>
<style lang="scss" scoped>
$head: 60px;
$sum_head: $head + 48px;
.water_head{
  height: $head;
  line-height: $head;
}
.water_body{
  height: calc(100vh - #{$sum_head});
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>