import { expect, test } from '@playwright/test'

test('permite editar o único check-in do dia sem duplicar registros', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByLabel('Nome').fill('Participante E2E')
  await page.getByLabel('Idade').fill('45')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Mais energia' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Iniciar jornada' }).click()

  await page.getByRole('button', { name: 'Fazer check-in de hoje' }).click()
  await page.getByLabel(/Rotina alimentar planejada/).check()
  await page.getByRole('button', { name: 'Salvar check-in' }).click()
  await expect(page.getByText('Ciclo 1 · 1 registro na jornada')).toBeVisible()
  await expect(page.getByText('Seu primeiro passo já conta')).toBeVisible()

  await page.getByRole('button', { name: 'Editar check-in de hoje' }).click()
  await page.getByLabel(/Refeição nutritiva e possível/).check()
  await page.getByRole('button', { name: 'Atualizar check-in' }).click()

  await expect(page.getByText('Ciclo 1 · 1 registro na jornada')).toBeVisible()
  await expect(page.getByText('Check-in atualizado. Seu registro de hoje agora soma 20 pontos.')).toBeVisible()
})

test('apresenta a primeira semana com orientações de uso responsável', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByLabel('Nome').fill('Participante E2E')
  await page.getByLabel('Idade').fill('45')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Mais energia' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Iniciar jornada' }).click()

  await page.getByRole('button', { name: 'Ver a semana' }).click()
  await expect(page.getByText('Semana 1 — Fundamentos da Vitalidade')).toBeVisible()
  await expect(page.getByText(/Este conteúdo é educativo e não substitui avaliação individual/)).toBeVisible()
  await page.getByRole('tab', { name: 'Dia 7' }).click()
  await expect(page.getByText('Integração e Continuidade')).toBeVisible()
})
