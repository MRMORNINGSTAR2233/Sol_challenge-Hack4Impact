import Link from "next/link";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const features = [
    {
      title: "Automated Grading",
      description: "Leverage AI to grade assignments in seconds, providing consistent evaluations across all submissions.",
      icon: "📊",
      color: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Personalized Feedback",
      description: "Generate tailored feedback for each student, highlighting strengths and areas for improvement.",
      icon: "💬",
      color: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "AI-Powered Chat",
      description: "Enable students to ask questions and receive immediate assistance through Groq AI's powerful language model.",
      icon: "🤖",
      color: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "Vision-Based Processing",
      description: "Upload handwritten assignments or diagrams and let our AI vision system convert them to digital format for evaluation.",
      icon: "👁️",
      color: "bg-amber-100 dark:bg-amber-900",
    },
  ];

  return (
    <PageLayout>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
            SolGrader: AI-Powered Assignment Solutions
          </h1>
          <p className="max-w-[42rem] text-muted-foreground sm:text-xl">
            Revolutionize education with automated grading, personalized feedback, 
            and AI-powered assistance for teachers and students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/teacher-dashboard">
              <Button size="lg">Teacher Dashboard</Button>
            </Link>
            <Link href="/student-dashboard">
              <Button variant="outline" size="lg">Student Dashboard</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Key Features</h2>
          <p className="max-w-[85%] text-muted-foreground sm:text-lg">
            Our platform combines cutting-edge AI technology with educational expertise to create a seamless grading and feedback experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col">
              <CardHeader>
                <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center text-2xl mb-2`}>
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Get Started Today</h2>
            <p className="text-muted-foreground">
              Join thousands of educators and students who are already benefiting from our AI-powered grading and feedback system.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/upload">
                <Button>Upload Assignment</Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline">Try AI Chat</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-lg border bg-muted p-8">
            <div className="flex flex-col gap-2">
              <div className="h-2 w-20 rounded bg-muted-foreground/30"></div>
              <div className="h-2 w-full rounded bg-muted-foreground/30"></div>
              <div className="h-2 w-full rounded bg-muted-foreground/30"></div>
              <div className="h-2 w-4/5 rounded bg-muted-foreground/30"></div>
              <div className="h-8 w-full rounded bg-muted-foreground/30 mt-6"></div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
