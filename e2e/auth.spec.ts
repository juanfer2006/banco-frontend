import { test, expect } from '@playwright/test';

function crearUsuarioTest() {
  const rand = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
  return {
    name: `Usuario Test ${rand}`,
    email: `test_${rand}@banco.com`,
    password: 'Password123!',
  };
}

test.describe('Flujo de Autenticación - Banco MVP', () => {
  test('Debe cargar la pantalla de login con el formulario inicial', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('BancoMVP');
    await expect(page.getByText('Ingresa a tu banca digital segura')).toBeVisible();
    await expect(page.getByPlaceholder('ejemplo@correo.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
    await expect(page.getByRole('button', { name: /Ingresar/i })).toBeVisible();
  });

  test('Debe permitir navegar a la pantalla de registro', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /Regístrate aquí/i }).click();

    await expect(page.getByRole('heading', { name: 'Crear Cuenta Bancaria' })).toBeVisible();
    await expect(page.getByPlaceholder('Juan Pérez')).toBeVisible();
    await expect(page.getByPlaceholder('ejemplo@correo.com')).toBeVisible();
    await expect(page.getByRole('button', { name: /Registrarme y Abrir Cuenta/i })).toBeVisible();
  });

  test('Debe completar el flujo: registro, acceso al Dashboard, logout y login', async ({ page }) => {
    const user = crearUsuarioTest();

    await page.goto('/');

    // 1. Ir a Registro
    await page.getByRole('button', { name: /Regístrate aquí/i }).click();

    // 2. Llenar formulario de registro con usuario único
    await page.getByPlaceholder('Juan Pérez').fill(user.name);
    await page.getByPlaceholder('ejemplo@correo.com').fill(user.email);
    await page.getByPlaceholder('Mínimo 6 caracteres').fill(user.password);

    // 3. Enviar registro
    await page.getByRole('button', { name: /Registrarme y Abrir Cuenta/i }).click();

    // 4. El registro exitoso inicia sesión directamente y abre el Dashboard
    await expect(page.getByText('Menú Principal')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Saldo Total Disponible')).toBeVisible();

    // 5. Cerrar sesión
    await page.getByRole('button', { name: /Salir/i }).click();

    // 6. Validar regreso a la pantalla de login
    await expect(page.getByText('Ingresa a tu banca digital segura')).toBeVisible({ timeout: 10000 });

    // 7. Iniciar sesión nuevamente con las credenciales registradas
    await page.getByPlaceholder('ejemplo@correo.com').fill(user.email);
    await page.getByPlaceholder('••••••••').fill(user.password);
    await page.getByRole('button', { name: /Ingresar/i }).click();

    // 8. Confirmar acceso al Dashboard
    await expect(page.getByText('Menú Principal')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Saldo Total Disponible')).toBeVisible();
  });
});
