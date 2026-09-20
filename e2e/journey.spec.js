import { expect, test } from '@playwright/test'

async function completeOnboarding(page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByLabel('Nome').fill('Participante Jornada')
  await page.getByLabel('Idade').fill('45')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Mais energia' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Iniciar jornada' }).click()
}

test('permite navegar pelas quatro semanas e pelo fechamento da jornada', async ({ page }) => {
  await completeOnboarding(page)
  await page.getByRole('button', { name: 'Ver a semana' }).click()

  await expect(page.getByText('Semana 1 — Fundamentos da Vitalidade')).toBeVisible()
  await page.getByRole('tab', { name: 'Semana 2', exact: true }).click()
  await expect(page.getByText('Semana 2 — Evolução do Corpo')).toBeVisible()
  await expect(page.getByText('Expansão da Consciência')).toBeVisible()

  await page.getByRole('tab', { name: 'Semana 3', exact: true }).click()
  await expect(page.getByText('Semana 3 — Autonomia, adaptação e integração')).toBeVisible()
  await expect(page.getByText('Otimização inteligente')).toBeVisible()

  await page.getByRole('tab', { name: 'Semana 4', exact: true }).click()
  await expect(page.getByText('Desafio Vitalidade — Semana 4')).toBeVisible()
  await expect(page.getByText('O despertar do líder')).toBeVisible()

  await page.getByRole('tab', { name: 'Fechamento', exact: true }).click()
  await expect(page.getByText('Fechamento — Dias 29 e 30')).toBeVisible()
  await expect(page.getByText('Consolidação pessoal')).toBeVisible()
  await page.getByRole('tab', { name: 'Dia 30' }).click()
  await expect(page.getByText('Continuidade com propósito')).toBeVisible()
})
