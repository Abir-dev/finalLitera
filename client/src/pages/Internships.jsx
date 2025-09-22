import { Briefcase } from "lucide-react";

export default function Internships() {
  return (
    <div className="container-premium">
      <div className="card-premium p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)',
                border: '1px solid var(--brand)30'
              }}>
                <Briefcase size={20} style={{ color: 'var(--brand)' }} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Internships</h1>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)',
                border: '1px solid var(--accent-gold)30',
                color: 'var(--accent-gold)'
              }}
            >
              Coming soon
            </span>
          </div>

          <div className="card-premium p-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center" style={{ 
              background: 'linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)',
              border: '1px solid var(--brand-strong)30'
            }}>
              <Briefcase size={28} style={{ color: 'var(--brand-strong)' }} />
            </div>
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Curated internships and application tracking are on the way
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Discover roles, save favorites, and track your applications right here.
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Stay tuned for updates.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


