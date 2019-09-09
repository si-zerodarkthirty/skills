const functions = require('firebase-functions');
const stripe = require("stripe")("sk_test_V8Gl3z5I0ItQ81G2lpRQaBrU00VdNJp2Yj");
const cors = require('cors')({origin: true});
const admin = require('firebase-admin');

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.CheckoutSession = functions.https.onRequest((request, response) => {

    cors(request, response, async () => {

      let myProducts = request.query.products;

      myProducts = Object.entries(JSON.parse(myProducts));
      
      const productsArray = [];
      myProducts.forEach(item => {
        const p =  admin.firestore().doc(`items/${item[0]}`).get();
        productsArray.push(p);
      });

      const all = await Promise.all(productsArray);

      const results = [];

      all.forEach(item => {
        const data = {};
        data.amount = parseFloat(item.data().price);
        data.currency = "jpy";
        data.description = item.data().description ;
        data.name = item.data().title;
        data.quantity = 1

        results.push(data)
    });

    stripe.checkout.sessions.create({
      success_url: "https://skil-hunt.firebaseapp.com/item/" + all[0].id,
      cancel_url: "https://skil-hunt.firebaseapp.com/item/" + all[0].id,
      payment_method_types: ["card"],
      line_items: results
    }, function(err, session) {   
      response.send(session);
    });
  }); 
});
