var express = require('express'),
  cors = require('cors'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');
global.Vocab = require('./api/models/VocabModel');
const routes = require('./api/routes/VocabRoutes');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://thaibaotran33:thaibaotran33@cluster0.peze41q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
app.use(cors());
app.use(express.urlencoded());
app.use(bodyParser.json());
routes(app);

app.listen(port);
app.get('/',(req,res) => {
  res.status(404).send({url: '${req.originalUrl} not found'});
});
console.log('Server started on: ' + port);