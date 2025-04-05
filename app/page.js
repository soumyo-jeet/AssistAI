import React from "react";
import Landing from "@/components/Landing";
import Explorer from "@/components/Explorer";

export default function LandingPage() {
  return (
    <>
      <div className="grid-background"></div>

      {/* Landing Section */}
      <Landing />

      {/* Features Section */}
      <Explorer />
    </>
  );
}