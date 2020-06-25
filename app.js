  const express=require('express');
var app = require('express')();
const path = require('path');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');

app.use(express.static(__dirname + '/public')); // Public folder is use to style the website..
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');


var appc = require('http').Server(app),
  io = require('socket.io').listen(appc),
  fs = require('fs'),
  mysql = require('mysql'),
  connectionsArray = [],

  connection = mysql.createConnection({
    connectionLimit: '10',
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fyp',
    port: 3306
  }),

  POLLING_INTERVAL = 3000,
  pollingTimer;


// If there is an error connecting to the database
connection.connect(function (err) {
  // connected! (unless `err` is set)
  if (err) {
    console.log(err);
  }
});







app.get('/', (req, res) => {

    res.render('index.ejs');
  })

  
app.get('/fork', (req, res) => {

    res.render('fork.ejs');
  })
  



  app.get('/card', (req, res) => {

    connection.query("SELECT * FROM `live`",
    (error, res2) => {
          if(error){
              console.log(error);
              return;
          }

          res.render('card.ejs',{
            "result" :res2
          });
      })


   
  })
  

  function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }


  app.post('/forkpin',(req, res) => {

    connection.query("SELECT * FROM `live` WHERE id=" +req.body.forkid ,
    (error, res2) => {
          if(error){
              console.log(error);
              return;
          }
          res.render('editorforfork.ejs',{
            "result" :res2
          });
      })

  })
  
  let loginuserid=1;

  app.post('/newpin',(req, res) => {

    connection.query("SELECT `htmldata`, `cssdata`, `jsdata` FROM `live` WHERE id=" +req.body.savepin,(error, res2) => 
    {
          if(error){
              console.log(error);
              return;
          }

          console.log('====================================');
        //  console.log(res2);
          console.log('====================================');

          var valuesinserted = [
             loginuserid, 
            req.body.htmldata,
            req.body.cssdata,
            req.body.jsdata
          ]
    
          console.log(valuesinserted);
          connection.query("INSERT INTO `live`(`userid`, `htmldata`, `cssdata`, `jsdata`) VALUES (?) " ,[valuesinserted],
          (error, res2) => 
          {
            res.render('editorforfork.ejs',{
                "result" :""
              });
            });

         
      })

  })





  app.post('/data', (req, res) => {
    // console.log(req.body.htmldata);

     //console.log(escapeHtml(req.body.htmldata));
     
     let htmldatas ="asd";
    //  const $ = cheerio.load(req.body.htmldata);

    var valuesinserted = [
        req.body.htmldata,
        req.body.cssdata,
        req.body.jsdata
      ]

        //      console.log($);
            //INSERT INTO `pin`(`id`, `html`) VALUES ([value-1],[value-2])
      connection.query("INSERT INTO `live`( `htmldata`,`cssdata`,`jsdata`) VALUES (?)", [valuesinserted],
      (error, res2) => {
            if(error){
                console.log(error);
                return;
            }
            res.render('index.ejs');
        })
  })
  


  



 app.listen(4000,()=>{
    console.log('Listen at port 4000');
   })
