import MainLayout from "../layout/MainLayout";
import UploadCard from "../components/UploadCard";

export default function Upload() {
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">
        Upload Document
      </h1>

      <UploadCard />
    </MainLayout>
  );
}