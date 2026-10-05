import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from '../utils/errorUtils';


function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(formData);
            navigate('/');
        } catch(err) {
            setError(getErrorMessage(err, "Erreur lors de la connexion. Vérifiez vos informations."));
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-md">
                <div className="mb-6">
                    <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                        Marketplace étudiant
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">
                        Connexion
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        Accédez à votre compte pour publier et gérer vos annonces.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <span className="block text-sm font-medium text-slate-700">Email</span>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => {setFormData({...formData, email: e.target.value})}}
                                placeholder="Email"  
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <span className="block text-sm font-medium text-slate-700">Mot de passe</span>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => {setFormData({...formData, password: e.target.value})}} 
                                placeholder="Mot de passe"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Se connecter
                            </button>
                        </div>
                    </form>
                    <Link
                        to={"/register"}
                        className="mt-5 inline-block text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                    >
                        Pas encore de compte ? S'inscrire
                    </Link>

                    {error && (
                        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                             {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
export default LoginPage
