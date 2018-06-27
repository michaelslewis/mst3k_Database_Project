'use strict';
var express = require('express'),
    app = express(),
    handlebars = require('express-handlebars'),
    bodyParser = require('body-parser'),
    mysql = require('mysql');

// Instantiate connection pool to mysql for queries
var pool = mysql.createPool({
  host: 'mysql.cs.orst.edu',
  user: 'cs340_lewismic',
  password: '5488',
  database: 'cs340_lewismic'
});

// Configure handlebars engine for layout and content files in partials directory
app.engine('handlebars', handlebars({defaultLayout: 'main',
                              extname:'.handlebars',
                              helpers: {dateFormat: require('handlebars-dateformat')},
                              partialsDir:'views/partials'}
));
app.set('view engine', 'handlebars');

// Sets port for running on server
app.set('port', 23456);

// Middleware function to serve static files from public directory
app.use(express.static('public'));

// Middleware functions to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Response passes route from home file to server upon request for '/'
app.get('/', function(req, res, next) {
  var ctx = {};

  ctx.active = {home: true};
  res.render('home', ctx);
});

// Route from actor file 
app.get('/actor', function(req, res, next){
  var ctx = {};
  ctx.active = {actor: true};
  // Perform query of all actor data
  pool.query('SELECT * FROM actor;', function(err, rows){
    if(err) next(err);
    else {
      if(rows[0] !== undefined){
        ctx.results = rows;
        ctx.keys = Object.keys(rows[0]);
      }
      else {
        ctx.error = 'Table returned no data';
      }
      res.render('actor', ctx);
    }
  })
});

// Route from mst3k_character file 
app.get('/mst3k_character', function(req, res, next) {
  var ctx = {};
  ctx.active = {mst3k_character: true};
  // Perform query of all mst3k_character data
  pool.query('SELECT * FROM mst3k_character;', function(err, rows){
    if(err) next(err);
    else {
      if(rows[0] !== undefined){
        ctx.results = rows;
        ctx.keys = Object.keys(rows[0]);
      }
      else {
        ctx.error = 'Table returned no data';
      }
      res.render('mst3k_character', ctx);
    }
  })
});

// Route from genre file 
app.get('/genre', function(req, res, next){
  var ctx = {};
  ctx.active = {genre: true};
  // Perform query of all genre data
  pool.query('SELECT * FROM genre;', function(err, rows){
    if(err) next(err);
    else {
      if(rows[0] !== undefined){
        ctx.results = rows;
        ctx.keys = Object.keys(rows[0]);
      }
      else {
        ctx.error = 'Table returned no data';
      }
      res.render('genre', ctx);
    }
  })
});

// Route from movie file 
app.get('/movie', function(req, res, next){
  var ctx = {};
  ctx.active = {movie: true};
  // Perform query of all movie data
  pool.query('SELECT * FROM movie;', function(err, rows){
    if(err) next(err);
    else {
      if(rows[0] !== undefined){
        ctx.results = rows;
        ctx.keys = Object.keys(rows[0]);
      }
      else {
        ctx.error = 'Table returned no data';
      }
      res.render('movie', ctx);
    }
  })
});

// Route from episode file 
app.get('/episode', function(req, res, next){
  var ctx = {};
  ctx.active = {episode: true};
  // Perform query of all episode data
  pool.query('SELECT * FROM episode;', function(err, rows){
    if(err) next(err);
    else {
      if(rows[0] !== undefined){
        ctx.results = rows;
        ctx.keys = Object.keys(rows[0]);
      }
      else {
        ctx.error = 'Table returned no data';
      }
      res.render('episode', ctx);
    }
  })
});

// Route from actor_episode file 
app.get('/actor_episode', function(req, res, next){
  var ctx = {};
  ctx.active = {actor_episode: true};
  // Perform query of all actor_episode data
  pool.query('SELECT * FROM actor_episode;', function(err, rows){
    if(err) next(err);
    else {
      if(rows[0] !== undefined){
        ctx.results = rows;
        ctx.keys = Object.keys(rows[0]);
      }
      else {
        ctx.error = 'Table returned no data';
      }
      res.render('actor_episode', ctx);
    }
  })
});

// Route from actor_character file 
app.get('/actor_character', function(req, res, next){
  var ctx = {};
  ctx.active = {actor_character: true};
  // Perform query of all actor-character data
  pool.query('SELECT * FROM actor_character;', function(err, rows){
    if(err) next(err);
    else {
      if(rows[0] !== undefined){
        ctx.results = rows;
        ctx.keys = Object.keys(rows[0]);
      }
      else {
        ctx.error = 'Table returned no data';
      }
      res.render('actor_character', ctx);
    }
  })
});

// Route from character_episode file 
app.get('/character_episode', function(req, res, next){
  var ctx = {};
  ctx.active = {character_episode: true};
  // Perform query of all character_episode data
  pool.query('SELECT * FROM character_episode;', function(err, rows){
    if(err) next(err);
    else {
      if(rows[0] !== undefined){
        ctx.results = rows;
        ctx.keys = Object.keys(rows[0]);
      }
      else {
        ctx.error = 'Table returned no data';
      }
      res.render('character_episode', ctx);
    }
  })
});

// Route from example1 file 
app.get('/example1', function(req, res, next) {
  var ctx = {};
  ctx.active = {example1: true};
  // Perform example1 search query
  var search = 'SELECT mst3k_character.fname, mst3k_character.lname FROM mst3k_character ';
  search += 'INNER JOIN character_episode ON mst3k_character.id = character_episode.character_id ';
  search += 'INNER JOIN episode ON episode.id = character_episode.episode_id';
  search += ' WHERE episode.title = "The Crawling Eye";';
  pool.query(search, req.body.title, function(err, rows){
    if(err) next(err);
    else {
      if(rows[0] !== undefined){
        ctx.results = rows;
        ctx.keys = Object.keys(rows[0]);
      }
      else {
        ctx.error = 'Table returned no data';
      }
      res.render('example1', ctx);
    }
  })
});

// Route from example2 file 
app.get('/example2', function(req, res, next) {
  var ctx = {};
  ctx.active = {example2: true};
  // Perform example2 search query
  var search = 'SELECT actor.fname, actor.lname FROM actor ';
  search += 'INNER JOIN actor_episode ON actor.id = actor_episode.actor_id ';
  search += 'INNER JOIN episode ON episode.id = actor_episode.episode_id';
  search += ' WHERE episode.title = "Laserblast";';
  pool.query(search, req.body.title, function(err, rows){
    if(err) next(err);
    else {
      if(rows[0] !== undefined){
        ctx.results = rows;
        ctx.keys = Object.keys(rows[0]);
      }
      else {
        ctx.error = 'Table returned no data';
      }
      res.render('example2', ctx);
    }
  })
});

// Route from example3 file 
app.get('/example3', function(req, res, next) {
  var ctx = {};
  ctx.active = {example3: true};
  // Perform example3 search query
  var search = 'SELECT actor.fname, actor.lname FROM actor ';
  search += 'INNER JOIN actor_character ON actor.id = actor_character.actor_id ';
  search += 'INNER JOIN mst3k_character ON mst3k_character.id = actor_character.character_id';
  search += ' WHERE mst3k_character.fname = "Tom" AND mst3k_character.lname = "Servo";';
  pool.query(search, req.body.title, function(err, rows){
    if(err) next(err);
    else {
      if(rows[0] !== undefined){
        ctx.results = rows;
        ctx.keys = Object.keys(rows[0]);
      }
      else {
        ctx.error = 'Table returned no data';
      }
      res.render('example3', ctx);
    }
  })
});

// Route from example4 file 
app.get('/example4', function(req, res, next) {
  var ctx = {};
  ctx.active = {example4: true};
  // Perform example4 search query
  var search = 'SELECT DISTINCT movie.title, movie.synopsis FROM movie ';
  search += 'INNER JOIN episode ON movie.id = episode.movie_id ';
  search += 'INNER JOIN actor_episode ON episode.id = actor_episode.episode_id ';
  search += 'INNER JOIN actor ON actor_episode.actor_id = actor.id ';
  search += 'WHERE actor.fname like "%y%" OR actor.lname like "%w%"';
  search += ' ORDER BY movie.title ASC;';
  pool.query(search, req.body.title, function(err, rows){
    if(err) next(err);
    else {
      if(rows[0] !== undefined){
        ctx.results = rows;
        ctx.keys = Object.keys(rows[0]);
      }
      else {
        ctx.error = 'Table returned no data';
      }
      res.render('example4', ctx);
    }
  })
});

// Route from example5 file 
app.get('/example5', function(req, res, next) {
  var ctx = {};
  ctx.active = {example5: true};
  // Perform example5 search query
  var search = 'SELECT DISTINCT genre.genre_name, genre.subgenre_name FROM genre ';
  search += 'INNER JOIN movie ON genre.id = movie.genre_id';
  search += ' WHERE movie.director_fname = "Roger" AND movie.director_lname = "Corman";';
  pool.query(search, req.body.title, function(err, rows){
    if(err) next(err);
    else {
      if(rows[0] !== undefined){
        ctx.results = rows;
        ctx.keys = Object.keys(rows[0]);
      }
      else {
        ctx.error = 'Table returned no data';
      }
      res.render('example5', ctx);
    }
  })
});

  // Perform example6 search query
app.get('/example6', function(req, res, next) {
  var ctx = {};
  ctx.active = {example6: true};
  // Perform example6 search query
  var search = 'SELECT DISTINCT actor.wikia FROM actor ';
  search += 'INNER JOIN actor_episode ON actor.id = actor_episode.actor_id ';
  search += 'INNER JOIN episode ON actor_episode.episode_id = episode.id ';
  search += 'INNER JOIN character_episode ON episode.id = character_episode.character_id ';
  search += 'INNER JOIN mst3k_character ON character_episode.character_id = mst3k_character.id';
  search += ' WHERE mst3k_character.type = "Gorilla";';
  pool.query(search, req.body.title, function(err, rows){
    if(err) next(err);
    else {
      if(rows[0] !== undefined){
        ctx.results = rows;
        ctx.keys = Object.keys(rows[0]);
      }
      else {
        ctx.error = 'Table returned no data';
      }
      res.render('example6', ctx);
    }
  })
});

// Route delete function from app.js 
app.delete('/delete-row', function(req, res, next){
  if( req.body.id !== undefined){
    // Perform delete on requested row
    var query = "DELETE FROM " + req.body.table + " WHERE id=" + req.body.id;
    pool.query(query, function(err, rows){
      if(err){
        next(err);
      }
      else{
        res.send(req.body.id);
      }
    })
  }
  else{
    res.send("Error: No ID provided");
  }
});

// Route update function from app.js 
app.post('/update-row', function(req, res, next){
  var ctx = {};
  // Perform update on requested row
  var query = 'UPDATE ' + req.body.table + ' SET ?' + ' WHERE id=' + req.body.id;
  pool.query(query, req.body.columns, function(err, rows){
    if(err){
      next(err);
    }
    else {
      res.send(req.body);
    }
  })
});

// Route add function from app.js 
app.post('/add-row', function(req, res, next){
  var ctx = {};
  // Perform add on requested row
  var query = 'INSERT INTO ' + req.body.table + ' SET ? ;';

  pool.query(query, req.body.columns, function(err, rows){
    if(err) {console.log(this.sql); res.send(err); next(err);}
    else {
      res.send("Success");
    }
  })
});

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(req, res) {
  console.log('Application started on port ' + app.get('port') + '; Press Ctrl+C to terminate.')
});
