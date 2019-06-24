### 图谱产品前端

```
yarn install
yarn start

npm run deploy:prod
pm2 start online.js --name porpoise -i 4 // 开3036端口
pm2 restart porpoise
pm2 stop porpoise
```

访问地址 e.g. "http://localhost:3000/?company=深圳市思恩控股有限公司&type=Graph"