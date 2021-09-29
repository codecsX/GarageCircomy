const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs')
var crypto = require("crypto");
token = crypto.randomBytes(32).toString('base64');
tokens = crypto.randomBytes(64).toString('base64');
tokenss = crypto.randomBytes(50).toString('base64');

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

var jsonData =
  {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],
    type: "VerifiablePresentation",
    id: "http://example.edu/credentials/1872",
    type: ["VerifiableCredential", "CircomyCredential"],
    issuer: "Marcus Robert",
    issuanceDate: "2010-01-01T19:73:24Z",
    location: "61.9241° N 25.7482° E",
    country: "Finland",
    region: "Helsinki",
    verifiableCredential: [{
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1"
      ],

      credentialSubject: {
        id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
        alumniOf: {
          id: "did:example:c276e12ec21ebfeb1f712ebc6f1",
          name: [{
            value: "Example University",
            lang: "en"
          }, {
            value: "Exemple d'Université",
            lang: "fr"
          }]
        }
      },
      proof: {
        type: "Signed by Team Circomy",
        created: "2017-06-18T21:19:10Z",
        proofPurpose: "assertionMethod",
        verificationMethod: "https://example.edu/issuers/keys/1",
        jws: "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..TCYt5XsITJX1CxPCT8yAV-TVkIEq_PbChOMqsLfRoPsnsgw5WEuts01mq-pQy7UJiN5mgRxD-WUcX16dUEMGlv50aqzpqh4Qktb3rk-BuQy72IFLOqV0G_zS245-kronKb78cPN25DGlcTwLtjPAYuNzVBAh4vGHSrQyHUdBBPM"
      }

    }],

    "proof": {
      "type": "Signed by Team Circomy",
      "created": "2018-09-14T21:19:10Z",
      "proofPurpose": "authentication",
      "verificationMethod": "did:example:ebfeb1f712ebc6f1c276e12ec21#keys-1",

      "challenge": "1f44d55f-f161-4938-a659-f8026467f126",
      "domain": "4jt78h47fh47",
      "jws": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..kTCYt5XsITJX1CxPCT8yAV-TVIw5WEuts01mq-pQy7UJiN5mgREEMGlv50aqzpqh4Qq_PbChOMqsLfRoPsnsgxD-WUcX16dUOqV0G_zS245-kronKb78cPktb3rk-BuQy72IFLN25DYuNzVBAh4vGHSrQyHUGlcTwLtjPAnKb78"
    }
  }

JSON.stringify(jsonData);
// let datas = JSON.parse(fs.readFileSync('./public/BuildingInformationOutputSchema.jsonld', 'utf8'))
// console.log(datas)

// let jsonData = JSON.parse(fs.readFileSync('./public/BuildingInformationOutputSchemanew.jsonld', 'utf8'))
// console.log(jsonData)
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const d = randomDate(new Date(2021, 0, 1), new Date());
console.log(d);



app.get('/', (req, res)=>{
  res.render('app', {data: jsonData.issuanceDate, issuers: jsonData.issuer, sign: jsonData.proof.type});
})

app.post('/', function(req, res){
  res.render('buildingfirst', {data: jsonData.issuanceDate, issuers: jsonData.issuer, sign: jsonData.proof.type, loc: jsonData.location});
})


app.get('/buildingfirst', (req, res)=>{
  res.render('buildingfirst', {data: jsonData.issuanceDate, issuers: jsonData.issuer, sign: jsonData.proof.type, loc: jsonData.location, locCountry: jsonData.country, locRegion: jsonData.region, expiration: d, tokenprevs: tokenss});
})

app.post('/buildingfirst', (req, res)=>{
  res.render('transportbooking');
})



console.log(token);

app.get('/transportbooking', (req, res)=>{
  res.render('transportbooking');
})

app.post('/transportbooking', function(req, res){
  res.render('checkout', {shipping: req.body.service, shippingprice: req.body.budget, data: jsonData.issuanceDate, issuers: jsonData.issuer, tokens: token, tokenprev: tokens, sign: jsonData.proof.type, credential: jsonData.type})
})

app.get('/checkout', (req, res)=>{
  res.render('checkout', {data: jsonData.issuanceDate, issuers: jsonData.issuer, sign: jsonData.proof.type, credential: jsonData.type, tokens: token, tokenprev: tokens, shipping: req.body.service});
})

app.get('/dashboard', (req, res)=>{
  res.sendFile(__dirname + '/public/dashboard.html');
})


const port = process.env.PORT || 3000;




app.listen(port, () => {
  console.log('Server started on port: ${port}')
})
