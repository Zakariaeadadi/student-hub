import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost, uploadPostImage } from "../api/postApi";
import { getAllCategories } from "../api/categoryApi";
import { getErrorMessage } from "../utils/errorUtils";


function EditPostPage() {

    const {id} = useParams();
    const [formData, setFormData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () =>{
            try {
                const responsePost = await getPostById(id);
                const responseCategories = await getAllCategories();
                setCategories(responseCategories.data);
                setFormData({
                    title: responsePost.data.title,
                    description: responsePost.data.description,
                    price: responsePost.data.price,
                    imageUrl: responsePost.data.imageUrl,
                    categoryId: responsePost.data.categoryId,
                    status: responsePost.data.status
                });
            } catch (err) {
                setError("Impossible de charger le post.");
            }
        }
        fetchPost();
    }, [id]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const handelSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await updatePost(id, formData);
            if(selectedFile) {
                await uploadPostImage(id, selectedFile);
            }
            navigate(`/posts/${id}`)
        } catch (err) {
            setError(getErrorMessage(err, "Erreur lors de la modification du post."));
        }
    }

    if (!formData) return (
        <div className="min-h-screen bg-slate-50 px-4 py-16">
            <p className="text-center text-sm text-slate-500">Chargement...</p>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-2xl">
                <div className="mb-6">
                    <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                        Marketplace étudiant
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">
                        Modifier l'annonce
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        Mettez à jour les informations de votre article.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                    <form onSubmit={handelSubmit} className="space-y-5">
                        {/* Les inputs */}
                        <div className="space-y-1.5">
                            <span className="block text-sm font-medium text-slate-700">Titre</span>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Titre"
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <span className="block text-sm font-medium text-slate-700">Description</span>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Description"
                                className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <span className="block text-sm font-medium text-slate-700">Prix</span>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="Prix"
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <span className="block text-sm font-medium text-slate-700">Image</span>

                                {formData.imageUrl && (
                                    <img
                                        src={"http://localhost:8080" + formData.imageUrl}
                                        alt="Image actuelle"
                                        className="mb-2 h-24 w-24 rounded-lg object-cover"
                                    />
                                )}

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>
                        {/* Les inputs */}
                        <div className="space-y-1.5">
                            <span className="block text-sm font-medium text-slate-700">Catégorie</span>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="">-- Choisir une catégorie --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto sm:min-w-40"
                            >
                                Modifier
                            </button>
                        </div>
                    </form>

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

export default EditPostPage;
