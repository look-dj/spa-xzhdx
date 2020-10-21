import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		theme: {},
		routes: null,
		menu: [],
		mid: "", // 第几个菜单被激活
		side: false,
    isDeleteFile: false, //  删除数据时是否连同删除图片
    storeageToken: ''
	},
	mutations,
	getters,
	actions,
});

export default store;
