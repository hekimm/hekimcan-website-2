import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const Stepper = ({ steps, currentStep, onStepClick }: StepperProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-16">
      {/* Desktop Stepper */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Background Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 dark:bg-apple-gray-700"></div>
          
          {/* Active Progress Line */}
          <div 
            className="absolute top-6 left-0 h-0.5 bg-blue-600 dark:bg-blue-500 transition-all duration-700 ease-out"
            style={{ 
              width: `${(currentStep / (steps.length - 1)) * 100}%` 
            }}
          ></div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`
                    relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 cursor-pointer hover:scale-110 z-10
                    ${index < currentStep
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-600/20 dark:shadow-blue-500/20'
                      : index === currentStep
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-600/30 dark:shadow-blue-500/30 ring-4 ring-blue-600/10 dark:ring-blue-500/10'
                      : 'border-gray-300 dark:border-apple-gray-600 bg-white dark:bg-apple-gray-800 text-gray-400 dark:text-apple-gray-500 hover:border-gray-400 dark:hover:border-apple-gray-500 hover:bg-gray-50 dark:hover:bg-apple-gray-700'
                    }
                  `}
                  onClick={() => onStepClick?.(index)}
                >
                  {index < currentStep ? (
                    <Check size={20} className="text-white" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-4 text-center max-w-[120px]">
                  <p
                    className={`
                      text-sm font-medium transition-colors duration-300
                      ${index <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-apple-gray-500'}
                    `}
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
                    }}
                  >
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-center space-x-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${index <= currentStep ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-apple-gray-600'}
              `}
            />
          ))}
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-apple-gray-400 mb-1">
            Adım {currentStep + 1} / {steps.length}
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {steps[currentStep]}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
