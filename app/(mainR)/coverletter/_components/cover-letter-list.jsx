"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { FileText, Eye, Trash2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "@/actions/cover-letter";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CoverLetterList({ coverLetters }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete cover letter");
    }
  };

  if (!coverLetters?.length) {
    return (
      <Card className="text-center border-dashed hover:border-primary transition-colors">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-lg">No Cover Letters Yet</CardTitle>
          <CardDescription className="mt-2">
            Create your first cover letter to get started
          </CardDescription>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/coverletter/new')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Cover Letter
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
      <h1 className="font-bold text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Cover Letters
          </h1>
        <Button onClick={() => router.push('/coverletter/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Cover Letter
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coverLetters.map((letter) => (
          <Card key={letter.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg line-clamp-1">
                    {letter.jobTitle}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {letter.companyName}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {format(new Date(letter.createdAt), "MMM d, yyyy")}
                </Badge>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {letter.jobDescription}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/coverletter/${letter.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the cover letter for{" "}
                        <span className="font-medium">{letter.jobTitle}</span> at{" "}
                        <span className="font-medium">{letter.companyName}</span>?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(letter.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}