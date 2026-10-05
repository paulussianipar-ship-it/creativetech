import { useState } from 'react';
import {
  Users, FileText, Image, Settings, Trash2, Edit3, Plus,
  Save, X, Check, AlertCircle, Eye, EyeOff, Shield, Star
} from 'lucide-react';

/* ─── INITIAL DATA ─────────────────────────────────────────── */
const INITIAL_USERS = [
  { id: 1, name: 'Admin Master', email: 'admin@creativestech.com', role: 'admin', status: 'active', joined: '2024-01-15' },
  { id: 2, name: 'Jane Designer', email: 'designer@creativestech.com', role: 'designer', status: 'active', joined: '2024-02-20' },
  { id: 3, name: 'John User', email: 'user@creativestech.com', role: 'user', status: 'active', joined: '2024-03-10' },
];

const INITIAL_PROJECTS = [
  { id: 1, title: 'Creative Design', slug: 'creative-design', category: 'Design', status: 'published', description: 'Layanan desain kreatif profesional untuk brand Anda.', updatedAt: '2024-10-01' },
  { id: 2, title: 'Multimedia', slug: 'multimedia', category: 'Media', status: 'published', description: 'Produksi multimedia berkualitas tinggi.', updatedAt: '2024-10-01' },
  { id: 3, title: 'IT Solution', slug: 'it-solution', category: 'IT', status: 'published', description: 'Solusi IT terpadu untuk bisnis Anda.', updatedAt: '2024-10-01' },
  { id: 4, title: 'Web Development', slug: 'web-development', category: 'Dev', status: 'published', description: 'Pengembangan web modern dan responsif.', updatedAt: '2024-10-01' },
  { id: 5, title: 'CCTV Specialist', slug: 'cctv-specialist', category: 'Security', status: 'published', description: 'Pemasangan & pemeliharaan sistem CCTV.', updatedAt: '2024-10-01' },
];

const INITIAL_CONTENT = {
  home: {
    heroTitle: 'Solusi Kreatif & Teknologi Terbaik',
    heroSubtitle: 'Kami menghadirkan desain branding, multimedia, IT, dan web development untuk kebutuhan bisnis Anda.',
    heroButton: 'Lihat Layanan Kami',
    aboutTeaser: 'Paul Design & IT Solution adalah studio kreatif yang berfokus pada desain dan teknologi.',
  },
  about: {
    title: 'Tentang Kami',
    description: 'Kami adalah tim profesional yang berdedikasi menghadirkan solusi kreatif dan teknologi terbaik.',
    vision: 'Menjadi mitra terpercaya dalam transformasi digital dan kreativitas bisnis.',
    mission: 'Menghadirkan solusi inovatif dengan kualitas terbaik dan pelayanan prima.',
  },
  contact: {
    email: 'info@creativestech.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Contoh No. 123, Jakarta, Indonesia',
    whatsapp: '+62 812-3456-7890',
  },
};

/* ─── HELPERS ────────────────────────────────────────────────── */
const ROLE_BADGE = {
  admin: 'bg-purple-100 text-purple-700',
  designer: 'bg-blue-100 text-blue-700',
  user: 'bg-gray-100 text-gray-600',
};

const STATUS_BADGE = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
};

function Toast({ msg, type, onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 80, right: 24, zIndex: 9999,
      background: type === 'success' ? '#16a34a' : '#dc2626',
      color: '#fff', borderRadius: 10, padding: '12px 20px',
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)', animation: 'slideIn 0.3s ease',
      maxWidth: 320,
    }}>
      {type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
      <span style={{ fontSize: 14 }}>{msg}</span>
      <button onClick={onClose} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={16} /></button>
    </div>
  );
}

/* ─── MODAL ──────────────────────────────────────────────────── */
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 520,
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 18, color: '#111' }}>{title}</h3>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
            <X size={18} color="#6b7280" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── FORM FIELD ─────────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb',
  fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#f9fafb',
  transition: 'border 0.2s',
};

const selectStyle = { ...inputStyle, cursor: 'pointer' };
const textareaStyle = { ...inputStyle, resize: 'vertical', minHeight: 80 };

/* ─── USERS TAB ──────────────────────────────────────────────── */
function UsersTab({ toast }) {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [modal, setModal] = useState(null); // null | 'add' | {user}
  const [form, setForm] = useState({ name: '', email: '', role: 'user', status: 'active' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const openAdd = () => { setForm({ name: '', email: '', role: 'user', status: 'active' }); setModal('add'); };
  const openEdit = (u) => { setForm({ ...u }); setModal(u); };

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) { toast('Nama dan email wajib diisi.', 'error'); return; }
    if (modal === 'add') {
      setUsers(prev => [...prev, { ...form, id: Date.now(), joined: new Date().toISOString().slice(0, 10) }]);
      toast('Pengguna berhasil ditambahkan!', 'success');
    } else {
      setUsers(prev => prev.map(u => u.id === form.id ? { ...form } : u));
      toast('Data pengguna diperbarui!', 'success');
    }
    setModal(null);
  };

  const confirmDelete = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setDeleteConfirm(null);
    toast('Pengguna dihapus.', 'success');
  };

  return (
    <div>
      {modal && (
        <Modal title={modal === 'add' ? 'Tambah Pengguna' : 'Edit Pengguna'} onClose={() => setModal(null)}>
          <Field label="Nama Lengkap">
            <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
          </Field>
          <Field label="Email">
            <input style={inputStyle} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
          </Field>
          <Field label="Role">
            <select style={selectStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="user">User</option>
              <option value="designer">Designer</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
          <Field label="Status">
            <select style={selectStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={save} style={{ flex: 1, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Save size={16} /> Simpan
            </button>
            <button onClick={() => setModal(null)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, cursor: 'pointer' }}>
              Batal
            </button>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal title="Hapus Pengguna?" onClose={() => setDeleteConfirm(null)}>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
            Apakah Anda yakin ingin menghapus <strong>{deleteConfirm.name}</strong>? Tindakan ini tidak bisa dibatalkan.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => confirmDelete(deleteConfirm.id)} style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, cursor: 'pointer' }}>
              Ya, Hapus
            </button>
            <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, cursor: 'pointer' }}>
              Batal
            </button>
          </div>
        </Modal>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: '#111', margin: 0 }}>Manajemen Pengguna</h3>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>{users.length} pengguna terdaftar</p>
        </div>
        <button onClick={openAdd} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
          <Plus size={16} /> Tambah Pengguna
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                {['Nama', 'Email', 'Role', 'Status', 'Bergabung', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                        {u.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#6b7280' }}>{u.email}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600 }} className={ROLE_BADGE[u.role] || ROLE_BADGE.user}>
                      {u.role === 'admin' && <Shield size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: u.status === 'active' ? '#dcfce7' : '#fef9c3', color: u.status === 'active' ? '#15803d' : '#a16207' }}>
                      {u.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#9ca3af' }}>{u.joined}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(u)} title="Edit" style={{ background: '#eff6ff', border: 'none', borderRadius: 7, padding: '6px 8px', cursor: 'pointer', color: '#2563eb', transition: 'background 0.15s' }}>
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => setDeleteConfirm(u)} title="Hapus" style={{ background: '#fef2f2', border: 'none', borderRadius: 7, padding: '6px 8px', cursor: 'pointer', color: '#ef4444', transition: 'background 0.15s' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── PROJECTS TAB ───────────────────────────────────────────── */
function ProjectsTab({ toast }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', category: 'Design', status: 'draft', description: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const openAdd = () => { setForm({ title: '', slug: '', category: 'Design', status: 'draft', description: '' }); setModal('add'); };
  const openEdit = (p) => { setForm({ ...p }); setModal(p); };

  const save = () => {
    if (!form.title.trim()) { toast('Judul wajib diisi.', 'error'); return; }
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (modal === 'add') {
      setProjects(prev => [...prev, { ...form, slug, id: Date.now(), updatedAt: new Date().toISOString().slice(0, 10) }]);
      toast('Project berhasil ditambahkan!', 'success');
    } else {
      setProjects(prev => prev.map(p => p.id === form.id ? { ...form, slug, updatedAt: new Date().toISOString().slice(0, 10) } : p));
      toast('Project diperbarui!', 'success');
    }
    setModal(null);
  };

  const confirmDelete = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
    toast('Project dihapus.', 'success');
  };

  const toggleStatus = (id) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p));
    toast('Status project diperbarui!', 'success');
  };

  return (
    <div>
      {modal && (
        <Modal title={modal === 'add' ? 'Tambah Project' : 'Edit Project'} onClose={() => setModal(null)}>
          <Field label="Judul Project">
            <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Nama project..." />
          </Field>
          <Field label="Slug URL">
            <input style={inputStyle} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generate dari judul" />
          </Field>
          <Field label="Kategori">
            <select style={selectStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {['Design', 'Media', 'IT', 'Dev', 'Security', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select style={selectStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </Field>
          <Field label="Deskripsi">
            <textarea style={textareaStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi singkat project..." />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={save} style={{ flex: 1, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Save size={16} /> Simpan
            </button>
            <button onClick={() => setModal(null)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, cursor: 'pointer' }}>
              Batal
            </button>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal title="Hapus Project?" onClose={() => setDeleteConfirm(null)}>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>Hapus project <strong>{deleteConfirm.title}</strong>? Tindakan ini tidak bisa dibatalkan.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => confirmDelete(deleteConfirm.id)} style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, cursor: 'pointer' }}>Ya, Hapus</button>
            <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, cursor: 'pointer' }}>Batal</button>
          </div>
        </Modal>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: '#111', margin: 0 }}>Manajemen Project</h3>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>{projects.length} project terdaftar</p>
        </div>
        <button onClick={openAdd} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
          <Plus size={16} /> Tambah Project
        </button>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {projects.map(p => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Image size={20} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{p.title}</span>
                <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600 }} className={STATUS_BADGE[p.status] || STATUS_BADGE.draft}>
                  {p.status}
                </span>
                <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: '#f0fdf4', color: '#16a34a' }}>{p.category}</span>
              </div>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '3px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description}</p>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '3px 0 0' }}>Diperbarui: {p.updatedAt} · /project/{p.slug}</p>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={() => toggleStatus(p.id)} title={p.status === 'published' ? 'Sembunyikan' : 'Publish'} style={{ background: p.status === 'published' ? '#fef3c7' : '#dcfce7', border: 'none', borderRadius: 7, padding: '7px 9px', cursor: 'pointer', color: p.status === 'published' ? '#d97706' : '#16a34a' }}>
                {p.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <button onClick={() => openEdit(p)} title="Edit" style={{ background: '#eff6ff', border: 'none', borderRadius: 7, padding: '7px 9px', cursor: 'pointer', color: '#2563eb' }}>
                <Edit3 size={15} />
              </button>
              <button onClick={() => setDeleteConfirm(p)} title="Hapus" style={{ background: '#fef2f2', border: 'none', borderRadius: 7, padding: '7px 9px', cursor: 'pointer', color: '#ef4444' }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CONTENT TAB ────────────────────────────────────────────── */
function ContentTab({ toast }) {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [activeSection, setActiveSection] = useState('home');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});

  const sections = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'about', label: 'About', icon: '📋' },
    { key: 'contact', label: 'Contact', icon: '📞' },
  ];

  const startEdit = () => { setDraft({ ...content[activeSection] }); setEditing(true); };
  const cancelEdit = () => { setEditing(false); setDraft({}); };
  const saveEdit = () => {
    setContent(prev => ({ ...prev, [activeSection]: { ...draft } }));
    setEditing(false);
    setDraft({});
    toast('Konten berhasil diperbarui!', 'success');
  };

  const cur = editing ? draft : content[activeSection];
  const updateDraft = (k, v) => setDraft(prev => ({ ...prev, [k]: v }));

  const LABELS = {
    home: { heroTitle: 'Judul Hero', heroSubtitle: 'Subtitle Hero', heroButton: 'Teks Tombol', aboutTeaser: 'Teaser About' },
    about: { title: 'Judul', description: 'Deskripsi', vision: 'Visi', mission: 'Misi' },
    contact: { email: 'Email', phone: 'Telepon', address: 'Alamat', whatsapp: 'WhatsApp' },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: '#111', margin: 0 }}>CMS — Konten Website</h3>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>Edit teks dan informasi halaman website</p>
        </div>
        {!editing ? (
          <button onClick={startEdit} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
            <Edit3 size={16} /> Edit Konten
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={saveEdit} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
              <Save size={16} /> Simpan
            </button>
            <button onClick={cancelEdit} style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, padding: '9px 16px', fontWeight: 600, cursor: 'pointer' }}>
              Batal
            </button>
          </div>
        )}
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {sections.map(s => (
          <button key={s.key} onClick={() => { setActiveSection(s.key); cancelEdit(); }}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: activeSection === s.key ? 'var(--primary)' : '#f3f4f6',
              color: activeSection === s.key ? '#fff' : '#374151',
              transition: 'all 0.2s',
            }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        {Object.entries(cur || {}).map(([key, value]) => (
          <div key={key} style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              {LABELS[activeSection]?.[key] || key}
            </label>
            {editing ? (
              value.length > 80 || key.includes('description') || key.includes('vision') || key.includes('mission') || key.includes('address') ? (
                <textarea style={textareaStyle} value={draft[key] || ''} onChange={e => updateDraft(key, e.target.value)} />
              ) : (
                <input style={inputStyle} value={draft[key] || ''} onChange={e => updateDraft(key, e.target.value)} />
              )
            ) : (
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#374151', border: '1px solid #e5e7eb', lineHeight: 1.6 }}>
                {value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── STATS OVERVIEW ─────────────────────────────────────────── */
function StatsCard({ label, value, icon, color }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#111' }}>{value}</div>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

/* ─── MAIN ADMIN PANEL ───────────────────────────────────────── */
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <Star size={16} /> },
    { key: 'users', label: 'Pengguna', icon: <Users size={16} /> },
    { key: 'projects', label: 'Projects', icon: <Image size={16} /> },
    { key: 'content', label: 'Konten Web', icon: <FileText size={16} /> },
    { key: 'settings', label: 'Pengaturan', icon: <Settings size={16} /> },
  ];

  return (
    <div style={{ fontFamily: 'inherit' }}>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:none; } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      {toastMsg && <Toast msg={toastMsg.msg} type={toastMsg.type} onClose={() => setToastMsg(null)} />}

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid #e5e7eb', paddingBottom: 0, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px',
              border: 'none', borderBottom: activeTab === t.key ? '2.5px solid var(--primary)' : '2.5px solid transparent',
              background: 'none', color: activeTab === t.key ? 'var(--primary)' : '#6b7280',
              fontWeight: activeTab === t.key ? 700 : 500, cursor: 'pointer', fontSize: 14,
              whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: '#111', marginBottom: 16 }}>Ringkasan Admin</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
            <StatsCard label="Total Pengguna" value="3" icon={<Users size={22} color="#fff" />} color="linear-gradient(135deg,#6366f1,#8b5cf6)" />
            <StatsCard label="Total Project" value="5" icon={<Image size={22} color="#fff" />} color="linear-gradient(135deg,#0ea5e9,#6366f1)" />
            <StatsCard label="Halaman Web" value="4" icon={<FileText size={22} color="#fff" />} color="linear-gradient(135deg,#f59e0b,#ef4444)" />
            <StatsCard label="Role Aktif" value="3" icon={<Shield size={22} color="#fff" />} color="linear-gradient(135deg,#10b981,#0ea5e9)" />
          </div>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h4 style={{ fontWeight: 700, color: '#111', marginBottom: 12 }}>⚡ Quick Actions</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
              {[
                { label: '+ Tambah Pengguna', tab: 'users', color: '#eff6ff', tc: '#2563eb' },
                { label: '+ Tambah Project', tab: 'projects', color: '#f0fdf4', tc: '#16a34a' },
                { label: '✏️ Edit Konten Home', tab: 'content', color: '#fff7ed', tc: '#ea580c' },
                { label: '⚙️ Pengaturan Sistem', tab: 'settings', color: '#f5f3ff', tc: '#7c3aed' },
              ].map(q => (
                <button key={q.tab} onClick={() => setActiveTab(q.tab)}
                  style={{ background: q.color, color: q.tc, border: `1px solid ${q.tc}30`, borderRadius: 10, padding: '12px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 14, textAlign: 'left', transition: 'opacity 0.2s' }}>
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && <UsersTab toast={showToast} />}
      {activeTab === 'projects' && <ProjectsTab toast={showToast} />}
      {activeTab === 'content' && <ContentTab toast={showToast} />}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: '#111', marginBottom: 16 }}>Pengaturan Sistem</h3>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', maxWidth: 520 }}>
            <Field label="Nama Website">
              <input style={inputStyle} defaultValue="Paul Design & IT Solution" />
            </Field>
            <Field label="Email Kontak Utama">
              <input style={inputStyle} type="email" defaultValue="info@creativestech.com" />
            </Field>
            <Field label="Bahasa Default">
              <select style={selectStyle}>
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </Field>
            <Field label="Mode Maintenance">
              <select style={selectStyle}>
                <option value="off">Nonaktif</option>
                <option value="on">Aktif (Website dalam perbaikan)</option>
              </select>
            </Field>
            <button onClick={() => showToast('Pengaturan berhasil disimpan!', 'success')}
              style={{ marginTop: 8, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Save size={16} /> Simpan Pengaturan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
