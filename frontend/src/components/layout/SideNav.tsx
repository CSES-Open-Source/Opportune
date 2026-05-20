import { NavLink } from "react-router-dom";
import { navItems } from "../../constants/navItems";
import { NavItem } from "../../types/NavItem";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import Dialog from "../public/Dialog";
import { useAuth } from "../../contexts/useAuth";
import { FcGoogle } from "react-icons/fc";
import { requireLogin, roleGuard } from "../../constants/pathAccess";
import { MdLockOutline } from "react-icons/md";
import { LuSparkles } from "react-icons/lu";
import "../../styles/Animations.css";

const OpportuneLogo = "/assets/OpportuneLogo.png";

const SideNav = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [isLogOutDialogOpen, setIsLogOutDialogOpen] = useState<boolean>(false);

  const onLogOutClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsLogOutDialogOpen(true);
  };

  const onLogOutDialogConfirm = () => {
    logout().then(() => setIsLogOutDialogOpen(false));
  };

  const onLogOutDialogClose = () => {
    setIsLogOutDialogOpen(false);
  };

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Sidebar entrance animation */
        @keyframes sidebarSlide {
          from { opacity:0; transform:translateX(-20px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .sidebar-container { animation: sidebarSlide 0.4s ease-out; }

        /* Nav item stagger */
        @keyframes navItemFade {
          from { opacity:0; transform:translateX(-10px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .nav-item-0 { animation: navItemFade 0.3s ease-out 0.05s both; }
        .nav-item-1 { animation: navItemFade 0.3s ease-out 0.10s both; }
        .nav-item-2 { animation: navItemFade 0.3s ease-out 0.15s both; }
        .nav-item-3 { animation: navItemFade 0.3s ease-out 0.20s both; }
        .nav-item-4 { animation: navItemFade 0.3s ease-out 0.25s both; }
        .nav-item-5 { animation: navItemFade 0.3s ease-out 0.30s both; }
        .nav-item-6 { animation: navItemFade 0.3s ease-out 0.35s both; }
        .nav-item-7 { animation: navItemFade 0.3s ease-out 0.40s both; }
        .nav-item-8 { animation: navItemFade 0.3s ease-out 0.45s both; }

        /* Logo glow */
        @keyframes logoGlowPulse {
          0%,100% { box-shadow: 0 0 20px rgba(91,142,244,0.3), 0 0 40px rgba(124,58,237,0.15); }
          50%      { box-shadow: 0 0 30px rgba(91,142,244,0.5), 0 0 60px rgba(124,58,237,0.25); }
        }
        .logo-glow { animation: logoGlowPulse 3s ease-in-out infinite; }

        /* Active nav shimmer */
        @keyframes activeShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .nav-active-shimmer {
          position: relative;
          overflow: hidden;
        }
        .nav-active-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: activeShimmer 2.5s infinite;
        }

        /* Hover glow effect */
        .nav-link-hover {
          position: relative;
          transition: all 0.25s ease;
        }
        .nav-link-hover::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          opacity: 0;
          transition: opacity 0.25s ease;
          background: radial-gradient(circle at center, rgba(91,142,244,0.08), transparent 70%);
        }
        .nav-link-hover:hover::after {
          opacity: 1;
        }

        /* Profile section slide up */
        @keyframes profileSlideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .profile-section { animation: profileSlideUp 0.4s ease-out 0.5s both; }

        /* Divider grow */
        @keyframes dividerGrow {
          from { width:0; opacity:0; }
          to   { width:80%; opacity:1; }
        }
        .divider-grow { animation: dividerGrow 0.5s ease-out 0.3s both; }
      `}} />

      <aside
        className="sidebar-container fixed left-0 top-0 h-screen w-[300px] flex flex-col items-center border-r z-40"
        style={{
          background: "linear-gradient(180deg, #1a1f2e 0%, #151920 100%)",
          borderColor: "#2d3748",
        }}
      >
        {/* ── Logo Header ── */}
        <div className="h-20 w-full flex items-center px-4 gap-3">
          <div
            className="logo-glow w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "#000000",
            }}
          >
            <img className="h-8 w-8" src={OpportuneLogo} alt="Opportune" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#e8eaed] tracking-tight">Opportune</h1>
            <div className="flex items-center gap-1 text-[10px] text-[#6b7280] uppercase tracking-wider">
              <LuSparkles className="w-2.5 h-2.5 text-[#FFCD00]" />
              <span>UCSD Portal</span>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="w-full flex justify-center">
          <div
            className="divider-grow h-px"
            style={{ background: "linear-gradient(90deg, transparent, #2d3748, transparent)" }}
          />
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-grow w-full py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((navItem: NavItem, index: number) => {
              if (navItem.disabled) {
                return null;
              }

              const pathIndex = roleGuard.findIndex(
                (pair) => navItem.path === pair.path,
              );
              if (pathIndex !== -1) {
                if (
                  !isAuthenticated ||
                  (user && roleGuard[pathIndex].role.includes(user.type))
                ) {
                  return null;
                }
              }

              const isPathLocked =
                !isAuthenticated && requireLogin.includes(navItem.path);

              return (
                <li key={index} className={`nav-item-${index}`}>
                  {!isPathLocked && (
                    <NavLink
                      className={({ isActive }) =>
                        `nav-link-hover group relative flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                          isActive
                            ? "nav-active-shimmer text-white"
                            : "text-[#9ca3af] hover:text-[#e8eaed]"
                        }`
                      }
                      to={navItem.path}
                      style={({ isActive }) => ({
                        background: isActive
                          ? "linear-gradient(135deg, #5b8ef4, #7c3aed)"
                          : "transparent",
                        boxShadow: isActive
                          ? "0 4px 14px rgba(91,142,244,0.25)"
                          : "none",
                      })}
                    >
                      {navItem.icon && (
                        <navItem.icon
                          size={20}
                          className="flex-shrink-0 transition-transform group-hover:scale-110"
                        />
                      )}
                      <span className="flex-1">{navItem.label}</span>
                    </NavLink>
                  )}

                  {isPathLocked && (
                    <div
                      className="nav-link-hover group relative flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-[#4b5563] cursor-not-allowed"
                      style={{ background: "rgba(45,55,72,0.3)" }}
                    >
                      {navItem.icon && (
                        <navItem.icon size={20} className="flex-shrink-0 opacity-50" />
                      )}
                      <span className="flex-1">{navItem.label}</span>
                      <MdLockOutline className="w-4 h-4 opacity-50" />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── User Profile / Login ── */}
        {isAuthenticated && user && (
          <div className="profile-section w-full flex flex-col items-center">
            <div
              className="w-[80%] h-px mb-3"
              style={{ background: "linear-gradient(90deg, transparent, #2d3748, transparent)" }}
            />
            <div className="w-full px-3 pb-3">
              <NavLink
                to="/profile"
                className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-[#1e2433]"
              >
                <img
                  src={user.profilePicture}
                  alt={`${user.name} Profile`}
                  className="rounded-full h-10 w-10 border-2 flex-shrink-0"
                  style={{ borderColor: "rgba(91,142,244,0.3)" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#e8eaed] truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-[#6b7280] truncate">{user.email}</div>
                </div>
                <button
                  onClick={onLogOutClicked}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6b7280] hover:text-[#f87171] hover:bg-[#141920] transition-all flex-shrink-0"
                  title="Logout"
                >
                  <FiLogOut size={18} />
                </button>
              </NavLink>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <div className="profile-section w-full px-3 pb-3">
            <button
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm border transition-all hover:-translate-y-0.5"
              style={{
                background: "#ffffff",
                borderColor: "#e5e7eb",
                color: "#1f2937",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              onClick={login}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              <FcGoogle size={22} />
              <span>Sign in with Google</span>
            </button>
          </div>
        )}
      </aside>

      <Dialog
        isDialogOpen={isLogOutDialogOpen}
        onConfirm={onLogOutDialogConfirm}
        onDialogClose={onLogOutDialogClose}
        text="Are you sure you would like to logout?"
      />
    </div>
  );
};

export default SideNav;