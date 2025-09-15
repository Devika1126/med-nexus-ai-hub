import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnhancedProgress } from "@/components/ui/enhanced-progress";
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

interface CompatibilityResult {
  medicine: string;
  score: number;
  status: 'safe' | 'caution' | 'unsafe';
  reasons: string[];
  alternatives?: string[];
  riskLevel: 'low' | 'moderate' | 'high';
  explanation: string;
}

interface CompatibilityCheckerProps {
  results: CompatibilityResult[];
  onOverride?: (medicine: string, reason: string) => void;
  onShowAlternatives?: (medicine: string) => void;
}

export const CompatibilityChecker = ({ results, onOverride, onShowAlternatives }: CompatibilityCheckerProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-success';
      case 'caution': return 'text-warning';
      case 'unsafe': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-5 h-5" />;
      case 'caution': return <AlertTriangle className="w-5 h-5" />;
      case 'unsafe': return <XCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return 'bg-success';
    if (score >= 70) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Brain className="w-5 h-5 mr-2 text-primary" />
          AI Medicine Compatibility Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {results.map((result, index) => (
          <div key={index} className="p-4 rounded-lg bg-muted/20 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className={getStatusColor(result.status)}>
                  {getStatusIcon(result.status)}
                </span>
                <div>
                  <h4 className="font-semibold text-foreground">{result.medicine}</h4>
                  <Badge variant={result.status === 'safe' ? 'outline' : 
                                result.status === 'caution' ? 'secondary' : 'destructive'}>
                    {result.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{result.score}%</div>
                <div className="text-xs text-muted-foreground">Compatibility</div>
              </div>
            </div>

            {/* Enhanced Progress Bar with Color Coding */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Compatibility Score</span>
                <span className="text-xs font-medium text-foreground">{result.score}%</span>
              </div>
              <EnhancedProgress 
                value={result.score}
                colorScheme="medical"
                showGradient={true}
                className="h-4"
              />
            </div>

            {/* Risk Level */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm text-muted-foreground">Risk Level:</span>
              <Badge variant={result.riskLevel === 'low' ? 'outline' : 
                            result.riskLevel === 'moderate' ? 'secondary' : 'destructive'}>
                {result.riskLevel}
              </Badge>
            </div>

            {/* Explanation */}
            <div className="mb-3">
              <p className="text-sm text-foreground">{result.explanation}</p>
            </div>

            {/* Reasons */}
            {result.reasons.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-foreground mb-2">Analysis Details:</h5>
                <ul className="space-y-1">
                  {result.reasons.map((reason, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start">
                      <span className="mr-2">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              {result.status === 'unsafe' && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="glass-button"
                    onClick={() => onShowAlternatives?.(result.medicine)}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Suggest Alternatives
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => onOverride?.(result.medicine, 'Doctor override with justification')}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Override Decision
                  </Button>
                </>
              )}
              
              {result.status === 'caution' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="glass-button"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Monitor Closely
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* AI Model Info */}
        <div className="text-xs text-muted-foreground text-center pt-4 border-t border-white/10">
          Analysis powered by AI compatibility prediction model • Based on patient lab values and drug interactions
        </div>
      </CardContent>
    </Card>
  );
};