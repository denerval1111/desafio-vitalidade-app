import { useState } from 'react'
import { HeartHandshake } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'

export function WeeklyReview({ prompt, onSave }) {
  const [answer, setAnswer] = useState('')
  const [focus, setFocus] = useState('')

  if (!prompt) return null

  const pillarLabel = prompt.topPillar?.shortLabel || 'sua jornada'
  const canSave = answer.trim() || focus.trim()

  function saveReview() {
    if (!canSave) return
    onSave(prompt.key, { answer, focus, dismissed: false })
  }

  return (
    <Card className="mt-5 border-sky-200 bg-sky-50/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-sky-950"><HeartHandshake className="h-5 w-5 text-sky-700" aria-hidden="true" />Pausa para refletir</CardTitle>
        <p className="text-sm leading-relaxed text-sky-900">Você registrou {prompt.registeredDays} dias nesta etapa. O pilar mais presente foi {pillarLabel.toLowerCase()}.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="block text-sm font-medium text-slate-700" htmlFor="weekly-review">O que ajudou você a cuidar de si nesta semana?</label>
        <Textarea id="weekly-review" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Escreva uma frase, se quiser." className="min-h-20 bg-white" />
        <label className="block text-sm font-medium text-slate-700" htmlFor="weekly-focus">Um foco pequeno para os próximos dias</label>
        <Input id="weekly-focus" value={focus} onChange={(event) => setFocus(event.target.value)} placeholder="Ex.: preparar uma refeição com mais presença" className="bg-white" />
        <div className="flex gap-2 pt-1">
          <Button type="button" onClick={saveReview} disabled={!canSave} className="flex-1 bg-emerald-600 hover:bg-emerald-700">Guardar reflexão</Button>
          <Button type="button" variant="outline" onClick={() => onSave(prompt.key, { dismissed: true })}>Agora não</Button>
        </div>
      </CardContent>
    </Card>
  )
}
