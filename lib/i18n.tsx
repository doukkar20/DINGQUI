"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  type AnchorHTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import arMA from "@/messages/ar-MA.json";
import { cn } from "@/lib/utils";

export const languages = ["en", "fr", "ar-MA"] as const;
export type Language = (typeof languages)[number];
export const defaultLanguage: Language = "ar-MA";

type Messages = typeof en;
type MessageKey = keyof Messages;

const dictionaries: Record<Language, Messages> = {
  en,
  fr,
  "ar-MA": arMA,
};

const languageLabels: Record<Language, string> = {
  en: "English",
  fr: "Français",
  "ar-MA": "العربية",
};

type I18nContextValue = {
  language: Language;
  direction: "ltr" | "rtl";
  setLanguage: (language: Language) => void;
  t: (key: MessageKey, values?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);
const darijaCountLabels: Partial<Record<MessageKey, [string, string]>> = {
  "home.productsCount": ["منتج", "منتجات"],
  "search.productsShown": ["منتج معروض", "منتجات معروضة"],
  "product.specRows": ["صف من المواصفات", "صفوف من المواصفات"],
};

function isLanguage(value: string | null): value is Language {
  return Boolean(value && languages.includes(value as Language));
}

function interpolate(message: string, values?: Record<string, string | number>): string {
  if (!values) {
    return message;
  }

  return Object.entries(values).reduce(
    (current, [key, value]) => current.replaceAll(`{${key}}`, String(value)),
    message,
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchLanguage = searchParams.get("lang");
  const initialLanguage = isLanguage(searchLanguage) ? searchLanguage : defaultLanguage;
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const direction = language === "ar-MA" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.body.dataset.language = language;
    window.localStorage.setItem("atlas-language", language);
  }, [direction, language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);

    const params = new URLSearchParams(window.location.search);
    if (nextLanguage === defaultLanguage) {
      params.delete("lang");
    } else {
      params.set("lang", nextLanguage);
    }

    const query = params.toString();
    window.history.replaceState(null, "", `${pathname}${query ? `?${query}` : ""}`);
  }, [pathname]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      direction,
      setLanguage,
      t: (key, values) => {
        const count = values?.count;
        const darijaCountLabel = language === "ar-MA" ? darijaCountLabels[key] : null;

        if (darijaCountLabel && typeof count === "number") {
          return `${count} ${count === 1 ? darijaCountLabel[0] : darijaCountLabel[1]}`;
        }

        return interpolate(dictionaries[language][key] || dictionaries.en[key], values);
      },
    }),
    [direction, language, setLanguage],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}

export function T({
  k,
  values,
  className,
}: {
  k: MessageKey;
  values?: Record<string, string | number>;
  className?: string;
}) {
  const { t } = useI18n();
  return <span className={className}>{t(k, values)}</span>;
}

export function useLocalizedHref() {
  const { language } = useI18n();

  return (href: string) => {
    if (language === defaultLanguage || href.startsWith("http") || href.startsWith("#")) {
      return href;
    }

    const [path, query = ""] = href.split("?");
    const params = new URLSearchParams(query);
    params.set("lang", language);
    return `${path}?${params.toString()}`;
  };
}

export function LocalizedLink({
  href,
  children,
  className,
  onClick,
  ariaLabel,
  ...props
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className" | "onClick" | "aria-label">) {
  const localizedHref = useLocalizedHref();

  return (
    <Link href={localizedHref(href)} className={className} onClick={onClick} aria-label={ariaLabel} {...props}>
      {children}
    </Link>
  );
}

export function LanguageSwitcher({ compact = false, onChange }: { compact?: boolean; onChange?: () => void }) {
  const { language, setLanguage, t } = useI18n();

  if (compact) {
    return (
      <div
        className="grid w-full gap-1 rounded-lg border border-gray-200 bg-white p-1"
        role="group"
        aria-label={t("language.label")}
      >
        {languages.map((item) => {
          const isActive = item === language;

          return (
            <button
              key={item}
              type="button"
              onClick={() => {
                setLanguage(item);
                onChange?.();
              }}
              className={cn(
                "rounded-md px-4 py-2.5 text-start text-sm font-semibold transition",
                isActive
                  ? "bg-orange text-white shadow-sm"
                  : "text-foreground hover:bg-orange/10 hover:text-orange",
              )}
              aria-pressed={isActive}
            >
              {languageLabels[item]}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      <span className="sr-only">{t("language.label")}</span>
      <select
        value={language}
        onChange={(event) => {
          setLanguage(event.target.value as Language);
          onChange?.();
        }}
        className="h-10 rounded-full border border-gray-200 bg-white px-3 text-sm font-semibold text-foreground outline-none transition focus:border-orange/60"
        aria-label={t("language.label")}
      >
        {languages.map((item) => (
          <option key={item} value={item}>
            {languageLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
