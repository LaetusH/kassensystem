export const useCheckout = () => {
  const selectedCashier = useState<number | string>('selectedCashier', () => '')
  const orderItems = useState<any[]>('orderItems', () => [])

  return {
    selectedCashier, orderItems
  }
}