<template>
  <v-sheet class="img_sheet" ref="sheet">
    <div class="top_loading" v-if="topLoading"></div>
    <div class="place">
      <div class="bottom_loading"></div>
      <div
        class="imgs"
        :class="$vuetify.breakpoint.xs ? 'imgs_xs' : ''"
        v-for="(item, idx) in images"
        :key="idx"
        :style="`width:${config.itemWidth}px;height:${item.height}px;padding: 0 ${config.gap}px;`"
      >
        <img
          :src="item.link"
          class="img"
          :style="`border-width:${Math.floor(
            Math.random() * 6 + 2
          )}px;border-color:rgba(${Math.floor(
            Math.random() * 255
          )},${Math.floor(Math.random() * 255)},${Math.floor(
            Math.random() * 255
          )},${Math.floor(Math.random() * 10)});`"
        />
      </div>
    </div>
  </v-sheet>
</template>
<script>
export default {
  name: "waterfull",
  props: {
    data: {
      default: [],
      type: Array,
    },
  },
  data: () => ({
    config: {},
    images: [],
    topLoading: true,
    bottomLoading: false,
  }),
  mounted() {
    let that = this;
    let itemWidth = 350;
    let gap = 10;

    setTimeout(() => {
      that.config = {
        W: that.$refs.sheet.$el.offsetWidth,
        col: Math.floor(that.$refs.sheet.$el.offsetWidth / 350),
        itemWidth,
        gap,
      };
      that.preload(that.data);
    }, 400);

    if (that.$vuetify.breakpoint.xs) {
      that.images = that.data;
      that.topLoading = false;
      return;
    }

    that.$on("preloaded", function () {
      console.log("加载完成");
      that.images = that.data;
      that.$nextTick(() => {
        let imgs = document.querySelectorAll(".imgs");
        that.arrange(imgs);
      });
    });
  },
  methods: {
    // 预加载
    preload(data) {
      let that = this;
      let heights = [];
      let len = data.length >>> 0;
      let loaded = 0;
      if (loaded >= len) that.$emit("preloaded");
      data.forEach((item, idx) => {
        let img = new Image();
        img.src = item.link;
        img.onload = img.onerror = (e) => {
          if (e.type === "load") {
            let height =
              (img.height * (that.config.itemWidth - that.config.gap * 2)) /
              img.width;
            item.height = Math.ceil(height);
            heights.push(Math.ceil(height));
            loaded++;
          } else {
            item.loadfail = true;
            loaded++;
          }
          if (loaded >= len) that.$emit("preloaded");
        };
      });
    },
    arrange(imgs) {
      let that = this;
      let heights = [];
      let top = null;
      let left = null;
      that.images.forEach((item, idx) => {
        let img = imgs[idx];
        let h = img.offsetHeight;
        if (idx < that.config.col) {
          heights.push(h);
          left = idx * that.config.itemWidth;
          top = 0;
        } else {
          let minHei = Math.min.apply(null, heights);
          let minIndex = heights.indexOf(minHei);
          top = minHei + that.config.gap * 2;
          left = minIndex * that.config.itemWidth;
          heights[minIndex] = top + h;
        }
        img.style.left = left + "px";
        img.style.top = top + "px";
      });
      console.log("排列完成");
      that.topLoading = false;
    },
  },
  created() {},
  beforeDestroy() {},
  computed: {},
};
</script>
<style lang="scss" scoped>
.img_sheet {
  width: 100%;
  position: relative;
  & .top_loading {
    position: absolute;
    z-index: 2;
    width: 100px;
    height: 40px;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    background-color: #eee;
  }
}
.place {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  & .imgs {
    position: absolute;
    z-index: 1;
    & > img {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid transparent;
    }
  }
}
.imgs_xs {
  position: relative !important;
  margin: 0 auto;
}
</style>