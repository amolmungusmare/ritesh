import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TMBLogo from '@/components/common/TMBLogo';
import LanguageSelector, { translations } from '@/components/common/LanguageSelector';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
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
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { key: 'home', icon: Home, page: 'Home' },
  { key: 'agriMitra', icon: MessageCircle, page: 'AgriMitra' },
  { key: 'cropHealth', icon: Leaf, page: 'CropHealth' },
  { key: 'soilTesting', icon: FlaskConical, page: 'SoilTesting' },
  { key: 'loanProducts', icon: CreditCard, page: 'LoanProducts' },
  { key: 'applyLoan', icon: FileText, page: 'ApplyLoan' },
  { key: 'cropInsurance', icon: Shield, page: 'CropInsurance' },
  { key: 'loanCalculator', icon: Calculator, page: 'LoanCalculator' },
  { key: 'trackApplication', icon: Search, page: 'TrackApplication' },
  { key: 'forum', icon: Users, page: 'FarmerForum' },
  { key: 'weather', icon: Cloud, page: 'Weather' },
  { key: 'iotDevices', icon: Cpu, page: 'IoTDevices' },
  { key: 'customerCare', icon: Phone, page: 'CustomerCare' }
];

export default function Layout({ children, currentPageName }) {
  const [language, setLanguage] = useState('english');
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const t = translations[language];

  useEffect(() => {
    const savedLang = localStorage.getItem('tmb_language');
    if (savedLang) setLanguage(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem('tmb_language', language);
  }, [language]);

  const NavLink = ({ item, mobile = false }) => {
    const isActive = currentPageName === item.page;
    const Icon = item.icon;
    
    return (
      <Link 
        to={createPageUrl(item.page)}
        onClick={() => mobile && setMobileOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-gradient-to-r from-[#C01589] to-[#0033A0] text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{t[item.key]}</span>
        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* TMB Watermark */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.05] z-0">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695cce0ff2398c4e3069fe74/ba681f103_Screenshot_20260105-185413.jpg"
          alt="TMB Watermark"
          className="w-96 h-96 object-contain transform rotate-[-15deg]"
        />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 z-40">
        <div className="p-6 border-b border-gray-100">
          <TMBLogo size="medium" />
        </div>
        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.key} item={item} />
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t border-gray-100">
          <LanguageSelector language={language} setLanguage={setLanguage} />
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-[#0033A0] to-[#C01589] text-white z-50 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#0033A0] to-[#C01589]">
                <TMBLogo size="medium" className="[&_span]:text-white" />
              </div>
              <ScrollArea className="h-[calc(100vh-180px)] p-4">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink key={item.key} item={item} mobile />
                  ))}
                </nav>
              </ScrollArea>
              <div className="p-4 border-t border-gray-100">
                <LanguageSelector language={language} setLanguage={setLanguage} />
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695cce0ff2398c4e3069fe74/ba681f103_Screenshot_20260105-185413.jpg"
              alt="TMB"
              className="h-8 object-contain brightness-0 invert"
            />
            <span className="text-white font-bold text-sm">AgriSmart</span>
          </div>
          
          <LanguageSelector language={language} setLanguage={setLanguage} compact />
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pt-20 lg:pt-0 relative z-10">
        <div className="p-4 lg:p-8">
          {React.cloneElement(children, { language, t })}
        </div>
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        <div className="flex justify-around py-2">
          {[navItems[0], navItems[1], navItems[5], navItems[8], navItems[12]].map((item) => {
            const Icon = item.icon;
            const isActive = currentPageName === item.page;
            return (
              <Link 
                key={item.key}
                to={createPageUrl(item.page)}
                className={`flex flex-col items-center p-2 ${isActive ? 'text-[#C01589]' : 'text-gray-500'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-1">{t[item.key]}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <style>{`
        :root {
          --tmb-magenta: #C01589;
          --tmb-navy: #0033A0;
        }
      `}</style>
    </div>
  );
}