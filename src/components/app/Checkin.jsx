import { CheckCircle2, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import iconeGerenciamentoPeso from '@/assets/icone_gerenciamento_peso.webp'
import iconeMedicinaRegenerativa from '@/assets/icone_medicina_regenerativa.webp'
import iconeNutrologia from '@/assets/icone_nutrologia.webp'
import iconePsiquiatria from '@/assets/icone_psiquiatria.webp'

function CheckItem({ label, checked, onChange, detail }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-3 rounded-lg px-1 py-1.5 hover:bg-slate-50">
      <span className="flex min-w-0 gap-3"><input type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" /><span><span className="block text-sm font-medium text-slate-700">{label}</span>{detail && <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{detail}</span>}</span></span>
      <Badge variant={checked ? 'default' : 'outline'} className="shrink-0">{checked ? '+10' : '10'}</Badge>
    </label>
  )
}

function PillarHeader({ icon, title }) {
  return <CardTitle className="flex items-center gap-2 text-base"><img src={icon} alt="" className="h-7 w-7 rounded-md object-cover" />{title}</CardTitle>
}

export function Checkin({ checkinData, setCheckinData, onSave, isEditing, stats }) {
  const toggle = (group, field) => setCheckinData((current) => ({ ...current, [group]: { ...current[group], [field]: !current[group][field] } }))
  const setMood = (humor) => setCheckinData((current) => ({ ...current, psiquiatria: { ...current.psiquiatria, humor } }))
  const date = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  const moodLabels = ['Muito difícil', 'Difícil', 'Regular', 'Bem', 'Muito bem']

  return (
    <main className="p-6 pb-24">
      <header className="mb-5 text-center"><h1 className="text-2xl font-bold text-slate-900">Como foi seu dia?</h1><p className="mt-1 capitalize text-sm text-slate-500">{date}</p>{isEditing && <p className="mt-2 rounded-lg bg-sky-50 p-2 text-xs text-sky-800">Você está editando o único check-in de hoje. Salvar atualiza o registro e recalcula os pontos.</p>}</header>
      <div className="mb-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950"><Info className="h-4 w-4 shrink-0" aria-hidden="true" /><p>Registre apenas o que fez ou observou. Jejum, suplementos e exercícios devem respeitar sua condição e orientação individual.</p></div>
      <div className="space-y-4">
        <Card><CardHeader><PillarHeader icon={iconeMedicinaRegenerativa} title="Medicina Regenerativa" /></CardHeader><CardContent className="space-y-2">
          <CheckItem label="Rotina alimentar planejada com orientação" detail="Marque apenas se esta prática fizer sentido para você." checked={checkinData.medicinaRegenerativa.jejum} onChange={() => toggle('medicinaRegenerativa', 'jejum')} />
          <CheckItem label="Sono adequado para mim" detail="Observe duração e qualidade sem buscar perfeição." checked={checkinData.medicinaRegenerativa.sono} onChange={() => toggle('medicinaRegenerativa', 'sono')} />
          <CheckItem label="Hidratação consciente" checked={checkinData.medicinaRegenerativa.hidratacao} onChange={() => toggle('medicinaRegenerativa', 'hidratacao')} />
        </CardContent></Card>
        <Card><CardHeader><PillarHeader icon={iconeNutrologia} title="Nutrologia" /></CardHeader><CardContent className="space-y-2">
          <CheckItem label="Refeição nutritiva e possível" detail="Ex.: comida brasileira de verdade, cores e variedade conforme sua rotina." checked={checkinData.nutrologia.refeicao} onChange={() => toggle('nutrologia', 'refeicao')} />
          <CheckItem label="Suplemento conforme orientação individual" checked={checkinData.nutrologia.suplementos} onChange={() => toggle('nutrologia', 'suplementos')} />
          <CheckItem label="Movimento ou exercício adaptado" detail="Sem dor e dentro da sua capacidade." checked={checkinData.nutrologia.exercicio} onChange={() => toggle('nutrologia', 'exercicio')} />
        </CardContent></Card>
        <Card><CardHeader><PillarHeader icon={iconePsiquiatria} title="Psiquiatria" /></CardHeader><CardContent className="space-y-3">
          <CheckItem label="Meditação, presença ou respiração" checked={checkinData.psiquiatria.meditacao} onChange={() => toggle('psiquiatria', 'meditacao')} />
          <CheckItem label="Prática de gratidão" checked={checkinData.psiquiatria.gratidao} onChange={() => toggle('psiquiatria', 'gratidao')} />
          <fieldset><legend className="mb-2 text-sm font-medium text-slate-700">Como se sentiu hoje? <span className="font-normal text-slate-500">Opcional, sem pontuação.</span></legend><div className="flex justify-between gap-1">{[1, 2, 3, 4, 5].map((mood) => { const selected = checkinData.psiquiatria.humor === mood; return <button key={mood} type="button" aria-label={moodLabels[mood - 1]} aria-pressed={selected} onClick={() => setMood(mood)} className={`h-11 w-11 rounded-full text-xl transition ${selected ? 'bg-emerald-500 text-white ring-2 ring-emerald-200' : 'bg-slate-100 hover:bg-slate-200'}`}>{['😞', '😐', '🙂', '😊', '😄'][mood - 1]}</button> })}</div></fieldset>
        </CardContent></Card>
        <Card><CardHeader><PillarHeader icon={iconeGerenciamentoPeso} title="Gerenciamento do Peso" /></CardHeader><CardContent className="space-y-2">
          <CheckItem label="Pesagem registrada" detail="A pesagem é opcional e privada neste dispositivo." checked={checkinData.gerenciamentoPeso.pesagem} onChange={() => toggle('gerenciamentoPeso', 'pesagem')} />
          {checkinData.gerenciamentoPeso.pesagem && <div className="ml-8 max-w-48"><Label htmlFor="weight">Peso (kg)</Label><Input id="weight" type="number" inputMode="decimal" min="1" step="0.1" value={checkinData.gerenciamentoPeso.pesoKg} onChange={(event) => setCheckinData((current) => ({ ...current, gerenciamentoPeso: { ...current.gerenciamentoPeso, pesoKg: event.target.value } }))} placeholder="Ex.: 72,5" /></div>}
          <CheckItem label="Controle alimentar com gentileza" detail="Observe escolhas e saciedade, sem punição." checked={checkinData.gerenciamentoPeso.controleAlimentar} onChange={() => toggle('gerenciamentoPeso', 'controleAlimentar')} />
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Notas do dia</CardTitle></CardHeader><CardContent><Textarea value={checkinData.notas} onChange={(event) => setCheckinData((current) => ({ ...current, notas: event.target.value }))} placeholder="Algo que gostaria de lembrar sobre o seu dia?" className="min-h-24" /></CardContent></Card>
      </div>
      <Button type="button" className="mt-6 h-13 w-full bg-emerald-600 hover:bg-emerald-700" onClick={onSave}><CheckCircle2 className="mr-2 h-5 w-5" aria-hidden="true" />{isEditing ? 'Atualizar check-in' : 'Salvar check-in'}</Button>
      <p className="mt-3 text-center text-xs text-slate-500">Os pontos são recalculados a partir deste registro: {stats.todayCheckin?.points ?? 0} ponto(s) atualmente salvos.</p>
    </main>
  )
}
