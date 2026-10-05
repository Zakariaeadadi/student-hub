import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";


function Navbar() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handelLogout = () => {
        logout();
        navigate('/')
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <Link
                    to={'/'}
                    className="text-base font-semibold tracking-tight text-slate-900 transition hover:text-indigo-600 sm:text-lg"
                >
                    Acceuil
                </Link>

                {user ? (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Link
                            to="/posts/create"
                            className="inline-flex items-center rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            Créer un post
                        </Link>
                        <Link
                            to="/posts/my"
                            className="inline-flex items-center rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            Mes posts
                        </Link>
                        <Link
                            to="/posts/favorite"
                            className="inline-flex items-center rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            Mes favoirs
                        </Link>
                        <span className="text-sm text-slate-500">Bonjour, {user.fullName}</span>
                        <button
                            onClick={handelLogout}
                            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                            Se déconnecter
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Link
                            to="/login"
                            className="inline-flex items-center rounded-xl px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-indigo-600"
                        >
                            Se connecter
                        </Link>
                        <Link
                            to="/register"
                            className="inline-flex items-center rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            S'inscrire
                        </Link>
                    </div>
                )}
            </div>
        </nav>
        )
}
export default Navbar;
