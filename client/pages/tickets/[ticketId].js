import { useRequest } from "../../hooks/useRequest"
import Router from 'next/router'

const TicketShow = ({ ticket, client }) => {
  const { doRequest, errors } = useRequest({
    method: "post",
    body: { ticketId: ticket.id },
    url: "/api/orders",
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
  })

  const onPurchase = () => {
    doRequest()
  }

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h5>{ticket.price}</h5>
      <button className='btn btn-primary' onClick={onPurchase}>
        Purchase
      </button>
      {errors}
    </div>
  )
}

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query
  const { data } = await client.get(`/api/tickets/${ticketId}`)
  console.log(data)
  return { ticket: data }
}

export default TicketShow
