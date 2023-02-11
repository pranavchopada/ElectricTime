const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const { body, validationResult } = require("express-validator");
const utils = require("./utils/calculations")

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('index', {check:true})
})

app.post('/', body('ev').isNumeric(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('error')
  }
  if (req.body.distance) {
    const result = utils.calculateTime(req.body.distance, req.body.ev)
    res.render('index', {check:false, arg:'time', ev:result['ev'], time:result['time'], distance:req.body.distance})
  }
  else if(req.body.time) {
    const result = utils.calculateDistance(req.body.time, req.body.ev)
    res.render('index', {check:false, arg:'distance', ev:result['ev'], distance:result['distance'], time:req.body.time})
  }
  else {
    return res.render('error')
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})