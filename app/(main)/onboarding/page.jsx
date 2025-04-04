import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";
import OnboardingForm from "./_components/onBoardingForm";
import { industries } from "@/datas/industries";

export default async function OnboardingPage() {
  // Check if user is already onboarded
  const { isOnboarded } = await getUserOnboardingStatus();

  if (isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
}