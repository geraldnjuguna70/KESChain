"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowDown, RefreshCw, AlertCircle, CheckCircle, Loader2, TrendingUp, TrendingDown } from "lucide-react"
import { useExchange } from "../context/ExchangeContext"
import { useAuth } from "../context/AuthContext"

//page for exchange of SUI and KSH tokens 
const Exchange = () => {
  const { exchangeRates, fees, slippageTolerance, initiateExchange } = useExchange()
  const { user, updateUserProfile } = useAuth()

  const [amount, setAmount] = useState<string>("")
  const [fromCurrency, setFromCurrency] = useState<"SUI" | "KSH">("SUI")
  const [toCurrency, setToCurrency] = useState<"SUI" | "KSH">("KSH")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exchangeSuccess, setExchangeSuccess] = useState(false)
  const [mpesaError, setMpesaError] = useState<string>("")
  const [suiAddressError, setSuiAddressError] = useState<string>("")
  const [tempMpesaNumber, setTempMpesaNumber] = useState<string>(user?.mpesaNumber || "")
  const [tempSuiAddress, setTempSuiAddress] = useState<string>(user?.suiAddress || "")
  const [saveMpesaNumber, setSaveMpesaNumber] = useState<boolean>(!!user?.mpesaNumber)
  const [saveSuiAddress, setSaveSuiAddress] = useState<boolean>(!!user?.suiAddress)

  const [rateHistory, setRateHistory] = useState<{ timestamp: Date; rate: number }[]>([])
  const [isRateIncreasing, setIsRateIncreasing] = useState<boolean>(true)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())
  const chartCanvasRef = useRef<HTMLCanvasElement>(null)

  const exchangePair = `${fromCurrency}-${toCurrency}` as "SUI-KSH" | "KSH-SUI"
  const exchangeRate = exchangeRates[exchangePair]?.rate || 0
  const numericAmount = Number.parseFloat(amount) || 0

  const calculatedAmount = numericAmount * exchangeRate
  const feeAmount = (numericAmount * fees.percentage) / 100 + fees.flat
  const slippageAmount = calculatedAmount * (slippageTolerance / 100)
  const receivedAmount = calculatedAmount - feeAmount
  const minReceived = receivedAmount - slippageAmount

  // Initialize temp values when user data changes
  useEffect(() => {
    if (user?.mpesaNumber) {
      setTempMpesaNumber(user.mpesaNumber)
      setSaveMpesaNumber(true)
    }
    if (user?.suiAddress) {
      setTempSuiAddress(user.suiAddress)
      setSaveSuiAddress(true)
    }
  }, [user?.mpesaNumber, user?.suiAddress])

  // Swap currencies
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency as "SUI" | "KSH")
    setToCurrency(fromCurrency as "SUI" | "KSH")
  }

  // Reset success state after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (exchangeSuccess) {
      timer = setTimeout(() => {
        setExchangeSuccess(false)
      }, 5000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [exchangeSuccess])

  // Simulate real-time rate updates
  useEffect(() => {
    // Initialize with current rate
    setRateHistory([{ timestamp: new Date(), rate: exchangeRate }])

    // Update rates every few seconds to simulate real-time data
    const intervalId = setInterval(() => {
      // Simulate small random fluctuations in the rate (±0.5%)
      const fluctuation = exchangeRate * (Math.random() * 0.01 - 0.005)
      const newRate = exchangeRate + fluctuation

      setRateHistory((prev) => {
        // Keep only the last 20 data points
        const newHistory = [...prev, { timestamp: new Date(), rate: newRate }]
        if (newHistory.length > 20) newHistory.shift()
        return newHistory
      })

      // Determine if rate is increasing compared to previous
      setIsRateIncreasing(fluctuation >= 0)
      setLastUpdateTime(new Date())
    }, 3000)

    return () => clearInterval(intervalId)
  }, [exchangeRate])

  // Draw the mini chart
  useEffect(() => {
    if (!chartCanvasRef.current || rateHistory.length < 2) return

    const canvas = chartCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set chart styles
    ctx.strokeStyle = isRateIncreasing ? "#22c55e" : "#ef4444"
    ctx.lineWidth = 2

    // Calculate scaling factors
    const rates = rateHistory.map((item) => item.rate)
    const minRate = Math.min(...rates)
    const maxRate = Math.max(...rates)
    const range = maxRate - minRate || 1 // Avoid division by zero

    const xStep = canvas.width / (rateHistory.length - 1)

    // Draw the line
    ctx.beginPath()
    rateHistory.forEach((point, index) => {
      const x = index * xStep
      // Normalize the rate to fit in the canvas height (with padding)
      const normalizedRate = 1 - (point.rate - minRate) / range
      const y = normalizedRate * (canvas.height * 0.8) + canvas.height * 0.1

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
  }, [rateHistory, isRateIncreasing])

  const validateMpesaNumber = (number: string): boolean => {
    // Regex for Kenya M-PESA numbers: 254 followed by 9 digits, typically starting with 7 or 1
    const mpesaRegex = /^254[17]\d{8}$/

    if (!number) {
      setMpesaError("M-PESA number is required")
      return false
    }

    if (!mpesaRegex.test(number)) {
      setMpesaError("Invalid M-PESA format. Use format: 254XXXXXXXXX")
      return false
    }

    setMpesaError("")
    return true
  }

  const validateSuiAddress = (address: string): boolean => {
    // Regex for SUI addresses: 0x followed by 40 hexadecimal characters
    const suiAddressRegex = /^0x[a-fA-F0-9]{40}$/

    if (!address) {
      setSuiAddressError("SUI wallet address is required")
      return false
    }

    if (!suiAddressRegex.test(address)) {
      setSuiAddressError("Invalid SUI address format. Should be 0x followed by 40 hex characters")
      return false
    }

    setSuiAddressError("")
    return true
  }

  const handleExchange = async () => {
    if (!numericAmount || numericAmount <= 0) return

    let isValid = true

    // Validate M-PESA number when required
    if ((fromCurrency === "KSH" || toCurrency === "KSH") && !validateMpesaNumber(tempMpesaNumber)) {
      isValid = false
    }

    // Validate SUI address when required
    if ((fromCurrency === "SUI" || toCurrency === "SUI") && !validateSuiAddress(tempSuiAddress)) {
      isValid = false
    }

    if (!isValid) return

    // Save validated values to user profile if the save option is checked
    const updates: Partial<{
      mpesaNumber: string
      suiAddress: string
    }> = {}

    if (saveMpesaNumber && tempMpesaNumber !== user?.mpesaNumber) {
      updates.mpesaNumber = tempMpesaNumber
    }

    if (saveSuiAddress && tempSuiAddress !== user?.suiAddress) {
      updates.suiAddress = tempSuiAddress
    }

    if (Object.keys(updates).length > 0) {
      await updateUserProfile(updates)
    }

    setIsSubmitting(true)
    try {
      const success = await initiateExchange(
        fromCurrency,
        toCurrency,
        numericAmount,
        fromCurrency === "SUI" ? tempSuiAddress : tempMpesaNumber,
        toCurrency === "SUI" ? tempSuiAddress : tempMpesaNumber,
      )
      if (success) {
        setExchangeSuccess(true)
        setAmount("")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exchange</h1>
        <p className="text-gray-600">Convert between SUI and KSH quickly and securely.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            {exchangeSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Exchange Initiated!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Your exchange has been initiated successfully. You can track its progress in the Transactions page.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* From Currency */}
              <div>
                <label htmlFor="from-amount" className="block text-sm font-medium text-gray-700 mb-2">
                  You Send
                </label>
                <div className="flex">
                  <div className="relative flex-1">
                    <input
                      id="from-amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="any"
                      className="input w-full pr-20"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value as "SUI" | "KSH")}
                        className="h-full border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-0 focus:border-transparent sm:text-sm"
                      >
                        <option value="SUI">SUI</option>
                        <option value="KSH">KSH</option>
                      </select>
                    </div>
                  </div>
                </div>
                {fromCurrency === "SUI" ? (
                  <div className="mt-2">
                    <label htmlFor="sui-address-send" className="block text-sm font-medium text-gray-700 mb-1">
                      SUI Wallet Address
                    </label>
                    <input
                      id="sui-address-send"
                      type="text"
                      value={tempSuiAddress}
                      onChange={(e) => {
                        setTempSuiAddress(e.target.value)
                        if (suiAddressError) validateSuiAddress(e.target.value)
                      }}
                      placeholder="0x..."
                      className={`input ${suiAddressError ? "border-red-500" : ""}`}
                    />
                    {suiAddressError ? (
                      <p className="mt-1 text-xs text-red-500">{suiAddressError}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Enter your SUI wallet address to send SUI</p>
                    )}
                    <div className="mt-2 flex items-center">
                      <input
                        id="save-sui-address"
                        type="checkbox"
                        checked={saveSuiAddress}
                        onChange={(e) => setSaveSuiAddress(e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary rounded"
                      />
                      <label htmlFor="save-sui-address" className="ml-2 block text-sm text-gray-700">
                        Save this address for future exchanges
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <label htmlFor="mpesa-number" className="block text-sm font-medium text-gray-700 mb-1">
                      M-PESA Number
                    </label>
                    <input
                      id="mpesa-number"
                      type="text"
                      value={tempMpesaNumber}
                      onChange={(e) => {
                        setTempMpesaNumber(e.target.value)
                        if (mpesaError) validateMpesaNumber(e.target.value)
                      }}
                      placeholder="254XXXXXXXXX"
                      className={`input ${mpesaError ? "border-red-500" : ""}`}
                    />
                    {mpesaError ? (
                      <p className="mt-1 text-xs text-red-500">{mpesaError}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Enter your M-PESA number to send KSH</p>
                    )}
                    <div className="mt-2 flex items-center">
                      <input
                        id="save-mpesa-number"
                        type="checkbox"
                        checked={saveMpesaNumber}
                        onChange={(e) => setSaveMpesaNumber(e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary rounded"
                      />
                      <label htmlFor="save-mpesa-number" className="ml-2 block text-sm text-gray-700">
                        Save this number for future exchanges
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSwapCurrencies}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ArrowDown className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* To Currency */}
              <div>
                <label htmlFor="to-amount" className="block text-sm font-medium text-gray-700 mb-2">
                  You Receive
                </label>
                <div className="flex">
                  <div className="relative flex-1">
                    <input
                      id="to-amount"
                      type="text"
                      value={numericAmount > 0 ? receivedAmount.toFixed(toCurrency === "SUI" ? 6 : 2) : ""}
                      readOnly
                      placeholder="0.00"
                      className="input w-full pr-20 bg-gray-50"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value as "SUI" | "KSH")}
                        className="h-full border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-0 focus:border-transparent sm:text-sm"
                      >
                        <option value="SUI">SUI</option>
                        <option value="KSH">KSH</option>
                      </select>
                    </div>
                  </div>
                </div>
                {toCurrency === "SUI" ? (
                  <div className="mt-2">
                    <label htmlFor="sui-address-receive" className="block text-sm font-medium text-gray-700 mb-1">
                      SUI Wallet Address
                    </label>
                    <input
                      id="sui-address-receive"
                      type="text"
                      value={tempSuiAddress}
                      onChange={(e) => {
                        setTempSuiAddress(e.target.value)
                        if (suiAddressError) validateSuiAddress(e.target.value)
                      }}
                      placeholder="0x..."
                      className={`input ${suiAddressError ? "border-red-500" : ""}`}
                    />
                    {suiAddressError ? (
                      <p className="mt-1 text-xs text-red-500">{suiAddressError}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Enter your SUI wallet address to receive SUI</p>
                    )}
                    <div className="mt-2 flex items-center">
                      <input
                        id="save-sui-address-receive"
                        type="checkbox"
                        checked={saveSuiAddress}
                        onChange={(e) => setSaveSuiAddress(e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary rounded"
                      />
                      <label htmlFor="save-sui-address-receive" className="ml-2 block text-sm text-gray-700">
                        Save this address for future exchanges
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <label htmlFor="mpesa-receive" className="block text-sm font-medium text-gray-700 mb-1">
                      M-PESA Number
                    </label>
                    <input
                      id="mpesa-receive"
                      type="text"
                      value={tempMpesaNumber}
                      onChange={(e) => {
                        setTempMpesaNumber(e.target.value)
                        if (mpesaError) validateMpesaNumber(e.target.value)
                      }}
                      placeholder="254XXXXXXXXX"
                      className={`input ${mpesaError ? "border-red-500" : ""}`}
                    />
                    {mpesaError ? (
                      <p className="mt-1 text-xs text-red-500">{mpesaError}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Enter your M-PESA number to receive KSH</p>
                    )}
                    <div className="mt-2 flex items-center">
                      <input
                        id="save-mpesa-number-receive"
                        type="checkbox"
                        checked={saveMpesaNumber}
                        onChange={(e) => setSaveMpesaNumber(e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary rounded"
                      />
                      <label htmlFor="save-mpesa-number-receive" className="ml-2 block text-sm text-gray-700">
                        Save this number for future exchanges
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Exchange Button */}
              <button
                onClick={handleExchange}
                disabled={isSubmitting || numericAmount <= 0 || exchangeSuccess}
                className="btn btn-primary w-full py-3 text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Exchange Now"
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Exchange Summary</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Exchange Rate</span>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">
                      1 {fromCurrency} = {exchangeRate.toFixed(toCurrency === "SUI" ? 6 : 2)} {toCurrency}
                    </span>
                    {isRateIncreasing ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">Updated {lastUpdateTime.toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Mini chart for rate visualization */}
              <div className="mt-2 mb-2">
                <canvas
                  ref={chartCanvasRef}
                  width="280"
                  height="60"
                  className="w-full h-[60px] bg-gray-50 rounded-md"
                ></canvas>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Fee</span>
                <span className="font-medium">
                  {feeAmount.toFixed(2)} {fromCurrency}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Slippage Tolerance</span>
                <span className="font-medium">{slippageTolerance}%</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Minimum Received</span>
                <span className="font-medium">
                  {minReceived.toFixed(toCurrency === "SUI" ? 6 : 2)} {toCurrency}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Rate Source</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {exchangeRates[exchangePair]?.source === "loading"
                        ? "Loading..."
                        : exchangeRates[exchangePair]?.source}
                    </span>
                    <RefreshCw className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Exchange rates can fluctuate. The final rate will be determined at the time of transaction
                    confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Exchange
