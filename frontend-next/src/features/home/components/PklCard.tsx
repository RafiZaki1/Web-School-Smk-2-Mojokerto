"use client";

import { useState } from "react";
import { MapPin, Quote } from "lucide-react";
import Image from "next/image";
import type { PklStory } from "@/features/home/constants/pkl-stories";
import { useTranslation } from "@/shared/hooks/useTranslation";

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

function PklAvatar({ story }: { story: PklStory }) {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative mx-auto -mt-16 mb-3 flex flex-col items-center">
      <div className="relative h-28 w-28">
        <span
          aria-hidden="true"
          className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-primary via-brand to-sun opacity-90 shadow-md transition-transform duration-300 group-hover:scale-105"
        />
        <span aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-full bg-navy ring-4 ring-card">
          <span className="absolute -top-3 -right-3 h-14 w-14 rounded-full bg-sun/85" />
          <span className="absolute -bottom-3 -left-3 h-14 w-14 rounded-full bg-brand/75" />
          <span className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xl bg-navy-deep/40" />
        </span>

        <div className="relative h-full w-full overflow-hidden rounded-full ring-4 ring-card">
          {!failed ? (
            <Image
              src={story.foto.src}
              alt={t(story.foto.alt)}
              width={224}
              height={224}
              onError={() => setFailed(true)}
              className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              role="img"
              aria-label={t(story.foto.alt)}
              className="flex h-full w-full items-center justify-center font-heading text-2xl font-bold tracking-wider text-white drop-shadow-sm"
            >
              {getInitials(story.nama)}
            </div>
          )}
        </div>
      </div>

      <span className="relative z-10 -mt-3 rounded-full border border-card bg-sun px-3 py-0.5 text-xs font-bold tracking-wide text-sun-ink uppercase shadow-sm">
        {t(story.label)}
      </span>
    </div>
  );
}

export function PklCard({ story }: { story: PklStory }) {
  const { t } = useTranslation();

  return (
    <article className="group relative mt-14 flex h-[calc(100%-3.5rem)] flex-col rounded-2xl border-2 border-primary/25 bg-card px-5 pt-4 pb-6 text-center shadow-[0_8px_24px_-8px_rgba(12,74,104,0.1)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_18px_36px_-10px_rgba(10,106,151,0.2)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-1 rounded-b-full bg-gradient-to-r from-primary via-brand to-sun opacity-75 transition-opacity group-hover:opacity-100"
      />

      <PklAvatar story={story} />

      <h3 className="font-heading text-lg leading-snug font-bold text-heading sm:text-xl">{story.nama}</h3>

      <p className="mt-1 text-sm leading-relaxed font-semibold text-primary sm:text-[15px]">
        {t(story.jurusan)} - {story.perusahaan}
      </p>
      <p className="mt-1 inline-flex items-center justify-center gap-1 text-sm text-muted">
        <MapPin size={14} className="shrink-0 text-brand" aria-hidden="true" />
        <span>{story.lokasi}</span>
      </p>

      <blockquote className="mt-4 flex flex-1 items-start gap-2.5 rounded-xl bg-tint/50 p-4 text-left text-sm leading-relaxed text-body sm:text-base">
        <Quote
          size={20}
          className="mt-0.5 shrink-0 rotate-180 text-primary"
          fill="currentColor"
          strokeWidth={0}
          aria-hidden="true"
        />
        <p className="flex-1">{t(story.kutipan)}</p>
      </blockquote>
    </article>
  );
}

