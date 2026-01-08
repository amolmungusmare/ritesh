import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { base44 } from '@/api/base44Client';
import { 
  Search, 
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee
} from 'lucide-react';

const statusSteps = [
  { key: 'Submitted', label: 'Submitted', icon: FileText },
  { key: 'Under_Review', label: 'Under Review', icon: Clock },
  { key: 'Documents_Verified', label: 'Documents Verified', icon: CheckCircle },
  { key: 'Approved', label: 'Approved', icon: CheckCircle },
  { key: 'Disbursed', label: 'Disbursed', icon: CheckCircle }
];

export default function TrackApplication({ language = 'english', t = {} }) {
  const [searchType, setSearchType] = useState('application_id');
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [application, setApplication] = useState(null);
  const [error, setError] = useState('');

  const searchApplication = async () => {
    if (!searchValue.trim()) {
      setError('Please enter a search value');
      return;
    }

    setIsSearching(true);
    setError('');
    setApplication(null);

    try {
      let query = {};
      if (searchType === 'application_id') {
        query = { application_id: searchValue.trim().toUpperCase() };
      } else {
        query = { mobile_number: searchValue.trim() };
      }

      const results = await base44.entities.LoanApplication.filter(query, '-created_date', 1);
      
      if (results.length === 0) {
        setError('No application found with the given details');
      } else {
        setApplication(results[0]);
      }
    } catch (err) {
      setError('Error searching application. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIndex = (status) => {
    if (status === 'Rejected') return -1;
    return statusSteps.findIndex(s => s.key === status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Under_Review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Documents_Verified': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Disbursed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
          <Search className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t.trackApplication || 'Track Application'}</h1>
          <p className="text-sm text-gray-500">Check your loan application status</p>
        </div>
      </div>

      {/* Search Card */}
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5 text-orange-600" />
            Search Your Application
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-4">
            <Button
              variant={searchType === 'application_id' ? 'default' : 'outline'}
              onClick={() => setSearchType('application_id')}
              className={searchType === 'application_id' ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              By Application ID
            </Button>
            <Button
              variant={searchType === 'mobile' ? 'default' : 'outline'}
              onClick={() => setSearchType('mobile')}
              className={searchType === 'mobile' ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              By Mobile Number
            </Button>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchType === 'application_id' ? 'Enter Application ID (e.g., TMB-AG-2026-1234)' : 'Enter registered mobile number'}
                onKeyPress={(e) => e.key === 'Enter' && searchApplication()}
              />
            </div>
            <Button 
              onClick={searchApplication}
              disabled={isSearching}
              className="bg-orange-600 hover:bg-orange-700 gap-2"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {t.trackNow || 'Track'}
            </Button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {application && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Status Progress */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className={`${getStatusColor(application.status)} border-b`}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Application Status</CardTitle>
                <Badge className={getStatusColor(application.status)}>
                  {application.status?.replace(/_/g, ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {application.status !== 'Rejected' ? (
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-[#0033A0] to-[#C01589] rounded-full transition-all duration-500"
                      style={{ width: `${(getStatusIndex(application.status) / (statusSteps.length - 1)) * 100}%` }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="flex justify-between relative">
                    {statusSteps.map((step, i) => {
                      const Icon = step.icon;
                      const isCompleted = i <= getStatusIndex(application.status);
                      const isCurrent = i === getStatusIndex(application.status);
                      
                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-[#0033A0] to-[#C01589] text-white' 
                              : 'bg-gray-200 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-[#C01589]/30' : ''}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <p className={`text-xs mt-2 text-center ${isCompleted ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <XCircle className="w-16 h-16 mx-auto text-red-500 mb-3" />
                  <p className="text-lg font-medium text-red-700">Application Rejected</p>
                  {application.status_remarks && (
                    <p className="text-sm text-gray-600 mt-2">{application.status_remarks}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C01589]" />
                Application Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">{t.applicationId || 'Application ID'}</p>
                    <p className="font-bold text-[#0033A0] text-lg">{application.application_id}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Applicant Name</p>
                    <p className="font-medium text-gray-800">{application.applicant_name}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Mobile</p>
                      <p className="font-medium text-gray-800">{application.mobile_number}</p>
                    </div>
                  </div>

                  {application.email && (
                    <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{application.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-[#C01589]/5 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Loan Product</p>
                    <p className="font-medium text-[#C01589]">{application.product_type?.replace(/_/g, ' ')}</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl flex items-center gap-3">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Loan Amount</p>
                      <p className="font-bold text-green-600 text-lg">₹{application.loan_amount?.toLocaleString()}</p>
                    </div>
                  </div>

                  {application.district && (
                    <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium text-gray-800">{application.district}, {application.state}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Applied On</p>
                      <p className="font-medium text-gray-800">
                        {new Date(application.created_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {application.status_remarks && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-600 font-medium mb-1">Remarks</p>
                  <p className="text-sm text-blue-800">{application.status_remarks}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}