import { getSupabaseError, isSupabaseConfigured, STORAGE_BUCKET, supabase } from './supabase'
import {
  DEMO_AUDIT_LOGS,
  DEMO_CONTACT_MESSAGES,
  DEMO_CONTENT,
  DEMO_PROJECTS,
  DEMO_SETTINGS,
  DEMO_USERS,
} from './demo-data'

/**
 * Lapisan data untuk Admin Panel.
 *
 * - Jika Supabase ter-konfigurasi  -> query ke tabel sungguhan.
 * - Jika belum                    -> memakai store lokal (demo mode),
 *   sehingga seluruh UI tetap bisa dicoba tanpa kredensial.
 *
 * Semua fungsi mengembalikan bentuk yang sama:
 *   { data, count, error }
 */

const STORAGE_KEY = 'pdits.demo.store'

// Naikkan angka ini setiap kali data contoh (demo-data.js) berubah isinya,
// agar store demo lama di browser otomatis di-reset ke data terbaru.
const SEED_VERSION = 2

const clone = (value) => JSON.parse(JSON.stringify(value))

function createDemoStore() {
  const fallback = {
    seedVersion: SEED_VERSION,
    users: DEMO_USERS,
    projects: DEMO_PROJECTS,
    content: DEMO_CONTENT,
    settings: DEMO_SETTINGS,
    contactMessages: DEMO_CONTACT_MESSAGES,
    auditLogs: DEMO_AUDIT_LOGS,
  }

  function read() {
    if (typeof window === 'undefined') return clone(fallback)
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return clone(fallback)
      const parsed = JSON.parse(raw)
      if (parsed?.seedVersion !== SEED_VERSION) return clone(fallback)
      return { ...clone(fallback), ...parsed }
    } catch {
      return clone(fallback)
    }
  }

  function write(next) {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...next, seedVersion: SEED_VERSION }))
      // Beritahu halaman publik bahwa data sudah berubah
      window.dispatchEvent(new CustomEvent('pdits:store:updated', { detail: next }))
    } catch {
      /* storage penuh / diblokir — abaikan, demo tetap jalan di memori */
    }
  }

  return { read, write }
}

const store = createDemoStore()
let auditCounter = 1000

function nextId(prefix) {
  auditCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${auditCounter}`
}

const ok = (data, count) => ({ data, count: count ?? data?.length ?? 0, error: null })
const fail = (error) => ({ data: null, count: 0, error })

/** Catat aktivitas ke audit log (diam-diam, error diabaikan). */
export async function logActivity({ action, entity, entityId, description }) {
  if (!isSupabaseConfigured) {
    const state = store.read()
    state.auditLogs.unshift({
      id: nextId('a'),
      actor: 'Pengguna',
      action,
      entity,
      entity_id: entityId ?? null,
      description,
      created_at: new Date().toISOString(),
    })
    state.auditLogs = state.auditLogs.slice(0, 200)
    store.write(state)
    return
  }

  const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: null }))
  const actor = userData?.user?.email || 'Sistem'

  await supabase
    .from('audit_logs')
    .insert({ action, entity, entity_id: entityId ?? null, description, actor_email: actor })
    .select()
    .then(({ error }) => {
      if (error) console.warn('Gagal menulis audit log:', error.message)
    })
}

/* ────────────────────────────  USERS  ──────────────────────────── */

/**
 * Tabel publik `profiles` adalah sumber data pengguna.
 * ID merujuk ke auth.users.
 */
export async function fetchUsers({ search = '', role = 'all', status = 'all', page = 1, pageSize = 10 } = {}) {
  if (isSupabaseConfigured) {
    let query = supabase
      .from('profiles')
      .select('id, name, email, role, status, avatar_url, phone, created_at, updated_at', { count: 'exact' })

    if (search.trim()) {
      const term = `%${search.trim()}%`
      query = query.or(`name.ilike.${term},email.ilike.${term}`)
    }
    if (role !== 'all') query = query.eq('role', role)
    if (status !== 'all') query = query.eq('status', status)

    const from = (page - 1) * pageSize
    query = query.order('created_at', { ascending: false }).range(from, from + pageSize - 1)

    const { data, count, error } = await query
    if (error) return fail(getSupabaseError(error))
    return ok(data || [], count || 0)
  }

  const state = store.read()
  let rows = [...state.users]

  if (search.trim()) {
    const term = search.trim().toLowerCase()
    rows = rows.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term),
    )
  }
  if (role !== 'all') rows = rows.filter((u) => u.role === role)
  if (status !== 'all') rows = rows.filter((u) => u.status === status)

  rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const start = (page - 1) * pageSize
  return ok(rows.slice(start, start + pageSize), rows.length)
}

export async function createUserProfile(payload) {
  const record = {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    role: payload.role,
    status: payload.status,
    phone: payload.phone?.trim() || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('profiles').insert(record).select().single()
    if (error) return fail(getSupabaseError(error))
    await logActivity({
      action: 'create',
      entity: 'user',
      entityId: data.id,
      description: `Menambah pengguna "${data.name}"`,
    })
    return ok(data, 1)
  }

  const state = store.read()
  const duplicate = state.users.find((u) => u.email === record.email)
  if (duplicate) return fail('Email tersebut sudah digunakan.')

  const created = { ...record, id: nextId('u') }
  state.users.unshift(created)
  store.write(state)
  await logActivity({
    action: 'create',
    entity: 'user',
    entityId: created.id,
    description: `Menambah pengguna "${created.name}"`,
  })
  return ok(created, 1)
}

export async function updateUserProfile(id, payload) {
  const patch = {
    name: payload.name.trim(),
    role: payload.role,
    status: payload.status,
    phone: payload.phone?.trim() || null,
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('profiles').update(patch).eq('id', id).select().single()
    if (error) return fail(getSupabaseError(error))
    await logActivity({
      action: 'update',
      entity: 'user',
      entityId: id,
      description: `Memperbarui pengguna "${data.name}"`,
    })
    return ok(data, 1)
  }

  const state = store.read()
  const index = state.users.findIndex((u) => u.id === id)
  if (index === -1) return fail('Pengguna tidak ditemukan.')
  state.users[index] = { ...state.users[index], ...patch }
  store.write(state)
  await logActivity({
    action: 'update',
    entity: 'user',
    entityId: id,
    description: `Memperbarui pengguna "${state.users[index].name}"`,
  })
  return ok(state.users[index], 1)
}

export async function deleteUserProfile(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) return fail(getSupabaseError(error))
    await logActivity({ action: 'delete', entity: 'user', entityId: id, description: 'Menghapus pengguna' })
    return ok(null, 0)
  }

  const state = store.read()
  const target = state.users.find((u) => u.id === id)
  if (!target) return fail('Pengguna tidak ditemukan.')
  state.users = state.users.filter((u) => u.id !== id)
  store.write(state)
  await logActivity({
    action: 'delete',
    entity: 'user',
    entityId: id,
    description: `Menghapus pengguna "${target.name}"`,
  })
  return ok(null, 0)
}

/** Daftar ringkas pengguna untuk dropdown / audit. */
export async function fetchUserDirectory() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, role')
      .order('name')
    if (error) return fail(getSupabaseError(error))
    return ok(data || [], data?.length || 0)
  }
  const state = store.read()
  return ok(
    state.users.map(({ id, name, email, role }) => ({ id, name, email, role })),
    state.users.length,
  )
}

/* ───────────────────────────  PROJECTS  ─────────────────────────── */

const PROJECT_COLUMNS =
  'id, title, slug, category, status, description, content, image_url, images, client, featured, created_at, updated_at'

export async function fetchProjects({
  search = '',
  category = 'all',
  status = 'all',
  page = 1,
  pageSize = 10,
} = {}) {
  if (isSupabaseConfigured) {
    let query = supabase
      .from('projects')
      .select(PROJECT_COLUMNS, { count: 'exact' })

    if (search.trim()) {
      const term = `%${search.trim()}%`
      query = query.or(`title.ilike.${term},slug.ilike.${term},description.ilike.${term},client.ilike.${term}`)
    }
    if (category !== 'all') query = query.eq('category', category)
    if (status !== 'all') query = query.eq('status', status)

    const from = (page - 1) * pageSize
    query = query.order('updated_at', { ascending: false }).range(from, from + pageSize - 1)

    const { data, count, error } = await query
    if (error) return fail(getSupabaseError(error))
    return ok(data || [], count || 0)
  }

  const state = store.read()
  let rows = [...state.projects]

  if (search.trim()) {
    const term = search.trim().toLowerCase()
    rows = rows.filter((row) =>
      [row.title, row.slug, row.description, row.client]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term)),
    )
  }
  if (category !== 'all') rows = rows.filter((row) => row.category === category)
  if (status !== 'all') rows = rows.filter((row) => row.status === status)

  rows.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))

  const start = (page - 1) * pageSize
  return ok(rows.slice(start, start + pageSize), rows.length)
}

/** Ambil satu project berdasarkan slug (untuk halaman detail publik). */
export async function fetchProjectBySlug(slug) {
  if (!slug) return fail('Project tidak ditemukan.')

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('projects')
      .select(PROJECT_COLUMNS)
      .eq('slug', slug)
      .maybeSingle()
    if (error) return fail(getSupabaseError(error))
    if (!data) return fail('Project tidak ditemukan.')
    return ok(data, 1)
  }

  const state = store.read()
  const project = state.projects.find((row) => row.slug === slug)
  if (!project) return fail('Project tidak ditemukan.')
  return ok(clone(project), 1)
}

function normalizeProjectPayload(payload) {
  return {
    title: payload.title.trim(),
    slug: (payload.slug || '').trim(),
    category: payload.category,
    status: payload.status,
    description: payload.description?.trim() || '',
    content: payload.content || '',
    image_url: payload.image_url || null,
    images: payload.images || [],
    client: payload.client?.trim() || null,
    featured: Boolean(payload.featured),
    updated_at: new Date().toISOString(),
  }
}

export async function createProject(payload) {
  const record = {
    ...normalizeProjectPayload(payload),
    created_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('projects').insert(record).select().single()
    if (error) return fail(getSupabaseError(error))
    await logActivity({
      action: 'create',
      entity: 'project',
      entityId: data.id,
      description: `Menambah project "${data.title}"`,
    })
    return ok(data, 1)
  }

  const state = store.read()
  const duplicate = state.projects.find((p) => p.slug === record.slug)
  if (duplicate) return fail('Slug tersebut sudah dipakai project lain.')

  const created = { ...record, id: nextId('p') }
  state.projects.unshift(created)
  store.write(state)
  await logActivity({
    action: 'create',
    entity: 'project',
    entityId: created.id,
    description: `Menambah project "${created.title}"`,
  })
  return ok(created, 1)
}

export async function updateProject(id, payload) {
  const record = normalizeProjectPayload(payload)

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('projects').update(record).eq('id', id).select().single()
    if (error) return fail(getSupabaseError(error))
    await logActivity({
      action: 'update',
      entity: 'project',
      entityId: id,
      description: `Memperbarui project "${data.title}"`,
    })
    return ok(data, 1)
  }

  const state = store.read()
  const index = state.projects.findIndex((p) => p.id === id)
  if (index === -1) return fail('Project tidak ditemukan.')

  const clash = state.projects.find((p) => p.slug === record.slug && p.id !== id)
  if (clash) return fail('Slug tersebut sudah dipakai project lain.')

  state.projects[index] = { ...state.projects[index], ...record }
  store.write(state)
  await logActivity({
    action: 'update',
    entity: 'project',
    entityId: id,
    description: `Memperbarui project "${state.projects[index].title}"`,
  })
  return ok(state.projects[index], 1)
}

export async function deleteProject(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) return fail(getSupabaseError(error))
    await logActivity({ action: 'delete', entity: 'project', entityId: id, description: 'Menghapus project' })
    return ok(null, 0)
  }

  const state = store.read()
  const target = state.projects.find((p) => p.id === id)
  if (!target) return fail('Project tidak ditemukan.')
  state.projects = state.projects.filter((p) => p.id !== id)
  store.write(state)
  await logActivity({
    action: 'delete',
    entity: 'project',
    entityId: id,
    description: `Menghapus project "${target.title}"`,
  })
  return ok(null, 0)
}

export async function toggleProjectStatus(id, nextStatus) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('projects')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) return fail(getSupabaseError(error))
    return ok(data, 1)
  }

  const state = store.read()
  const index = state.projects.findIndex((p) => p.id === id)
  if (index === -1) return fail('Project tidak ditemukan.')
  state.projects[index] = {
    ...state.projects[index],
    status: nextStatus,
    updated_at: new Date().toISOString(),
  }
  store.write(state)
  return ok(state.projects[index], 1)
}

/* ───────────────────────────  CONTENT  ──────────────────────────── */

export async function fetchContent(section) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('content')
      .select('key, value, updated_at')
      .eq('key', section)
      .maybeSingle()
    if (error) return fail(getSupabaseError(error))
    return ok(data ? { values: data.value || {}, updated_at: data.updated_at } : { values: {} }, 1)
  }

  const state = store.read()
  return ok({ values: clone(state.content[section] || {}) }, 1)
}

export async function fetchAllContent() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('content').select('key, value')
    if (error) return fail(getSupabaseError(error))
    const result = {}
    ;(data || []).forEach((row) => {
      result[row.key] = row.value || {}
    })
    return ok(result, Object.keys(result).length)
  }

  const state = store.read()
  return ok(clone(state.content), Object.keys(state.content).length)
}

export async function saveContent(section, values) {
  if (isSupabaseConfigured) {
    const payload = { key: section, value: values, updated_at: new Date().toISOString() }
    const { data: existing } = await supabase
      .from('content')
      .select('id')
      .eq('key', section)
      .maybeSingle()

    let result
    if (existing) {
      const { data, error } = await supabase
        .from('content')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single()
      if (error) return fail(getSupabaseError(error))
      result = data
    } else {
      const { data, error } = await supabase.from('content').insert(payload).select().single()
      if (error) return fail(getSupabaseError(error))
      result = data
    }

    await logActivity({
      action: 'update',
      entity: 'content',
      entityId: section,
      description: `Memperbarui konten section "${section}"`,
    })
    return ok(result, 1)
  }

  const state = store.read()
  state.content[section] = clone(values)
  store.write(state)
  await logActivity({
    action: 'update',
    entity: 'content',
    entityId: section,
    description: `Memperbarui konten section "${section}"`,
  })
  return ok({ key: section, value: values }, 1)
}

/* ───────────────────────────  SETTINGS  ─────────────────────────── */

/**
 * Pemetaan kolom tabel `settings` (snake_case, sesuai supabase-schema.sql)
 * <-> field form (camelCase, sesuai SETTINGS_FIELDS).
 */
const SETTINGS_FIELDS_MAP = {
  siteName: 'site_name',
  tagline: 'tagline',
  contactEmail: 'contact_email',
  defaultLanguage: 'default_language',
  maintenanceMode: 'maintenance_mode',
  allowRegistration: 'allow_registration',
  itemsPerPage: 'items_per_page',
}

function settingsRowToCamel(row) {
  if (!row) return {}
  return Object.fromEntries(
    Object.entries(SETTINGS_FIELDS_MAP).map(([camel, snake]) => [camel, row[snake] ?? null]),
  )
}

function settingsValuesToRow(values) {
  const row = {}
  Object.entries(SETTINGS_FIELDS_MAP).forEach(([camel, snake]) => {
    if (values[camel] === undefined) return
    if (camel === 'itemsPerPage') {
      const parsed = Math.floor(Number(values[camel]))
      row[snake] = Number.isFinite(parsed) && parsed > 0 ? parsed : 10
      return
    }
    row[snake] = values[camel]
  })
  return row
}

export async function fetchSettings() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle()
    if (error) return fail(getSupabaseError(error))
    return ok(settingsRowToCamel(data), 1)
  }
  const state = store.read()
  return ok(clone(state.settings), 1)
}

export async function saveSettings(values) {
  const row = settingsValuesToRow(values)

  if (isSupabaseConfigured) {
    const payload = { ...row, updated_at: new Date().toISOString() }
    const { data: existing } = await supabase.from('settings').select('id').limit(1).maybeSingle()
    let result
    if (existing) {
      const { data, error } = await supabase
        .from('settings')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single()
      if (error) return fail(getSupabaseError(error))
      result = data
    } else {
      const { data, error } = await supabase.from('settings').insert(payload).select().single()
      if (error) return fail(getSupabaseError(error))
      result = data
    }
    await logActivity({ action: 'update', entity: 'settings', description: 'Memperbarui pengaturan website' })
    return ok(settingsRowToCamel(result), 1)
  }

  const state = store.read()
  state.settings = { ...state.settings, ...values }
  store.write(state)
  await logActivity({ action: 'update', entity: 'settings', description: 'Memperbarui pengaturan website' })
  return ok(state.settings, 1)
}

/* ─────────────────────────  CONTACT MESSAGES  ───────────────────── */

const CONTACT_COLUMNS = 'id, name, email, topic, message, read, created_at'

/** Simpan pesan dari formulir kontak publik (boleh diakses anon). */
export async function submitContactMessage(payload) {
  const record = {
    name: String(payload.name || '').trim(),
    email: String(payload.email || '').trim().toLowerCase(),
    topic: String(payload.topic || '').trim() || null,
    message: String(payload.message || '').trim(),
    read: false,
    created_at: new Date().toISOString(),
  }

  if (!record.name || !record.email || !record.message) {
    return fail('Nama, email, dan pesan wajib diisi.')
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('contact_messages').insert(record).select().single()
    if (error) return fail(getSupabaseError(error))
    return ok(data, 1)
  }

  const state = store.read()
  const created = { ...record, id: nextId('c') }
  state.contactMessages.unshift(created)
  store.write(state)
  return ok(created, 1)
}

export async function fetchContactMessages({ search = '', status = 'all', page = 1, pageSize = 10 } = {}) {
  if (isSupabaseConfigured) {
    let query = supabase.from('contact_messages').select(CONTACT_COLUMNS, { count: 'exact' })

    if (search.trim()) {
      const term = `%${search.trim()}%`
      query = query.or(`name.ilike.${term},email.ilike.${term},message.ilike.${term}`)
    }
    if (status === 'unread') query = query.eq('read', false)
    if (status === 'read') query = query.eq('read', true)

    const from = (page - 1) * pageSize
    query = query.order('created_at', { ascending: false }).range(from, from + pageSize - 1)

    const { data, count, error } = await query
    if (error) return fail(getSupabaseError(error))
    return ok(data || [], count || 0)
  }

  const state = store.read()
  let rows = [...(state.contactMessages || [])]

  if (search.trim()) {
    const term = search.trim().toLowerCase()
    rows = rows.filter((row) =>
      [row.name, row.email, row.message].filter(Boolean).some((field) => field.toLowerCase().includes(term)),
    )
  }
  if (status === 'unread') rows = rows.filter((row) => !row.read)
  if (status === 'read') rows = rows.filter((row) => row.read)

  rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  const start = (page - 1) * pageSize
  return ok(rows.slice(start, start + pageSize), rows.length)
}

export async function setContactMessageRead(id, read) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ read })
      .eq('id', id)
      .select()
      .single()
    if (error) return fail(getSupabaseError(error))
    return ok(data, 1)
  }

  const state = store.read()
  const index = (state.contactMessages || []).findIndex((row) => row.id === id)
  if (index === -1) return fail('Pesan tidak ditemukan.')
  state.contactMessages[index] = { ...state.contactMessages[index], read }
  store.write(state)
  return ok(state.contactMessages[index], 1)
}

export async function deleteContactMessage(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    if (error) return fail(getSupabaseError(error))
    return ok(null, 0)
  }

  const state = store.read()
  const target = (state.contactMessages || []).find((row) => row.id === id)
  if (!target) return fail('Pesan tidak ditemukan.')
  state.contactMessages = state.contactMessages.filter((row) => row.id !== id)
  store.write(state)
  return ok(null, 0)
}

/** Jumlah pesan belum dibaca (untuk badge menu admin). */
export async function fetchUnreadMessageCount() {
  if (isSupabaseConfigured) {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('read', false)
    if (error) return fail(getSupabaseError(error))
    return ok(count || 0, 1)
  }
  const state = store.read()
  const total = (state.contactMessages || []).filter((row) => !row.read).length
  return ok(total, 1)
}

/* ───────────────────────────  AUDIT LOG  ────────────────────────── */

export async function fetchAuditLogs({ page = 1, pageSize = 10 } = {}) {
  if (isSupabaseConfigured) {
    const from = (page - 1) * pageSize
    const { data, count, error } = await supabase
      .from('audit_logs')
      .select('id, actor_email, action, entity, entity_id, description, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + pageSize - 1)
    if (error) return fail(getSupabaseError(error))

    const rows = (data || []).map((row) => ({ ...row, actor: row.actor_email }))
    return ok(rows, count || 0)
  }

  const state = store.read()
  const rows = [...state.auditLogs].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  )
  const start = (page - 1) * pageSize
  return ok(rows.slice(start, start + pageSize), rows.length)
}

/* ────────────────────────  DASHBOARD STATS  ─────────────────────── */

export async function fetchDashboardStats() {
  if (isSupabaseConfigured) {
    const [users, projects, published, draft, featured, audit, messages, unreadMessages] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact' }).limit(1000),
      supabase.from('projects').select('category, status, featured', { count: 'exact' }).limit(1000),
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('featured', true),
      supabase.from('audit_logs').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(5),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('read', false),
    ])

    if (users.error) return fail(getSupabaseError(users.error))
    if (projects.error) return fail(getSupabaseError(projects.error))

    const allUsers = users.data || []
    const allProjects = projects.data || []

    return ok({
      users: {
        total: users.count || 0,
        admin: allUsers.filter((u) => u.role === 'admin').length,
        editor: allUsers.filter((u) => u.role === 'editor').length,
        active: allUsers.filter((u) => u.status === 'active').length,
      },
      projects: {
        total: projects.count || 0,
        published: published.count || 0,
        draft: draft.count || 0,
        featured: featured.count || 0,
      },
      messages: {
        total: messages.count || 0,
        unread: unreadMessages.count || 0,
      },
      content: { sections: 4 },
      recentActivity: (audit.data || []).map((row) => ({ ...row, actor: row.actor_email })),
      categoryBreakdown: countBy(allProjects, 'category'),
    })
  }

  const state = store.read()
  return ok({
    users: {
      total: state.users.length,
      admin: state.users.filter((u) => u.role === 'admin').length,
      editor: state.users.filter((u) => u.role === 'editor').length,
      active: state.users.filter((u) => u.status === 'active').length,
    },
    projects: {
      total: state.projects.length,
      published: state.projects.filter((p) => p.status === 'published').length,
      draft: state.projects.filter((p) => p.status === 'draft').length,
      featured: state.projects.filter((p) => p.featured).length,
    },
    messages: {
      total: (state.contactMessages || []).length,
      unread: (state.contactMessages || []).filter((m) => !m.read).length,
    },
    content: { sections: Object.keys(state.content).length },
    recentActivity: [...state.auditLogs]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5),
    categoryBreakdown: countBy(state.projects, 'category'),
  })
}

function countBy(rows, key) {
  const map = new Map()
  rows.forEach((row) => {
    const value = row[key] || 'other'
    map.set(value, (map.get(value) || 0) + 1)
  })
  return [...map.entries()].map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total)
}

/* ──────────────────────  STORAGE (gambar)  ──────────────────────── */

/**
 * Unggah gambar ke Supabase Storage.
 * Mengembalikan { data: { path, url }, error }.
 * Di mode demo, gambar dikembalikan sebagai object URL lokal.
 */
export async function uploadProjectImage(file, folder = 'projects') {
  if (!file) return fail('Tidak ada berkas yang dipilih.')

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
  if (!allowed.includes(file.type)) {
    return fail('Format gambar harus JPG, PNG, WEBP, GIF, atau AVIF.')
  }
  if (file.size > 5 * 1024 * 1024) {
    return fail('Ukuran gambar maksimal 5MB.')
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
  const path = `${folder}/${Date.now()}-${safeName}`

  if (!isSupabaseConfigured) {
    return ok({ path, url: URL.createObjectURL(file), name: file.name }, 1)
  }

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (uploadError) return fail(getSupabaseError(uploadError, 'Gagal mengunggah gambar.'))

  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return ok({ path, url: urlData.publicUrl, name: file.name }, 1)
}

export async function removeProjectImage(path) {
  if (!path) return ok(null, 0)
  if (!isSupabaseConfigured) return ok(null, 0)

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path])
  if (error) return fail(getSupabaseError(error, 'Gagal menghapus gambar.'))
  return ok(null, 0)
}