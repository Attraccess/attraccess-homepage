import credits from '../../demo/images/credits.json';
import { useSite } from '../lib/site';

export function CreditsPage() {
  const { copy, locale } = useSite();
  const [open, close] = locale === 'de' ? ['„', '“'] : ['“', '”'];
  const c = copy.credits;
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-36">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">{c.eyebrow}</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">{c.title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">{c.lead}</p>
      <div className="mt-10 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-surface-secondary text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">{c.photo}</th>
              <th className="px-4 py-3 font-medium">{c.creator}</th>
              <th className="px-4 py-3 font-medium">{c.license}</th>
              <th className="px-4 py-3 font-medium">{c.source}</th>
            </tr>
          </thead>
          <tbody>
            {credits.map((credit) => (
              <tr key={credit.file} className="border-t border-border">
                <td className="px-4 py-3">
                  {open}
                  {credit.title}
                  {close}
                </td>
                <td className="px-4 py-3">{credit.creator}</td>
                <td className="px-4 py-3">
                  <a href={credit.licenseUrl} className="text-accent hover:underline" rel="license">
                    {credit.license}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <a href={credit.source} className="text-accent hover:underline">
                    Flickr
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mt-14 text-2xl font-bold">{c.othersTitle}</h2>
      <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
        {c.others.map((item) => (
          <li key={item.name} className="flex flex-wrap justify-between gap-2 px-4 py-3 text-sm">
            <span>{item.name}</span>
            <span className="text-muted">{item.license}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
