/*
 * @Author: your name
 * @Date: 2020-10-30 09:50:07
 * @LastEditTime: 2020-11-09 09:38:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project\spa-xzhdx\src\store\mutations.js
 */
//同步修改state的状态
// import { saveItemObj } from "@/plugins/util.js";
import { theme as _theme } from "@/plugins/static.js";
const mutations = {
  changeTheme(state, theme) {
    if (typeof theme === "object") {
      state.theme = theme;
    } else {
      state.theme = _theme[theme];
    }
  },
  setRouter(state, router) {
    state.router = router;
  },
  setMenu(state, menu) {
    state.menu = menu;
  },
  setMid(state, mid) {
    state.mid = mid;
  },
  setSide(state, bool) {
    state.side = bool;
  },
  setIsDeleteFile(state, bool) {
    state.isDeleteFile = bool;
  },
  setStoreageToken(state, token) {
    state.storeageToken = token;
  },
};

export default mutations;
