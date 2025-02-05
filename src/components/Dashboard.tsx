import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ScrollText, Book, Sword, Shield } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function Dashboard() {
  const { data } = useStore();

  const stats = useMemo(() => {
    const typeCount = data.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sourceCount = data.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: data.length,
      byType: Object.entries(typeCount).map(([name, value]) => ({ name, value })),
      bySource: Object.entries(sourceCount).map(([name, value]) => ({ name, value }))
    };
  }, [data]);

  if (data.length === 0) return null;

  return (
    <div className="w-full space-y-8 mt-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<Scroll className="w-8 h-8 text-amber-700" />}
          title="Total Artifacts"
          value={stats.total}
          className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200"
        />
        <StatCard
          icon={<Book className="w-8 h-8 text-emerald-700" />}
          title="Types of Lore"
          value={stats.byType.length}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200"
        />
        <StatCard
          icon={<Sword className="w-8 h-8 text-red-700" />}
          title="Most Common"
          value={stats.byType[0]?.name || 'N/A'}
          className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200"
        />
        <StatCard
          icon={<Shield className="w-8 h-8 text-blue-700" />}
          title="Sources"
          value={stats.bySource.length}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200"
        />
      </div>

      {/* Charts with themed styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-parchment p-6 rounded-lg shadow-md border-2 border-amber-300">
          <h3 className="text-xl font-medieval text-amber-900 mb-4">Distribution of Artifacts</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byType}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-parchment p-6 rounded-lg shadow-md border-2 border-amber-300">
          <h3 className="text-xl font-medieval text-amber-900 mb-4">Source Origins</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.bySource}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.bySource.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Entries Table */}
      <div className="bg-parchment rounded-lg shadow-md overflow-hidden border-2 border-amber-300">
        <div className="p-4 border-b border-amber-300 bg-gradient-to-r from-amber-100/50">
          <h3 className="text-xl font-medieval text-amber-900">Recent Discoveries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.slice(0, 5).map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.source}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}