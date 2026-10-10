import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useLang } from '../../contexts/LangContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Menu, X, Sun, Moon, Globe } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function PublicLayout() {
  const { t, lang, toggle: toggleLang } = useLang()
  const { dark, toggle: toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/about', label: t.nav.about },
    { to: '/services', label: t.nav.services },
    { to: '/portfolio', label: t.nav.portfolio },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass shadow-lg shadow-black/5'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black">C</span>
            <span className="gradient-text">CreativeTech</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors animated-underline',
                      isActive
                        ? 'text-primary bg-accent'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                    )
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-colors"
              title="Toggle language"
              id="btn-lang-toggle"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang.toUpperCase()}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Toggle theme"
              id="btn-theme-toggle"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {/* Mobile menu */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMenuOpen(o => !o)}
              id="btn-mobile-menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden glass border-t border-border">
            <ul className="px-4 py-3 space-y-1">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive ? 'text-primary bg-accent' : 'hover:bg-muted'
                      )
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-3">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black">C</span>
                <span className="gradient-text">CreativeTech</span>
              </div>
              <p className="text-sm text-muted-foreground">{t.footer.tagline}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Pages</h4>
              <ul className="space-y-2">
                {navLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-muted-foreground hover:text-primary transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Admin</h4>
              <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard →</Link>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} CreativeTech. {t.footer.rights}
          </div>
        </div>
      </footer>
    </div>
  )
}
