import { useEffect, useState } from "react";
import { getAllPosts } from '../api/postApi';
import { getAllCategories } from '../api/categoryApi'
import { Link } from "react-router-dom";
import { getErrorMessage } from '../utils/errorUtils';


function HomePage() {
    
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();
                setCategories(response.data);
            } catch (err) {
                setError(getErrorMessage(err, "Impossible de charger les catégories."));
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await getAllPosts({ categoryId, search: debouncedSearch, page, size: 6 });
                setPosts(response.data.content);
                setTotalPages(response.data.page.totalPages);
            } catch (err) {
                setError(getErrorMessage(err, "Impossible de charger les posts."));
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [debouncedSearch, categoryId, page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);


    if (loading) return (
        <div className="min-h-screen bg-slate-50 px-4 py-16">
            <p className="text-center text-sm text-slate-500">Chargement...</p>
        </div>
    )
    if (error) return (
        <div className="min-h-screen bg-slate-50 px-4 py-16">
            <p className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-center text-sm text-red-700">{error}</p>
        </div>
    )

    return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">

            {/* En-tête */}
            <div className="mb-8">
                <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                    Marketplace étudiant
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">
                    Annonces
                </h1>
                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                    Parcourez les articles proposés par d'autres étudiants.
                </p>
            </div>

            {/* Barre de recherche + filtre catégorie */}
            <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1.5">
                    <span className="block text-sm font-medium text-slate-700">Recherche</span>
                    <input
                        type="text"
                        placeholder="Rechercher un article..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div className="space-y-1.5 sm:w-56">
                    <span className="block text-sm font-medium text-slate-700">Catégorie</span>
                    <select
                        value={categoryId || ''}
                        onChange={(e) => {
                            setCategoryId(e.target.value || null);
                            setPage(0);
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="">Toutes les catégories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Liste des posts */}
            {posts.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-sm text-slate-500">Aucun post ne correspond à votre recherche.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-100 hover:shadow-md"
                        >
                            {post.imageUrl ? (
                                <img
                                    src={"http://localhost:8080" + post.imageUrl}
                                    alt={post.title}
                                    className="h-40 w-full rounded-xl object-cover"
                                />
                            ) : (
                                <div className="flex h-40 w-full items-center justify-center rounded-xl bg-slate-100">
                                    <span className="text-sm text-slate-400">Pas d'image</span>
                                </div>
                            )}
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">{post.title}</h3>
                            <p className="mt-2 text-base font-medium text-indigo-600">{post.price} MAD</p>
                            {post.status === "SOLD" && (
                                <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
                                    Vendu
                                </span>
                            )}
                            <Link
                                to={`/posts/${post.id}`}
                                className="mt-4 inline-flex w-fit items-center text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                            >
                                Voir le détail
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-4">
                <button
                    onClick={() => setPage((p) =>  Math.max(p - 1, 0))}
                    disabled={page === 0}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Précédent
                </button>
                <span className="text-sm text-slate-600">Page {page + 1} / {totalPages || 1}</span>
                <button
                    onClick={() => setPage((p) => Math.min(page + 1, totalPages - 1))}
                    disabled={page + 1 >= totalPages}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Suivant
                </button>
            </div>
        </div>
    </div>
);
}
export default HomePage;