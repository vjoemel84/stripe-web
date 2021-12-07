import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from './components/PaymentForm'
import './App.css'

const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;

const stripePromise = loadStripe(PUBLIC_KEY)

function App() {
  return (
    <div className="App">
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
}

export default App;
