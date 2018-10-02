declare namespace API {
  namespace Input {
    interface CreateAccountInput {
      id: string
      balance: number
      availableBalance: number
    }
    interface UpdateBalanceInput {
      request: string
      account: string
      amount: number
    }
  }

  namespace Output {

  }
}