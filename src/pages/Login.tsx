import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, Users, FlaskConical, ArrowLeft, Eye, EyeOff, Pill } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    identifier: "",
    password: ""
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    nmcId: "",
    nablId: "",
    password: "",
    confirmPassword: ""
  });

  const roleConfig = {
    doctor: {
      title: "Doctor Portal",
      subtitle: "NMC Verified Physicians",
      icon: Stethoscope,
      color: "doctor",
      loginField: "NMC ID",
      placeholder: "Enter your NMC ID"
    },
    patient: {
      title: "Patient Portal",
      subtitle: "Your Health Dashboard", 
      icon: Users,
      color: "patient",
      loginField: "Email/Phone",
      placeholder: "Enter your email or phone"
    },
    lab: {
      title: "Laboratory Portal",
      subtitle: "NABL Certified Labs",
      icon: FlaskConical,
      color: "lab",
      loginField: "NABL ID",
      placeholder: "Enter your NABL ID"
    },
    pharmacy: {
      title: "Pharmacy Portal",
      subtitle: "Verified Pharmacy Stores",
      icon: FlaskConical,
      color: "pharmacy",
      loginField: "Pharmacy License ID",
      placeholder: "Enter your pharmacy license ID"
    }
  };

  const config = roleConfig[role as keyof typeof roleConfig];

  if (!config) {
    return <div>Invalid role</div>;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: `Welcome to ${config.title}!`
      });
      navigate(`/dashboard/${role}`);
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account Created",
        description: "Please check your email for verification"
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">MediAI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] py-12">
        <div className="w-full max-w-md">
          <Card className="glass-card border-white/10">
            <CardHeader className="text-center pb-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                config.color === 'doctor' ? 'bg-doctor/20 text-doctor glow-doctor' :
                config.color === 'patient' ? 'bg-patient/20 text-patient glow-patient' :
                config.color === 'lab' ? 'bg-lab/20 text-lab glow-lab' :
                'bg-pharmacy/20 text-pharmacy glow-pharmacy'
              }`}>
                <config.icon className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">{config.title}</CardTitle>
              <p className={`text-sm ${
                config.color === 'doctor' ? 'text-doctor' :
                config.color === 'patient' ? 'text-patient' :
                config.color === 'lab' ? 'text-lab' :
                'text-pharmacy'
              }`}>
                {config.subtitle}
              </p>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="identifier">{config.loginField}</Label>
                      <Input
                        id="identifier"
                        type="text"
                        placeholder={config.placeholder}
                        value={loginData.identifier}
                        onChange={(e) => setLoginData(prev => ({ ...prev, identifier: e.target.value }))}
                        className="bg-muted/50 border-white/20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="bg-muted/50 border-white/20 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className={`w-full ${
                        config.color === 'doctor' ? 'bg-doctor hover:bg-doctor/90' :
                        config.color === 'patient' ? 'bg-patient hover:bg-patient/90' :
                        config.color === 'lab' ? 'bg-lab hover:bg-lab/90' :
                        'bg-pharmacy hover:bg-pharmacy/90'
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>

                    <div className="text-center">
                      <Button variant="link" className="text-muted-foreground">
                        Forgot password?
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signupData.name}
                        onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-muted/50 border-white/20"
                        required
                      />
                    </div>

                    {role === 'patient' ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={signupData.email}
                            onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                            className="bg-muted/50 border-white/20"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={signupData.phone}
                            onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
                            className="bg-muted/50 border-white/20"
                            required
                          />
                        </div>
                      </>
                    ) : role === 'doctor' ? (
                      <div className="space-y-2">
                        <Label htmlFor="nmcId">NMC ID</Label>
                        <Input
                          id="nmcId"
                          type="text"
                          placeholder="Enter your NMC ID"
                          value={signupData.nmcId}
                          onChange={(e) => setSignupData(prev => ({ ...prev, nmcId: e.target.value }))}
                          className="bg-muted/50 border-white/20"
                          required
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="nablId">NABL ID</Label>
                        <Input
                          id="nablId"
                          type="text"
                          placeholder="Enter your NABL ID"
                          value={signupData.nablId}
                          onChange={(e) => setSignupData(prev => ({ ...prev, nablId: e.target.value }))}
                          className="bg-muted/50 border-white/20"
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Password</Label>
                      <Input
                        id="signupPassword"
                        type="password"
                        placeholder="Create a password"
                        value={signupData.password}
                        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                        className="bg-muted/50 border-white/20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="bg-muted/50 border-white/20"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className={`w-full ${
                        config.color === 'doctor' ? 'bg-doctor hover:bg-doctor/90' :
                        config.color === 'patient' ? 'bg-patient hover:bg-patient/90' :
                        config.color === 'lab' ? 'bg-lab hover:bg-lab/90' :
                        'bg-pharmacy hover:bg-pharmacy/90'
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;