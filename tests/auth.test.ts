import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { auth, AuthUser } from '../src/lib/auth';

// Mock de localStorage para el entorno de pruebas unitarias
const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: mockStorage,
  writable: true,
});

describe('Módulo de Autenticación de Frontend (auth)', () => {
  const usuarioPrueba: AuthUser = {
    id: 'usr-123456',
    email: 'cliente@banco.com',
    full_name: 'Ana María Gómez',
  };
  const tokenPrueba = 'jwt.header.payload.signature';

  beforeEach(() => {
    mockStorage.clear();
  });

  test('al iniciar debe retornar null si no hay sesión activa', () => {
    assert.equal(auth.getToken(), null);
    assert.equal(auth.getUser(), null);
    assert.equal(auth.getSession(), null);
  });

  test('setSession almacena token y datos de usuario correctamente', () => {
    auth.setSession(tokenPrueba, usuarioPrueba);

    assert.equal(auth.getToken(), tokenPrueba);
    assert.deepEqual(auth.getUser(), usuarioPrueba);

    const session = auth.getSession();
    assert.ok(session !== null);
    assert.equal(session?.token, tokenPrueba);
    assert.equal(session?.user.email, 'cliente@banco.com');
  });

  test('clearSession elimina el token y el usuario del almacenamiento', () => {
    auth.setSession(tokenPrueba, usuarioPrueba);
    assert.ok(auth.getSession() !== null);

    auth.clearSession();
    assert.equal(auth.getToken(), null);
    assert.equal(auth.getUser(), null);
    assert.equal(auth.getSession(), null);
  });

  test('notifica a los observadores mediante onAuthStateChange al cambiar la sesión', () => {
    let sesionNotificada: any = 'no_llamado';
    const sub = auth.onAuthStateChange((ses) => {
      sesionNotificada = ses;
    });

    auth.setSession(tokenPrueba, usuarioPrueba);
    assert.equal(sesionNotificada?.user?.email, 'cliente@banco.com');

    auth.clearSession();
    assert.equal(sesionNotificada, null);

    sub.unsubscribe();
  });

  test('tolera datos corruptos en el almacenamiento sin lanzar excepción', () => {
    mockStorage.setItem('banco_session_user', '{json_invalido}');
    assert.equal(auth.getUser(), null);
  });
});
