"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { PINNED_REPOS, EXCLUDED_REPOS, gridProjects } from "@/content/projects";
import { useLang } from "@/lib/i18n";

interface Repo {
  id: number | string;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork?: boolean;
  archived?: boolean;
}

const LANG_COLOR: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  "C#": "#178600",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
};

function prettyName(name: string): string {
  return name.replace(/^-+/, "");
}

export function GithubProjects() {
  const { t } = useLang();
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.github.com/users/FinnKrause/repos?per_page=100&sort=pushed")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Repo[]) => {
        if (cancelled) return;
        const filtered = data.filter(
          (r) => !r.fork && !r.archived && !EXCLUDED_REPOS.includes(r.name),
        );
        const rank = (r: Repo) => {
          const i = PINNED_REPOS.indexOf(r.name);
          return i === -1 ? 999 : i;
        };
        filtered.sort(
          (a, b) =>
            rank(a) - rank(b) ||
            new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
        );
        setRepos(filtered.slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Static fallback if the GitHub API is unavailable / rate-limited. Built only
  // when it is actually needed — the happy path never touches it.
  const list: Repo[] | null = useMemo(() => {
    if (!failed) return repos;
    return gridProjects.map((p) => ({
      id: p.slug,
      name: p.title,
      description: t(p.tagline),
      html_url: p.repo ?? "https://github.com/FinnKrause",
      language: p.tech[0] ?? null,
      stargazers_count: 0,
      pushed_at: "",
    }));
  }, [failed, repos, t]);

  if (!list) {
    // Loading skeletons — same footprint as a real tile, so nothing reflows.
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-fog" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((repo) => (
        <a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="card group flex flex-col p-4 transition-shadow hover:shadow-float"
        >
          <div className="flex items-center justify-between gap-3">
            {repo.language ? (
              <span className="inline-flex items-center gap-2 text-fine text-graphite">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: LANG_COLOR[repo.language] ?? "#636363" }}
                />
                {repo.language}
              </span>
            ) : (
              <span />
            )}
            <span className="flex items-center gap-3 text-fine text-graphite">
              {repo.stargazers_count > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {repo.stargazers_count}
                </span>
              )}
              <ArrowUpRight className="h-4 w-4 text-steel transition-colors group-hover:text-primary" />
            </span>
          </div>
          <h4 className="mt-3 text-body font-medium">{prettyName(repo.name)}</h4>
          {repo.description ? (
            <p className="mt-1.5 line-clamp-2 text-caption text-graphite">{repo.description}</p>
          ) : null}
        </a>
      ))}
    </div>
  );
}
