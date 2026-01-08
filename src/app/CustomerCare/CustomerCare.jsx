import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Globe,
  MessageCircle,
  CreditCard,
  Smartphone,
  Building,
  ExternalLink,
  Headphones
} from 'lucide-react';

const contactInfo = [
  {
    title: 'National Toll-Free Number',
    value: '1800 425 0426',
    subtitle: 'Available 8:00 AM to 10:00 PM',
    icon: Phone,
    color: 'green',
    action: 'tel:18004250426'
  },
  {
    title: 'All-India Mobile Assistance',
    value: '+91 9842 461 461',
    subtitle: 'SMS "HELP" or Call',
    icon: Smartphone,
    color: 'blue',
    action: 'tel:+919842461461'
  },
  {
    title: 'Customer Support Email',
    value: 'customercare@tmbank.in',
    subtitle: 'We respond within 24 hours',
    icon: Mail,
    color: 'purple',
    action: 'mailto:customercare@tmbank.in'
  },
  {
    title: 'ATM/Digital Block (24/7)',
    value: '+91 (44) 2622 3106 / 2622 3109',
    subtitle: 'For emergency card blocking',
    icon: CreditCard,
    color: 'red',
    action: 'tel:+914426223106'
  }
];

const digitalSupport = [
  {
    title: 'Internet Banking Support',
    email: 'econnect@tmbank.in',
    phone: '0461-2383325',
    icon: Globe
  },
  {
    title: 'Mobile Banking Support',
    email: 'mobile_banking@tmbank.in',
    icon: Smartphone
  }
];

export default function CustomerCare({ language = 'english', t = {} }) {
  return (
    <div className="max-w-5xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0033A0] to-[#C01589] flex items-center justify-center shadow-lg">
          <Headphones className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t.customerCare || 'Customer Care'}</h1>
          <p className="text-sm text-gray-500">We're here to help you 24/7</p>
        </div>
      </div>

      {/* Main Contact Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {contactInfo.map((contact, i) => {
          const Icon = contact.icon;
          const colorClasses = {
            green: 'from-green-500 to-green-600 bg-green-50 text-green-600',
            blue: 'from-blue-500 to-blue-600 bg-blue-50 text-blue-600',
            purple: 'from-purple-500 to-purple-600 bg-purple-50 text-purple-600',
            red: 'from-red-500 to-red-600 bg-red-50 text-red-600'
          };
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <a href={contact.action}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[contact.color].split(' ').slice(0, 2).join(' ')} text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">{contact.title}</p>
                        <p className="text-lg font-bold text-gray-800 group-hover:text-[#C01589] transition-colors">
                          {contact.value}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{contact.subtitle}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          );
        })}
      </div>

      {/* Head Office */}
      <Card className="mb-8 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#0033A0]/5 to-[#C01589]/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[#0033A0]" />
            Registered & Head Office
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#0033A0]/10">
              <MapPin className="w-6 h-6 text-[#0033A0]" />
            </div>
            <div>
              <p className="text-gray-800 font-medium">Tamilnad Mercantile Bank Ltd.</p>
              <p className="text-gray-600">57, V.E. Road, Thoothukudi</p>
              <p className="text-gray-600">Tamil Nadu, India - 628 002</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digital Support */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {digitalSupport.map((support, i) => {
          const Icon = support.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-[#C01589]/10">
                      <Icon className="w-5 h-5 text-[#C01589]" />
                    </div>
                    <h3 className="font-semibold text-gray-800">{support.title}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="text-gray-500">Email:</span>{' '}
                      <a href={`mailto:${support.email}`} className="text-[#0033A0] hover:underline">
                        {support.email}
                      </a>
                    </p>
                    {support.phone && (
                      <p className="text-gray-600">
                        <span className="text-gray-500">Phone:</span>{' '}
                        <a href={`tel:${support.phone}`} className="text-[#0033A0] hover:underline">
                          {support.phone}
                        </a>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Links */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <a href="https://www.tmb.bank.in" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Globe className="w-4 h-4" />
                Official Website
                <ExternalLink className="w-3 h-3 ml-auto" />
              </Button>
            </a>
            <a href="https://www.tmb.bank.in/branch-locator" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full justify-start gap-2">
                <MapPin className="w-4 h-4" />
                Find Nearest Branch
                <ExternalLink className="w-3 h-3 ml-auto" />
              </Button>
            </a>
            <a href="https://www.pmfby.gov.in" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full justify-start gap-2">
                <CreditCard className="w-4 h-4" />
                PMFBY Portal
                <ExternalLink className="w-3 h-3 ml-auto" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* AI Chatbot CTA */}
      <Card className="bg-gradient-to-r from-[#0033A0] to-[#C01589] text-white overflow-hidden">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
            <MessageCircle className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Need instant help?</h3>
            <p className="text-white/80 text-sm">Chat with Agri Mitra, our AI assistant available 24/7</p>
          </div>
          <Button className="bg-white text-[#0033A0] hover:bg-white/90">
            Chat Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}