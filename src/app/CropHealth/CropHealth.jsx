import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { base44 } from '@/api/base44Client';
import ImageUploader from '@/components/common/ImageUploader';
import { 
  Leaf, 
  AlertTriangle, 
  CheckCircle, 
  Bug,
  Droplets,
  Sun,
  Loader2,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function CropHealth({ language = 'english', t = {} }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyzeCrop = async () => {
    if (!imageUrl) return;
    setIsAnalyzing(true);

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this crop/plant image for health issues. Identify:
        1. The type of crop/plant if identifiable
        2. Any diseases, pests, or nutrient deficiencies visible
        3. Overall health score (0-100)
        4. Specific symptoms observed
        5. Recommended treatments and actions
        6. Preventive measures for future
        
        Provide response in ${language} language. Be specific and practical for Indian farmers.`,
        file_urls: [imageUrl],
        response_json_schema: {
          type: "object",
          properties: {
            crop_type: { type: "string" },
            disease_detected: { type: "string" },
            health_score: { type: "number" },
            severity: { type: "string", enum: ["Healthy", "Mild", "Moderate", "Severe"] },
            symptoms: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            treatment_options: { type: "array", items: { type: "string" } },
            preventive_measures: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAnalysis(result);
      
      // Save to database
      await base44.entities.CropAnalysis.create({
        image_url: imageUrl,
        crop_type: result.crop_type,
        disease_detected: result.disease_detected,
        health_score: result.health_score,
        symptoms: result.symptoms,
        recommendations: result.recommendations,
        treatment_options: result.treatment_options,
        language
      });
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImageUrl(null);
    setAnalysis(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Healthy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Mild': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Moderate': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Severe': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="text-center mb-6">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695cce0ff2398c4e3069fe74/ba681f103_Screenshot_20260105-185413.jpg"
          alt="TMB Bank"
          className="h-12 object-contain mx-auto mb-4"
        />
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t.cropHealth || 'Crop Health Analysis'}</h1>
        </div>
        <p className="text-sm text-gray-500">AI-powered disease & pest detection</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              {t.scanCrop || 'Scan Your Crop'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ImageUploader
              onImageUpload={setImageUrl}
              imageUrl={imageUrl}
              onClear={() => setImageUrl(null)}
              label={t.upload || 'Upload Photo'}
              captureLabel={t.capture || 'Capture Photo'}
            />

            {imageUrl && !analysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <Button 
                  onClick={analyzeCrop}
                  disabled={isAnalyzing}
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Leaf className="w-4 h-4" />
                      {t.analyze || 'Analyze Crop Health'}
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {analysis && (
              <Button 
                onClick={resetAnalysis}
                variant="outline"
                className="w-full mt-4 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Scan Another Crop
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className={`${
                analysis.health_score >= 80 ? 'bg-green-50' : 
                analysis.health_score >= 60 ? 'bg-yellow-50' : 
                analysis.health_score >= 40 ? 'bg-orange-50' : 'bg-red-50'
              } border-b`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Analysis Results</CardTitle>
                  <Badge className={getSeverityColor(analysis.severity)}>
                    {analysis.severity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Health Score */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Health Score</span>
                    <span className="text-2xl font-bold">{analysis.health_score}%</span>
                  </div>
                  <Progress value={analysis.health_score} className={`h-3 ${getHealthColor(analysis.health_score)}`} />
                </div>

                {/* Crop & Disease */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Crop Type</p>
                    <p className="font-semibold text-gray-800">{analysis.crop_type || 'Unknown'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Issue Detected</p>
                    <p className="font-semibold text-gray-800">{analysis.disease_detected || 'None'}</p>
                  </div>
                </div>

                {/* Symptoms */}
                {analysis.symptoms?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Symptoms Observed
                    </h4>
                    <ul className="space-y-1">
                      {analysis.symptoms.map((symptom, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Treatments */}
                {analysis.treatment_options?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <Bug className="w-4 h-4 text-red-500" />
                      Treatment Options
                    </h4>
                    <ul className="space-y-1">
                      {analysis.treatment_options.map((treatment, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <ArrowRight className="w-3 h-3 mt-1 text-green-500 flex-shrink-0" />
                          {treatment}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {analysis.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 mt-1 text-green-500 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info Cards */}
        {!analysis && (
          <div className="space-y-4">
            {[
              { icon: Bug, title: 'Pest Detection', desc: 'Identify insects, larvae, and pest damage on leaves and stems', color: 'red' },
              { icon: Droplets, title: 'Disease Analysis', desc: 'Detect fungal, bacterial, and viral infections early', color: 'blue' },
              { icon: Sun, title: 'Nutrient Check', desc: 'Identify deficiencies from leaf color and patterns', color: 'orange' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`p-4 border-l-4 ${
                  item.color === 'red' ? 'border-l-red-500' :
                  item.color === 'blue' ? 'border-l-blue-500' :
                  'border-l-orange-500'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      item.color === 'red' ? 'bg-red-100 text-red-600' :
                      item.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}