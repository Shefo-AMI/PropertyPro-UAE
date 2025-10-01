import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>
        <form className="space-y-4">
          <Input type="text" placeholder="Company Name" required />
          <Input type="email" placeholder="Email" required />
          <Input type="password" placeholder="Password" required />
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Already have an account? <a href="/api/login" className="underline">Login</a>
        </p>
      </Card>
    </div>
  );
}