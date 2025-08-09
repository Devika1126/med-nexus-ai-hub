import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Sparkles, Pill, Activity } from "lucide-react";
import { CompatibilityChecker } from "@/components/prescriptions/CompatibilityChecker";
import { SideEffectsPanel } from "@/components/prescriptions/SideEffectsPanel";

interface MedicineAlt { name: string; reason: string }

interface RuleOutput {
  status: "safe" | "attention" | "high-risk";
  score: number; // 0-100 compatibility
  reasons: string[];
  alternatives: MedicineAlt[];
}

const ruleEngine = (diagnosis: string, labs: { name: string; value: number; ref: [number, number] }[], current: string): RuleOutput => {
  const reasons: string[] = [];
  let score = 90;
  let status: RuleOutput["status"] = "safe";

  const getLab = (n: string) => labs.find((l) => l.name === n);
  const hba1c = getLab("HbA1c");
  const ldl = getLab("LDL");
  const egfr = getLab("eGFR");

  if (hba1c && hba1c.value > 7.0) {
    reasons.push("Poor glycemic control (HbA1c > 7%)");
    score -= 20;
  }
  if (ldl && ldl.value > 130) {
    reasons.push("LDL is high; consider intensifying statin");
    score -= 10;
  }
  if (egfr && egfr.value < 60) {
    reasons.push("Reduced renal function — adjust renally cleared drugs");
    score -= 30;
  }

  if (current.toLowerCase().includes("metformin") && egfr && egfr.value < 45) {
    reasons.push("Metformin caution when eGFR < 45");
    score -= 25;
  }

  status = score >= 75 ? "safe" : score >= 50 ? "attention" : "high-risk";

  const alternatives: MedicineAlt[] = [];
  if (diagnosis.toLowerCase().includes("diab")) {
    alternatives.push({ name: "Dapagliflozin 10mg", reason: "Cardiorenal benefit in T2DM" });
    alternatives.push({ name: "Sitagliptin 100mg", reason: "Weight neutral; low hypo risk" });
  }
  if (diagnosis.toLowerCase().includes("hypert")) {
    alternatives.push({ name: "Losartan 50mg", reason: "ACEi cough or potassium issues" });
  }

  return { status, score: Math.max(10, Math.min(98, score)), reasons, alternatives };
};

export default function AISuggestions() {
  const [diagnosis, setDiagnosis] = useState("Type 2 Diabetes, Hypertension");
  const [currentMed, setCurrentMed] = useState("Metformin 500mg");
  const labs = [
    { name: "HbA1c", value: 8.2, ref: [4, 6] as [number, number] },
    { name: "LDL", value: 142, ref: [0, 100] as [number, number] },
    { name: "eGFR", value: 58, ref: [90, 120] as [number, number] },
  ];

  const result = useMemo(() => ruleEngine(diagnosis, labs, currentMed), [diagnosis, labs, currentMed]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Brain className="w-5 h-5 mr-2" /> AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Diagnosis" />
            <Input value={currentMed} onChange={(e) => setCurrentMed(e.target.value)} placeholder="Current medication" />
          </div>

          <div className="p-4 rounded-lg bg-muted/40 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant={result.status === "safe" ? "secondary" : result.status === "attention" ? "outline" : "destructive"}>
                  {result.status}
                </Badge>
                <span className="text-sm text-muted-foreground">Compatibility score</span>
              </div>
              <span className="text-sm text-muted-foreground">{result.score}%</span>
            </div>
            <Progress value={result.score} className="h-2" />
            <ul className="mt-3 list-disc list-inside text-sm text-muted-foreground">
              {result.reasons.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center"><Sparkles className="w-4 h-4 mr-2"/>Recommended alternatives</h4>
            <div className="space-y-2">
              {result.alternatives.map((alt) => (
                <div key={alt.name} className="p-3 rounded-md bg-muted/40 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    <span className="font-medium text-foreground">{alt.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{alt.reason}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground"><Activity className="w-5 h-5 mr-2"/> Drug compatibility</CardTitle>
          </CardHeader>
          <CardContent>
            <CompatibilityChecker
              results={[
                { medicine: currentMed, score: result.score, status: result.status === "safe" ? "safe" : result.status === "attention" ? "caution" : "unsafe", reasons: result.reasons, riskLevel: result.status } as any,
              ]}
            />
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground"><Pill className="w-5 h-5 mr-2"/> Predicted side effects</CardTitle>
          </CardHeader>
          <CardContent>
            <SideEffectsPanel
              medicine={currentMed}
              patientRiskFactors={["Elevated HbA1c", "Reduced eGFR"]}
              sideEffects={[
                { name: "GI Upset", probability: 32, severity: "mild", description: "Nausea / diarrhea may occur initially", timeframe: "First 1-2 weeks" },
                { name: "Lactic acidosis", probability: 1, severity: "severe", description: "Rare but serious; risk increases with renal impairment", timeframe: "Anytime", riskFactors: ["eGFR < 45"] },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
