import { useEffect, useState } from "react";
import { getPostsByUser, toggleStatus } from '../api/postApi';
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import { deleteUser } from "../api/authApi";
import { Trash2 } from "lucide-react";


function MyPostsPage() {

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { user, logout } = useAuth();
    const [error, setError] = useState(null);
    const [errorDelete, setErrorDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyPost = async () => {
            setLoading(true);
            try {
                const response = await getPostsByUser({page, size: 6});
                setPosts(response.data.content);
                setTotalPages(response.data.page.totalPages);
            } catch (err) {
                setError(getErrorMessage(err, "Impossible de charger les posts."));
            } finally {
                setLoading(false);
            }
        }
        fetchMyPost();
    }, [page]);

    const handleToggleStatus = async (postId) => {
        try {
            const response = await toggleStatus(postId);
            setPosts(posts.map(p => p.id === postId ? response.data : p));
        } catch (err) {
            setError(getErrorMessage(err, "Impossible de modifier le statut."));
        }
};

    const handelDeleteAccount = async () => {
        setErrorDelete(null);
        try {
            await deleteUser();
            logout();
            navigate("/");
        } catch (err) {
            setErrorDelete(getErrorMessage(err, "Error lors de supprimer ce compte."));
        }
    }
 

    if (loading) return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
        <p className="text-center text-sm text-slate-500">Chargement...</p>
    </div>
    );
    if (error) return (
        <div className="min-h-screen bg-slate-50 px-4 py-16">
            <p className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-center text-sm text-red-700">{error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">

                {/* MODAL DELETE */}
                {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-slate-900">Supprimer votre compte ?</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Cette action est irréversible. votre posts, favoris et votre avis seront définitivement supprimés.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handelDeleteAccount}
                                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                Confirmer la suppression
                            </button>
                        </div>
                    </div>
                </div>
                )}
                {/* MODAL DELETE */}

                {/* Carte info utilisateur */}
                <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">Mon profil</p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-900">{user?.fullName}</h2>
                    <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
                    <p className="mt-1 text-sm text-slate-500">{user?.phone}</p>
                    <button 
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50"                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        <Trash2 className="h-4 w-4" />
                        Supprimer Votre compte
                    </button>
                </div>

                {/* Titre section posts */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Mes posts</h1>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        Retrouvez ici toutes vos annonces publiées.
                    </p>
                </div>

                {/* Liste des posts */}
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
                                <Link
                                    to={`/posts/${post.id}`}
                                    className="mt-4 inline-flex w-fit items-center text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                                >
                                    Voir le détail
                                </Link>
                                <button
                                    onClick={() => handleToggleStatus(post.id)}
                                    className="mt-2 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    {post.status === "AVAILABLE" ? "Marquer comme vendu" : "Remettre en vente"}
                                </button>
                                {post.status === "SOLD" && (
                                    <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
                                        Vendu
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                {/* Pagination */}
                <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 0))}
                        disabled={page === 0}
                        className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                    >
                        Précédent
                    </button>
                    <span className="text-sm text-slate-600">Page {page + 1} / {totalPages}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                        disabled={page + 1 >= totalPages}
                        className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                    >
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
}
export default MyPostsPage;