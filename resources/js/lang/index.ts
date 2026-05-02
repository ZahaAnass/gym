import ar from '@/lang/ar';
import en from '@/lang/en';
import fr from '@/lang/fr';

export type AppLanguage = 'en' | 'fr' | 'ar';

export const dictionaries = { en, fr, ar } as const;

export function getDictionary(language: AppLanguage) {
    return dictionaries[language];
}

