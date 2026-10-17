import { test, expect } from '@playwright/test';

function crearUsuarioTest() {
  const rand = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
  return {
    name: `Usuario Nav ${rand}`,
    email: `nav_${rand}@banco.com`,
    password: 'Password123!',
  };
}

test.describe('Navegación y Módulos Principales - Banco MVP', () => {
  test.beforeEach(async ({ page }) => {
    const user = crearUsuarioTest();

    await page.goto('/');
    await page.getByRole('button', { name: /Regístrate aquí/i }).click();
    await page.getByPlaceholder('Juan Pérez').fill(user.name);
    await page.getByPlaceholder('ejemplo@correo.com').fill(user.email);
    await page.getByPlaceholder('Mínimo 6 caracteres').fill(user.password);
    await page.getByRole('button', { name: /Registrarme y Abrir Cuenta/i }).click();
    await expect(page.getByText('Menú Principal')).toBeVisible({ timeout: 15000 });
  });

  test('Debe navegar a Transferencias correctamente', async ({ page }) => {
    await page.getByRole('button', { name: /Transferencias/i }).click();
    await expect(page.getByRole('heading', { name: 'Transferir Dinero' })).toBeVisible();
    await expect(page.getByText('Envío inmediato entre cuentas de Banco MVP')).toBeVisible();
  });

  test('Debe navegar a Mis Tarjetas y visualizar la tarjeta activa', async ({ page }) => {
    await page.getByRole('button', { name: /Mis Tarjetas/i }).click();
    await expect(page.getByRole('heading', { name: 'Gestión de Tarjetas' })).toBeVisible();
    await expect(page.getByText('Tarjetas físicas y digitales emitidas')).toBeVisible();
  });

  test('Debe navegar a Cajitas de Ahorro', async ({ page }) => {
    await page.getByRole('button', { name: /Cajitas de Ahorro/i }).click();
    await expect(page.getByRole('heading', { name: 'Cajitas de Ahorro', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /Crear Cajita/i })).toBeVisible();
  });
});
