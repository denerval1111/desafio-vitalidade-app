import { CheckCircle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import heroImage from '@/assets/hero_boas_vindas.webp'
import iconeGerenciamentoPeso from '@/assets/icone_gerenciamento_peso.webp'
import iconeMedicinaRegenerativa from '@/assets/icone_medicina_regenerativa.webp'
import iconeNutrologia from '@/assets/icone_nutrologia.webp'
import iconePsiquiatria from '@/assets/icone_psiquiatria.webp'

const pillars = [
  { title: 'Medicina Regenerativa', description: 'Sono, hidratação, rotina e escolhas de autocuidado.', icon: iconeMedicinaRegenerativa, color: 'bg-emerald-50' },
  { title: 'Nutrologia', description: 'Alimentação prática, brasileira e possível no dia a dia.', icon: iconeNutrologia, color: 'bg-sky-50' },
  { title: 'Psiquiatria', description: 'Presença, gratidão e bem-estar emocional.', icon: iconePsiquiatria, color: 'bg-violet-50' },
  { title: 'Gerenciamento do Peso', description: 'Acompanhamento sem sofrimento e sem comparações.', icon: iconeGerenciamentoPeso, color: 'bg-amber-50' },
]

const objectives = ['Mais energia', 'Melhor sono', 'Gerenciar o peso', 'Ganhar força', 'Reduzir estresse', 'Longevidade', 'Melhor humor']

function PillarCard({ pillar }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl p-3 ${pillar.color}`}>
      <img src={pillar.icon} alt="" className="h-11 w-11 rounded-lg object-cover" />
      <div>
        <h3 className="font-semibold text-slate-800">{pillar.title}</h3>
        <p className="text-xs leading-relaxed text-slate-600">{pillar.description}</p>
      </div>
    </div>
  )
}

export function Onboarding({ step, setStep, profileForm, setProfileForm, onObjectiveToggle, onComplete }) {
  const steps = [
    {
      title: 'Bem-vindo ao Desafio Vitalidade',
      subtitle: 'Uma jornada prática de 30 dias, organizada em quatro semanas.',
      content: (
        <div className="space-y-4 text-center">
          <img src={heroImage} alt="Pessoa em momento de bem-estar ao ar livre" className="h-48 w-full rounded-2xl object-cover" />
          <p className="text-sm leading-relaxed text-slate-600">Práticas simples para apoiar hábitos de saúde, com liberdade para adaptar ao seu momento.</p>
          <div className="rounded-xl border border-sky-100 bg-sky-50 p-3 text-left text-xs leading-relaxed text-sky-900">
            <ShieldCheck className="mr-1 inline h-4 w-4" aria-hidden="true" />
            Seus registros ficam somente neste navegador. O aplicativo permite exportar, importar ou apagar seus dados no perfil.
          </div>
        </div>
      ),
    },
    {
      title: 'Quatro pilares, uma rotina possível',
      subtitle: 'Cada semana integra os quatro pilares.',
      content: <div className="space-y-3">{pillars.map((pillar) => <PillarCard key={pillar.title} pillar={pillar} />)}</div>,
    },
    {
      title: 'Conte-nos sobre você',
      subtitle: 'Usaremos apenas para personalizar a sua experiência neste dispositivo.',
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" autoComplete="name" value={profileForm.name} onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))} placeholder="Seu nome" />
          </div>
          <div>
            <Label htmlFor="age">Idade</Label>
            <Input id="age" inputMode="numeric" type="number" min="18" max="120" value={profileForm.age} onChange={(event) => setProfileForm((current) => ({ ...current, age: event.target.value }))} placeholder="Sua idade" />
          </div>
        </div>
      ),
    },
    {
      title: 'O que é mais importante agora?',
      subtitle: 'Selecione pelo menos um foco. Você pode mudar isso depois.',
      content: (
        <div className="space-y-2">
          {objectives.map((objective) => {
            const selected = profileForm.objectives.includes(objective)
            return (
              <button key={objective} type="button" aria-pressed={selected} onClick={() => onObjectiveToggle(objective)} className={`w-full rounded-xl border p-3 text-left text-sm font-medium transition ${selected ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                {objective}
              </button>
            )
          })}
        </div>
      ),
    },
    {
      title: 'Tudo pronto para começar',
      subtitle: 'O objetivo é consistência, não perfeição.',
      content: (
        <div className="space-y-4 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" aria-hidden="true" />
          <div className="rounded-xl bg-slate-50 p-4 text-left text-sm leading-relaxed text-slate-700">
            <p><strong>Nome:</strong> {profileForm.name}</p>
            <p><strong>Foco:</strong> {profileForm.objectives.join(', ')}</p>
          </div>
          <p className="text-xs leading-relaxed text-slate-500">Este aplicativo oferece apoio a hábitos. Não substitui avaliação, diagnóstico ou prescrição individual.</p>
        </div>
      ),
    },
  ]

  const current = steps[step]
  const lastStep = step === steps.length - 1
  const canContinue = step < 2 || (step === 2 && profileForm.name.trim() && profileForm.age) || (step === 3 && profileForm.objectives.length > 0) || lastStep

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col bg-white p-6">
      <div className="mb-6 flex gap-1" aria-label={`Etapa ${step + 1} de ${steps.length}`}>
        {steps.map((_, index) => <div key={index} className={`h-1 flex-1 rounded-full ${index <= step ? 'bg-emerald-500' : 'bg-slate-200'}`} />)}
      </div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{current.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{current.subtitle}</p>
      </div>
      <div className="flex-1">{current.content}</div>
      <div className="mt-8 flex justify-between gap-3">
        {step > 0 ? <Button type="button" variant="outline" onClick={() => setStep((value) => value - 1)}>Voltar</Button> : <span />}
        <Button type="button" disabled={!canContinue} className="bg-emerald-600 hover:bg-emerald-700" onClick={() => lastStep ? onComplete(profileForm) : setStep((value) => value + 1)}>
          {lastStep ? 'Iniciar jornada' : 'Continuar'}
        </Button>
      </div>
    </main>
  )
}
