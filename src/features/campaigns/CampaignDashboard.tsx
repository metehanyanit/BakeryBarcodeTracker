export function CampaignDashboard() {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Campaign Overview */}
      <div className="col-span-8 bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">The Lost Mines of Phandelver</h2>
          <CampaignStatus status="active" />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <SessionTimeline />
          <PartyOverview />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="col-span-4 space-y-6">
        <QuestTracker />
        <TreasureLog />
        <NPCDirectory />
      </div>
    </div>
  );
} 