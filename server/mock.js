

const express = require('express')
const router = express.Router()
const MODULE_PATH = '../src/store/modules'
require(`${MODULE_PATH}/loginOut/mock`)(router)
require(`${MODULE_PATH}/systemMgt/userMgt/mock`)(router)
require(`${MODULE_PATH}/systemMgt/orgMgt/mock`)(router)
require(`${MODULE_PATH}/systemMgt/roleMgt/mock`)(router)
require(`${MODULE_PATH}/systemMgt/paramsMgt/mock`)(router)
require(`${MODULE_PATH}/customerMgt/tagMgt/mock`)(router)
require(`${MODULE_PATH}/home/mock`)(router)
require(`${MODULE_PATH}/customerMgt/customerMgt/mock`)(router)
require(`${MODULE_PATH}/customerMgt/accountMgt/mock`)(router)
module.exports = router
