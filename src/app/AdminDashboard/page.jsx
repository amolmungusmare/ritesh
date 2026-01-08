import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Download,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import ExportControls from '../components/admin/ExportControls';

export default function AdminDashboard({ language = 'english', t = {} }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-created_date');

  // Fetch applications
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['admin-applications', statusFilter, sortBy],
    queryFn: async () => {
      const apps = await base44.entities.LoanApplication.list(sortBy, 1000);
      if (statusFilter === 'all') return apps;
      return apps.filter(app => app.status === statusFilter);
    }
  });

  // Fetch users count
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => base44.entities.User.list('-created_date', 1000)
  });

  // Fetch chat sessions
  const { data: chatSessions = [] } = useQuery({
    queryKey: ['admin-chats'],
    queryFn: () => base44.entities.ChatSession.list('-created_date', 1000)
  });

  // Statistics
  const stats = {
    totalApplications: applications.length,
    pending: applications.filter(a => a.status === 'Submitted' || a.status === 'Under_Review').length,
    approved: applications.filter(a => a.status === 'Approved').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
    totalLoanAmount: applications.reduce((sum, app) => sum + (app.loan_amount || 0), 0),
    totalUsers: users.length
  };

  // Search and filter
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      app.application_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.mobile_number?.includes(searchTerm) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Submitted': 'bg-blue-100 text-blue-800',
      'Under_Review': 'bg-yellow-100 text-yellow-800',
      'Documents_Verified': 'bg-purple-100 text-purple-800',
      'Approved': 'bg-green-100 text-green-800',
      'Disbursed': 'bg-emerald-100 text-emerald-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    if (status === 'Approved' || status === 'Disbursed') return <CheckCircle className="w-4 h-4" />;
    if (status === 'Rejected') return <XCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695cce0ff2398c4e3069fe74/ba681f103_Screenshot_20260105-185413.jpg"
            alt="TMB Bank"
            className="h-12 object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500">Complete control & monitoring center</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="border-l-4 border-[#0033A0]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalApplications}</p>
                </div>
                <div className="p-3 bg-[#0033A0]/10 rounded-xl">
                  <FileText className="w-8 h-8 text-[#0033A0]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-l-4 border-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-xl">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-l-4 border-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.approved}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-l-4 border-[#C01589]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Loan Amount</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalLoanAmount)}</p>
                </div>
                <div className="p-3 bg-[#C01589]/10 rounded-xl">
                  <DollarSign className="w-8 h-8 text-[#C01589]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Export Controls */}
      <ExportControls 
        applications={applications}
        users={users}
        chatSessions={chatSessions}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="applications" className="mt-8">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="applications">Applications ({stats.totalApplications})</TabsTrigger>
          <TabsTrigger value="users">Users ({stats.totalUsers})</TabsTrigger>
          <TabsTrigger value="chats">Chat Logs ({chatSessions.length})</TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <CardTitle>Loan Applications Management</CardTitle>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by ID, name, mobile..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="Under_Review">Under Review</SelectItem>
                      <SelectItem value="Documents_Verified">Docs Verified</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Disbursed">Disbursed</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-created_date">Newest First</SelectItem>
                      <SelectItem value="created_date">Oldest First</SelectItem>
                      <SelectItem value="-loan_amount">Highest Amount</SelectItem>
                      <SelectItem value="loan_amount">Lowest Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">Loading applications...</div>
              ) : filteredApplications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No applications found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Application ID</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredApplications.map((app, index) => (
                        <motion.tr 
                          key={app.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="font-mono text-sm font-medium text-[#0033A0]">
                                {app.application_id}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-800">{app.applicant_name}</p>
                              <p className="text-sm text-gray-500">{app.mobile_number}</p>
                              {app.email && <p className="text-xs text-gray-400">{app.email}</p>}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">
                              {app.product_type?.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-800">
                              {formatCurrency(app.loan_amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={`${getStatusColor(app.status)} flex items-center gap-1 w-fit`}>
                              {getStatusIcon(app.status)}
                              {app.status?.replace(/_/g, ' ')}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {new Date(app.created_date).toLocaleDateString('en-IN')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Link to={createPageUrl('ApplicationDetail') + `?id=${app.id}`}>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#C01589]/10 flex items-center justify-center">
                              <Users className="w-4 h-4 text-[#C01589]" />
                            </div>
                            <span className="font-medium text-gray-800">{user.full_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(user.created_date).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat Logs Tab */}
        <TabsContent value="chats">
          <Card>
            <CardHeader>
              <CardTitle>Agri Mitra Chat Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chatSessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#C01589]/10 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-[#C01589]" />
                        </div>
                        <span className="font-mono text-sm text-gray-600">Session: {session.session_id?.slice(0, 8)}...</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(session.created_date).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Language: <Badge variant="outline">{session.language}</Badge>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Messages: {session.messages?.length || 0}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}