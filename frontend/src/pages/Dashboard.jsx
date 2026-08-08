/*import Navbar from "../components/Navbar";
import UploadCard from "../components/UploadCard";
import DocumentList from "../components/DocumentList";
import DocumentHistory from "../components/DocumentHistory";
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100">

      <Navbar />

      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl font-bold">
          Intelligent Document Platform
        </h1>

        <p className="text-gray-500 mt-2">
          Upload, organize and chat with your documents.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

          <div className="lg:col-span-1">
            <UploadCard />
            <DocumentHistory />
          </div>

          <div className="lg:col-span-2">
            <DocumentList />
          </div>

        </div>

      </div>

    </div>
  );
}*/
import MainLayout from "../layout/MainLayout";
import DashboardStats from "../components/DashboardStats";
import DocumentHistory from "../components/DocumentHistory";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8">

       
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-300">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            👋 Welcome to Intelligent Document Platform
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Upload, summarize and chat with your documents using AI.
          </p>
        </div>

        <DashboardStats />

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Recent Uploads
          </h2>

          <DocumentHistory limit={5} />
        </div>

      </div>
    </MainLayout>
  );
}