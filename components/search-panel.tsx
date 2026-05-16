"use client";

import { Search } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Business } from "@/lib/mock-data";

type SearchPanelProps = {
  businesses: Business[];
  compact?: boolean;
};

type SearchResponse = {
  found: boolean;
  redirectUrl?: string;
  message?: string;
};

type BusinessSuggestion = {
  entryId: number;
  rankingRunId: number;
  title: string;
  address: string | null;
  position: number;
  categoryName: string;
  city: string;
  redirectUrl: string;
};

type SuggestResponse = {
  suggestions: BusinessSuggestion[];
  message?: string;
};

export function SearchPanel({
  businesses,
  compact = false,
}: SearchPanelProps) {
  const [businessName, setBusinessName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<BusinessSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const businessOptions = useMemo(
    () => businesses.map((business) => business.name).sort((a, b) => a.localeCompare(b, "pl")),
    [businesses],
  );

  useEffect(() => {
    const normalized = businessName.trim();

    if (normalized.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      fetch(`/api/suggest-business.php?q=${encodeURIComponent(normalized)}`, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      })
        .then(async (response) => {
          const payload = (await response.json()) as SuggestResponse;

          if (!response.ok) {
            throw new Error(payload.message ?? "Nie udało się pobrać podpowiedzi.");
          }

          setSuggestions(payload.suggestions ?? []);
          setShowSuggestions(true);
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          setSuggestions([]);
        });
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [businessName]);

  const handleBusinessSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalized = businessName.trim();

    if (normalized.length < 2) {
      setErrorMessage("Wpisz nazwę lokalu.");
      return;
    }

    setIsSearching(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/search-business.php", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ businessName: normalized }),
      });

      const payload = (await response.json()) as SearchResponse;

      if (!response.ok) {
        throw new Error(payload.message ?? "Nie udało się sprawdzić lokalu.");
      }

      if (!payload.found || !payload.redirectUrl) {
        setErrorMessage(
          payload.message ?? "Niestety lokal nie znajduje się w rankingu top 10 w swojej kategorii",
        );
        setShowSuggestions(false);
        return;
      }

      window.location.href = payload.redirectUrl;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Nie udało się sprawdzić lokalu.");
    } finally {
      setIsSearching(false);
    }
  };

  const inputClasses =
    "h-14 w-full rounded-full border border-[#DADCE0] bg-white px-5 text-base text-[#202124] shadow-sm outline-none transition-all placeholder:text-[#5F6368] focus:border-[#1A73E8] focus:ring-4 focus:ring-[#1A73E8]/10";

  return (
    <div
      className={`relative z-[1000] rounded-[32px] border border-[#DADCE0] bg-white p-4 shadow-[0_24px_60px_rgba(32,33,36,0.08)] ${compact ? "" : "md:p-5"}`}
    >
      <form className={`grid gap-3 ${compact ? "" : "md:grid-cols-[1fr_auto]"}`} onSubmit={handleBusinessSearch}>
        <label className="relative z-[1001]">
          <Search className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-[#5F6368]" />
          <input
            className={`${inputClasses} pl-12`}
            list="business-list"
            placeholder="Wpisz nazwę lokalu..."
            value={businessName}
            onBlur={() => window.setTimeout(() => setShowSuggestions(false), 120)}
            onChange={(event) => {
              setBusinessName(event.target.value);
              setErrorMessage("");
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          <datalist id="business-list">
            {businessOptions.map((business) => (
              <option key={business} value={business} />
            ))}
          </datalist>
          {showSuggestions && suggestions.length > 0 ? (
            <div className="absolute top-[calc(100%+10px)] right-0 left-0 z-[1002] overflow-hidden rounded-[24px] border border-[#DADCE0] bg-white shadow-[0_24px_60px_rgba(32,33,36,0.16)]">
              {suggestions.map((suggestion) => (
                <button
                  key={`${suggestion.rankingRunId}-${suggestion.entryId}`}
                  className="block w-full border-b border-[#F1F3F4] px-5 py-4 text-left transition last:border-b-0 hover:bg-[#F8F9FA]"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setBusinessName(suggestion.title);
                    setShowSuggestions(false);
                    window.location.href = suggestion.redirectUrl;
                  }}
                  type="button"
                >
                  <span className="block text-sm font-semibold text-[#202124]">{suggestion.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-[#5F6368]">
                    #{suggestion.position} w {suggestion.categoryName}, {suggestion.city}
                    {suggestion.address ? ` • ${suggestion.address}` : ""}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </label>
        <Button className="h-14" disabled={isSearching} type="submit">
          {isSearching ? "Sprawdzamy..." : "Sprawdź wynik"}
        </Button>
      </form>

      {errorMessage ? (
        <div className="mt-4 rounded-[24px] border border-[#FAD2CF] bg-[#FCE8E6] px-5 py-4 text-sm font-medium leading-6 text-[#A50E0E]">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
