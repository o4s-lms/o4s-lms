interface Props {
	currency: string;
	num: number;
	numSize: string;
}

function Price({currency, num, numSize }: Props) {
	if (num == 0) {
		return (
			<>
				GRATUITO
			</>
		)
	}
  return (
    <>
      Preço: {currency.toUpperCase()} <span className={numSize}>{num/100}</span>
    </>
  )
}

export default Price