interface ExchangeRateResponse {
  result: string
  base: string
  date: string
  rates: {
    [key: string]: number
  }
}

export async function fetchExchangeRates(baseCurrency = "USD"): Promise<ExchangeRateResponse> {
  try {
    // Using the Open Exchange Rates API (free tier)
    const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching exchange rates:", error)
    throw error
  }
}

