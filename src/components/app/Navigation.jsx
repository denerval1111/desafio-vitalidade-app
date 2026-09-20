import { BookOpen, CheckCircle, Home, Target, User } from 'lucide-react'

const navigation = [
  { id: 'dashboard', label: 'Hoje', icon: Home },
  { id: 'checkin', label: 'Check-in', icon: CheckCircle },
  { id: 'learn', label: 'Semana', icon: BookOpen },
  { id: 'goals', label: 'Metas', icon: Target },
  { id: 'profile', label: 'Perfil', icon: User },
]

export function Navigation({ currentView, onNavigate }) {
  return (
    <nav aria-label="Navegação principal" className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="grid grid-cols-5 px-1 py-1">
        {navigation.map(({ id, label, icon: Icon }) => {
          const active = currentView === id
          return (
            <button
              key={id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onNavigate(id)}
              className={`flex min-h-14 flex-col items-center justify-center rounded-xl px-1 text-xs font-medium transition ${
                active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon className="mb-1 h-5 w-5" aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
