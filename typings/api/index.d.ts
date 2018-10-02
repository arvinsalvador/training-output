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

    interface CreateVirtualBalanceInput {
      id: string
      account: string
      context: string
      balance: number
      type: string
    }

  }

  namespace Output {

  }
}