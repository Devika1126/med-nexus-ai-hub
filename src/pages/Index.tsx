import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Users, FlaskConical, ArrowRight, Shield, Brain, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const userRoles = [
    {
      id: "doctor",
      title: "Doctor Portal",
      subtitle: "NMC Verified Physicians",
      description: "AI-powered prescription assistance with real-time drug interaction analysis",
      icon: Stethoscope,
      color: "doctor",
      route: "/login/doctor"
    },
    {
      id: "patient",
      title: "Patient Portal", 
      subtitle: "Your Health Dashboard",
      description: "Track medications, view reports, and receive personalized health insights",
      icon: Users,
      color: "patient",
      route: "/login/patient"
    },
    {
      id: "lab",
      title: "Laboratory Portal",
      subtitle: "NABL Certified Labs",
      description: "Upload reports and integrate with doctor prescriptions seamlessly",
      icon: FlaskConical,
      color: "lab",
      route: "/login/lab"
    },
    {
      id: "pharmacy",
      title: "Pharmacy Portal",
      subtitle: "Verified Pharmacy Stores",
      description: "Manage inventory, process prescriptions, and provide medicine availability",
      icon: FlaskConical,
      color: "pharmacy",
      route: "/login/pharmacy"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms detect drug interactions and suggest optimal treatments"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "HIPAA compliant with end-to-end encryption for all medical data"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Instant notifications and updates across all healthcare providers"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">MediAI</h1>
                <p className="text-xs text-muted-foreground">Prescription Ecosystem</p>
              </div>
            </div>
            <Button variant="outline" className="glass-button">
              Contact Support
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary-glow to-accent bg-clip-text text-transparent mb-6">
              AI-Driven Medical Prescription Assistant Ecosystem
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Revolutionizing healthcare with intelligent prescription management, 
              real-time drug interaction analysis, and seamless collaboration between 
              doctors, patients, and laboratories.
            </p>
            
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {features.map((feature, index) => (
                <Card key={index} className="glass-card border-white/10">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="w-12 h-12 text-primary mx-auto mb-4 glow-primary" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="relative z-10 pb-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Portal</h2>
            <p className="text-muted-foreground">Select your role to access your personalized dashboard</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {userRoles.map((role) => (
              <Card
                key={role.id}
                className={`glass-card border-white/10 cursor-pointer smooth-transition group ${
                  hoveredCard === role.id ? `glow-${role.color}` : ''
                }`}
                onMouseEnter={() => setHoveredCard(role.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(role.route)}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 smooth-transition ${
                    role.color === 'doctor' ? 'bg-doctor/20 text-doctor' :
                    role.color === 'patient' ? 'bg-patient/20 text-patient' :
                    role.color === 'lab' ? 'bg-lab/20 text-lab' :
                    'bg-pharmacy/20 text-pharmacy'
                  }`}>
                    <role.icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-2">{role.title}</h3>
                  <p className={`text-sm font-medium mb-4 ${
                    role.color === 'doctor' ? 'text-doctor' :
                    role.color === 'patient' ? 'text-patient' :
                    role.color === 'lab' ? 'text-lab' :
                    'text-pharmacy'
                  }`}>
                    {role.subtitle}
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {role.description}
                  </p>
                  
                  <Button 
                    className={`w-full group-hover:scale-105 smooth-transition ${
                      role.color === 'doctor' ? 'bg-doctor hover:bg-doctor/90' :
                      role.color === 'patient' ? 'bg-patient hover:bg-patient/90' :
                      role.color === 'lab' ? 'bg-lab hover:bg-lab/90' :
                      'bg-pharmacy hover:bg-pharmacy/90'
                    }`}
                  >
                    Access Portal
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 smooth-transition" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 MediAI Prescription Ecosystem. All rights reserved.</p>
            <p className="text-sm mt-2">Secure, Compliant, and AI-Powered Healthcare Solutions</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
