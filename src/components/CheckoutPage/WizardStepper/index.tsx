import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React from 'react';

interface WizardStepperProps {
  currentStep: number;
}

const WizardStepper = ({ currentStep }: WizardStepperProps) => {
  return (
    <div className="mb-4 flex w-1/2 flex-col items-center">
      <div className="mb-2 flex w-full items-center justify-between">
        {[1, 2, 3].map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'mb-2 flex h-8 w-8 items-center justify-center rounded-full',
                  {
                    'bg-green-500':
                      currentStep > step || (currentStep === 3 && step === 3),
                    'bg-primary-700': currentStep === step && step !== 3,
                    'border border-customgreys-dirtyGrey text-customgreys-dirtyGrey':
                      currentStep < step,
                  },
                )}
              >
                {currentStep > step || (currentStep === 3 && step === 3) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step}</span>
                )}
              </div>
              <p
                className={cn('text-sm', {
                  'text-white-100': currentStep >= step,
                  'text-customgreys-dirtyGrey': currentStep < step,
                })}
              >
                {step === 1 && 'Details'}
                {step === 2 && 'Payment'}
                {step === 3 && 'Completion'}
              </p>
            </div>
            {index < 2 && (
              <div
                className={cn('mt-4 h-[1px] w-1/4 self-start', {
                  'bg-green-500': currentStep > step,
                  'bg-customgreys-dirtyGrey': currentStep <= step,
                })}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WizardStepper;
