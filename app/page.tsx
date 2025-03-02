import CurrencyConverter from "@/components/currency-converter"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Currency Converter</h1>
        <CurrencyConverter />
      </div>
    </main>
  )
}

