// types_alias.ts solution
type Status = 'draft' | 'published' | 'archived';

type Timestamped<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

type Article = Timestamped<{
  id: string;
  title: string;
  status: Status;
}>;

function publishArticle(article: Article): Article {
  return {
    ...article,
    status: 'published',
    updatedAt: new Date(),
  };
}

test("manipulates type aliases with union and intersection", () => {
  const initialTime = new Date("2026-01-01T00:00:00.000Z");
  const draft: Article = {
    id: "art-1",
    title: "Mastering TypeScript",
    status: "draft",
    createdAt: initialTime,
    updatedAt: initialTime,
  };

  const published = publishArticle(draft);
  expect(published.status).toBe("published");
  expect(published.id).toBe("art-1");
  expect(published.title).toBe("Mastering TypeScript");
  expect(published.updatedAt.getTime()).toBeGreaterThanOrEqual(initialTime.getTime());
});
