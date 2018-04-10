const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

var passport = require('passport');
const keys = require('./core/config/keys');
const oauth = require('./routes/Oauth');
const app = express()


app.use((req, res, next)=> {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors())
app.use(passport.initialize());

app.get('/',(req, res)=> {
  res.send('Page under construction.');
});

app.use('/authentificte', oauth);

/*app.get('/status', (req, res) => {
  res.send({
    message: 'hellooooooooo!'
  })
})

app.listen(process.env.PORT || 8081)*/

//connect to mongoDB
mongoose.connect(keys.mongodb.dbURI,()=>{});

// catch 404 and forward to error handler
app.use((req, res, next) =>{
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;
