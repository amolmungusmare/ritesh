import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  ExternalLink,
  CheckCircle,
  FileText,
  Cloud,
  Umbrella,
  Building,
  ArrowRight,
  Info,
  MapPin,
  Phone,
  AlertCircle
} from 'lucide-react';

const insuranceSchemes = [
  {
    id: 'pmfby',
    name: 'PM Fasal Bima Yojana (PMFBY)',
    icon: Shield,
    type: 'Government',
    color: 'green',
    description: 'Comprehensive government crop insurance covering natural calamities, pests, and yield loss.',
    coverage: ['Natural calamities', 'Pest attacks', 'Crop diseases', 'Yield loss'],
    premium: 'Kharif: 2%, Rabi: 1.5%, Horticultural: 5%',
    applyUrl: 'https://www.pmfby.gov.in',
    features: [
      'One Nation One Scheme',
      'Coverage from sowing to post-harvest',
      'Use of technology for claim assessment',
      'Quick claim settlement'
    ]
  },
  {
    id: 'wbcis',
    name: 'Weather-Based Crop Insurance (WBCIS)',
    icon: Cloud,
    type: 'Government',
    color: 'blue',
    description: 'Insurance triggered by weather parameters like rainfall, temperature, humidity etc.',
    coverage: ['Deficit rainfall', 'Excess rainfall', 'Temperature variations', 'Humidity issues'],
    premium: 'Similar to PMFBY',
    features: [
      'Parametric insurance',
      'No field inspection needed',
      'Quick automatic payouts',
      'Based on weather station data'
    ]
  },
  {
    id: 'farmers_package',
    name: 'Farmers Package Insurance',
    icon: Umbrella,
    type: 'Government',
    color: 'purple',
    description: 'Comprehensive package covering crops, livestock, farm assets, and personal accident.',
    coverage: ['Crops', 'Livestock', 'Farm implements', 'Personal accident'],
    premium: 'Varies by component',
    features: [
      'All-in-one protection',
      'Multiple risk coverage',
      'Customizable package',
      'Single policy convenience'
    ]
  },
  {
    id: 'private',
    name: 'Private Crop Insurance',
    icon: Building,
    type: 'Private',
    color: 'orange',
    description: 'Optional private insurance schemes from companies like IFFCO-Tokio, HDFC Ergo.',
    coverage: ['Custom crop coverage', 'Add-on benefits', 'Flexible terms'],
    premium: 'Varies by provider',
    features: [
      'Flexible coverage options',
      'Additional benefits',
      'Personalized service',
      'Quick claim processing'
    ]
  }
];

const requiredDocs = [
  { name: 'Aadhaar Card', required: true },
  { name: 'Land Records (7/12, Patta, RTC)', required: true },
  { name: 'Bank Account / KCC Details', required: true },
  { name: 'Crop / Sowing Certificate', required: false },
  { name: 'Passport Size Photo', required: true }
];

export default function CropInsurance({ language = 'english', t = {} }) {
  const [selectedScheme, setSelectedScheme] = useState(null);

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700'
    };
    return colors[color];
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t.cropInsurance || 'Crop Insurance'}</h1>
          <p className="text-sm text-gray-500">Protect your crops and livelihood</p>
        </div>
      </div>

      <Tabs defaultValue="schemes" className="space-y-6">
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="schemes">Insurance Schemes</TabsTrigger>
          <TabsTrigger value="apply">Apply Now</TabsTrigger>
          <TabsTrigger value="documents">Documents Required</TabsTrigger>
        </TabsList>

        {/* Schemes Tab */}
        <TabsContent value="schemes">
          <div className="grid md:grid-cols-2 gap-6">
            {insuranceSchemes.map((scheme, i) => {
              const Icon = scheme.icon;
              return (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card 
                    className={`h-full cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedScheme === scheme.id ? 'ring-2 ring-[#C01589]' : ''
                    }`}
                    onClick={() => setSelectedScheme(selectedScheme === scheme.id ? null : scheme.id)}
                  >
                    <CardHeader className={`${getColorClasses(scheme.color)} rounded-t-lg`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/50 rounded-lg">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{scheme.name}</CardTitle>
                            <Badge variant="outline" className="mt-1">{scheme.type}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5">
                      <p className="text-sm text-gray-600 mb-4">{scheme.description}</p>
                      
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 mb-2">Coverage Includes:</p>
                        <div className="flex flex-wrap gap-1">
                          {scheme.coverage.map((item, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 mb-1">Premium:</p>
                        <p className="text-sm font-medium text-gray-800">{scheme.premium}</p>
                      </div>

                      {selectedScheme === scheme.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-4 border-t"
                        >
                          <p className="text-xs font-medium text-gray-500 mb-2">Key Features:</p>
                          <ul className="space-y-1">
                            {scheme.features.map((feature, j) => (
                              <li key={j} className="text-xs text-gray-600 flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {scheme.applyUrl && (
                        <a 
                          href={scheme.applyUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="block mt-4"
                        >
                          <Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
                            Apply on Official Portal <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Apply Tab */}
        <TabsContent value="apply">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  PMFBY - Official Portal
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  Apply for Pradhan Mantri Fasal Bima Yojana through the official government portal for hassle-free enrollment.
                </p>
                <ul className="space-y-2 mb-6">
                  {['Online application', 'Track application status', 'Calculate premium', 'Check claim status'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="https://www.pmfby.gov.in" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
                    Visit PMFBY Portal <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#C01589]" />
                  Apply at Nearest Branch/CSC
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  Visit your nearest TMB branch or Common Service Centre for assisted enrollment.
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">TMB Toll-Free</p>
                    <p className="font-semibold text-[#0033A0]">1800 425 0426</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Branch Support</p>
                    <a href="https://www.tmb.bank.in" target="_blank" rel="noopener noreferrer" className="text-[#C01589] font-medium flex items-center gap-1">
                      Find Nearest Branch <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Chatbot Suggestion */}
          <Card className="mt-6 bg-gradient-to-r from-[#0033A0]/5 to-[#C01589]/5 border-[#C01589]/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C01589] to-[#0033A0] flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Need help choosing insurance?</h3>
                <p className="text-sm text-gray-600">Ask Agri Mitra to recommend the best insurance for your crops</p>
              </div>
              <Button variant="outline" className="gap-2">
                Ask Agri Mitra <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C01589]" />
                Documents Required for Insurance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {requiredDocs.map((doc, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      doc.required ? 'bg-red-100' : 'bg-gray-200'
                    }`}>
                      {doc.required ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <FileText className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.required ? 'Required' : 'Optional'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> TMB AgriSmart facilitates insurance applications only. Policies are issued by the respective insurers. Please read terms & conditions on the official portal.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}