const {
  override,
  fixBabelImports,
  addLessLoader,
} = require("customize-cra")

module.exports = override(

  // 用js的方式导入antd及其样式：style为true表示导入antd.less; 为false表示不使用js的方式导入antd.less或antd.css；为'css'表示使用antd.css;
  fixBabelImports("import", {
    libraryName: "antd", libraryDirectory: "es", style: false // 为false或css会导致addLessLoader失效
  }),
  addLessLoader({
    javascriptEnabled: true,
    // modifyVars: { "@primary-color": "#D24545" } // 深红色
  })
);
