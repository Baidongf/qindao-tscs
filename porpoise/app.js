const express = require('express')
const project = require('./config/project.config')
const compress = require('compression')
const app = require('./back/routes/index')

// const guaranteeRisk = require('./back/routes/guaranteeRisk')
// const routeIndex = require('./back/routes/index')

// Apply gzip compression
app.use(compress())

app.use(express.static(project.paths.dist()))

app.use('/graph', express.static(project.paths.dist()))
app.use('/graph', (req, res) => {
  if (req.headers.accept.includes('html')) {
    res.sendFile(`${project.paths.dist()}/index.html`)
  }
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(3036)
