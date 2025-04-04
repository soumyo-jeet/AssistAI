"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
  Printer,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/actions/resume";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import { EntryForm } from "./resume-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");
  const [isPrinting, setIsPrinting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  // Watch form fields for preview updates
  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  // Update preview content when form values change
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  // Handle save result
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!", {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      });
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume", {
        icon: <XCircle className="w-5 h-5 text-red-500" />,
      });
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const generatePDF = () => {
    setIsPrinting(true);
    try {
      window.print();
      toast.info("Opening print dialog...", {
        icon: <Printer className="w-5 h-5 text-blue-500" />,
      });
    } catch (error) {
      toast.error("Failed to open print dialog", {
        icon: <XCircle className="w-5 h-5 text-red-500" />,
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formattedContent = previewContent
        .replace(/\n/g, "\n")
        .replace(/\n\s*\n/g, "\n\n")
        .trim();

      await saveResumeFn(previewContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div data-color-mode="light" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="font-bold text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Resume Builder
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and customize your professional resume
          </p>
        </div>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isDirty ? "default" : "outline"}
                onClick={handleSubmit(onSubmit)}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isDirty ? "Save Changes" : "Saved"}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isDirty ? "Save your resume" : "All changes saved"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={generatePDF}
                disabled={isPrinting}
                className="gap-2"
              >
                {isPrinting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Printer className="h-4 w-4" />
                    Print/PDF
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate printable PDF version</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="grid grid-cols-2 w-[200px]">
            <TabsTrigger value="edit">
              <Edit className="h-4 w-4 mr-2" />
              Form
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Monitor className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
          {activeTab === "preview" && (
            <Badge
              variant={resumeMode === "preview" ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/80"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit Mode
                </>
              ) : (
                <>
                  <Monitor className="h-3 w-3 mr-1" />
                  Preview Mode
                </>
              )}
            </Badge>
          )}
        </div>

        <TabsContent value="edit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "contactInfo.email",
                    label: "Email",
                    type: "email",
                    placeholder: "your@email.com",
                    icon: "📧",
                  },
                  {
                    name: "contactInfo.mobile",
                    label: "Mobile Number",
                    type: "tel",
                    placeholder: "+91 1234 567890",
                    icon: "📱",
                  },
                  {
                    name: "contactInfo.linkedin",
                    label: "LinkedIn URL",
                    type: "url",
                    placeholder: "https://linkedin.com/in/your-profile",
                    icon: "💼",
                  },
                  {
                    name: "contactInfo.twitter",
                    label: "Twitter/X Profile",
                    type: "url",
                    placeholder: "https://twitter.com/your-handle",
                    icon: "🐦",
                  },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <span>{field.icon}</span>
                      {field.label}
                    </label>
                    <Input
                      {...register(field.name)}
                      type={field.type}
                      placeholder={field.placeholder}
                      error={errors.contactInfo?.[field.name.split(".")[1]]}
                    />
                    {errors.contactInfo?.[field.name.split(".")[1]] && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo[field.name.split(".")[1]].message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {[
            {
              title: "Professional Summary",
              name: "summary",
              placeholder: "Write a compelling professional summary...",
              rows: 5,
            },
            {
              title: "Skills",
              name: "skills",
              placeholder: "List your key skills (comma separated or bullet points)...",
              rows: 5,
            },
          ].map((section) => (
            <Card key={section.name}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name={section.name}
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="min-h-[120px]"
                      placeholder={section.placeholder}
                      rows={section.rows}
                      error={errors[section.name]}
                    />
                  )}
                />
                {errors[section.name] && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors[section.name].message}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          {[
            {
              title: "Work Experience",
              name: "experience",
              type: "Experience",
            },
            {
              title: "Education",
              name: "education",
              type: "Education",
            },
            {
              title: "Projects",
              name: "projects",
              type: "Project",
            },
          ].map((section) => (
            <Card key={section.name}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name={section.name}
                  control={control}
                  render={({ field }) => (
                    <EntryForm
                      type={section.type}
                      entries={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors[section.name] && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors[section.name].message}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="preview" className="relative">
          {resumeMode !== "preview" && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-sm">
                Note: Changes made here will be overwritten if you edit the form
              </span>
            </div>
          )}
          
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
              className="rounded-lg"
            />
          </div>
          
          {/* Hidden content for printing */}
          <div className="hidden">
            <div
              id="resume-pdf"
              className="p-8 markdown-body"
              style={{
                width: '210mm',
                minHeight: '297mm',
                backgroundColor: 'white',
                color: 'black'
              }}
            >
              <MDEditor.Markdown
                source={previewContent}
                style={{ whiteSpace: 'pre-wrap' }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}