import Navbar from "../components/Navbar";
import UploadCard from "../components/UploadCard";
import DocumentList from "../components/DocumentList";

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
          </div>

          <div className="lg:col-span-2">
            <DocumentList />
          </div>

        </div>

      </div>

    </div>
  );
}