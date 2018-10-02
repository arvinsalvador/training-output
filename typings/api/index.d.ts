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

    interface UpdateReservedBalanceInput {
      request: string
      account: string
      context: string
      amount: number
      type: string
    }

    interface ReleaseReservedBalanceInput {
      request: string
      account: string
      context: string
    }

    interface CreateVirtualBalanceInput {
      id: string
      account: string
      context: string
      balance: number
    }
  }

  namespace Output {

  }
}