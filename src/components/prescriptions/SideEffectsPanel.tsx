import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Brain, 
  TrendingUp,
  Info,
  Clock
} from "lucide-react";

interface SideEffect {
  name: string;
  probability: number;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  timeframe: string;
  riskFactors?: string[];
}

interface SideEffectsPanelProps {
  medicine: string;
  sideEffects: SideEffect[];
  patientRiskFactors: string[];
}

export const SideEffectsPanel = ({ medicine, sideEffects, patientRiskFactors }: SideEffectsPanelProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-success';
      case 'moderate': return 'text-warning';
      case 'severe': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'mild': return 'outline';
      case 'moderate': return 'secondary';
      case 'severe': return 'destructive';
      default: return 'outline';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-destructive';
    if (probability >= 40) return 'text-warning';
    return 'text-success';
  };

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Brain className="w-5 h-5 mr-2 text-primary" />
          AI-Predicted Side Effects: {medicine}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Patient Risk Factors */}
        {patientRiskFactors.length > 0 && (
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-4 h-4 mr-2 text-warning" />
              <span className="text-sm font-medium text-foreground">Patient Risk Factors</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {patientRiskFactors.map((factor, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {factor}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Side Effects List */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Predicted Side Effects (Top 3 Most Likely)</h4>
          
          {sideEffects.map((effect, index) => (
            <div key={index} className="p-4 rounded-lg bg-muted/20 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-foreground">#{index + 1}</span>
                  <div>
                    <h5 className="font-semibold text-foreground">{effect.name}</h5>
                    <Badge variant={getSeverityBadgeVariant(effect.severity)}>
                      {effect.severity} severity
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getProbabilityColor(effect.probability)}`}>
                    {effect.probability}%
                  </div>
                  <div className="text-xs text-muted-foreground">Probability</div>
                </div>
              </div>

              {/* Probability Bar */}
              <div className="mb-3">
                <Progress 
                  value={effect.probability} 
                  className="h-2"
                />
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-3">{effect.description}</p>

              {/* Timeframe */}
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Expected timeframe: {effect.timeframe}</span>
              </div>

              {/* Risk Factors */}
              {effect.riskFactors && effect.riskFactors.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium text-foreground">Increased risk due to:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {effect.riskFactors.map((factor, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Explanation */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-primary mt-0.5" />
            <div className="text-sm text-foreground">
              <strong>AI Analysis:</strong> Side effect predictions are based on the patient's lab values, 
              medical history, and known drug interactions. Probabilities are calculated using machine learning 
              models trained on clinical data.
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground text-center pt-4 border-t border-white/10">
          AI predictions are for clinical decision support only. Final prescription decisions should be based on 
          clinical judgment and patient-specific factors.
        </div>
      </CardContent>
    </Card>
  );
};