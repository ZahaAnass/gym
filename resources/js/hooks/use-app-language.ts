import { useEffect, useSyncExternalStore } from 'react';
import type { AppLanguage } from '@/lang';

const STORAGE_KEY = 'app-language';
const LEGACY_STORAGE_KEY = 'dashboard-language';
const DEFAULT_LANGUAGE: AppLanguage = 'en';

function normalizeLang(value: string | null): AppLanguage | null {
    if (value === 'en' || value === 'fr' || value === 'ar') {
        return value;
    }

    return null;
}

function readInitialLanguage(): AppLanguage {
    if (typeof window === 'undefined') {
        return DEFAULT_LANGUAGE;
    }

    const fromApp = normalizeLang(localStorage.getItem(STORAGE_KEY));
    if (fromApp) {
        return fromApp;
    }

    const fromLegacy = normalizeLang(localStorage.getItem(LEGACY_STORAGE_KEY));
    return fromLegacy || DEFAULT_LANGUAGE;
}

let currentLanguage: AppLanguage = readInitialLanguage();
const listeners = new Set<() => void>();

function emitLanguageChange() {
    listeners.forEach((listener) => listener());
}

function setGlobalLanguage(language: AppLanguage) {
    currentLanguage = language;

    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, language);
        localStorage.setItem(LEGACY_STORAGE_KEY, language);
    }

    emitLanguageChange();
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return currentLanguage;
}

function getServerSnapshot() {
    return DEFAULT_LANGUAGE;
}

export function useAppLanguage() {
    const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key !== STORAGE_KEY && event.key !== LEGACY_STORAGE_KEY) {
                return;
            }

            const next = normalizeLang(event.newValue);
            if (!next || next === currentLanguage) {
                return;
            }

            currentLanguage = next;
            emitLanguageChange();
        };

        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    return { language, setLanguage: setGlobalLanguage, isRTL: language === 'ar' };
}

export const useDashboardLanguage = useAppLanguage;
export type DashboardLanguage = AppLanguage;
