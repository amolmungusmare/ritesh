import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  Cpu, 
  Wifi,
  WifiOff,
  Droplets,
  Thermometer,
  Leaf,
  Plus,
  RefreshCw,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Beaker
} from 'lucide-react';

const deviceTypeIcons = {
  NPK_Sensor: Beaker,
  Moisture_Probe: Droplets,
  Weather_Station: Thermometer,
  Soil_pH_Sensor: Leaf,
  Temperature_Sensor: Thermometer
};

const deviceTypeColors = {
  NPK_Sensor: 'from-green-500 to-green-600',
  Moisture_Probe: 'from-blue-500 to-blue-600',
  Weather_Station: 'from-orange-500 to-orange-600',
  Soil_pH_Sensor: 'from-purple-500 to-purple-600',
  Temperature_Sensor: 'from-red-500 to-red-600'
};

// Demo data for when no devices are connected
const demoDevices = [
  {
    id: 'demo1',
    device_id: 'NPK-001',
    device_name: 'Field A - NPK Sensor',
    device_type: 'NPK_Sensor',
    location: 'North Field',
    is_active: true,
    last_reading: {
      nitrogen: 45,
      phosphorus: 32,
      potassium: 28,
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'demo2',
    device_id: 'MOIST-002',
    device_name: 'Field B - Moisture Probe',
    device_type: 'Moisture_Probe',
    location: 'South Field',
    is_active: true,
    last_reading: {
      moisture: 65,
      temperature: 28,
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'demo3',
    device_id: 'WS-003',
    device_name: 'Farm Weather Station',
    device_type: 'Weather_Station',
    location: 'Central Area',
    is_active: false,
    last_reading: {
      temperature: 32,
      moisture: 45,
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  }
];

export default function IoTDevices({ language = 'english', t = {} }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: devices = demoDevices, isLoading, refetch } = useQuery({
    queryKey: ['iotDevices'],
    queryFn: async () => {
      const result = await base44.entities.IoTDevice.list('-created_date', 50);
      return result.length > 0 ? result : demoDevices;
    }
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const activeDevices = devices.filter(d => d.is_active);
  const inactiveDevices = devices.filter(d => !d.is_active);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const getReadingDisplay = (device) => {
    const reading = device.last_reading;
    if (!reading) return [];

    const displays = [];
    if (reading.nitrogen !== undefined) displays.push({ label: 'N', value: reading.nitrogen, color: 'text-green-600' });
    if (reading.phosphorus !== undefined) displays.push({ label: 'P', value: reading.phosphorus, color: 'text-blue-600' });
    if (reading.potassium !== undefined) displays.push({ label: 'K', value: reading.potassium, color: 'text-orange-600' });
    if (reading.moisture !== undefined) displays.push({ label: 'Moisture', value: `${reading.moisture}%`, color: 'text-blue-600' });
    if (reading.temperature !== undefined) displays.push({ label: 'Temp', value: `${reading.temperature}°C`, color: 'text-red-600' });
    if (reading.ph !== undefined) displays.push({ label: 'pH', value: reading.ph, color: 'text-purple-600' });
    
    return displays;
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C01589] to-[#0033A0] flex items-center justify-center shadow-lg">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.iotDevices || 'IoT Devices'}</h1>
            <p className="text-sm text-gray-500">Monitor your farm sensors in real-time</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-[#C01589] hover:bg-[#A01270] gap-2">
            <Plus className="w-4 h-4" /> Add Device
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <Wifi className="w-6 h-6 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-700">{activeDevices.length}</p>
            <p className="text-xs text-green-600">Active Devices</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <WifiOff className="w-6 h-6 mx-auto text-red-600 mb-2" />
            <p className="text-2xl font-bold text-red-700">{inactiveDevices.length}</p>
            <p className="text-xs text-red-600">Offline Devices</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Cpu className="w-6 h-6 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-700">{devices.length}</p>
            <p className="text-xs text-blue-600">Total Devices</p>
          </CardContent>
        </Card>
      </div>

      {/* Devices Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#C01589]" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device, i) => {
            const Icon = deviceTypeIcons[device.device_type] || Cpu;
            const colorClass = deviceTypeColors[device.device_type] || 'from-gray-500 to-gray-600';
            const readings = getReadingDisplay(device);

            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`overflow-hidden ${!device.is_active ? 'opacity-75' : ''}`}>
                  <div className={`bg-gradient-to-r ${colorClass} p-4 text-white`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{device.device_name}</h3>
                          <p className="text-xs text-white/80">{device.device_id}</p>
                        </div>
                      </div>
                      <Badge className={device.is_active ? 'bg-green-500' : 'bg-red-500'}>
                        {device.is_active ? (
                          <><Wifi className="w-3 h-3 mr-1" /> Online</>
                        ) : (
                          <><WifiOff className="w-3 h-3 mr-1" /> Offline</>
                        )}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4" />
                      {device.location}
                    </div>

                    {/* Readings */}
                    {readings.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {readings.map((reading, j) => (
                          <div key={j} className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">{reading.label}</p>
                            <p className={`font-bold ${reading.color}`}>{reading.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
                        No readings available
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last update: {formatTime(device.last_reading?.timestamp)}
                      </span>
                      {device.is_active ? (
                        <span className="text-green-500 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Connected
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Check device
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Cpu className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Connect Your Farm Sensors</h4>
              <p className="text-sm text-blue-600 mt-1">
                TMB AgriSmart supports NPK sensors, moisture probes, and weather stations via LoRaWAN or GSM. 
                Contact your local branch for IoT integration assistance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}