import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call - no actual logic
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    // No navigation - just stays on login
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Top left icon */}
      <div className="absolute top-6 left-6 z-20">
        <img
          src="/speakrr icon blue copy.png"
          alt="Speakrr"
          className="h-8 w-8"
        />
      </div>

      {/* Top right enquire button */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="secondary"
          size="sm"
          asChild
        >
          <a href="https://tally.so/r/A7vNjD" target="_blank" rel="noopener noreferrer">
            Enquire
          </a>
        </Button>
      </div>

      {/* Subtle ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/3 blur-[150px] pointer-events-none" />

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24">
          <div className="max-w-md">
            <h1 className="text-4xl xl:text-5xl font-semibold tracking-tight text-foreground mb-4">
              Welcome to Speakrr®
            </h1>
            <p className="text-lg text-muted-foreground tracking-tight leading-relaxed">
              Intelligent call handling for dental practices. Never miss a patient call again.
            </p>
            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-primary" />
                <span className="text-sm text-muted-foreground">24/7 automated answering</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-primary" />
                <span className="text-sm text-muted-foreground">Smart appointment scheduling</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-primary" />
                <span className="text-sm text-muted-foreground">Real-time call analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16">
          <div className="w-full max-w-sm animate-fade-in">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-10">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
                Coming Soon
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your dashboard
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-card border border-border p-8">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold tracking-tight text-foreground mb-1">
                  Sign in
                </h2>
                <p className="text-sm text-muted-foreground">
                  Access your voice AI dashboard
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs font-mono uppercase tracking-wide text-muted-foreground"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@practice.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      className={cn(
                        "pl-12 h-12 bg-bg-secondary border-border focus-visible:border-primary",
                        errors.email && "border-destructive focus-visible:border-destructive"
                      )}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive font-mono animate-fade-in">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-xs font-mono uppercase tracking-wide text-muted-foreground"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: undefined });
                      }}
                      className={cn(
                        "pl-12 pr-12 h-12 bg-bg-secondary border-border focus-visible:border-primary",
                        errors.password && "border-destructive focus-visible:border-destructive"
                      )}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive font-mono animate-fade-in">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                ©2026 | Valentis AI Labs (valentis.ai)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
