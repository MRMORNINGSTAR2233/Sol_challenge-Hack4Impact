"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Let's install the required packages for form validation
// npm install react-hook-form zod @hookform/resolvers

const textSubmissionSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  course: z.string().min(1, { message: "Please select a course" }),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  notes: z.string().optional(),
});

const fileSubmissionSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  course: z.string().min(1, { message: "Please select a course" }),
  file: z.instanceof(FileList).refine((files) => files.length > 0, "File is required"),
  notes: z.string().optional(),
});

export default function UploadAssignment() {
  const [submissionType, setSubmissionType] = useState("text");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  
  const textForm = useForm<z.infer<typeof textSubmissionSchema>>({
    resolver: zodResolver(textSubmissionSchema),
    defaultValues: {
      title: "",
      course: "",
      content: "",
      notes: "",
    },
  });
  
  const fileForm = useForm<z.infer<typeof fileSubmissionSchema>>({
    resolver: zodResolver(fileSubmissionSchema),
    defaultValues: {
      title: "",
      course: "",
      notes: "",
    },
  });

  async function onTextSubmit(data: z.infer<typeof textSubmissionSchema>) {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError("");
    
    try {
      // In a real app, this would send data to the server
      // For demo purposes, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Text submission data:", data);
      setSubmitSuccess(true);
      textForm.reset();
    } catch (error) {
      setSubmitError("Failed to submit assignment. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  async function onFileSubmit(data: z.infer<typeof fileSubmissionSchema>) {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError("");
    
    try {
      // In a real app, this would use FormData to send files
      // For demo purposes, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("File submission data:", {
        title: data.title,
        course: data.course,
        fileName: data.file[0]?.name,
        fileSize: data.file[0]?.size,
        notes: data.notes,
      });
      
      setSubmitSuccess(true);
      fileForm.reset();
    } catch (error) {
      setSubmitError("Failed to upload assignment. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const courses = [
    { value: "eng101", label: "English 101" },
    { value: "eng102", label: "English 102" },
    { value: "math201", label: "Mathematics 201" },
    { value: "math202", label: "Calculus II" },
    { value: "cs101", label: "Computer Science 101" },
    { value: "phy301", label: "Physics 301" },
    { value: "chem201", label: "Chemistry 201" },
    { value: "psy201", label: "Psychology 201" },
  ];

  return (
    <PageLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Upload Assignment</h1>
        <p className="text-muted-foreground">
          Submit your assignments for grading and receive AI-powered feedback.
        </p>
        
        {submitSuccess && (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-600 dark:text-green-500"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your assignment has been submitted successfully. You will receive feedback shortly.
            </AlertDescription>
          </Alert>
        )}
        
        {submitError && (
          <Alert variant="destructive">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="text" onValueChange={setSubmissionType} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Submission</TabsTrigger>
            <TabsTrigger value="file">File Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text">
            <Card>
              <CardHeader>
                <CardTitle>Text Assignment</CardTitle>
                <CardDescription>
                  Submit essays, reports, or any text-based assignments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...textForm}>
                  <form onSubmit={textForm.handleSubmit(onTextSubmit)} className="space-y-6">
                    <FormField
                      control={textForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignment Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter assignment title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={textForm.control}
                      name="course"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a course" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course.value} value={course.value}>
                                  {course.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={textForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignment Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter your assignment content here..." 
                              className="min-h-[200px] resize-y"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={textForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any additional notes for your instructor..." 
                              className="resize-y"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Assignment"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="file">
            <Card>
              <CardHeader>
                <CardTitle>File Assignment</CardTitle>
                <CardDescription>
                  Upload document files, images, or scanned assignments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...fileForm}>
                  <form onSubmit={fileForm.handleSubmit(onFileSubmit)} className="space-y-6">
                    <FormField
                      control={fileForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignment Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter assignment title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={fileForm.control}
                      name="course"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a course" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course.value} value={course.value}>
                                  {course.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={fileForm.control}
                      name="file"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Assignment File</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              type="file"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => onChange(e.target.files)} 
                              className="cursor-pointer"
                            />
                          </FormControl>
                          <FormDescription>
                            Accepted formats: PDF, DOC, DOCX, JPG, PNG
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={fileForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any additional notes for your instructor..." 
                              className="resize-y"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Uploading..." : "Upload Assignment"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}