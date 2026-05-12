'use client';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm mb-2">Pending Compliance</p>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm mb-2">Active Clients</p>
          <p className="text-3xl font-bold">48</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm mb-2">Open Assignments</p>
          <p className="text-3xl font-bold">24</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm mb-2">This Month Revenue</p>
          <p className="text-3xl font-bold">₹2.4L</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">Chart placeholder</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Compliance Status</h2>
          <p className="text-muted-foreground">Chart placeholder</p>
        </div>
      </div>
    </div>
  );
}
