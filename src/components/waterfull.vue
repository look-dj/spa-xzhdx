<template>
  <div id="water">
    <v-sheet class="img_sheet" ref="sheet">
      <div class="top_loading" v-if="topLoading">
        <div class="top_load">
          <div class="k-line2 k-line12-1"></div>
          <div class="k-line2 k-line12-2"></div>
          <div class="k-line2 k-line12-3"></div>
          <div class="k-line2 k-line12-4"></div>
          <div class="k-line2 k-line12-5"></div>
          <div class="k-line2 k-line12-6"></div>
          <div class="k-line2 k-line12-7"></div>
          <div class="k-line2 k-line12-8"></div>
        </div>
        <p class="loading_text ma-0">加载中. . .</p>
      </div>

      <div class="place">
        <div class="bottom_loading" v-if="bottomLoading">
          <div class="la-ball-elastic-dots la-2x">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div class="bottom_hint" v-if="bottom_hint">我也是有底线的. . .</div>
        <div
          class="imgs"
          :class="$vuetify.breakpoint.xs ? 'imgs_xs' : ''"
          v-for="(item, idx) in images"
          :key="idx"
          :data-sign="item.sign"
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
  </div>
</template>
<script>
export default {
  name: "waterfull",
  props: {
    data: {
      default: () => [],
      type: Array,
    },
    scrollData: {
      default: () => [],
      type: Array,
    },
    total: {
      default: 0,
      type: Number,
    },
  },
  data: () => ({
    config: {},
    images: [],
    topLoading: true,
    bottomLoading: false,
    heights: [],
    scrollNum: 0,
    bottom_hint: false
  }),
  mounted() {
    let that = this;
    let itemWidth = 350;
    let gap = 10;
    document
      .querySelector("#water")
      .addEventListener("scroll", that.waterScroll, true);
    setTimeout(() => {
      that.config = {
        W: that.$refs.sheet.$el.offsetWidth,
        col: Math.floor(that.$refs.sheet.$el.offsetWidth / 350),
        itemWidth,
        gap,
      };
      that.data.forEach((item) => (item.sign = new Date().valueOf()));
      that.preload(that.data).then((res) => {
        console.log("加载完成");
        that.images = res;
        that.$nextTick(() => {
          let imgs = document.querySelectorAll(".imgs");
          imgs = Array.from(imgs);
          imgs = imgs.filter((node) => node.dataset.sign == that.data[0].sign);
          that.arrange(imgs);
        });
      });
    }, 1000);

    if (that.$vuetify.breakpoint.xs) {
      that.images = that.data;
      that.topLoading = false;
      return;
    }
  },
  watch: {
    scrollData(val) {
      // console.log(val)
      let that = this;
      that.scrollData = val;
      if (that.scrollData.length < 1) return;
      setTimeout(() => {
        that.preload(that.scrollData).then((res) => {
          that.images = that.images.concat(res);
          that.$nextTick(() => {
            let imgs = document.querySelectorAll(".imgs");
            imgs = Array.from(imgs);
            imgs = imgs.filter((i) => i.dataset.sign == res[0].sign);
            that.arrange(imgs);
          });
        });
      }, 1000);
    },
  },
  methods: {
    // 滚动加载
    waterScroll(e) {
      let that = this;
      let div = document.querySelector("#water");
      let place = document.querySelector(".place");
      let scrollTop = Math.floor(div.scrollTop);
      let offsetH = Math.floor(place.offsetHeight);
      // 发起获取后期资源的请求时机
      let timimg = offsetH - scrollTop - div.offsetHeight;
      if (timimg < 100 && !that.bottomLoading) {
        that.bottomLoading = true;
        if (++that.scrollNum >= that.total) {
          console.log(that.scrollNum);
          that.bottomLoading = false;
          that.bottom_hint = true;
          document
            .querySelector("#water")
            .removeEventListener("scroll", this.waterScroll, true);
          return;
        }
        that.$emit("getScrollData", that.scrollNum);
        console.log("该发起网络请求了");
      }
    },
    // 预加载
    preload(data) {
      let that = this;
      let len = data.length >>> 0;
      let loaded = 0;
      let images = [];
      let sign = new Date().valueOf();
      return new Promise((resolve, reject) => {
        if (loaded >= len) resolve(images);
        data.forEach((item) => {
          let img = new Image();
          img.src = item.link;
          img.onload = img.onerror = (e) => {
            if (e.type === "load") {
              let height =
                (img.height * (that.config.itemWidth - that.config.gap * 2)) /
                img.width;
              item.height = Math.ceil(height);
              item.sign = sign;
              images.push(item);
              loaded++;
            } else {
              item.loadfail = true;
              loaded++;
            }
            if (loaded >= len) resolve(images);
          };
        });
      });
    },
    arrange(imgs) {
      let that = this;
      let heights = that.heights;
      let first = true;
      if (heights.length > 0) first = false;
      let top = null;
      let left = null;
      imgs.forEach((item, idx) => {
        let h = item.offsetHeight;
        if (idx < that.config.col && first) {
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
        item.style.left = left + "px";
        item.style.top = top + "px";
      });
      console.log("排列完成");
      let footHeight = 50;
      that.topLoading = false;
      let placeHei = Math.max.apply(null, heights) + footHeight;
      document.querySelector(".place").style.height = placeHei + "px";
      that.bottomLoading = false;
    },
  },
  created() {},
  beforeDestroy() {
    document
      .querySelector("#water")
      .removeEventListener("scroll", this.waterScroll, true);
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
#water {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}
.img_sheet {
  width: 100%;
  position: relative;
  & .top_loading {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 60px;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    background-color: #fff;
  }
}
.loading_text {
  width: 100%;
  text-align: center;
}
.place {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  & .bottom_loading,  & .bottom_hint {
    position: absolute;
    bottom: 20px;
    // background-color: #222;
    left: 0;
    z-index: 3;
    width: 100%;
  }
  & .bottom_hint{
   text-align:center;
   text-decoration: underline;
  }
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
.top_load {
  width: 600px;
  margin: 0 auto;
  text-align: center;
}
.k-line2 {
  display: inline-block;
  background: #666;
  height: 10px;
  width: 10px;
  opacity: 0;
  border-radius: 50%;
  transform: translateX(-300px);
  background-color: #4b9cdb;
}
.k-line12-1 {
  animation: k-loadingS 4s infinite;
  animation-delay: 0.8s;
}
.k-line12-2 {
  animation: k-loadingS 4s infinite;
  animation-delay: 0.7s;
}
.k-line12-3 {
  animation: k-loadingS 4s infinite;
  animation-delay: 0.6s;
}
.k-line12-4 {
  animation: k-loadingS 4s infinite;
  animation-delay: 0.5s;
}
.k-line12-5 {
  animation: k-loadingS 4s infinite;
  animation-delay: 0.4s;
}
.k-line12-6 {
  animation: k-loadingS 4s infinite;
  animation-delay: 0.3s;
}
.k-line12-7 {
  animation: k-loadingS 4s infinite;
  animation-delay: 0.2s;
}
.k-line12-8 {
  animation: k-loadingS 4s infinite;
  animation-delay: 0.1s;
}
@keyframes k-loadingS {
  40% {
    transform: translateX(0);
    opacity: 0.8;
  }
  100% {
    transform: translateX(300px);
    opacity: 0;
  }
}
.la-ball-elastic-dots {
  margin: 0 auto;
}
.la-ball-elastic-dots,
.la-ball-elastic-dots > div {
  position: relative;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.la-ball-elastic-dots {
  display: block;
  font-size: 0;
  color: #fff;
}

.la-ball-elastic-dots.la-dark {
  color: #333;
}

.la-ball-elastic-dots > div {
  display: inline-block;
  float: none;
  background-color: #0094ff;
  border: 0 solid #0094ff;
}

.la-ball-elastic-dots {
  width: 120px;
  height: 10px;
  font-size: 0;
  text-align: center;
}

.la-ball-elastic-dots > div {
  display: inline-block;
  width: 10px;
  height: 10px;
  white-space: nowrap;
  border-radius: 100%;
  -webkit-animation: ball-elastic-dots-anim 1s infinite;
  -moz-animation: ball-elastic-dots-anim 1s infinite;
  -o-animation: ball-elastic-dots-anim 1s infinite;
  animation: ball-elastic-dots-anim 1s infinite;
}

.la-ball-elastic-dots.la-sm {
  width: 60px;
  height: 4px;
}

.la-ball-elastic-dots.la-sm > div {
  width: 4px;
  height: 4px;
}

.la-ball-elastic-dots.la-2x {
  width: 240px;
  height: 20px;
}

.la-ball-elastic-dots.la-2x > div {
  width: 12px;
  height: 12px;
}

.la-ball-elastic-dots.la-3x {
  width: 360px;
  height: 30px;
}

.la-ball-elastic-dots.la-3x > div {
  width: 30px;
  height: 30px;
}

@-webkit-keyframes ball-elastic-dots-anim {
  0%,
  100% {
    margin: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  50% {
    margin: 0 5%;
    -webkit-transform: scale(0.65);
    transform: scale(0.65);
  }
}

@-moz-keyframes ball-elastic-dots-anim {
  0%,
  100% {
    margin: 0;
    -moz-transform: scale(1);
    transform: scale(1);
  }

  50% {
    margin: 0 5%;
    -moz-transform: scale(0.65);
    transform: scale(0.65);
  }
}

@-o-keyframes ball-elastic-dots-anim {
  0%,
  100% {
    margin: 0;
    -o-transform: scale(1);
    transform: scale(1);
  }

  50% {
    margin: 0 5%;
    -o-transform: scale(0.65);
    transform: scale(0.65);
  }
}

@keyframes ball-elastic-dots-anim {
  0%,
  100% {
    margin: 0;
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
  }

  50% {
    margin: 0 5%;
    -webkit-transform: scale(0.65);
    -moz-transform: scale(0.65);
    -o-transform: scale(0.65);
    transform: scale(0.65);
  }
}
</style>