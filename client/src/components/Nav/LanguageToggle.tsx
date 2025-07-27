import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import Cookies from 'js-cookie';
import { Button } from '~/components/ui';
import { useLocalize } from '~/hooks';
import store from '~/store';
import { Globe } from 'lucide-react';

// Compact language options (top most used languages + Persian as default)
const compactLanguageOptions = [
    { value: 'fa-IR', label: 'فارسی', flag: '🇮🇷' },
    { value: 'en-US', label: 'English', flag: '🇺🇸' },
    { value: 'ar-EG', label: 'العربية', flag: '🇪🇬' },
    { value: 'de-DE', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'es-ES', label: 'Español', flag: '🇪🇸' },
    { value: 'fr-FR', label: 'Français', flag: '🇫🇷' },
];

const LanguageToggle = ({ isCollapsed }: { isCollapsed?: boolean }) => {
    const localize = useLocalize();
    const [langcode, setLangcode] = useRecoilState(store.lang);

    const changeLang = useCallback(
        (value: string) => {
            let userLang = value;
            if (value === 'auto') {
                userLang = navigator.language || navigator.languages[0];
            }

            requestAnimationFrame(() => {
                document.documentElement.lang = userLang;
            });
            setLangcode(userLang);
            Cookies.set('lang', userLang, { expires: 365 });
        },
        [setLangcode],
    );

    const getCurrentLangIndex = () => {
        const currentIndex = compactLanguageOptions.findIndex(option => option.value === langcode);
        return currentIndex === -1 ? 0 : currentIndex; // Default to Persian if not found
    };

    const cycleLanguage = () => {
        const currentIndex = getCurrentLangIndex();
        const nextIndex = (currentIndex + 1) % compactLanguageOptions.length;
        changeLang(compactLanguageOptions[nextIndex].value);
    };

    const currentLang = compactLanguageOptions[getCurrentLangIndex()];

    if (isCollapsed) {
        return (
            <Button
                variant="ghost"
                size="icon"
                onClick={cycleLanguage}
                className="h-8 w-8 text-text-secondary hover:text-text-primary"
                title={localize('com_nav_language')}
            >
                <Globe className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            onClick={cycleLanguage}
            className="h-8 w-full justify-start px-3 text-text-secondary hover:text-text-primary"
            title={localize('com_nav_language')}
        >
            <span className="mr-2 text-sm">{currentLang.flag}</span>
            <span className="text-sm font-medium">{currentLang.label}</span>
        </Button>
    );
};

export default LanguageToggle; 