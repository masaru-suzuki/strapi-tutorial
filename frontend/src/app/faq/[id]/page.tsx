import { getFaqById } from '@/data/loaders';

export default async function Page({ params }: { params: { id: string } }) {
  const data = await getFaqById(params.id);
  const { title, body } = data;

  return (
    <div className="">
      <h1>{title}</h1>
      {body.map((html: any) => {
        return (
          <div>
            <div
              dangerouslySetInnerHTML={{ __html: `${html.children[0].type}` }}
            ></div>
            <div
              dangerouslySetInnerHTML={{ __html: `${html.children[0].text}` }}
            ></div>
          </div>
        );
      })}
    </div>
  );
}
