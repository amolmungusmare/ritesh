import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FeatureCard from '@/components/common/FeatureCard';
import { 
  MessageCircle, 
  Leaf, 
  FlaskConical, 
  CreditCard,
  FileText,
  Shield,
  Calculator,
  Search,
  Phone,
  Users,
  Cloud,
  Cpu,
  ArrowRight,
  Sprout,
  TrendingUp
} from 'lucide-react';

const quickActions = [
  { icon: MessageCircle, title: 'Agri Mitra', desc: '24/7 AI Advisor', page: 'AgriMitra', color: 'magenta' },
  { icon: Leaf, title: 'Crop Health', desc: 'Scan & Diagnose', page: 'CropHealth', color: 'green' },
  { icon: FlaskConical, title: 'Soil Testing', desc: 'AI Analysis', page: 'SoilTesting', color: 'orange' },
  { icon: FileText, title: 'Apply Loan', desc: 'Quick Process', page: 'ApplyLoan', color: 'navy' }
];

const services = [
  { icon: CreditCard, key: 'loanProducts', desc: 'Browse all TMB agricultural loan products', page: 'LoanProducts', color: 'navy' },
  { icon: Shield, key: 'cropInsurance', desc: 'PMFBY & other insurance schemes', page: 'CropInsurance', color: 'green' },
  { icon: Calculator, key: 'loanCalculator', desc: 'Calculate EMI & eligibility', page: 'LoanCalculator', color: 'magenta' },
  { icon: Search, key: 'trackApplication', desc: 'Track your loan application status', page: 'TrackApplication', color: 'orange' },
  { icon: Users, key: 'forum', desc: 'Connect with other farmers', page: 'FarmerForum', color: 'navy' },
  { icon: Cloud, key: 'weather', desc: 'Real-time weather updates', page: 'Weather', color: 'green' },
  { icon: Cpu, key: 'iotDevices', desc: 'Monitor your IoT sensors', page: 'IoTDevices', color: 'magenta' },
  { icon: Phone, key: 'customerCare', desc: '24/7 support available', page: 'CustomerCare', color: 'orange' }
];

export default function Home({ language = 'english', t = {} }) {
  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0033A0] via-[#0033A0]/90 to-[#C01589]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative p-8 lg:p-12 text-white">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695cce0ff2398c4e3069fe74/ba681f103_Screenshot_20260105-185413.jpg"
              alt="TMB Bank"
              className="h-12 object-contain brightness-0 invert"
            />
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">
            {t.welcome || 'Welcome to TMB AgriSmart'}
          </h1>
          <p className="text-lg lg:text-xl text-white/80 mb-8 max-w-2xl">
            {t.tagline || 'Your Digital Agricultural Banking Partner'} - Empowering farmers with technology, finance, and expert guidance.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link to={createPageUrl('ApplyLoan')}>
              <Button size="lg" className="bg-white text-[#0033A0] hover:bg-white/90 gap-2 font-semibold">
                {t.applyNow || 'Apply Now'} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to={createPageUrl('AgriMitra')}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
                <MessageCircle className="w-4 h-4" /> {t.agriMitra || 'Talk to Agri Mitra'}
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.page}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={createPageUrl(action.page)}>
              <Card className={`p-5 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-gradient-to-br ${
                action.color === 'magenta' ? 'from-[#C01589]/5 to-[#C01589]/10 border-[#C01589]/20' :
                action.color === 'navy' ? 'from-[#0033A0]/5 to-[#0033A0]/10 border-[#0033A0]/20' :
                action.color === 'green' ? 'from-green-500/5 to-green-500/10 border-green-500/20' :
                'from-orange-500/5 to-orange-500/10 border-orange-500/20'
              }`}>
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
                  action.color === 'magenta' ? 'bg-[#C01589]/10 text-[#C01589]' :
                  action.color === 'navy' ? 'bg-[#0033A0]/10 text-[#0033A0]' :
                  action.color === 'green' ? 'bg-green-500/10 text-green-600' :
                  'bg-orange-500/10 text-orange-600'
                } group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-800">{t[action.page.toLowerCase()] || action.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active Farmers', value: '50,000+', icon: Users },
          { label: 'Loans Disbursed', value: '₹500Cr+', icon: TrendingUp },
          { label: 'Districts Covered', value: '100+', icon: Sprout }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <Card className="p-4 text-center bg-white/80 backdrop-blur-sm">
              <stat.icon className="w-6 h-6 mx-auto text-[#C01589] mb-2" />
              <p className="text-2xl font-bold text-[#0033A0]">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* All Services */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-[#C01589] to-[#0033A0] rounded-full" />
        All Services
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((service, i) => (
          <FeatureCard
            key={service.page}
            icon={service.icon}
            title={t[service.key] || service.key}
            description={service.desc}
            link={service.page}
            color={service.color}
            delay={i}
          />
        ))}
      </div>
    </div>
  );
}