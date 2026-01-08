import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronRight } from 'lucide-react';

export default function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  link, 
  color = 'magenta',
  delay = 0 
}) {
  const colors = {
    magenta: 'from-[#C01589]/10 to-[#C01589]/5 hover:from-[#C01589]/20 border-[#C01589]/20',
    navy: 'from-[#0033A0]/10 to-[#0033A0]/5 hover:from-[#0033A0]/20 border-[#0033A0]/20',
    green: 'from-green-500/10 to-green-500/5 hover:from-green-500/20 border-green-500/20',
    orange: 'from-orange-500/10 to-orange-500/5 hover:from-orange-500/20 border-orange-500/20'
  };

  const iconColors = {
    magenta: 'text-[#C01589] bg-[#C01589]/10',
    navy: 'text-[#0033A0] bg-[#0033A0]/10',
    green: 'text-green-600 bg-green-500/10',
    orange: 'text-orange-600 bg-orange-500/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
    >
      <Link to={createPageUrl(link)}>
        <Card className={`p-5 bg-gradient-to-br ${colors[color]} border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${iconColors[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#C01589] transition-colors mt-1" />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}