import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import PostDetailPage from '../pages/PostDetailPage';
import CreatePostPage from '../pages/CreatePostPage';
import EditPostPage from '../pages/EditPostPage';
import NotFoundPage from '../pages/NotFoundPage';
import MyPostsPage from '../pages/MyPostsPage';
import FavoritesPage from '../pages/FavoritesPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<HomePage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Routes protégées */}
      <Route element={<PrivateRoute />}>
        <Route path="/posts/create" element={<CreatePostPage />} />
        <Route path="/posts/:id/edit" element={<EditPostPage />} />
        <Route path="/posts/my/" element={<MyPostsPage />} />
        <Route path="/posts/favorite" element={<FavoritesPage />} />
      </Route>

      {/* Route 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;