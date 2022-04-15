const express = require("express")
const bodyParser = require("body-parser")
const engines = require("consolidate")
const paypal = require("paypal-rest-sdk")

const app = express()

app.engine("ejs", engines.ejs)
app.set("views", "./views")
app.set("view engine", "ejs")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AeMrN8tVBFVT0nIrAuCD9i_SVCEk0bpFhZkvCZLSl3MA7OkrzyZMzcW7h5sBRuTsrNqU72P6Wc1IGQCv',
  'client_secret': 'EDweszAiQ9Uk5r0a6tCjnwAx3jc01d3BlGDULeCCwAhZx23eGG2fngxJyiNnH2j61NksxDaDPlfU4Oym'
})

app.get("/plus", (req, res) => res.render("plus"))

app.get("/gold", (req, res) => res.render("gold"))

let price

app.get("/paypalPlusOneMonth", (req, res) => {
  price = req.query.price
  console.log("price: ", price)
  let create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://192.168.43.97:3000/success",
      "cancel_url": "http://192.168.43.97:3000/cancel"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "item",
          "sku": "item",
          "price": "4.00",
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": "4.00"
      },
      "description": "This is the payment description."
    }]
  }


  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error
    } else {
      console.log("Create Payment Response")
      console.log(payment)
      res.redirect(payment.links[1].href)
    }
  })
})

app.get("/paypalPlusSixMonths", (req, res) => {
  price = req.query.price
  console.log("price: ", price)
  let create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://192.168.43.97:3000/success",
      "cancel_url": "http://192.168.43.97:3000/cancel"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "item",
          "sku": "item",
          "price": "2.00",
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": price
      },
      "description": "This is the payment description."
    }]
  }


  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error
    } else {
      console.log("Create Payment Response")
      console.log(payment)
      res.redirect(payment.links[1].href)
    }
  })
})

app.get("/paypalPlusTwelveMonths", (req, res) => {
  price = req.query.price
  console.log("price: ", price)
  let create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://192.168.43.97:3000/success",
      "cancel_url": "http://192.168.43.97:3000/cancel"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "item",
          "sku": "item",
          "price": "1.5",
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": price
      },
      "description": "This is the payment description."
    }]
  }


  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error
    } else {
      console.log("Create Payment Response")
      console.log(payment)
      res.redirect(payment.links[1].href)
    }
  })
})

app.get("/paypalGoldOneMonth", (req, res) => {
  price = req.query.price
  console.log("price: ", price)
  let create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://192.168.43.97:3000/success",
      "cancel_url": "http://192.168.43.97:3000/cancel"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "item",
          "sku": "item",
          "price": price,
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": price
      },
      "description": "This is the payment description."
    }]
  }


  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error
    } else {
      console.log("Create Payment Response")
      console.log(payment)
      res.redirect(payment.links[1].href)
    }
  })
})

app.get("/paypalGoldSixMonths", (req, res) => {
  price = req.query.price
  console.log("price: ", price)
  let create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://192.168.43.97:3000/success",
      "cancel_url": "http://192.168.43.97:3000/cancel"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "item",
          "sku": "item",
          "price": price,
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": price
      },
      "description": "This is the payment description."
    }]
  }


  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error
    } else {
      console.log("Create Payment Response")
      console.log(payment)
      res.redirect(payment.links[1].href)
    }
  })
})

app.get("/paypalGoldTwelveMonths", (req, res) => {
  price = req.query.price
  console.log("price: ", price)
  let create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://192.168.43.97:3000/success",
      "cancel_url": "http://192.168.43.97:3000/cancel"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "item",
          "sku": "item",
          "price": price,
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": price
      },
      "description": "This is the payment description."
    }]
  }


  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error
    } else {
      console.log("Create Payment Response")
      console.log(payment)
      res.redirect(payment.links[1].href)
    }
  })
})

app.get("/success", (req, res) => {
  let payerID = req.query.PayerID
  let paymentId = req.query.paymentId

  const execute_payment_json = {
    "payer_id": payerID,
    "transactions": [{
      "amount": {
        "currency": "USD",
        "total": price
      }
    }]
  }

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      console.log(error.response)
      throw error
    } else {
      console.log("Get Payment Response")
      console.log(JSON.stringify(payment))
      res.render("success")
    }
  })
})

app.get("/cancel", (req, res) => {
  res.render("cancel")
})

app.listen(3000, () => console.log("server is on"))