import { test, expect } from '@playwright/test';

function crearUsuarioTest() {
  const rand = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
  return {
    name: `Usuario Credito ${rand}`,
    email: `credito_${rand}@banco.com`,
    password: 'Password123!',
  };
}

test.describe('Simulador de Créditos y Amortización - Banco MVP', () => {
  test.beforeEach(async ({ page }) => {
    const user = crearUsuarioTest();

    // Registrar e ingresar automáticamente al Dashboard
    await page.goto('/');
    await page.getByRole('button', { name: /Regístrate aquí/i }).click();
    await page.getByPlaceholder('Juan Pérez').fill(user.name);
    await page.getByPlaceholder('ejemplo@correo.com').fill(user.email);
    await page.getByPlaceholder('Mínimo 6 caracteres').fill(user.password);
    await page.getByRole('button', { name: /Registrarme y Abrir Cuenta/i }).click();

    // Confirmar llegada al Dashboard
    await expect(page.getByText('Menú Principal')).toBeVisible({ timeout: 15000 });
  });

  test('Debe calcular la amortización correctamente con el sistema francés', async ({ page }) => {
    // 1. Navegar al simulador de créditos en la barra lateral
    await page.getByRole('button', { name: /Simulador & Créditos/i }).click();

    // 2. Verificar que el módulo cargue
    await expect(page.getByText('Motor de Créditos & Amortización')).toBeVisible();
    await expect(page.getByText('Simulador Interactivo')).toBeVisible();

    // 3. Ejecutar la simulación con valores por defecto
    await page.getByRole('button', { name: /Calcular Amortización/i }).click();

    // 4. Validar que se muestren los resultados estimados y la cuota mensual
    await expect(page.getByText('Resultados Estimados')).toBeVisible();
    await expect(page.getByText('Cuota Mensual:')).toBeVisible();
    await expect(page.getByText('Total Intereses:')).toBeVisible();
    await expect(page.getByText('Total a Pagar:')).toBeVisible();

    // 5. Validar la tabla de amortización detallada
    await expect(page.getByText('Tabla de Amortización (Sistema Francés)')).toBeVisible();
  });
});
