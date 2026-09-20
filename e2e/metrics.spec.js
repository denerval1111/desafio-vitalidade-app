import { expect, test } from '@playwright/test'

async function completeOnboarding(page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByLabel('Nome').fill('Participante Métricas')
  await page.getByLabel('Idade').fill('45')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Mais energia' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Iniciar jornada' }).click()
}

test('apresenta progresso, pilares e histórico sem linguagem de cobrança', async ({ page }) => {
  await completeOnboarding(page)
  await page.getByRole('button', { name: 'Fazer check-in de hoje' }).click()
  await page.getByLabel(/Refeição nutritiva e possível/).check()
  await page.getByRole('button', { name: 'Salvar check-in' }).click()

  await expect(page.getByText('Seu primeiro passo já conta')).toBeVisible()
  await expect(page.getByText('Últimos 7 dias')).toBeVisible()
  await page.getByRole('button', { name: 'Meu progresso' }).click()

  await expect(page.getByText('Calendário do ciclo')).toBeVisible()
  await expect(page.getByText('1 de 30 dias registrados')).toBeVisible()
  await page.getByRole('tab', { name: 'Pilares' }).click()
  await expect(page.getByText('Nutrologia')).toBeVisible()
  await expect(page.getByText('Presente em 1 de 1 dias registrados')).toBeVisible()
  await page.getByRole('tab', { name: 'Histórico' }).click()
  await expect(page.getByText('Evolução neste ciclo')).toBeVisible()
  await expect(page.getByText('Semana 1')).toBeVisible()
})
