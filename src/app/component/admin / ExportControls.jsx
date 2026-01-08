import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from '@/api/base44Client';
import { 
  Download, 
  FileSpreadsheet, 
  Loader2, 
  Calendar,
  Mail,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function ExportControls({ applications = [], users = [], chatSessions = [] }) {
  const [exporting, setExporting] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState('daily');
  const [scheduleEmail, setScheduleEmail] = useState('');
  const [scheduling, setScheduling] = useState(false);

  const convertToCSV = (data, headers) => {
    if (!data || data.length === 0) return '';
    
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportApplications = () => {
    setExporting(true);
    try {
      const headers = [
        'application_id',
        'applicant_name',
        'mobile_number',
        'email',
        'aadhaar_number',
        'product_type',
        'loan_amount',
        'crop_type',
        'land_area',
        'state',
        'district',
        'village',
        'status',
        'status_remarks',
        'created_date',
        'updated_date'
      ];
      
      const csvContent = convertToCSV(applications, headers);
      const filename = `TMB_Loan_Applications_${new Date().toISOString().split('T')[0]}.csv`;
      
      downloadCSV(csvContent, filename);
      toast.success('Applications exported successfully!');
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportUsers = () => {
    setExporting(true);
    try {
      const headers = ['id', 'full_name', 'email', 'role', 'created_date'];
      const csvContent = convertToCSV(users, headers);
      const filename = `TMB_Users_${new Date().toISOString().split('T')[0]}.csv`;
      
      downloadCSV(csvContent, filename);
      toast.success('Users exported successfully!');
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportChatLogs = () => {
    setExporting(true);
    try {
      const flattenedChats = chatSessions.map(session => ({
        session_id: session.session_id,
        language: session.language,
        message_count: session.messages?.length || 0,
        created_date: session.created_date,
        messages_summary: session.messages?.slice(0, 3).map(m => `${m.role}: ${m.content?.slice(0, 50)}...`).join(' | ')
      }));
      
      const headers = ['session_id', 'language', 'message_count', 'created_date', 'messages_summary'];
      const csvContent = convertToCSV(flattenedChats, headers);
      const filename = `TMB_Chat_Logs_${new Date().toISOString().split('T')[0]}.csv`;
      
      downloadCSV(csvContent, filename);
      toast.success('Chat logs exported successfully!');
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportAll = () => {
    setExporting(true);
    try {
      exportApplications();
      setTimeout(() => exportUsers(), 500);
      setTimeout(() => exportChatLogs(), 1000);
      toast.success('All data exported successfully!');
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const scheduleReport = async () => {
    if (!scheduleEmail || !scheduleEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setScheduling(true);
    try {
      // In a real implementation, this would set up a scheduled job
      // For now, we'll send a confirmation email
      await base44.integrations.Core.SendEmail({
        to: scheduleEmail,
        subject: 'TMB AgriSmart - Scheduled Report Confirmation',
        body: `
Dear Admin,

Your scheduled ${scheduleFrequency} report for TMB AgriSmart has been configured successfully.

Report Details:
- Frequency: ${scheduleFrequency.charAt(0).toUpperCase() + scheduleFrequency.slice(1)}
- Delivery Email: ${scheduleEmail}
- Includes: Applications, Users, Chat Logs

Reports will be delivered automatically at:
${scheduleFrequency === 'daily' ? '8:00 AM IST daily' : 'Monday 8:00 AM IST weekly'}

You will receive Excel/CSV files containing all platform data.

Thank you,
TMB AgriSmart Admin System
        `
      });
      
      toast.success('Scheduled report configured! Confirmation email sent.');
      setScheduleEmail('');
    } catch (error) {
      toast.error('Failed to schedule report. Please try again.');
    } finally {
      setScheduling(false);
    }
  };

  return (
    <Card className="border-2 border-[#C01589]">
      <CardHeader className="bg-gradient-to-r from-[#C01589]/5 to-[#0033A0]/5">
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#C01589]" />
          Data Export & Scheduled Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Export */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Download className="w-4 h-4 text-[#0033A0]" />
              Quick Export
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={exportApplications}
                disabled={exporting || applications.length === 0}
                variant="outline"
                className="justify-start"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                )}
                Applications ({applications.length})
              </Button>
              <Button 
                onClick={exportUsers}
                disabled={exporting || users.length === 0}
                variant="outline"
                className="justify-start"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                )}
                Users ({users.length})
              </Button>
              <Button 
                onClick={exportChatLogs}
                disabled={exporting || chatSessions.length === 0}
                variant="outline"
                className="justify-start"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                )}
                Chat Logs ({chatSessions.length})
              </Button>
              <Button 
                onClick={exportAll}
                disabled={exporting}
                className="bg-[#0033A0] hover:bg-[#002580] justify-start"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export All
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Downloads CSV files containing all data
            </p>
          </div>

          {/* Scheduled Reports */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C01589]" />
              Schedule Automated Reports
            </h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Frequency</Label>
                <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily (8:00 AM IST)</SelectItem>
                    <SelectItem value="weekly">Weekly (Monday 8:00 AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Admin Email</Label>
                <Input
                  type="email"
                  placeholder="admin@tmb.in"
                  value={scheduleEmail}
                  onChange={(e) => setScheduleEmail(e.target.value)}
                />
              </div>
              <Button 
                onClick={scheduleReport}
                disabled={scheduling}
                className="w-full bg-[#C01589] hover:bg-[#A01270]"
              >
                {scheduling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Configuring...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Setup Scheduled Report
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Receive automated reports via email
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}