import { MoveRight } from 'lucide-react'

function CheckOutButton({ webUrl }) {
  return (
    <a
      href={webUrl}
      aria-label="checkout-products"
      className="bg-palette-primary font-primary focus:ring-palette-light hover:bg-palette-dark flex w-full items-center justify-center rounded-sm 
      pb-1 pt-2 text-lg font-semibold leading-relaxed text-white focus:outline-none focus:ring-1"
    >
      Check Out
			<MoveRight className="ml-2 inline-flex w-4"/>
    </a>
  )
}

export default CheckOutButton