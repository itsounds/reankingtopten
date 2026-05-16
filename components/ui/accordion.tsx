"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type AccordionItem = {
  question: string;
  answer: string;
};

type AccordionProps = {
  items: AccordionItem[];
};

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className="rounded-[28px] border border-[#DADCE0] bg-white p-2 shadow-[0_18px_40px_rgba(32,33,36,0.06)]"
          >
            <button
              className="flex w-full items-center justify-between gap-4 rounded-[22px] px-5 py-4 text-left text-[#202124]"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span className="text-base font-medium md:text-lg">{item.question}</span>
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F8F9FA] text-[#1A73E8] transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
              >
                <ChevronDown className="size-5" />
              </span>
            </button>

            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-60",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-7 text-[#5F6368] md:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
