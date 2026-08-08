import MainLayout from "../layout/MainLayout";
import DocumentHistory from "../components/DocumentHistory";

export default function Documents() {
  return (
    <MainLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-white  dark:bg-gray-800 rounded-xl shadow p-6">
          <h1  className="text-gray-900 dark:text-white">
            📁 Documents
          </h1>

          <p className="text-gray-600 mt-2">
            Manage your uploaded documents.
          </p>
        </div>

        {/* Documents */}
        <div className="bg-white  dark:bg-gray-800 rounded-xl shadow p-6">
          <DocumentHistory />
        </div>

      </div>
    </MainLayout>
  );
}