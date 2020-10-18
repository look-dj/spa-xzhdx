module.exports = {
  isdev: ["development"].includes(process.env.NODE_ENV),
  // isdev: true, //为true打包vue vuetify等依赖
  storage: {
    account: 'root',
    pass: '123123'
  }
};
