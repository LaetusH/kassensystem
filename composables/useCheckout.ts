export const useCheckout = () => {
  const selectedCashier = useState<number | string>('selectedCashier', () => '')
  const selectedEvent = useState<number | string>('selectedEvent', () => '')
  const orderItems = useState<any[]>('orderItems', () => [])
  const isFachschaft = useState<boolean>('isFachschaft', () => false)

  return {
    selectedCashier, selectedEvent, orderItems, isFachschaft
  }
}