import { access, readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { parse } from "yaml";

interface ArticleFrontmatter {
  draft?: boolean;
  image?: string;
  slug?: string;
  tags?: string[];
}

interface Article extends ArticleFrontmatter {
  file: string;
}

const projectRoot = process.cwd();
const contentRoot = join(projectRoot, "content", "blog");
const publicRoot = join(projectRoot, "public");
const errors: string[] = [];

async function listMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);

      return entry.isDirectory()
        ? listMarkdownFiles(path)
        : Promise.resolve(entry.name.endsWith(".md") ? [path] : []);
    }),
  );

  return nestedFiles.flat();
}

async function readArticle(file: string): Promise<Article | null> {
  const source = await readFile(file, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const displayPath = relative(projectRoot, file);

  if (!match?.[1]) {
    errors.push(`${displayPath}: missing YAML frontmatter`);
    return null;
  }

  try {
    return {
      ...(parse(match[1]) as ArticleFrontmatter),
      file: displayPath,
    };
  } catch (error) {
    errors.push(
      `${displayPath}: invalid YAML (${error instanceof Error ? error.message : String(error)})`,
    );
    return null;
  }
}

function checkUniqueSlugs(articles: Article[]) {
  const seen = new Map<string, string>();

  for (const article of articles) {
    const value = article.slug;

    if (typeof value !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      errors.push(
        `${article.file}: slug must use lowercase ASCII letters, numbers and hyphens`,
      );
      continue;
    }

    const previousFile = seen.get(value);

    if (previousFile) {
      errors.push(
        `${article.file}: duplicate slug "${value}" (already used by ${previousFile})`,
      );
    } else {
      seen.set(value, article.file);
    }
  }
}

async function checkImage(article: Article) {
  if (!article.image || /^(?:https?:)?\/\//.test(article.image)) {
    return;
  }

  if (!article.image.startsWith("/")) {
    errors.push(`${article.file}: image must be an absolute public path`);
    return;
  }

  const imageFile = resolve(publicRoot, `.${article.image}`);

  if (!imageFile.startsWith(`${publicRoot}/`)) {
    errors.push(`${article.file}: image path escapes the public directory`);
    return;
  }

  try {
    await access(imageFile);
  } catch {
    errors.push(`${article.file}: image does not exist at public${article.image}`);
  }
}

const files = await listMarkdownFiles(contentRoot);
const articles = (await Promise.all(files.map(readArticle))).filter(
  (article): article is Article => article !== null,
);

checkUniqueSlugs(articles);
await Promise.all(articles.map(checkImage));

for (const error of errors) {
  console.error(`ERROR ${error}`);
}

if (errors.length) {
  console.error(`Content check failed with ${errors.length} error(s).`);
  process.exitCode = 1;
} else {
  console.log(`Content check passed for ${articles.length} article(s).`);
}
