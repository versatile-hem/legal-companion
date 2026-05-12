export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"></div>
        <div className="relative z-10 text-white max-w-md">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
            <span className="text-3xl font-bold">S</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">Suits In</h1>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            AI-First Compliance & Operations Platform for Modern Professional Services
          </p>
          
          <div className="space-y-6 mt-12">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-300 text-xl">✓</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Complete Compliance</h3>
                <p className="text-blue-100 text-sm">Automate and track all compliance requirements</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-300 text-xl">✓</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">AI-Powered Insights</h3>
                <p className="text-blue-100 text-sm">Get intelligent recommendations and analytics</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-300 text-xl">✓</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Seamless Integration</h3>
                <p className="text-blue-100 text-sm">Connect with your existing business tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
