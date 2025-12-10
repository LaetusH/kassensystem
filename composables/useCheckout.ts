export const useCheckout = () => {
  const selectedCashier = useState<number | null>('selectedCashier', () => null)
  const orderItems = useState<any[]>('orderItems', () => [])

  return {
    selectedCashier, orderItems
  }
}