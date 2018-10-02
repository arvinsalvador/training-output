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

    interface UpdateReservedBalanceInput {
      request: string
      account: string
      context: string
      amount: number
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

    interface UpdateVirtualBalanceInput {
      request: string
      account: string
      context: string
      amount: number
    }

    interface CancelVirtualBalanceInput {
      request: string
      account: string
      context: string
    }

    interface CommitVirtualBalanceInput {
      request: string
      account: string
      context: string
    }
  }

  namespace Output {

  }
}