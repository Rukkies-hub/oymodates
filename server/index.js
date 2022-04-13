import express from "express"
import Stripe from "stripe"

const app = express()

const PORT = 3000

const PUBLISHABLE_KEY = "pk_test_51I0Dk8AX4NIcpyf3y2FxrILBCYiToGjzGatZPUOuidiOgmbFpbz4uePYb0MKtD3BbsOBkWOIn7vUGW59MiVodiva00htd0xyYX"
const SECRETE_KEY = "sk_test_51I0Dk8AX4NIcpyf3zxeshpnnszWUBF9Q3Lcy891fywYOBrLY5KFLQy8kqZWMIOkmO7lJLyGSLPbuMOqUXLr7B9ti00owHsYHse"

const stripe = Stripe(SECRETE_KEY, {
  apiVersion: "2020-08-27"
})


app.post("/createPaymentIntent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "usd",
      payment_method_types: ["card"]
    })

    const clientSecret = paymentIntent.client_secret

    res.json({
      clientSecret
    })
  } catch (error) {
    console.log(error.message)
    res.json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})