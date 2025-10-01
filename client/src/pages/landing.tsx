import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building,
  Users,
  Wrench,
  Calendar,
  BarChart3,
  Shield,
  Banknote,
  Languages,
} from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleSignup = () => {
    window.location.href = "/signup";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5dc] to-[#e0d8b0] text-[#2c2c2c]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-[#8b5e3c] rounded-lg p-3 mr-4">
                <Building className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-serif">
                PropertyPro UAE
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Property Management Made Simple
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              Streamline your property management with our all-in-one platform.
              Manage properties, tenants, maintenance, and finances with bilingual support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleSignup}
                size="lg"
                className="px-8 py-3 text-lg"
              >
                Get Started
              </Button>
              <Button
                onClick={handleLogin}
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg"
              >
                Login
              </Button>
              <Button variant="ghost" size="lg" className="px-8 py-3 text-lg">
                <Languages className="inline-block mr-2" />
                عربي / English
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">
              Everything You Need to Manage Properties
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From tenant screening to accounting, PropertyPro has all the tools
              you need to manage your property portfolio efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="bg-[#8b5e3c]/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <Building className="h-8 w-8 text-[#8b5e3c]" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Property Management</h4>
              <p className="text-muted-foreground">
                Organize and track all your properties with detailed information and analytics.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-[#4a7c59]/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-[#4a7c59]" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Tenant Management</h4>
              <p className="text-muted-foreground">
                Screen tenants, manage leases, and handle communications all in one place.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-[#a06c4a]/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <Wrench className="h-8 w-8 text-[#a06c4a]" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Maintenance Tracking</h4>
              <p className="text-muted-foreground">
                Log requests, assign vendors, and track progress with automated workflows.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-[#c2b280]/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <Calendar className="h-8 w-8 text-[#c2b280]" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Calendar & Reminders</h4>
              <p className="text-muted-foreground">
                Never miss important dates with automated payment reminders and scheduling.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-[#d4af37]/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <Banknote className="h-8 w-8 text-[#d4af37]" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Accounting & Invoicing</h4>
              <p className="text-muted-foreground">
                Track rent payments, generate invoices, and reconcile transactions with ease.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-[#2c2c2c]/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#2c2c2c]" />
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
      <div className="py-24 bg-[#f5f5dc]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold mb-6">
            Ready to Streamline Your Property Management?
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of property managers who trust PropertyPro to manage their portfolios.
          </p>
          <Button
            onClick={handleSignup}
            size="lg"
            className="px-8 py-3 text-lg"
          >
            Start Managing Today
          </Button>
        </div>
      </div>
    </div>
  );
}