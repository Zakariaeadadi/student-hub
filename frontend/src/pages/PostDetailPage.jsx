import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { getPostById, deletePost } from "../api/postApi";
import { useAuth } from "../context/AuthContext";
import { addFavorite, removeFavorite } from "../api/favoriteApi";
import { addReview, getReviewsByPost } from "../api/reviewApi";
import { getErrorMessage } from '../utils/errorUtils';
import { getTimeAgo } from "../utils/dateUtils";

// ICONS
import { Phone, Mail, Pencil, Trash2, Heart } from 'lucide-react';


function PostDetailPage() {

    const {id} = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(null);
    const [favoriteError, setFavoriteError] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [note, setNote] = useState(null);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [infoMessage, setInfoMessage] = useState(location.state?.message || null);
    const isOwner = user && post && user.userId === post.userId;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await getPostById(id);
                const responseReview = await getReviewsByPost(id, {page, size: 6})
                setPost(response.data);
                setIsFavorite(response.data.isFavorite);
                setReviews(responseReview.data.content);
                setTotalPages(responseReview.data.page.totalPages)
            } catch (err) {
                setError(getErrorMessage(err, "Post introuvable."));
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [id, page]);

    const handleDelete = async () => {
        setError(null);
        try {
            await deletePost(post.id);
            navigate("/");
        } catch (err) {
            setError(getErrorMessage(err, "Erreur lors de la suppression de ce post."));
        }
    }

    const handelFavorite = async () => {
        setFavoriteError(null);
        try {
            if(isFavorite) {
                await removeFavorite(post.id);
                setIsFavorite(false);
            } else {
                await addFavorite(post.id);
                setIsFavorite(true);
            }
        } catch (err) {
            setFavoriteError("Impossible de modifier les favoris.");
        }
    }

    const handleAddReview = async () => {
        setReviewError(null);
        try {
            const response = await addReview(post.id, { rating: note, comment });
            setReviews([...reviews, response.data]);
            setPost({ ...post, hasReviewed: true });
            setNote('');
            setComment('');
        } catch (err) {
            setReviewError(getErrorMessage(err, "Impossible d'envoyer votre avis."));        }
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
            <div className="mx-auto w-full max-w-2xl">

                {infoMessage && (
                    <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-700">
                        {infoMessage}
                    </p>
                )}

                {/* MODAL DELETE */}
                {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-slate-900">Supprimer ce post ?</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Cette action est irréversible. Le post, ses favoris et ses avis seront définitivement supprimés.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                Confirmer la suppression
                            </button>
                        </div>
                    </div>
                </div>
                )}
                {/* MODAL DELETE */}

                {/* Carte principale du post */}
                <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                    <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                        Marketplace étudiant
                    </p>

                    {post.imageUrl ? (
                        <img
                            src={"http://localhost:8080" + post.imageUrl}
                            alt={post.title}
                            className="mt-4 h-56 w-full rounded-xl object-cover"
                        />
                    ) : (
                        <div className="mt-4 flex h-56 w-full items-center justify-center rounded-xl bg-slate-100">
                            <span className="text-sm text-slate-400">Pas d'image</span>
                        </div>
                    )}

                    <h3 className="mt-5 text-2xl font-semibold text-slate-900 sm:text-3xl">{post.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{post.description}</p>
                    <p className="mt-5 text-xl font-semibold text-indigo-600">{post.price} MAD</p>
                    <p className="mt-2 text-xs text-slate-400">
                        {getTimeAgo(post.createdAt)}
                    </p>

                    {/* Infos vendeur */}
                    <div className="mt-6 space-y-1.5 border-t border-slate-100 pt-5 text-sm text-slate-500">
                        <p>Catégorie : <span className="font-medium text-slate-700">{post.categoryName}</span></p>
                        <p>Vendu par : <span className="font-medium text-slate-700">{post.userFullName}</span></p>
                    </div>

                    {post.status === "SOLD" && (
                        <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
                            Vendu
                        </span>
                    )}

                    {/* Note moyenne */}
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">Note moyenne :</span>
                        {post.averageRating ? (
                            <span className="text-base font-semibold text-indigo-600">
                                {post.averageRating.toFixed(1)} / 5
                            </span>
                        ) : (
                            <span className="text-sm text-slate-400">Pas encore noté</span>
                        )}
                    </div>

                    {/* Boutons contact (téléphone / email) */}
                    {user && !isOwner && (post.userPhone || post.userEmail) && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {post.userPhone && (
                                <a
                                    href={`tel:${post.userPhone}`}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                                >
                                    <Phone className="h-4 w-4" />
                                    Appeler
                                </a>
                            )}
                            {post.userEmail && (
                                <a
                                    href={`mailto:${post.userEmail}`}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                                >
                                    <Mail className="h-4 w-4" />
                                    Email
                                </a>
                            )}
                        </div>
                    )}

                    {/* Actions propriétaire */}
                    {isOwner && (
                        <div className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                            <Link
                                to={`/posts/${post.id}/edit`}
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                <Pencil className="h-4 w-4" />
                                Modifier
                            </Link>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                                Supprimer
                            </button>
                        </div>
                    )}

                    {/* Favori */}
                    {user && (
                        <div className="mt-4">
                            <button
                                onClick={handelFavorite}
                                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50"
                            >
                                <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
                                {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                            </button>
                        </div>
                    )}
                    {favoriteError && (
                        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                            {favoriteError}
                        </p>
                    )}

                    {/* Formulaire d'avis */}
                    {user && !isOwner && !post.hasReviewed && (
                        <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                            <h4 className="text-sm font-semibold text-slate-900">Laisser un avis</h4>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[100px_1fr]">
                                <div className="space-y-1.5">
                                    <span className="block text-xs font-medium text-slate-700">Note (1-5)</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={note ?? ''}
                                        onChange={(e) => setNote(Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <span className="block text-xs font-medium text-slate-700">Commentaire</span>
                                    <input
                                        type="text"
                                        placeholder="Votre commentaire"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleAddReview}
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                Envoyer l'avis
                            </button>
                            {reviewError && (
                                <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                                    {reviewError}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Liste des avis */}
                <div className="mt-6">
                    <h4 className="mb-3 text-sm font-semibold text-slate-900">Avis ({reviews.length})</h4>
                    {reviews.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                            <p className="text-sm text-slate-500">Aucun avis pour ce post.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {reviews.map((rate) => (
                                <div
                                    key={rate.id}
                                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-100 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-900">{rate.userFullName}</span>
                                        <span className="text-sm font-semibold text-indigo-600">{rate.rating} / 5</span>
                                    </div>
                                    {rate.comment && (
                                        <p className="mt-2 text-sm text-slate-600">{rate.comment}</p>
                                    )}
                                    <p className="mt-3 text-xs text-slate-400">
                                        {getTimeAgo(rate.createdAt)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination avis */}
                <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 0))}
                        disabled={page === 0}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Précédent
                    </button>
                    <span className="text-sm text-slate-600">Page {page + 1} / {totalPages || 1}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
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

export default PostDetailPage;