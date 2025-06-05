import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Skeleton loader for price table rows
 */
export function PriceTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-grey-200">
      <div className="px-6 py-4 bg-grey-50 border-b border-grey-200">
        <Skeleton className="h-4 w-48" />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-grey-50 border-b border-grey-200">
            <tr>
              <th className="px-6 py-3"><Skeleton className="h-4 w-20" /></th>
              <th className="px-6 py-3"><Skeleton className="h-4 w-24" /></th>
              <th className="px-6 py-3"><Skeleton className="h-4 w-20" /></th>
              <th className="px-6 py-3"><Skeleton className="h-4 w-20" /></th>
              <th className="px-6 py-3"><Skeleton className="h-4 w-20" /></th>
              <th className="px-6 py-3"><Skeleton className="h-4 w-16" /></th>
              <th className="px-6 py-3"><Skeleton className="h-4 w-24" /></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-grey-200">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-3 w-40" />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16 mx-auto" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16 mx-auto" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16 mx-auto" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-center">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for mobile price cards
 */
export function PriceCardSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: cards }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[300, 500, 900].map((vol) => (
              <div key={vol} className="text-center p-2 bg-gray-50 rounded">
                <Skeleton className="h-3 w-8 mx-auto mb-1" />
                <Skeleton className="h-5 w-16 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/**
 * Skeleton loader for dashboard stats cards
 */
export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton loader for supplier cards
 */
export function SupplierCardSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: cards }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-12" />
            </div>
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Skeleton loader for form inputs
 */
export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

/**
 * Generic content skeleton
 */
export function ContentSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="h-4" 
          style={{ width: `${Math.random() * 40 + 60}%` }} 
        />
      ))}
    </div>
  );
}