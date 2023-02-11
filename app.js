const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const { body, validationResult } = require("express-validator");

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('index', {check:true})
})

app.post('/', body('ev').isNumeric(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Invalid Input'});
  }
  if (req.body.distance) {
    const result = calculateTime(req.body.distance, req.body.ev)
    res.render('index', {check:false, arg:'time', ev:result['ev'], time:result['time'], distance:req.body.distance})
  }
  else if(req.body.time) {
    const result = calculateDistance(req.body.time, req.body.ev)
    res.render('index', {check:false, arg:'distance', ev:result['ev'], distance:result['distance'], time:req.body.time})
  }
  else {
    return res.status(400).json({ error: 'Invalid Input'});
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

ev_data = {
  1: {
    'speed': 3.1,
    'range': 30,
  },
  2: {
    'speed': 18,
    'range': 7,
  },
  3: {
    'speed': 24,
    'range': 31,
  },
  4: {
    'speed': 19,
    'range': 18,
  },
  5: {
    'speed': 22,
    'range': 10,
  },
  6: {
    'speed': 10,
    'range': 13,
  },
  7: {
    'speed': 12,
    'range': 22,
  },
  8: {
    'speed': 18,
    'range': 15,
  },
  9: {
    'speed': 15,
    'range': 8,
  },
  10: {
    'speed': 9,
    'range': 6,
  }
}


function calculateTime(distance, ev) {
    result = {ev:ev, time:{}}
    for (const key of Object.keys(ev_data)){
      if (distance>ev_data[key]['range']) {
        result['time'][key] = -1
      }
      else {
        result['time'][key] = (distance*60/ev_data[key]['speed']).toFixed(2)
      }
    }
    return result
}


function calculateDistance(time, ev) {
    result = {ev:ev, distance:{}}
    for (const key of Object.keys(ev_data)){
      if (time*ev_data[key]['speed']/60>ev_data[key]['range']) {
        result['distance'][key] = -1
      }
      else {
        result['distance'][key] = (time*ev_data[key]['speed']/60).toFixed(2)
      }
    }
    return result
}