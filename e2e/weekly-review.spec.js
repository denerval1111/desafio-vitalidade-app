import { expect, test } from '@playwright/test'

const checkin = (date) => ({
  date,
  medicinaRegenerativa: { jejum: false, sono: true, hidratacao: false },
  nutrologia: { refeicao: false, suplementos: false, exercicio: false },
  psiquiatria: { meditacao: false, gratidao: false, humor: null },
  gerenciamentoPeso: { pesagem: false, controleAlimentar: false, pesoKg: '' },
  notas: '',
})

test('oferece uma reflexão semanal opcional após sete registros', async ({ page }) => {
  const days = Array.from({ length: 7 }, (_, index) => 14 + index)
  const data = {
    dataVersion: 3,
    profile: { name: 'Participante Reflexão', age: '45', objectives: ['Mais energia'] },
    hasCompletedOnboarding: true,
    startDate: '2026-09-14T12:00:00.000Z',
    dailyProgress: Object.fromEntries(days.map((day) => {
      const date = `2026-09-${String(day).padStart(2, '0')}`
      return [date, checkin(date)]
    })),
    weeklyReviews: {},
    longTermData: { customGoals: [] },
  }

  await page.addInitScript((storedData) => window.localStorage.setItem('vitality_user_data', JSON.stringify(storedData)), data)
  await page.goto('/')

  await expect(page.getByText('Pausa para refletir')).toBeVisible()
  await page.getByLabel('O que ajudou você a cuidar de si nesta semana?').fill('Dormir melhor ajudou a manter o ritmo.')
  await page.getByLabel('Um foco pequeno para os próximos dias').fill('Manter a rotina noturna.')
  await page.getByRole('button', { name: 'Guardar reflexão' }).click()

  await expect(page.getByText('Sua reflexão foi guardada neste dispositivo.')).toBeVisible()
  await expect(page.getByText('Pausa para refletir')).not.toBeVisible()
})
