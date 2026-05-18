import DocumentCard from "./DocumentCard";
import { useApplication } from "../../../../context/ApplicationContext";

export default function DocumentSection() {
  const { applications } = useApplication();

  const documents = applications.flatMap((app) =>
    (app.documents || []).map((doc: any) => ({
      ...doc,
      company: app.company,
    })),
  );

  return (
    <div className="mt-8">
      <div className="mb-1 flex items-center gap-3">
        <h2 className="text-[18px] font-[600] text-black">작성 중인 서류</h2>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-2">
        {documents.map((item: any) => (
          <DocumentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
