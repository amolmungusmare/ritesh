import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  CreditCard, 
  Tractor,
  Truck,
  Sprout,
  Gem,
  Factory,
  Wheat,
  Fish,
  Milk,
  Egg,
  Search,
  ArrowRight,
  IndianRupee,
  Percent,
  FileText,
  Clock
} from 'lucide-react';

const loanProducts = [
  {
    id: 'Kisan_Credit_Card',
    name: 'Kisan Credit Card (KCC)',
    icon: CreditCard,
    category: 'credit',
    maxAmount: '₹3 Lakh',
    interestRate: '9% - 11.5%',
    tenure: 'Yearly Renewal',
    color: 'green',
    features: [
      'Crop production credit',
      'Allied activities financing',
      'Interest subvention up to 3%',
      'No margin up to ₹1.60 L'
    ],
    eligibility: 'Owner cultivators, tenant farmers, oral lessees, sharecroppers'
  },
  {
    id: 'Tractor_Loan',
    name: 'Tractor Loan',
    icon: Tractor,
    category: 'equipment',
    maxAmount: '₹15 Lakh',
    interestRate: '10% - 12%',
    tenure: 'Up to 9 years',
    color: 'blue',
    features: [
      'New tractor purchase',
      'Power tillers & implements',
      'Quick processing',
      'Nil margin up to ₹1.60 L'
    ],
    eligibility: 'Individuals, JLGs, FPOs with adequate land holdings'
  },
  {
    id: 'Agri_Transport',
    name: 'Agri Transport',
    icon: Truck,
    category: 'equipment',
    maxAmount: '₹2.5 Crore',
    interestRate: '10.5% - 12.5%',
    tenure: 'Up to 7 years',
    color: 'orange',
    features: [
      'Trucks, vans, reefer vehicles',
      'Milk vans, farming rigs',
      'Used vehicle financing',
      '15% margin for new vehicles'
    ],
    eligibility: 'Farmers, SHGs, FPOs, custom hiring units'
  },
  {
    id: 'Banana_Cultivation',
    name: 'Banana Cultivation (Tissue Culture)',
    icon: Sprout,
    category: 'crop',
    maxAmount: 'Based on Scale of Finance',
    interestRate: '9.5% - 11%',
    tenure: 'As per crop cycle',
    color: 'green',
    features: [
      'Tissue culture seedling costs',
      'Drip irrigation financing',
      'Land development loans',
      'No margin up to ₹1.60 L'
    ],
    eligibility: 'Individual farmers, JLGs, FPOs, partnerships'
  },
  {
    id: 'Agri_Jewel_Loan',
    name: 'Gold Overdraft (Agri) - KCC GOLD Special',
    icon: Gem,
    category: 'credit',
    maxAmount: '₹3 Lakh',
    interestRate: '9% - 10%',
    tenure: 'Yearly Renewal',
    color: 'yellow',
    features: [
      'Gold as security',
      'Interest subvention benefit',
      'Quick disbursement',
      'LTV up to 85%'
    ],
    eligibility: 'Owner cultivators with gold jewellery'
  },
  {
    id: 'Rice_Mill_Loan',
    name: 'Rice Mill Loan',
    icon: Factory,
    category: 'business',
    maxAmount: 'Project Based',
    interestRate: '11% - 13%',
    tenure: 'Up to 10 years',
    color: 'purple',
    features: [
      'New mill setup',
      'Existing unit acquisition',
      'Working capital',
      'Machinery financing'
    ],
    eligibility: 'Proprietors, partnerships, companies'
  },
  {
    id: 'Dhall_Mill_Loan',
    name: 'Dhall Mill Loan',
    icon: Wheat,
    category: 'business',
    maxAmount: 'Project Based',
    interestRate: '11% - 13%',
    tenure: 'Up to 10 years',
    color: 'amber',
    features: [
      'Pulse processing setup',
      'Machinery & infrastructure',
      'Working capital',
      'Term loans'
    ],
    eligibility: 'Entrepreneurs, companies, partnerships'
  },
  {
    id: 'Poultry_Broiler',
    name: 'Poultry Farm - Broiler',
    icon: Egg,
    category: 'allied',
    maxAmount: '₹25 Crore',
    interestRate: '10.5% - 12%',
    tenure: 'Up to 7 years',
    color: 'red',
    features: [
      'Shed construction',
      'Equipment & feed plant',
      'Operational costs',
      '15-25% margin'
    ],
    eligibility: 'Individual farmers, farmer groups, corporates'
  },
  {
    id: 'Mini_Dairy',
    name: 'Mini Dairy Loan',
    icon: Milk,
    category: 'allied',
    maxAmount: '₹10 Lakh',
    interestRate: '10% - 12%',
    tenure: 'Up to 5 years',
    color: 'cyan',
    features: [
      'Milch animals purchase',
      'Shed construction',
      'Equipment & feed',
      'Insurance coverage'
    ],
    eligibility: 'Individuals & farmer groups engaged in dairy'
  },
  {
    id: 'Composite_Fish_Farm',
    name: 'Composite Fish Farm',
    icon: Fish,
    category: 'allied',
    maxAmount: 'Project Based',
    interestRate: '10% - 12%',
    tenure: 'Up to 8 years',
    color: 'blue',
    features: [
      'Pond construction/repair',
      'Fingerlings purchase',
      'Feed & equipment',
      'Working capital'
    ],
    eligibility: 'Farmers, corporates, partnerships'
  }
];

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'credit', name: 'Credit' },
  { id: 'crop', name: 'Crop Loans' },
  { id: 'equipment', name: 'Equipment' },
  { id: 'allied', name: 'Allied Activities' },
  { id: 'business', name: 'Agri Business' }
];

export default function LoanProducts({ language = 'english', t = {} }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = loanProducts.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getColorClasses = (color) => {
    const colors = {
      green: 'from-green-500 to-green-600 bg-green-50 text-green-600',
      blue: 'from-blue-500 to-blue-600 bg-blue-50 text-blue-600',
      orange: 'from-orange-500 to-orange-600 bg-orange-50 text-orange-600',
      yellow: 'from-yellow-500 to-yellow-600 bg-yellow-50 text-yellow-600',
      purple: 'from-purple-500 to-purple-600 bg-purple-50 text-purple-600',
      amber: 'from-amber-500 to-amber-600 bg-amber-50 text-amber-600',
      red: 'from-red-500 to-red-600 bg-red-50 text-red-600',
      cyan: 'from-cyan-500 to-cyan-600 bg-cyan-50 text-cyan-600'
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0033A0] to-[#C01589] flex items-center justify-center shadow-lg">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t.loanProducts || 'Loan Products'}</h1>
          <p className="text-sm text-gray-500">TMB Agricultural Financing Solutions</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search loan products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="overflow-x-auto">
          <TabsList className="bg-gray-100">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, i) => {
          const colorClasses = getColorClasses(product.color);
          const Icon = product.icon;
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <CardHeader className={`bg-gradient-to-r ${colorClasses.split(' ').slice(0, 2).join(' ')} text-white pb-12`}>
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge className="bg-white/20 text-white border-0 text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">{product.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="p-5 -mt-6 relative">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm border text-center">
                      <IndianRupee className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">Max Amount</p>
                      <p className="text-xs font-bold text-gray-800">{product.maxAmount}</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm border text-center">
                      <Percent className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">Interest</p>
                      <p className="text-xs font-bold text-gray-800">{product.interestRate}</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm border text-center">
                      <Clock className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">Tenure</p>
                      <p className="text-xs font-bold text-gray-800">{product.tenure}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-4">
                    {product.features.map((feature, j) => (
                      <li key={j} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${colorClasses.split(' ').slice(2, 3).join(' ').replace('bg-', 'bg-').replace('-50', '-500')}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Eligibility */}
                  <p className="text-xs text-gray-500 mb-4">
                    <span className="font-medium">Eligibility:</span> {product.eligibility}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to={`${createPageUrl('ApplyLoan')}?product=${product.id}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-[#C01589] to-[#0033A0] hover:opacity-90 gap-2 text-sm">
                        {t.applyNow || 'Apply Now'} <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                    <Link to={`${createPageUrl('LoanCalculator')}?product=${product.id}`}>
                      <Button variant="outline" size="icon">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}