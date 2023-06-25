import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js"
import { client } from "@/lib/wundergraph"

interface Props {
  orderId: string;
  saveOrder: (method_id: string | undefined) => void;
}

function PayPal({ orderId }: Props) {
  const FUNDING_SOURCES = [
    FUNDING.PAYPAL,
    FUNDING.CARD
  ]

  const initialOptions = {
    "clientId": process.env.PAYPAL_CLIENT_ID as string,
    "enable-funding": "paylater,venmo",
  }

  return (
    <div className="App">
      <PayPalScriptProvider options={initialOptions}>
        {
          FUNDING_SOURCES.map(fundingSource=>{
            return(
              <PayPalButtons
                fundingSource={fundingSource}
                key={fundingSource}

                style={{
                  layout: 'vertical',
                  shape: 'rect',
                  color: (fundingSource == FUNDING.PAYLATER) ? 'gold' : undefined,
                }}

                createOrder={async (data, actions) => {
                  const { data: order, error } = await client.mutate({
                    operationName: 'paypal/orders',
                    input: {
                      order_id: orderId
                    }
                  })
                  if (error) {
                    console.error(error)
                  }

                  return order.id

                }}

                onApprove={async (data, actions) => {
                  const { data: details, error } = await client.mutate({
                    operationName: 'paypal/capture',
                    input: {
                      order_id: data.orderID
                    }
                  })

                  if (error) {
                    console.error(error)
                  }

                  const errorDetail = Array.isArray(details.details) && details.details[0]

                  if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
                    return actions.restart();
                    // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
                  }

                  if (errorDetail) {
                    let msg = 'Sorry, your transaction could not be processed.';
                    msg += errorDetail.description ? ' ' + errorDetail.description : '';
                    msg += details.debug_id ? ' (' + details.debug_id + ')' : '';
                    alert(msg);
                  }

                  // Successful capture! For demo purposes:
                  console.log('Capture result', details, JSON.stringify(details, null, 2));
                  const transaction = details.purchase_units[0].payments.captures[0];
                  alert('Transaction '+ transaction.status + ': ' + transaction.id + 'See console for all available details')


                }}
            />)
          })
        }
      </PayPalScriptProvider>
    </div>
  )
}

export default PayPal
