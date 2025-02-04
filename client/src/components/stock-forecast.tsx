import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { type Product, type QuantityHistory } from "@shared/schema";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { format, subDays } from "date-fns";
import { TrendingDown } from "lucide-react";

interface StockForecastProps {
  product: Product;
}

interface ChartDataPoint {
  date: string;
  quantity: number;
  isPredicted?: boolean;
}

export default function StockForecast({ product }: StockForecastProps) {
  const { data: history } = useQuery<QuantityHistory[]>({
    queryKey: [`/api/products/${product.id}/history`],
  });

  if (!history?.length) return null;

  // Calculate average daily usage over the last 7 days
  const sevenDaysAgo = subDays(new Date(), 7);
  const recentHistory = history.filter(h => new Date(h.timestamp) >= sevenDaysAgo);
  const totalUsage = recentHistory.reduce((sum, h) => sum + Math.abs(h.changeAmount), 0);
  const avgDailyUsage = totalUsage / 7;

  // Project when stock will be depleted
  const daysUntilDepletion = avgDailyUsage > 0 
    ? Math.floor(product.quantity / avgDailyUsage)
    : Infinity;

  // Prepare chart data
  const chartData: ChartDataPoint[] = history
    .slice(0, 10)
    .map(h => ({
      date: format(new Date(h.timestamp), 'MMM dd'),
      quantity: h.quantity
    }))
    .reverse();

  // Predict next 5 days
  const lastQuantity = chartData[chartData.length - 1].quantity;
  for (let i = 1; i <= 5; i++) {
    const predictedQuantity = Math.max(0, lastQuantity - (avgDailyUsage * i));
    chartData.push({
      date: format(new Date(Date.now() + i * 24 * 60 * 60 * 1000), 'MMM dd'),
      quantity: predictedQuantity,
      isPredicted: true
    });
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-josefin-sans text-[#3E2723] flex items-center gap-2">
          <TrendingDown className="h-4 w-4" />
          Stock Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  angle={-45} 
                  textAnchor="end" 
                  height={50} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="quantity"
                  stroke="#F9A825"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  strokeDasharray={(d: ChartDataPoint) => d.isPredicted ? "5 5" : "0"}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-[#795548]">
              Avg. daily usage: {avgDailyUsage.toFixed(1)}
            </p>
            {daysUntilDepletion < Infinity && (
              <p className={`text-right ${daysUntilDepletion < 7 ? 'text-red-600' : 'text-[#795548]'}`}>
                {daysUntilDepletion} days remaining
              </p>
            )}
          </div>
          {product.quantity < product.minQuantity && (
            <p className="text-sm text-red-600 font-medium">
              Stock is below minimum quantity
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}