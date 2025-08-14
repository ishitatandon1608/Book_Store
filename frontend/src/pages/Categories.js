import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { categoriesAPI } from '../services/api';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Grid3X3,
  BookOpen,
  X,
  Calendar,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const Categories = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Fetch categories with book count
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery('categoriesWithCount', () => categoriesAPI.getWithCount());

  const categories = categoriesData?.data?.categories || [];

  // Filter categories
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mutations
  const createCategoryMutation = useMutation(categoriesAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
      queryClient.invalidateQueries('categoriesWithCount');
      toast.success('Category added successfully!');
      handleCloseModals();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add category');
    }
  });

  const updateCategoryMutation = useMutation(categoriesAPI.update, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
      queryClient.invalidateQueries('categoriesWithCount');
      toast.success('Category updated successfully!');
      handleCloseModals();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update category');
    }
  });

  const deleteCategoryMutation = useMutation(categoriesAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
      queryClient.invalidateQueries('categoriesWithCount');
      toast.success('Category deleted successfully!');
      handleCloseModals();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  });

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showAddModal) {
      createCategoryMutation.mutate(formData);
    } else if (showEditModal) {
      updateCategoryMutation.mutate({ id: selectedCategory.id, ...formData });
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCategory(null);
    setFormData({ name: '', description: '' });
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Color themes for categories
  const colorThemes = [
    { bg: 'from-blue-500 to-blue-600', icon: 'from-blue-400 to-blue-500', text: 'text-blue-600' },
    { bg: 'from-green-500 to-green-600', icon: 'from-green-400 to-green-500', text: 'text-green-600' },
    { bg: 'from-purple-500 to-purple-600', icon: 'from-purple-400 to-purple-500', text: 'text-purple-600' },
    { bg: 'from-pink-500 to-pink-600', icon: 'from-pink-400 to-pink-500', text: 'text-pink-600' },
    { bg: 'from-orange-500 to-orange-600', icon: 'from-orange-400 to-orange-500', text: 'text-orange-600' },
    { bg: 'from-indigo-500 to-indigo-600', icon: 'from-indigo-400 to-indigo-500', text: 'text-indigo-600' },
    { bg: 'from-teal-500 to-teal-600', icon: 'from-teal-400 to-teal-500', text: 'text-teal-600' },
    { bg: 'from-red-500 to-red-600', icon: 'from-red-400 to-red-500', text: 'text-red-600' }
  ];

  const getColorTheme = (index) => {
    return colorThemes[index % colorThemes.length];
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-white shadow-lg border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-teal-600/10 to-blue-600/10"></div>
        <div className="relative px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Categories Management
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Organize your books with colorful categories
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Category</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <button
              onClick={clearSearch}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category, index) => {
            const theme = getColorTheme(index);
            return (
              <div
                key={category.id}
                className="group relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Category Header */}
                <div className={`relative h-24 bg-gradient-to-r ${theme.bg} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm`}>
                        <Grid3X3 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{category.name}</h3>
                        <p className="text-white/80 text-sm">Category</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                        title="Edit Category"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                        title="Delete Category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                </div>

                {/* Category Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {category.description || 'No description available'}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Books</span>
                      </div>
                      <span className={`text-lg font-bold ${theme.text}`}>
                        {category.book_count || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Created</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(category.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${(category.book_count || 0) > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {(category.book_count || 0) > 0 ? 'Active' : 'Empty'}
                      </span>

                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${(category.book_count || 0) > 0 ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        <span className="text-xs text-gray-500">
                          {(category.book_count || 0) > 0 ? 'In use' : 'No books'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 to-teal-600/0 group-hover:from-green-600/5 group-hover:to-teal-600/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center mb-6">
              <Grid3X3 className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search' : 'Start by creating your first category'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Your First Category
              </button>
            )}
          </div>
        )}

        {/* Statistics */}
        {filteredCategories.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Grid3X3 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Books</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {categories.reduce((sum, cat) => sum + (cat.book_count || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Categories</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {categories.filter(cat => (cat.book_count || 0) > 0).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {showAddModal ? 'Add New Category' : 'Edit Category'}
                </h2>
                <button
                  onClick={handleCloseModals}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Fiction, Non-Fiction, Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Brief description of this category..."
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={handleCloseModals}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCategoryMutation.isLoading || updateCategoryMutation.isLoading}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {createCategoryMutation.isLoading || updateCategoryMutation.isLoading ? 'Saving...' : (showAddModal ? 'Add Category' : 'Update Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Category</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedCategory?.name}"?
                {selectedCategory?.book_count > 0 && (
                  <span className="block mt-2 text-sm text-red-600">
                    ⚠️ This category has {selectedCategory.book_count} book(s) and cannot be deleted.
                  </span>
                )}
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handleCloseModals}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteCategoryMutation.mutate(selectedCategory.id)}
                  disabled={deleteCategoryMutation.isLoading || (selectedCategory?.book_count > 0)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteCategoryMutation.isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories; 