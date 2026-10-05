import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-lg flex-col items-center py-16 text-center sm:py-24">
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                    <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                        Marketplace étudiant
                    </p>
                    <p className="mt-4 text-6xl font-semibold text-slate-900 sm:text-7xl">
                        404
                    </p>
                    <h1 className="mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
                        Page introuvable
                    </h1>
                    <p className="mt-3 text-sm text-slate-500 sm:text-base">
                        Cette adresse n'existe pas ou l'annonce a été retirée. Revenez à l'accueil pour continuer à parcourir les annonces.
                    </p>
                    <Link
                        to="/"
                        className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default NotFoundPage;