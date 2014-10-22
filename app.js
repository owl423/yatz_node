var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

var players = [],
    seq = 0;


app.get('/enroll', function (req, res) {
    players.push({
        id : seq,
        game : [null,null,null,null,null,null,null,null,null,null,null,null,null],
        turn : 0
    });
    
    res.json({
        id : seq++
    });
});

app.get('/players', function(req, res) {
    res.json(players);
});

app.post('/:user/roll', function(req, res) {
    
    var id = req.params.user,
        eyes = req.body,
        player = _.find(players, function (player) { return player.id == id; });
    
    if (player.turn < 3) {
        _.map(eyes, function (eye) {
            return _.extend(eye, { eye : eye.status === 'hold' ? eye.eye : Math.floor(Math.random() * 6) });
        })

        player.turn++;
    }
    
    res.json(eyes);
});

app.post('/:user/decision', function(req, res) {
    res.send('decision');
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.sendfile('views/error.html');
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.sendfile('views/error.html');
});


module.exports = app;
