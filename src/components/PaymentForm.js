import React, { useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Input, Button, Col, Row } from 'reactstrap'
import CurrencyInput from 'react-currency-input-field';
import axios from 'axios'

function PaymentForm() {
  // const [success, setSuccess] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [cardName, setCardName] = useState('')
  const [invoice, setInvoice] = useState('')
  const [amount, setAmount] = useState(0)
  const stripe = useStripe()
  const elements = useElements()

  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    })

    if (!error) {
      try {
        const { id } = paymentMethod
        const metadata = {
          contact: contactName,
          company: companyName,
          cardName: cardName
        }
        const response = await axios.post('https://stripe-leafa.herokuapp.com/payment', {
          amount: amount,
          id,
          metadata: JSON.stringify(metadata),
          invoice: invoice
        })
        console.log(response)
      } catch (error) {
        console.log("Error:", error)
      }
    }
  }

  return (
    <React.Fragment>
      <form id="payment-form" onSubmit={handleSubmit}>
        <div className="form-group mt-2">
          <Row>
            <Col md={6}>
              <Input
                type="text"
                value={companyName}
                name="company"
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name"
              />
            </Col>
            <Col md={6}>
              <Input
                type="text"
                name="contact"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Contact Name"
              />
            </Col>
          </Row>
        </div>
        <div className="form-group mt-2">
          <Row>
            <Col md={7}>
              <Input
                type="number"
                value={invoice}
                min="1"
                onChange={(e) => setInvoice(e.target.value)}
                name="invoiceNumber"
                placeholder="Invoice Number"
              />
            </Col>
            <Col md={5}>              
              <CurrencyInput
                id="input-example"
                className="form-control"
                name="input-name"
                placeholder="Amount"
                allowDecimals={false}
                allowNegativeValue={false}
                onValueChange={(value) => setAmount(value)}
                disableGroupSeparators={true}
              />
            </Col>
          </Row>
        </div>
        <div className="form-group mt-2">
          <Input
            type="text"
            placeholder="Card Name"
            value={cardName}
            name="cardName"
            onChange={(e) => setCardName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div id="card-element">
            <CardElement className="form-control p-2 mt-2" />
          </div>
        </div>
        <div className="form-group">
          <Button disabled={!companyName || !contactName || !cardName || !amount}>
            Pay {
              !amount 
                ? formatter.format(0) 
                : formatter.format(amount / 100)
            }
          </Button>
        </div>
      </form>
    </React.Fragment >
  )
}

export default PaymentForm
