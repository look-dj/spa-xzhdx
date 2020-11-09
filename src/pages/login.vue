<template>
  <v-container fluid class="pa-0">
    <v-sheet
      style="position: relative; z-index: 10"
      color="#fff"
      height="70"
      elevation="2"
      class="d-flex align-center justify-center"
    >
      <v-card flat class="d-inline" light>
        <span class="text-h5">雪中悍刀行</span>
      </v-card>
    </v-sheet>
    <v-sheet
      color="#f3f7f9"
      style="position: relative; z-index: 9"
      height="calc(100vh - 70px)"
    >
      <div class="login_out_box">
        <div class="login_inside_box">
          <v-sheet height="100%" v-if="!$vuetify.breakpoint.xs">
            <img src="@assets/images/HDJ454548.png" height="100%" />
          </v-sheet>
          <v-sheet height="100%" class="sheet2">
            <v-card flat light width="350" style="margin: 0 auto">
              <v-card-title class="justify-center py-0">
                <v-img src="@assets/images/img1.jpg" width="350"></v-img>
              </v-card-title>
              <v-card-text :class="$vuetify.breakpoint.xs ? 'px-12' : 'px-8'">
                <v-text-field
                  label="账号"
                  v-model="userModel.account"
                  :error-messages="accountErrors"
                  required
                  @input="$v.userModel.account.$touch()"
                  @blur="$v.userModel.account.$touch()"
                ></v-text-field>
                <v-text-field
                  label="密码"
                  v-model="userModel.password"
                  :type="passState ? 'text' : 'password'"
                  :error-messages="passwordErrors"
                  required
                  @input="$v.userModel.password.$touch()"
                  @blur="$v.userModel.password.$touch()"
                  :append-icon="
                    passState ? 'iconfont-kejian' : 'iconfont-bukejian'
                  "
                  @click:append="passState = !passState"
                ></v-text-field>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn
                  :width="!$vuetify.breakpoint.xs ? 320 : 250"
                  height="50"
                  rounded
                  v-ripple="{ class: '#0094ff' }"
                  color="#0094ff"
                  class="text-h6 white--text"
                  @click="login"
                  >登录</v-btn
                >
              </v-card-actions>
              <p class="go_register">
                <router-link to="/">去注册？</router-link>
              </p>
            </v-card>
          </v-sheet>
        </div>
      </div>
    </v-sheet>
  </v-container>
</template>
<script>
import { login as userLogin } from "@api";
import { saveItemObj } from "@/plugins/util.js";
import { required } from "vuelidate/lib/validators";
import config from "@/plugins/config.js";
export default {
  name: "login",
  validations: {
    userModel: {
      account: {
        required,
      },
      password: {
        required,
      },
    },
  },
  data: () => ({
    userModel: {
      account: config.isdev ? "root" : "",
      password: config.isdev ? "123123" : "",
    },
    passState: false,
  }),
  async mounted() {
    // console.log( this.$hint)
    // let res = await api.getRouter();
    // console.log(res);
    // const whiteList = ["/login", "/home", "/register"];
    // let inWhiteList = (s) => whiteList.some((w) => w === s);
    // console.log(inWhiteList("/home"))
  },

  methods: {
    async login() {
      let that = this;
      that.$v.userModel.$touch();
      if (that.$v.userModel.$invalid) {
        return;
      }
      that.userModel.pass = this.$md5(that.userModel.password);
      delete that.userModel.password;
      try {
        that.$loading({ msg: "登录" });
        let result = await userLogin(that.userModel, that);
        if (result.code === 200) {
          localStorage.setItem("token", result.data.token);
          saveItemObj("user", result.data);
          that.$hint({ msg: result.msg });
          setTimeout(() => {
            that.$router.replace("/");
            that.userModelReset();
          }, 200);
        } else {
          that.$hint({ msg: "登录失败,请检查账号密码", type: "error" });
          that.userModelReset();
        }
      } catch (e) {
        console.log(e);
        that.userModelReset();
      }
    },
    userModelReset() {
      let that = this;
      that.userModel = {
        account: "",
        password: "",
      };
    },
  },
  computed: {
    accountErrors() {
      const errors = [];
      if (!this.$v.userModel.account.$dirty) return errors;
      !this.$v.userModel.account.required && errors.push("请输入账号");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.userModel.password.$dirty) return errors;
      !this.$v.userModel.password.required && errors.push("请输入密码");
      return errors;
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #222;
}
#canvas {
  border: 1px solid #222;
  margin-left: 15px;
  width: 120px;
  height: 50px;
}

.login_sheet {
  max-width: 1050px;
  position: absolute;
  z-index: 10;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 4px;
}
.login_out_box {
  padding-top: 36%;
  width: 65%;
  // height: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  & .login_inside_box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    min-width: 650px;
    height: 100%;
    min-height: 430px;
    display: flex;
    & .sheet2 {
      flex: 1;
    }
  }
}
.go_register{
  width:100%;
  text-align: center;
  margin-top: 10px;
  position: relative;
  line-height: 20px;
  // &::after{
  //   content:"";
  //   position: absolute;
  //   top:50%;
  //   left:50%;
  //   width: 80%;
  //   height: 1px;
  //   background-color: #999;
  //   opacity: 0.2;
  //   z-index:1;
  //   transform: translate(-50%, -50%);
  // }
  & > a{
    position: relative;
    z-index:2;
    padding: 0 5px;
    background-color: #fff;
    // text-decoration: none;
  }
}
</style>