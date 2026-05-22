"use client";

import { Search } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BusinessSuggestion = {
  entryId: number;
  rankingRunId: number;
  title: string;
  address: string | null;
  position: number;
  categoryName: string;
  city: string;
};

type SelectedPlace = BusinessSuggestion;

type SuggestResponse = {
  suggestions: BusinessSuggestion[];
  message?: string;
};

type OrderResponse = {
  success?: boolean;
  message?: string;
  deliveryAddress?: string;
};

const STAND_COUNTS = Array.from({ length: 15 }, (_, index) => index + 1);

function OrderDisclaimer() {
  return (
    <p className="max-w-[650px] text-xs leading-6 text-[#5F6368]">
      Klikając „Zamów bezpłatne standy”, akceptujesz warunki współpracy. Standy NFC + QR są
      bezpłatne na stałe (maks. 15 standów na lokal). Lokale korzystające ze standów biorą udział
      w rankingu TOP10 swojej kategorii i miasta. Lokale zakwalifikowane do TOP10 otrzymują
      odpłatny cyfrowy zestaw TOP10 zgodnie z warunkami współpracy.{" "}
      <span className="font-bold text-[#202124]">
        Bez abonamentu, subskrypcji i podawania danych karty.
      </span>
    </p>
  );
}

export function B2bOrderSection() {
  const [businessName, setBusinessName] = useState("");
  const [suggestions, setSuggestions] = useState<BusinessSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null);
  const [contactName, setContactName] = useState("");
  const [standCount, setStandCount] = useState(7);
  const [validationMessage, setValidationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successAddress, setSuccessAddress] = useState("");

  const isFormReady =
    selectedPlace !== null && contactName.trim().length >= 2 && standCount >= 1 && standCount <= 15;

  useEffect(() => {
    const normalized = businessName.trim();

    if (normalized.length < 2) {
      setSuggestions([]);
      return;
    }

    if (selectedPlace && selectedPlace.title === normalized) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      fetch(`/api/suggest-business.php?q=${encodeURIComponent(normalized)}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
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
  }, [businessName, selectedPlace]);

  const selectPlace = (suggestion: BusinessSuggestion) => {
    setSelectedPlace(suggestion);
    setBusinessName(suggestion.title);
    setShowSuggestions(false);
    setValidationMessage("");
    setSuccessMessage("");
    setSuccessAddress("");
  };

  const handleBusinessInputChange = (value: string) => {
    setBusinessName(value);
    setValidationMessage("");

    if (selectedPlace && value.trim() !== selectedPlace.title) {
      setSelectedPlace(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormReady || !selectedPlace) {
      setValidationMessage("Wybierz lokal z listy, wpisz imię i nazwisko oraz ilość standów.");
      return;
    }

    setIsSubmitting(true);
    setValidationMessage("");

    try {
      const response = await fetch("/api/order-stands.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entryId: selectedPlace.entryId,
          rankingRunId: selectedPlace.rankingRunId,
          businessName: selectedPlace.title,
          address: selectedPlace.address,
          city: selectedPlace.city,
          categoryName: selectedPlace.categoryName,
          contactName: contactName.trim(),
          standCount,
          source: "b2b_landing",
        }),
      });

      const payload = (await response.json()) as OrderResponse;

      if (!response.ok || !payload.success) {
        throw new Error(payload.message ?? "Nie udało się zapisać zamówienia.");
      }

      setSuccessMessage("Dziękujemy. Zamówienie bezpłatnych standów zostało przyjęte.");
      setSuccessAddress(
        payload.deliveryAddress ??
          selectedPlace.address ??
          "adres wskazany dla wybranego lokalu",
      );
    } catch (error) {
      setValidationMessage(
        error instanceof Error ? error.message : "Nie udało się zapisać zamówienia.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "h-14 w-full rounded-full border border-[#DADCE0] bg-white px-5 text-base text-[#202124] shadow-sm outline-none transition-all placeholder:text-[#5F6368] focus:border-[#1A73E8] focus:ring-4 focus:ring-[#1A73E8]/10";

  const labelClasses = "mb-2 block text-sm font-medium text-[#202124]";

  return (
    <section
      id="odbierz-standy"
      className="mx-auto max-w-5xl scroll-mt-28 px-4 py-16 md:px-6 lg:px-8 lg:pb-32"
    >
      <div className="rounded-[42px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] px-6 py-12 shadow-[0_28px_80px_rgba(32,33,36,0.10)] md:px-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl leading-tight font-semibold tracking-[-0.04em] text-[#202124] md:text-5xl">
            Odbierz darmowe standy do opinii Google
          </h2>
          <p className="mt-5 text-base leading-8 text-[#5F6368] md:text-lg">
            Wyszukaj swój lokal i zamów bezpłatne standy NFC + QR.
          </p>
        </div>

        {successMessage ? (
          <div className="mx-auto mt-10 max-w-2xl rounded-[28px] border border-[#CEEAD6] bg-[#E6F4EA] px-6 py-6 text-center">
            <p className="text-base font-semibold text-[#137333]">{successMessage}</p>
            <p className="mt-3 text-sm leading-7 text-[#5F6368]">
              Standy zostaną dostarczone na adres:{" "}
              <span className="font-medium text-[#202124]">{successAddress}</span>.
            </p>
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="relative z-[1000] rounded-[32px] border border-[#DADCE0] bg-white p-4 shadow-[0_24px_60px_rgba(32,33,36,0.08)] md:p-5">
              <label className={labelClasses} htmlFor="b2b-business-search">
                Nazwa lokalu
              </label>
              <div className="relative z-[1001]">
                <Search className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-[#5F6368]" />
                <input
                  id="b2b-business-search"
                  className={`${inputClasses} pl-12`}
                  placeholder="Wpisz nazwę lokalu…"
                  value={businessName}
                  onBlur={() => window.setTimeout(() => setShowSuggestions(false), 120)}
                  onChange={(event) => handleBusinessInputChange(event.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                />
                {showSuggestions && suggestions.length > 0 ? (
                  <div className="absolute top-[calc(100%+10px)] right-0 left-0 z-[1002] overflow-hidden rounded-[24px] border border-[#DADCE0] bg-white shadow-[0_24px_60px_rgba(32,33,36,0.16)]">
                    {suggestions.map((suggestion) => (
                      <button
                        key={`${suggestion.rankingRunId}-${suggestion.entryId}`}
                        className="block w-full border-b border-[#F1F3F4] px-5 py-4 text-left transition last:border-b-0 hover:bg-[#F8F9FA]"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          selectPlace(suggestion);
                        }}
                        type="button"
                      >
                        <span className="block text-sm font-semibold text-[#202124]">
                          {suggestion.title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-[#5F6368]">
                          {suggestion.categoryName}, {suggestion.city}
                          {suggestion.address ? ` • ${suggestion.address}` : ""}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {selectedPlace ? (
              <p className="mt-6 rounded-[24px] border border-[#E8EAED] bg-white px-5 py-4 text-sm leading-7 text-[#5F6368]">
                Standy zostaną dostarczone bezpłatnie na adres:{" "}
                <span className="font-medium text-[#202124]">
                  {selectedPlace.address ?? "brak adresu w bazie — uzupełnimy przed wysyłką"}
                </span>
                .
              </p>
            ) : null}

            {selectedPlace ? (
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className={labelClasses} htmlFor="b2b-contact-name">
                    Imię i nazwisko
                  </label>
                  <input
                    id="b2b-contact-name"
                    className={inputClasses}
                    placeholder="Wpisz imię i nazwisko"
                    value={contactName}
                    onChange={(event) => {
                      setContactName(event.target.value);
                      setValidationMessage("");
                    }}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                  <div>
                    <label className={labelClasses} htmlFor="b2b-stand-count">
                      Ilość standów
                    </label>
                    <select
                      id="b2b-stand-count"
                      className={cn(inputClasses, "appearance-none pr-10")}
                      value={standCount}
                      onChange={(event) => {
                        setStandCount(Number(event.target.value));
                        setValidationMessage("");
                      }}
                    >
                      {STAND_COUNTS.map((count) => (
                        <option key={count} value={count}>
                          {count}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    className="h-14 w-full whitespace-nowrap md:w-auto md:min-w-[240px]"
                    disabled={isSubmitting || !isFormReady}
                    type="submit"
                  >
                    {isSubmitting ? "Zapisujemy..." : "Zamów bezpłatne standy"}
                  </Button>
                </div>

                {validationMessage ? (
                  <p className="text-sm leading-6 text-[#A50E0E]">{validationMessage}</p>
                ) : null}

                <OrderDisclaimer />
              </form>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
