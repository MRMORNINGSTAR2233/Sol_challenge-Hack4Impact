"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Navbar } from "@/components/layout/navbar";

export default function TeacherDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated or not a teacher
    if (!loading && (!user || user.role !== "teacher")) {
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
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {user.name}!</p>

        <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card text-card-foreground rounded-lg border shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Manage Assignments</h2>
            <p className="text-muted-foreground">Create, edit, and review student assignments</p>
            <div className="mt-4">
              <button className="text-primary underline">View assignments</button>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-lg border shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Student Progress</h2>
            <p className="text-muted-foreground">Track student performance and engagement</p>
            <div className="mt-4">
              <button className="text-primary underline">View students</button>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-lg border shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-muted-foreground">Insights into student performance and assignment quality</p>
            <div className="mt-4">
              <button className="text-primary underline">View analytics</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 