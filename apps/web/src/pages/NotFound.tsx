import { buttonVariants } from '@heroui/react';
import { ArrowLeft } from 'lucide-react';
import { pathFor } from '../lib/routes';
import { useSite } from '../lib/site';

export function NotFoundPage() {
  const { copy, locale } = useSite();
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-6 pt-28 text-center">
      <img src="/brand/mascot.webp" alt="" aria-hidden className="w-28 -rotate-6" />
      <p className="mt-8 font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{copy.notFound.title}</h1>
      <p className="mt-4 text-lg text-muted">{copy.notFound.lead}</p>
      <a href={pathFor('home', locale)} className={`${buttonVariants({ variant: 'primary', size: 'lg' })} mt-8`}>
        <ArrowLeft className="size-4" aria-hidden />
        {copy.notFound.back}
      </a>
    </div>
  );
}
