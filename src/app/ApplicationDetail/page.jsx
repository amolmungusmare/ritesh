import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft,
  User,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  Calendar,
  FileText,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ApplicationDetail({ language = 'english', t = {} }) {
  const [applicationId, setApplicationId] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    setApplicationId(id);
  }, []);

  // Fetch application details
  const { data: application, isLoading } = useQuery({
    queryKey: ['application-detail', applicationId],
    queryFn: async () => {
      const apps = await base44.entities.LoanApplication.list('-created_date', 1000);
      return apps.find(app => app.id === applicationId);
    },
    enabled: !!applicationId
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, remarks }) => {
      await base44.entities.LoanApplication.update(applicationId, {
        status,
        status_remarks: remarks
      });
      return { status, remarks };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['application-detail', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      
      // Send notifications
      sendNotifications(data.status);
      
      setShowStatusModal(false);
      setNewStatus('');
      setStatusRemarks('');
    }
  });

  const sendNotifications = async (status) => {
    if (!application) return;
    
    setIsSendingNotification(true);
    
    try {
      // Send Email
      if (application.email) {
        const emailSubject = `TMB AgriSmart - Application Status Update (${application.application_id})`;
        const emailBody = `
Dear ${application.applicant_name},

This is to inform you that the status of your loan application has been updated.

🔹 Application ID: ${application.application_id}
🔹 New Status: ${status.replace(/_/g, ' ')}
🔹 Updated On: ${new Date().toLocaleString('en-IN')}

${statusRemarks ? `\nRemarks: ${statusRemarks}` : ''}

If additional information or documents are required, our team will contact you.

You can track your application anytime using the Track Application option in the TMB AgriSmart portal.

Thank you for choosing Tamilnad Mercantile Bank.

Warm regards,
TMB AgriSmart Support Team
Tamilnad Mercantile Bank Ltd.
📞 1800 425 0426
🌐 https://www.tmb.in
        `;
        
        await base44.integrations.Core.SendEmail({
          to: application.email,
          subject: emailSubject,
          body: emailBody
        });
      }

      // Note: SMS would be sent here if SMS gateway was integrated
      // For now, we're simulating it with a console log
      console.log(`SMS would be sent to ${application.mobile_number}: TMB AgriSmart - Application ${application.application_id} status updated to ${status.replace(/_/g, ' ')}.`);
      
    } catch (error) {
      console.error('Notification error:', error);
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleStatusChange = () => {
    if (!newStatus) return;
    updateStatusMutation.mutate({
      status: newStatus,
      remarks: statusRemarks
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Submitted': 'bg-blue-100 text-blue-800 border-blue-300',
      'Under_Review': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Documents_Verified': 'bg-purple-100 text-purple-800 border-purple-300',
      'Approved': 'bg-green-100 text-green-800 border-green-300',
      'Disbursed': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'Rejected': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    if (status === 'Approved' || status === 'Disbursed') return <CheckCircle className="w-5 h-5" />;
    if (status === 'Rejected') return <XCircle className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#C01589]" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Application Not Found</h2>
        <Link to={createPageUrl('AdminDashboard')}>
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('AdminDashboard')}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Application Details</h1>
            <p className="text-sm text-gray-500">Complete application information & controls</p>
          </div>
        </div>
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695cce0ff2398c4e3069fe74/ba681f103_Screenshot_20260105-185413.jpg"
          alt="TMB Bank"
          className="h-10 object-contain"
        />
      </div>

      {/* Application ID & Status Card */}
      <Card className="mb-6 border-2 border-[#0033A0]">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Application ID</p>
              <p className="text-2xl font-mono font-bold text-[#0033A0]">{application.application_id}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Badge className={`${getStatusColor(application.status)} text-lg px-4 py-2 border-2`}>
                {getStatusIcon(application.status)}
                <span className="ml-2">{application.status?.replace(/_/g, ' ')}</span>
              </Badge>
              <Button 
                onClick={() => {
                  setNewStatus(application.status);
                  setShowStatusModal(true);
                }}
                className="bg-[#C01589] hover:bg-[#A01270]"
              >
                Update Status
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-[#0033A0]/5 to-[#C01589]/5">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#0033A0]" />
                Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Full Name</Label>
                  <p className="font-semibold text-gray-800 mt-1">{application.applicant_name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Mobile Number</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="font-semibold text-gray-800">{application.mobile_number}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-500">Email</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="font-semibold text-gray-800">{application.email || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-500">Aadhaar Number</Label>
                  <p className="font-mono font-semibold text-gray-800 mt-1">
                    {application.aadhaar_number?.replace(/(\d{4})(\d{4})(\d{4})/, '●●●● ●●●● $3')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Details */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-[#0033A0]/5 to-[#C01589]/5">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C01589]" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Product Type</Label>
                  <p className="font-semibold text-gray-800 mt-1">{application.product_type?.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Loan Amount</Label>
                  <p className="text-2xl font-bold text-[#0033A0] mt-1">{formatCurrency(application.loan_amount)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Crop Type</Label>
                  <p className="font-semibold text-gray-800 mt-1">{application.crop_type || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Land Area</Label>
                  <p className="font-semibold text-gray-800 mt-1">{application.land_area ? `${application.land_area} acres` : 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-[#0033A0]/5 to-[#C01589]/5">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">State</Label>
                  <p className="font-semibold text-gray-800 mt-1">{application.state || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">District</Label>
                  <p className="font-semibold text-gray-800 mt-1">{application.district || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Village/Town</Label>
                  <p className="font-semibold text-gray-800 mt-1">{application.village || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Land Survey Number</Label>
                  <p className="font-semibold text-gray-800 mt-1">{application.land_survey_number || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Documents */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-[#0033A0]/5 to-[#C01589]/5">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Uploaded Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {application.documents && application.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {application.documents.map((doc, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{doc.doc_type?.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-gray-500 mt-1">Click to view full size</p>
                        </div>
                        <a href={doc.doc_url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </a>
                      </div>
                      <a href={doc.doc_url} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={doc.doc_url} 
                          alt={doc.doc_type} 
                          className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No documents uploaded</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-[#0033A0]/5 to-[#C01589]/5">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Application Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#0033A0] mt-2" />
                  <div>
                    <p className="font-semibold text-gray-800">Submitted</p>
                    <p className="text-sm text-gray-500">
                      {new Date(application.created_date).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                
                {application.updated_date && application.updated_date !== application.created_date && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#C01589] mt-2" />
                    <div>
                      <p className="font-semibold text-gray-800">Last Updated</p>
                      <p className="text-sm text-gray-500">
                        {new Date(application.updated_date).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Remarks */}
          {application.status_remarks && (
            <Card>
              <CardHeader className="bg-yellow-50">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  Status Remarks
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-700">{application.status_remarks}</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => {
                  setNewStatus(application.status);
                  setShowStatusModal(true);
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Update Status
              </Button>
              {application.email && (
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => sendNotifications(application.status)}
                  disabled={isSendingNotification}
                >
                  {isSendingNotification ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Notification
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Update Modal */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Change the status of this application. Email and SMS notifications will be sent automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Under_Review">Under Review</SelectItem>
                  <SelectItem value="Documents_Verified">Documents Verified</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Disbursed">Disbursed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Remarks (Optional)</Label>
              <Textarea
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
                placeholder="Add any remarks or notes about this status change..."
                rows={4}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowStatusModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleStatusChange} 
              disabled={updateStatusMutation.isPending || !newStatus}
              className="flex-1 bg-[#0033A0] hover:bg-[#002580]"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Update & Notify
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}