import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, Wrench, Calendar, BarChart3, Shield } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-primary rounded-lg p-3 mr-4">
                <Building className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground font-serif">
                PropertyPro
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              Property Management Made Simple
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              Streamline your property management with our all-in-one platform. 
              Manage properties, tenants, maintenance, and finances all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleLogin}
                size="lg"
                className="px-8 py-3 text-lg"
                data-testid="button-login"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-card-foreground mb-4">
              Everything You Need to Manage Properties
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From tenant screening to maintenance tracking, PropertyPro has all the tools 
              you need to manage your property portfolio efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="bg-primary/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Property Management</h4>
              <p className="text-muted-foreground">
                Organize and track all your properties with detailed information and analytics.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-chart-2/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-chart-2" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Tenant Management</h4>
              <p className="text-muted-foreground">
                Screen tenants, manage leases, and handle communications all in one place.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-chart-3/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <Wrench className="h-8 w-8 text-chart-3" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Maintenance Tracking</h4>
              <p className="text-muted-foreground">
                Log requests, assign vendors, and track progress with automated workflows.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-chart-4/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <Calendar className="h-8 w-8 text-chart-4" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Calendar & Reminders</h4>
              <p className="text-muted-foreground">
                Never miss important dates with automated payment reminders and scheduling.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-chart-5/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-chart-5" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Financial Reporting</h4>
              <p className="text-muted-foreground">
                Generate comprehensive reports and track your portfolio's performance.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-primary/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Secure & Reliable</h4>
              <p className="text-muted-foreground">
                Your data is protected with enterprise-grade security and regular backups.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-foreground mb-6">
            Ready to Streamline Your Property Management?
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of property managers who trust PropertyPro to manage their portfolios.
          </p>
          <Button
            onClick={handleLogin}
            size="lg"
            className="px-8 py-3 text-lg"
            data-testid="button-cta-login"
          >
            Start Managing Today
          </Button>
        </div>
      </div>
    </div>
  );
}
