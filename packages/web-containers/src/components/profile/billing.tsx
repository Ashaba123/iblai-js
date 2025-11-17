'use client';

import { Button } from '@web-containers/components/ui/button';
import { Card, CardContent } from '@web-containers/components/ui/card';
import { Settings, CreditCard } from 'lucide-react';

export default function BillingTab({
  billingURL,
  topUpURL,
  currentPlan = '',
}: {
  billingURL: string;
  topUpURL: string;
  currentPlan?: string;
}) {
  return (
    <div className="container mx-auto max-w-7xl !mt-0">
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
        {/* Manage Subscription Card */}
        {billingURL && (
          <Card className="flex-1 shadow-md border-1 hover:border-primary/20">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="max-w-md mx-auto text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-6">
                  <Settings className="h-20 w-20 mx-auto" />
                </div>
                {currentPlan && (
                  <div className="flex justify-center items-center gap-2 mb-4">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 capitalize">
                      {currentPlan} Plan
                    </h4>
                    <div className="text-blue-700 text-md font-semibold bg-blue-50 px-1.5 py-0.5 rounded-xs text-md">
                      Active
                    </div>
                  </div>
                )}
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Update your plan, cancel subscription, or view billing history
                </p>
                <Button
                  onClick={() => window.open(billingURL, '_self')}
                  className="w-full bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white cursor-pointer text-md"
                >
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Credit Card */}
        {topUpURL && (
          <Card
            //onClick={() => window.open(topUpURL, "_self")}
            className="flex-1 shadow-md border-1 hover:border-primary/20"
          >
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="max-w-md mx-auto text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-6">
                  <CreditCard className="h-20 w-20 mx-auto" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Usage
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Add credits to your account for pay-as-you-go services
                </p>
                <Button
                  onClick={() => window.open(topUpURL, '_self')}
                  className="w-full bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white cursor-pointer text-md"
                >
                  Add Credits
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
