import { useState } from 'react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');

  // MOCK DATA for Users
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'user@example.com', role: 'user' },
    { id: 2, name: 'Jane Smith', email: 'designer@example.com', role: 'designer' },
    { id: 3, name: 'Admin Master', email: 'admin@example.com', role: 'admin' },
  ]);

  // Handle User Edits
  const handleRoleChange = (id, newRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    alert(`Role berhasil diubah menjadi ${newRole}`);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-semibold ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Manajemen Pengguna
        </button>
        <button 
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 font-semibold ${activeTab === 'content' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          CMS (Konten Web)
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Daftar Pengguna</h3>
            <button className="bg-primary text-white font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90">
              + Tambah Pengguna
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-gray-700 font-semibold text-sm">Nama</th>
                  <th className="p-3 text-gray-700 font-semibold text-sm">Email</th>
                  <th className="p-3 text-gray-700 font-semibold text-sm">Role</th>
                  <th className="p-3 text-gray-700 font-semibold text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm text-gray-800 font-medium">{user.name}</td>
                    <td className="p-3 text-sm text-gray-600">{user.email}</td>
                    <td className="p-3">
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-gray-100 border-none text-xs font-semibold px-2 py-1 rounded-md outline-none cursor-pointer"
                      >
                        <option value="user">User</option>
                        <option value="designer">Designer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:text-blue-800 font-semibold mr-3 text-sm">Edit</button>
                      <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 font-semibold text-sm">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Manajemen Konten Website (CMS)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 bg-gray-50 hover:border-primary transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-800 group-hover:text-primary"><i className="fa-solid fa-home mr-2"></i>Halaman Home</h4>
                <button className="text-primary text-sm font-semibold">Edit Konten</button>
              </div>
              <p className="text-sm text-gray-500">Edit banner utama, teks layanan, dan bagian about teaser.</p>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50 hover:border-primary transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-800 group-hover:text-primary"><i className="fa-solid fa-address-card mr-2"></i>Halaman About</h4>
                <button className="text-primary text-sm font-semibold">Edit Konten</button>
              </div>
              <p className="text-sm text-gray-500">Edit profil, deskripsi visi misi, dan biodata.</p>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50 hover:border-primary transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-800 group-hover:text-primary"><i className="fa-solid fa-layer-group mr-2"></i>Halaman Project</h4>
                <button className="text-primary text-sm font-semibold">Edit Konten</button>
              </div>
              <p className="text-sm text-gray-500">Atur portofolio, kategori project, dan upload gambar karya.</p>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50 hover:border-primary transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-800 group-hover:text-primary"><i className="fa-solid fa-address-book mr-2"></i>Halaman Contact</h4>
                <button className="text-primary text-sm font-semibold">Edit Konten</button>
              </div>
              <p className="text-sm text-gray-500">Ubah alamat email, nomor telepon, dan link sosial media.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
