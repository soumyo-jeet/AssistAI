"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createOrUpdateIndustryInsight } from "./dashboard"; // Changed import
import { revalidatePath } from "next/cache";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Validate input
  if (!data.industry || !data.experience) {
    throw new Error("Industry and experience are required");
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });
    if (!user) throw new Error("User not found");

    const result = await db.$transaction(async (tx) => {
      // 1. Create or update industry insights (simplified using new function)
      const industryInsight = await createOrUpdateIndustryInsight(data.industry, tx);

      // 2. Update user profile
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio || null,
          skills: data.skills || []
        }
      });

      return { updatedUser, industryInsight };
    }, { 
      timeout: 10000,
      maxWait: 5000 // Added max wait time
    });

    revalidatePath("/");
    return result.updatedUser;

  } catch (error) {
    console.error("Update failed:", {
      error: error.message,
      stack: error.stack,
      inputData: data
    });
    
    throw new Error(
      error.message.includes("industry insights")
        ? "Industry analysis temporary unavailable. Please try again later."
        : "Profile update failed. Please check your input."
    );
  }
}

export async function getUserOnboardingStatus() {
  try {
    const { userId } = await auth();
    if (!userId) return { isOnboarded: false }; // More graceful handling

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true }
    });

    return { isOnboarded: !!user?.industry };
  } catch (error) {
    console.error("Onboarding check failed:", error);
    return { isOnboarded: false }; // Return default instead of throwing
  }
}


// In your user actions file
export async function getCurrentUser(userId) {
  try {
    return await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        industry: true,
        // Add other fields you need
      }
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}