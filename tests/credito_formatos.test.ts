import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Funciones utilitarias para pruebas unitarias de lógica financiera y formateo en Frontend
export function formatearMoneda(monto: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(monto);
}

export function calcularCuotaEstimada(capital: number, tasaEa: number, meses: number): number {
  if (meses <= 0 || capital <= 0) return 0;
  // Conversión tasa EA a mensual efectiva
  const im = Math.pow(1 + tasaEa, 1 / 12) - 1;
  if (im === 0) return capital / meses;
  const cuota = (capital * (im * Math.pow(1 + im, meses))) / (Math.pow(1 + im, meses) - 1);
  return Math.round(cuota);
}

export function validarMontoSolicitud(monto: number, min: number = 500000, max: number = 50000000): { valido: boolean; mensaje?: string } {
  if (isNaN(monto) || monto <= 0) {
    return { valido: false, mensaje: 'El monto debe ser un número positivo' };
  }
  if (monto < min) {
    return { valido: false, mensaje: `El monto mínimo es ${formatearMoneda(min)}` };
  }
  if (monto > max) {
    return { valido: false, mensaje: `El monto máximo es ${formatearMoneda(max)}` };
  }
  return { valido: true };
}

describe('Simulación y Formateo Financiero en Frontend', () => {
  test('formatearMoneda formatea números a moneda colombiana COP', () => {
    const formatted = formatearMoneda(1500000);
    // Elimina espacios no separables si los hubiera
    const normalizado = formatted.replace(/\u00a0/g, ' ');
    assert.ok(normalizado.includes('1.500.000') || normalizado.includes('1500000'));
    assert.ok(normalizado.includes('$'));
  });

  test('calcularCuotaEstimada calcula la cuota mensual con amortización francesa', () => {
    const capital = 10_000_000;
    const tasaEa = 0.22; // 22% EA
    const meses = 12;
    const cuota = calcularCuotaEstimada(capital, tasaEa, meses);

    assert.ok(cuota > 0);
    // El total a pagar debe superar el capital prestado
    const totalPagar = cuota * meses;
    assert.ok(totalPagar > capital);
    // Para 10M al 22% EA a 12 meses, la cuota está alrededor de ~920.000 COP
    assert.ok(cuota > 850_000 && cuota < 1_000_000);
  });

  test('validarMontoSolicitud valida correctamente límites mínimos y máximos', () => {
    const valido = validarMontoSolicitud(5_000_000);
    assert.equal(valido.valido, true);

    const muyBajo = validarMontoSolicitud(200_000);
    assert.equal(muyBajo.valido, false);
    assert.ok(muyBajo.mensaje?.includes('mínimo'));

    const muyAlto = validarMontoSolicitud(100_000_000);
    assert.equal(muyAlto.valido, false);
    assert.ok(muyAlto.mensaje?.includes('máximo'));

    const negativo = validarMontoSolicitud(-50_000);
    assert.equal(negativo.valido, false);
  });
});
