"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Navbar } from "@/components/layout/navbar";

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated or not a student
    if (!loading && (!user || user.role !== "student")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {user.name}!</p>

        <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card text-card-foreground rounded-lg border shadow p-6">
            <h2 className="text-xl font-semibold mb-2">My Assignments</h2>
            <p className="text-muted-foreground">View and submit your assignments</p>
            <div className="mt-4">
              <button className="text-primary underline">View assignments</button>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-lg border shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Recent Feedback</h2>
            <p className="text-muted-foreground">Review feedback from your instructors</p>
            <div className="mt-4">
              <button className="text-primary underline">View feedback</button>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-lg border shadow p-6">
            <h2 className="text-xl font-semibold mb-2">AI Chat Assistant</h2>
            <p className="text-muted-foreground">Get help with your assignments</p>
            <div className="mt-4">
              <button className="text-primary underline">Start chatting</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 