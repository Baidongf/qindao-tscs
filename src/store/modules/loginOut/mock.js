module.exports = function (router) {
  router.post('/mock/gap/api/account/login', function (req, res, next) {
    res.json({
      "success": true,
      "payload": {
        userInfo: {name: 'John', id: "2"}
      },
      "message": {}
    })
  })

  router.get('/mock/gap/api/account/logout', function (req, res, next) {
    res.json({
      success: true,
      "payload": {},
      "message": {}
    })
  })
}
