import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Calculator, 
  IndianRupee,
  Percent,
  Clock,
  TrendingUp,
  ArrowRight,
  PieChart
} from 'lucide-react';

const loanProducts = [
  { id: 'Kisan_Credit_Card', name: 'Kisan Credit Card', minRate: 9, maxRate: 11.5, maxAmount: 300000, maxTenure: 12 },
  { id: 'Tractor_Loan', name: 'Tractor Loan', minRate: 10, maxRate: 12, maxAmount: 1500000, maxTenure: 108 },
  { id: 'Agri_Transport', name: 'Agri Transport', minRate: 10.5, maxRate: 12.5, maxAmount: 25000000, maxTenure: 84 },
  { id: 'Banana_Cultivation', name: 'Banana Cultivation', minRate: 9.5, maxRate: 11, maxAmount: 1000000, maxTenure: 60 },
  { id: 'Mini_Dairy', name: 'Mini Dairy', minRate: 10, maxRate: 12, maxAmount: 1000000, maxTenure: 60 },
  { id: 'Commercial_Dairy', name: 'Commercial Dairy', minRate: 10, maxRate: 12, maxAmount: 250000000, maxTenure: 84 },
  { id: 'Poultry_Broiler', name: 'Poultry Farm - Broiler', minRate: 10.5, maxRate: 12, maxAmount: 250000000, maxTenure: 84 },
  { id: 'Rice_Mill_Loan', name: 'Rice Mill Loan', minRate: 11, maxRate: 13, maxAmount: 50000000, maxTenure: 120 },
  { id: 'Composite_Fish_Farm', name: 'Composite Fish Farm', minRate: 10, maxRate: 12, maxAmount: 10000000, maxTenure: 96 }
];

export default function LoanCalculator({ language = 'english', t = {} }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10);
  const [tenure, setTenure] = useState(36);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product = params.get('product');
    if (product) {
      setSelectedProduct(product);
      const productData = loanProducts.find(p => p.id === product);
      if (productData) {
        setInterestRate(productData.minRate);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const productData = loanProducts.find(p => p.id === selectedProduct);
      if (productData) {
        setInterestRate(productData.minRate);
        if (loanAmount > productData.maxAmount) {
          setLoanAmount(productData.maxAmount);
        }
        if (tenure > productData.maxTenure) {
          setTenure(productData.maxTenure);
        }
      }
    }
  }, [selectedProduct]);

  const calculateEMI = () => {
    const P = loanAmount;
    const R = interestRate / 12 / 100;
    const N = tenure;

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    setResult({
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      principalPercent: Math.round((P / totalPayment) * 100),
      interestPercent: Math.round((totalInterest / totalPayment) * 100)
    });
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const currentProduct = loanProducts.find(p => p.id === selectedProduct);

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C01589] to-[#0033A0] flex items-center justify-center shadow-lg">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t.loanCalculator || 'Loan Calculator'}</h1>
          <p className="text-sm text-gray-500">Calculate your EMI and eligibility</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calculator Input */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-[#0033A0]/5 to-[#C01589]/5 border-b">
            <CardTitle className="text-lg">Enter Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Loan Product */}
            <div>
              <Label>Select Loan Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {loanProducts.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Loan Amount */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" /> Loan Amount
                </Label>
                <span className="text-lg font-bold text-[#0033A0]">{formatCurrency(loanAmount)}</span>
              </div>
              <Slider
                value={[loanAmount]}
                onValueChange={([v]) => setLoanAmount(v)}
                min={50000}
                max={currentProduct?.maxAmount || 10000000}
                step={10000}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>₹50,000</span>
                <span>{formatCurrency(currentProduct?.maxAmount || 10000000)}</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="flex items-center gap-2">
                  <Percent className="w-4 h-4" /> Interest Rate (p.a.)
                </Label>
                <span className="text-lg font-bold text-[#C01589]">{interestRate}%</span>
              </div>
              <Slider
                value={[interestRate]}
                onValueChange={([v]) => setInterestRate(v)}
                min={currentProduct?.minRate || 8}
                max={currentProduct?.maxRate || 15}
                step={0.1}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{currentProduct?.minRate || 8}%</span>
                <span>{currentProduct?.maxRate || 15}%</span>
              </div>
            </div>

            {/* Tenure */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Tenure (Months)
                </Label>
                <span className="text-lg font-bold text-gray-700">
                  {tenure} months ({(tenure / 12).toFixed(1)} yrs)
                </span>
              </div>
              <Slider
                value={[tenure]}
                onValueChange={([v]) => setTenure(v)}
                min={6}
                max={currentProduct?.maxTenure || 120}
                step={6}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>6 months</span>
                <span>{currentProduct?.maxTenure || 120} months</span>
              </div>
            </div>

            <Button 
              onClick={calculateEMI}
              className="w-full bg-gradient-to-r from-[#C01589] to-[#0033A0] hover:opacity-90 gap-2"
            >
              <Calculator className="w-4 h-4" /> Calculate EMI
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#C01589] to-[#0033A0] text-white">
                  <CardTitle className="text-lg">Your EMI Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* EMI */}
                  <div className="text-center p-6 bg-gradient-to-r from-[#0033A0]/5 to-[#C01589]/5 rounded-2xl mb-6">
                    <p className="text-sm text-gray-500 mb-1">Monthly EMI</p>
                    <p className="text-4xl font-bold text-[#0033A0]">
                      ₹{result.emi.toLocaleString()}
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-xs text-gray-500 mb-1">Principal Amount</p>
                      <p className="text-lg font-bold text-gray-800">{formatCurrency(loanAmount)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-xs text-gray-500 mb-1">Total Interest</p>
                      <p className="text-lg font-bold text-[#C01589]">{formatCurrency(result.totalInterest)}</p>
                    </div>
                  </div>

                  {/* Total Payment */}
                  <div className="p-4 bg-green-50 rounded-xl text-center mb-6">
                    <p className="text-xs text-gray-500 mb-1">Total Payment</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(result.totalPayment)}</p>
                  </div>

                  {/* Visual Breakdown */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Principal ({result.principalPercent}%)</span>
                      <span>Interest ({result.interestPercent}%)</span>
                    </div>
                    <div className="h-4 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-[#0033A0] h-full" 
                        style={{ width: `${result.principalPercent}%` }}
                      />
                      <div 
                        className="bg-[#C01589] h-full" 
                        style={{ width: `${result.interestPercent}%` }}
                      />
                    </div>
                  </div>

                  <Link to={`${createPageUrl('ApplyLoan')}${selectedProduct ? `?product=${selectedProduct}` : ''}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
                      Apply for This Loan <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <PieChart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Enter loan details and click Calculate to see your EMI breakdown</p>
              </div>
            </Card>
          )}

          {/* Quick Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Interest Subvention</p>
                  <p className="text-sm text-blue-600">
                    Get up to 3% interest subvention on crop loans up to ₹3 Lakh under government schemes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}