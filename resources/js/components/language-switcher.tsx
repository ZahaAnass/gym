import { useAppLanguage } from '@/hooks/use-app-language';
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
    buttonClassName?: string;
    activeButtonClassName?: string;
    inactiveButtonClassName?: string;
};

export function LanguageSwitcher({
    className,
    buttonClassName,
    activeButtonClassName,
    inactiveButtonClassName,
}: Props) {
    const { language, setLanguage } = useAppLanguage();

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1',
                className,
            )}
            aria-label="Language switcher"
        >
            {(['en', 'fr', 'ar'] as const).map((lang) => (
                <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={cn(
                        'rounded-full px-2 py-0.5 text-[11px] font-bold transition-colors',
                        buttonClassName,
                        language === lang
                            ? cn('bg-primary text-primary-foreground', activeButtonClassName)
                            : cn('text-muted-foreground hover:text-foreground', inactiveButtonClassName),
                    )}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
