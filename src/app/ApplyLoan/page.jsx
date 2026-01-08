import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import ImageUploader from '@/components/common/ImageUploader';
import { 
  FileText, 
  User,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';

const loanProducts = [
  { id: 'Kisan_Credit_Card', name: 'Kisan Credit Card (KCC)' },
  { id: 'Tractor_Loan', name: 'Tractor Loan' },
  { id: 'Agri_Transport', name: 'Agri Transport' },
  { id: 'Banana_Cultivation', name: 'Banana Cultivation' },
  { id: 'Agri_Jewel_Loan', name: 'Gold Overdraft (Agri)' },
  { id: 'Rice_Mill_Loan', name: 'Rice Mill Loan' },
  { id: 'Dhall_Mill_Loan', name: 'Dhall Mill Loan' },
  { id: 'Poultry_Broiler', name: 'Poultry Farm - Broiler' },
  { id: 'Poultry_Layer', name: 'Poultry Farm - Layer' },
  { id: 'Mini_Dairy', name: 'Mini Dairy Loan' },
  { id: 'Commercial_Dairy', name: 'Commercial Dairy Loan' },
  { id: 'Brackish_Water_Shrimp', name: 'Brackish Water Shrimp Farm' },
  { id: 'Composite_Fish_Farm', name: 'Composite Fish Farm' },
  { id: 'Gold_Overdraft_Agri', name: 'Gold Overdraft Agri' },
  { id: 'Bhoomi_Heen_Kisan', name: 'Bhoomi Heen Kisan' },
  { id: 'Genset_Loan', name: 'Genset Loan' }
];

const states = [
  'Tamil Nadu', 'Andhra Pradesh', 'Karnataka', 'Kerala', 'Maharashtra',
  'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'Bihar',
  'Punjab', 'Haryana', 'Telangana', 'Odisha', 'West Bengal'
];

export default function ApplyLoan({ language = 'english', t = {} }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    applicant_name: '',
    mobile_number: '',
    email: '',
    aadhaar_number: '',
    product_type: '',
    loan_amount: '',
    crop_type: '',
    land_area: '',
    land_survey_number: '',
    village: '',
    district: '',
    state: '',
    documents: []
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product = params.get('product');
    if (product) {
      setFormData(prev => ({ ...prev, product_type: product }));
    }
  }, []);

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.applicant_name || !/^[a-zA-Z\s]+$/.test(formData.applicant_name)) {
        newErrors.applicant_name = 'Please enter a valid name (letters only)';
      }
      if (!formData.mobile_number || !/^\d{10}$/.test(formData.mobile_number)) {
        newErrors.mobile_number = 'Please enter a valid 10-digit mobile number';
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.aadhaar_number || !/^\d{12}$/.test(formData.aadhaar_number)) {
        newErrors.aadhaar_number = 'Please enter a valid 12-digit Aadhaar number';
      }
    }

    if (currentStep === 2) {
      if (!formData.product_type) newErrors.product_type = 'Please select a loan product';
      if (!formData.loan_amount || formData.loan_amount <= 0) newErrors.loan_amount = 'Please enter loan amount';
    }

    if (currentStep === 3) {
      if (!formData.state) newErrors.state = 'Please select state';
      if (!formData.district) newErrors.district = 'Please enter district';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const generateApplicationId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `TMB-AG-${year}-${random}`;
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    
    setIsSubmitting(true);
    try {
      const appId = generateApplicationId();
      
      await base44.entities.LoanApplication.create({
        ...formData,
        application_id: appId,
        loan_amount: parseFloat(formData.loan_amount),
        land_area: formData.land_area ? parseFloat(formData.land_area) : null,
        status: 'Submitted',
        language
      });

      // Send email notification
      if (formData.email) {
        await base44.integrations.Core.SendEmail({
          to: formData.email,
          subject: `TMB AgriSmart - Loan Application Submitted (${appId})`,
          body: `
Dear ${formData.applicant_name},

Your loan application has been successfully submitted to TMB Bank.

Application Details:
- Application ID: ${appId}
- Product: ${loanProducts.find(p => p.id === formData.product_type)?.name}
- Amount: ₹${parseInt(formData.loan_amount).toLocaleString()}
- Status: Submitted

You can track your application status using the Application ID on our AgriSmart portal.

For any queries, contact our customer care:
- Toll-Free: 1800 425 0426
- Email: customercare@tmbank.in

Thank you for choosing TMB Bank.

Best Regards,
TMB AgriSmart Team
          `
        });
      }

      setApplicationId(appId);
      setStep(5);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocUpload = (url, type) => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, { doc_type: type, doc_url: url }]
    }));
  };

  const progress = (step / 5) * 100;

  return (
    <div className="max-w-3xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0033A0] to-[#C01589] flex items-center justify-center shadow-lg">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t.applyLoan || 'Apply for Loan'}</h1>
          <p className="text-sm text-gray-500">Complete the application form</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Step {step} of 5</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="overflow-hidden">
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <CardHeader className="bg-gradient-to-r from-[#0033A0]/5 to-[#C01589]/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#C01589]" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="name">{t.name || 'Full Name'} *</Label>
                <Input
                  id="name"
                  value={formData.applicant_name}
                  onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                  placeholder="Enter your full name"
                  className={errors.applicant_name ? 'border-red-500' : ''}
                />
                {errors.applicant_name && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.applicant_name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="mobile">{t.mobile || 'Mobile Number'} *</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +91
                  </span>
                  <Input
                    id="mobile"
                    value={formData.mobile_number}
                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="Enter 10-digit mobile number"
                    className={`rounded-l-none ${errors.mobile_number ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.mobile_number && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.mobile_number}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">{t.email || 'Email'} (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="aadhaar">{t.aadhaar || 'Aadhaar Number'} *</Label>
                <Input
                  id="aadhaar"
                  value={formData.aadhaar_number}
                  onChange={(e) => setFormData({ ...formData, aadhaar_number: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                  placeholder="Enter 12-digit Aadhaar number"
                  className={errors.aadhaar_number ? 'border-red-500' : ''}
                />
                {errors.aadhaar_number && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.aadhaar_number}
                  </p>
                )}
              </div>
            </CardContent>
          </motion.div>
        )}

        {/* Step 2: Loan Details */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <CardHeader className="bg-gradient-to-r from-[#0033A0]/5 to-[#C01589]/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C01589]" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label>{t.selectProduct || 'Select Loan Product'} *</Label>
                <Select value={formData.product_type} onValueChange={(v) => setFormData({ ...formData, product_type: v })}>
                  <SelectTrigger className={errors.product_type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a loan product" />
                  </SelectTrigger>
                  <SelectContent>
                    {loanProducts.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.product_type && (
                  <p className="text-xs text-red-500 mt-1">{errors.product_type}</p>
                )}
              </div>

              <div>
                <Label htmlFor="amount">{t.loanAmount || 'Loan Amount'} (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.loan_amount}
                  onChange={(e) => setFormData({ ...formData, loan_amount: e.target.value })}
                  placeholder="Enter loan amount"
                  className={errors.loan_amount ? 'border-red-500' : ''}
                />
                {errors.loan_amount && (
                  <p className="text-xs text-red-500 mt-1">{errors.loan_amount}</p>
                )}
              </div>

              <div>
                <Label htmlFor="crop">{t.cropType || 'Crop Type'}</Label>
                <Input
                  id="crop"
                  value={formData.crop_type}
                  onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
                  placeholder="e.g., Rice, Wheat, Sugarcane"
                />
              </div>

              <div>
                <Label htmlFor="land">{t.landArea || 'Land Area'} (Acres)</Label>
                <Input
                  id="land"
                  type="number"
                  value={formData.land_area}
                  onChange={(e) => setFormData({ ...formData, land_area: e.target.value })}
                  placeholder="Enter land area in acres"
                />
              </div>
            </CardContent>
          </motion.div>
        )}

        {/* Step 3: Address */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <CardHeader className="bg-gradient-to-r from-[#0033A0]/5 to-[#C01589]/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C01589]" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label>State *</Label>
                <Select value={formData.state} onValueChange={(v) => setFormData({ ...formData, state: v })}>
                  <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Enter district name"
                  className={errors.district ? 'border-red-500' : ''}
                />
              </div>

              <div>
                <Label htmlFor="village">Village/Town</Label>
                <Input
                  id="village"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="Enter village or town name"
                />
              </div>

              <div>
                <Label htmlFor="survey">Land Survey Number</Label>
                <Input
                  id="survey"
                  value={formData.land_survey_number}
                  onChange={(e) => setFormData({ ...formData, land_survey_number: e.target.value })}
                  placeholder="Enter 7/12 or land survey number"
                />
              </div>
            </CardContent>
          </motion.div>
        )}

        {/* Step 4: Documents */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <CardHeader className="bg-gradient-to-r from-[#0033A0]/5 to-[#C01589]/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#C01589]" />
                Upload Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label className="mb-2 block">Aadhaar Card</Label>
                <ImageUploader
                  onImageUpload={(url) => handleDocUpload(url, 'Aadhaar')}
                  imageUrl={formData.documents.find(d => d.doc_type === 'Aadhaar')?.doc_url}
                  label="Upload Aadhaar"
                />
              </div>

              <div>
                <Label className="mb-2 block">Land Records (7/12 Extract)</Label>
                <ImageUploader
                  onImageUpload={(url) => handleDocUpload(url, 'Land_Record')}
                  imageUrl={formData.documents.find(d => d.doc_type === 'Land_Record')?.doc_url}
                  label="Upload Land Records"
                />
              </div>

              <div>
                <Label className="mb-2 block">Other Documents (Optional)</Label>
                <ImageUploader
                  onImageUpload={(url) => handleDocUpload(url, 'Other')}
                  imageUrl={formData.documents.find(d => d.doc_type === 'Other')?.doc_url}
                  label="Upload Document"
                />
              </div>
            </CardContent>
          </motion.div>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
              <p className="text-gray-600 mb-6">Your loan application has been successfully submitted.</p>
              
              <Card className="bg-gradient-to-r from-[#0033A0]/5 to-[#C01589]/5 p-6 mb-6">
                <p className="text-sm text-gray-500 mb-1">{t.applicationId || 'Application ID'}</p>
                <p className="text-2xl font-bold text-[#0033A0]">{applicationId}</p>
              </Card>

              <p className="text-sm text-gray-500 mb-6">
                Save this ID to track your application status. A confirmation has been sent to your email/mobile.
              </p>

              <div className="flex gap-3 justify-center">
                <Link to={createPageUrl('TrackApplication')}>
                  <Button className="bg-[#0033A0] hover:bg-[#002580] gap-2">
                    Track Application <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => { setStep(1); setFormData({ ...formData, documents: [] }); setApplicationId(null); }}>
                  New Application
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )}

        {/* Navigation */}
        {step < 5 && (
          <div className="flex justify-between p-6 border-t bg-gray-50">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            
            {step < 4 ? (
              <Button onClick={nextStep} className="gap-2 bg-[#C01589] hover:bg-[#A01270]">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2 bg-green-600 hover:bg-green-700">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> {t.submit || 'Submit Application'}
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
