import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { base44 } from '@/api/base44Client';
import ImageUploader from '@/components/common/ImageUploader';
import { 
  FlaskConical, 
  MapPin,
  Loader2,
  Droplets,
  Leaf,
  RefreshCw,
  CheckCircle,
  Sprout,
  Beaker
} from 'lucide-react';

export default function SoilTesting({ language = 'english', t = {} }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [location, setLocation] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Location error:', error)
      );
    }
  };

  const analyzeSoil = async () => {
    if (!imageUrl) return;
    setIsAnalyzing(true);

    try {
      const prompt = `Analyze this soil image and provide:
      1. Soil type (Clay, Sandy, Loamy, Silty, etc.)
      2. Estimated pH level (acidic, neutral, alkaline with range)
      3. Nitrogen (N), Phosphorus (P), Potassium (K) levels (Low/Medium/High)
      4. Moisture content estimation
      5. Organic matter assessment
      6. Recommended crops for this soil type
      7. Fertilizer recommendations
      8. Soil improvement suggestions
      
      ${location ? `Location coordinates: ${location.lat}, ${location.lng} - use this for regional soil data context.` : ''}
      
      Provide response in ${language} language. Be practical for Indian farming conditions.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: [imageUrl],
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            soil_type: { type: "string" },
            ph_level: { type: "number" },
            ph_category: { type: "string" },
            nitrogen_level: { type: "string" },
            phosphorus_level: { type: "string" },
            potassium_level: { type: "string" },
            moisture_content: { type: "number" },
            organic_matter: { type: "string" },
            suitable_crops: { type: "array", items: { type: "string" } },
            fertilizer_recommendations: { type: "array", items: { type: "string" } },
            improvement_suggestions: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAnalysis(result);
      
      // Save to database
      await base44.entities.SoilAnalysis.create({
        image_url: imageUrl,
        location_lat: location?.lat,
        location_lng: location?.lng,
        soil_type: result.soil_type,
        ph_level: result.ph_level,
        nitrogen_level: result.nitrogen_level,
        phosphorus_level: result.phosphorus_level,
        potassium_level: result.potassium_level,
        moisture_content: result.moisture_content,
        organic_matter: result.organic_matter,
        suitable_crops: result.suitable_crops,
        fertilizer_recommendations: result.fertilizer_recommendations,
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

  const getNPKColor = (level) => {
    switch (level) {
      case 'High': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
            <FlaskConical className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t.soilTesting || 'Soil Testing'}</h1>
        </div>
        <p className="text-sm text-gray-500">AI-powered soil analysis & recommendations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-100 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-orange-600" />
              {t.scanSoil || 'Scan Your Soil'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Location Button */}
            <Button 
              variant="outline" 
              onClick={getLocation}
              className="w-full gap-2"
            >
              <MapPin className={`w-4 h-4 ${location ? 'text-green-500' : ''}`} />
              {location ? 'Location Captured' : 'Get GPS Location (Optional)'}
            </Button>

            <ImageUploader
              onImageUpload={setImageUrl}
              imageUrl={imageUrl}
              onClear={() => setImageUrl(null)}
              label={t.upload || 'Upload Soil Photo'}
              captureLabel={t.capture || 'Capture Photo'}
            />

            {imageUrl && !analysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button 
                  onClick={analyzeSoil}
                  disabled={isAnalyzing}
                  className="w-full bg-orange-600 hover:bg-orange-700 gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Soil...
                    </>
                  ) : (
                    <>
                      <Beaker className="w-4 h-4" />
                      {t.analyze || 'Analyze Soil'}
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {analysis && (
              <Button 
                onClick={resetAnalysis}
                variant="outline"
                className="w-full gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Test Another Sample
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Soil Overview */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Soil Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-orange-50 rounded-xl text-center">
                    <p className="text-xs text-gray-500 mb-1">Soil Type</p>
                    <p className="font-bold text-lg text-orange-700">{analysis.soil_type}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl text-center">
                    <p className="text-xs text-gray-500 mb-1">pH Level</p>
                    <p className="font-bold text-lg text-blue-700">{analysis.ph_level}</p>
                    <p className="text-xs text-gray-500">{analysis.ph_category}</p>
                  </div>
                </div>

                {/* NPK Levels */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">NPK Levels</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className={`p-3 rounded-xl ${getNPKColor(analysis.nitrogen_level)}`}>
                        <p className="text-2xl font-bold">N</p>
                        <p className="text-xs">{analysis.nitrogen_level}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Nitrogen</p>
                    </div>
                    <div className="text-center">
                      <div className={`p-3 rounded-xl ${getNPKColor(analysis.phosphorus_level)}`}>
                        <p className="text-2xl font-bold">P</p>
                        <p className="text-xs">{analysis.phosphorus_level}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Phosphorus</p>
                    </div>
                    <div className="text-center">
                      <div className={`p-3 rounded-xl ${getNPKColor(analysis.potassium_level)}`}>
                        <p className="text-2xl font-bold">K</p>
                        <p className="text-xs">{analysis.potassium_level}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Potassium</p>
                    </div>
                  </div>
                </div>

                {/* Moisture */}
                {analysis.moisture_content && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        Moisture Content
                      </span>
                      <span className="font-bold">{analysis.moisture_content}%</span>
                    </div>
                    <Progress value={analysis.moisture_content} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Suitable Crops */}
            {analysis.suitable_crops?.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-green-500" />
                    Suitable Crops
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.suitable_crops.map((crop, i) => (
                      <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fertilizer Recommendations */}
            {analysis.fertilizer_recommendations?.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-orange-500" />
                    Fertilizer Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.fertilizer_recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Info Section */}
        {!analysis && (
          <div className="space-y-4">
            <Card className="p-5 bg-gradient-to-br from-orange-50 to-amber-50">
              <h3 className="font-semibold text-gray-800 mb-3">How it works</h3>
              <ol className="space-y-3">
                {[
                  'Take a clear photo of your soil sample',
                  'Enable GPS for location-based recommendations',
                  'Our AI analyzes soil color, texture & composition',
                  'Get instant NPK levels & crop suggestions'
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-600">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="p-5 border-l-4 border-l-blue-500">
              <h4 className="font-semibold text-gray-800 mb-2">Pro Tip</h4>
              <p className="text-sm text-gray-600">
                For best results, photograph soil from 15-20cm depth. Include both dry and moist samples for accurate moisture analysis.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}