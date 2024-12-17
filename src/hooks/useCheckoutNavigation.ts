"use client";

import { useAuth } from "@/providers/Auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export const useCheckoutNavigation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useAuth();

  const slug = searchParams.get("slug") ?? "";
  const checkoutStep = parseInt(searchParams.get("step") ?? "1", 10);

  const navigateToStep = useCallback(
    (step: number) => {
      const newStep = Math.min(Math.max(1, step), 3);
      const showSignUp = isSignedIn ? "true" : "false";

      router.push(
        `/checkout?step=${newStep}&slug=${slug}&showSignUp=${showSignUp}`,
        {
          scroll: false,
        }
      );
    },
    [slug, isSignedIn, router]
  );

  useEffect(() => {
    if (isLoaded && !isSignedIn && checkoutStep > 1) {
      navigateToStep(1);
    }
  }, [isLoaded, isSignedIn, checkoutStep, navigateToStep]);

  return { checkoutStep, navigateToStep };
};