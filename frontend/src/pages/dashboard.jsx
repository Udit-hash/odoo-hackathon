

export const Dashboard = () => {
  return (
    <div className="h-screen w-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col justify-between">
        <div>
          <div className="p-4 text-xl font-bold">Company</div>
          <div className="px-4 mt-6 space-y-4">
            <div className="text-gray-800 font-semibold cursor-pointer">Projects</div>
            <div className="text-gray-600 cursor-pointer">My Tasks</div>
          </div>
        </div>
        <div className="p-4 flex items-center space-x-3 border-t">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div>
            <p className="text-sm font-semibold">Test User</p>
            <p className="text-xs text-gray-500">user@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="text-sm text-gray-500">Projects</div>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1 border rounded-md text-sm"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
              New Project
            </button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="p-6 grid grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border rounded-lg shadow p-4">
            <div className="text-sm text-green-600 font-semibold mb-2">
              Completed
            </div>
            <div className="h-32 bg-gray-200 flex items-center justify-center">
              Project Image
            </div>
            <div className="mt-3 text-gray-800 font-semibold">90 Sentences</div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border rounded-lg shadow p-4">
            <div className="text-sm text-red-600 font-semibold mb-2">
              In Progress
            </div>
            <div className="h-32 bg-gray-200 flex items-center justify-center">
              Project Image
            </div>
            <div className="mt-3 text-gray-800 font-semibold">50 Segments</div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border rounded-lg shadow p-4">
            <div className="text-sm text-yellow-600 font-semibold mb-2">
              Review
            </div>
            <div className="h-32 bg-gray-200 flex items-center justify-center">
              Project Image
            </div>
            <div className="mt-3 text-gray-800 font-semibold">42 Annotations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
