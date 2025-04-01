// src/app/admin/settings/page.tsx
export default function SettingsPage() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-medium mb-4">Site Settings</h2>
          
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="My Application"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Registration
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded">
                <option value="open">Open to Everyone</option>
                <option value="invite">Invite Only</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <button 
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Settings
            </button>
          </form>
        </div>
      </div>
    );
  }