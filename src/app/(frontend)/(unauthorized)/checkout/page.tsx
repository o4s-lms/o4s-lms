"use client";

import Loading from "@/components/Loading";
import WizardStepper from "@/components/CheckoutPage/WizardStepper";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import React from "react";
import CheckoutDetailsPage from "@/components/CheckoutPage/Details";
import PaymentPage from "@/components/CheckoutPage/Payment";
import CompletionPage from "@/components/CheckoutPage/Completion";
import { useAuth } from "@/providers/Auth";

const CheckoutWizard = () => {
  const { isLoaded } = useAuth();
  const { checkoutStep } = useCheckoutNavigation();

  if (!isLoaded) return <Loading />;

  const renderStep = () => {
    switch (checkoutStep) {
      case 1:
        return <CheckoutDetailsPage />;
      case 2:
        return <PaymentPage />;
      case 3:
        return <CompletionPage />;
      default:
        return <CheckoutDetailsPage />;
    }
  };

  return (
    <div className="w-full px-4 h-full flex flex-col items-center py-12">
      <WizardStepper currentStep={checkoutStep} />
      <div className="w-full max-w-screen-lg flex flex-col items-center mt-10">{renderStep()}</div>
    </div>
  );
};

export default CheckoutWizard;