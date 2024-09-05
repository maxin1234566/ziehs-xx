// 自定义配置，参考 ./default/setting.config.js，需要自定义的属性在这里配置即可
module.exports = {
  theme: {
    color: '#0067cc', //蓝色
    mode: 'dark',
  },
  multiPage: true,
  asyncRoutes: process.env.NODE_ENV === 'production' ? false : false, // 上线的时候 ‘：’前面改成 true 
  animate: {
    name: 'lightSpeed',
    direction: 'left'
  }
}