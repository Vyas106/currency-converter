"use client"

import { useState, useEffect } from "react"
import { ArrowLeftRight, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fetchExchangeRates } from "@/lib/api"

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1)
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("EUR")
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [currencies, setCurrencies] = useState<string[]>([])

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        const data = await fetchExchangeRates(fromCurrency)

        if (data && data.rates) {
          setCurrencies(Object.keys(data.rates).concat(fromCurrency).sort())
          const rate = data.rates[toCurrency]
          setExchangeRate(rate)
          setConvertedAmount(amount * rate)
        }
      } catch (err) {
        setError("Failed to load exchange rates. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [amount, fromCurrency, toCurrency])

  const handleConvert = async () => {
    if (!amount) return

    try {
      setIsLoading(true)
      setError(null)

      const data = await fetchExchangeRates(fromCurrency)

      if (data && data.rates) {
        const rate = data.rates[toCurrency]
        setExchangeRate(rate)
        setConvertedAmount(amount * rate)
      }
    } catch (err) {
      setError("Failed to convert currency. Please try again later.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    // We'll need to fetch new rates after swapping
    handleConvert()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Convert Currency</CardTitle>
        <CardDescription>Get real-time currency exchange rates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
            placeholder="Enter amount"
          />
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
          <div className="space-y-2">
            <label htmlFor="from-currency" className="text-sm font-medium">
              From
            </label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger id="from-currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="ghost" size="icon" onClick={handleSwapCurrencies} className="mt-6">
            <ArrowLeftRight className="h-4 w-4" />
            <span className="sr-only">Swap currencies</span>
          </Button>

          <div className="space-y-2">
            <label htmlFor="to-currency" className="text-sm font-medium">
              To
            </label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger id="to-currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleConvert} className="w-full mt-4" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            "Convert"
          )}
        </Button>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </CardContent>

      {convertedAmount !== null && exchangeRate !== null && (
        <CardFooter className="flex flex-col items-start">
          <div className="w-full p-4 bg-muted rounded-md">
            <div className="text-2xl font-bold">
              {amount.toFixed(2)} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
            </div>
            <div className="text-sm text-muted-foreground">
              1 {toCurrency} = {(1 / exchangeRate).toFixed(6)} {fromCurrency}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-4">Exchange rates updated from ExchangeRate-API</div>
        </CardFooter>
      )}
    </Card>
  )
}

