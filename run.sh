./node_modules/.bin/pm2 delete fudian-bank-3010
NODE_ENV=production ./node_modules/.bin/pm2 start server/index.js --name fudian-bank-3010
