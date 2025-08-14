import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { booksAPI, categoriesAPI } from '../services/api';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  PackageCheck,
  BookOpen,
  Image as ImageIcon,
  X,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const Books = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    quantity: '',
    category_id: '',
    description: '',
    image_url: ''
  });
  const [stockData, setStockData] = useState({ quantity: '' });
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch data
  const { data: booksData, isLoading: booksLoading } = useQuery('books', () => booksAPI.getAll({ limit: 1000 }));
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery('categoriesForBooks', () => categoriesAPI.getAll({ limit: 1000 }));

  const books = booksData?.data?.books || [];
  const categories = categoriesData?.data?.categories || [];

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    const matchesCategory = !selectedCategory || book.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Mutations
  const createBookMutation = useMutation(booksAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('books');
      toast.success('Book added successfully!');
      handleCloseModals();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add book');
    }
  });

  const updateBookMutation = useMutation(booksAPI.update, {
    onSuccess: () => {
      queryClient.invalidateQueries('books');
      toast.success('Book updated successfully!');
      handleCloseModals();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update book');
    }
  });

  const deleteBookMutation = useMutation(booksAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('books');
      toast.success('Book deleted successfully!');
      handleCloseModals();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete book');
    }
  });

  const updateStockMutation = useMutation(booksAPI.updateStock, {
    onSuccess: () => {
      queryClient.invalidateQueries('books');
      toast.success('Stock updated successfully!');
      handleCloseModals();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update stock');
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image_url: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      category_id: parseInt(formData.category_id)
    };

    if (showAddModal) {
      createBookMutation.mutate(bookData);
    } else if (showEditModal) {
      updateBookMutation.mutate({ id: selectedBook.id, ...bookData });
    }
  };

  const handleStockSubmit = (e) => {
    e.preventDefault();
    updateStockMutation.mutate({
      id: selectedBook.id,
      quantity: parseInt(stockData.quantity)
    });
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      price: book.price.toString(),
      quantity: book.quantity.toString(),
      category_id: book.category_id.toString(),
      description: book.description || '',
      image_url: book.image_url || ''
    });
    setImagePreview(book.image_url);
    setShowEditModal(true);
  };

  const handleDelete = (book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  const handleStockUpdate = (book) => {
    setSelectedBook(book);
    setStockData({ quantity: book.quantity.toString() });
    setShowStockModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowStockModal(false);
    setSelectedBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      price: '',
      quantity: '',
      category_id: '',
      description: '',
      image_url: ''
    });
    setImagePreview(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  if (booksLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-white shadow-lg border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-orange-600/10"></div>
        <div className="relative px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Books Management
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Manage your colorful bookstore inventory
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Book</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              {/* Book Image */}
              <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
                {book.image_url ? (
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-purple-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${book.quantity <= 5 ? 'bg-red-100 text-red-800' :
                    book.quantity <= 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                    {book.quantity <= 5 ? 'Low Stock' :
                      book.quantity <= 10 ? 'Medium' : 'In Stock'}
                  </span>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
                <p className="text-gray-600 mb-3">{book.author}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-purple-600">${book.price}</span>
                  <span className="text-sm text-gray-500">Qty: {book.quantity}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {categories.find(c => c.id === book.category_id)?.name || 'Unknown'}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleStockUpdate(book)}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      title="Update Stock"
                    >
                      <PackageCheck className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(book)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Edit Book"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(book)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete Book"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Add Your First Book
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Book Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {showAddModal ? 'Add New Book' : 'Edit Book'}
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
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Book Cover Image</label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-400 transition-colors"
                    >
                      <ImageIcon className="h-5 w-5 text-purple-500" />
                      <span className="text-purple-600 font-medium">Choose Image</span>
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image_url: '' }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter book title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter ISBN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter book description..."
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
                  disabled={createBookMutation.isLoading || updateBookMutation.isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {createBookMutation.isLoading || updateBookMutation.isLoading ? 'Saving...' : (showAddModal ? 'Add Book' : 'Update Book')}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Book</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedBook?.title}"? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handleCloseModals}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteBookMutation.mutate(selectedBook.id)}
                  disabled={deleteBookMutation.isLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  {deleteBookMutation.isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Update Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <PackageCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Stock</h3>
              <p className="text-gray-600 mb-6">
                Update stock quantity for "{selectedBook?.title}"
              </p>
              <form onSubmit={handleStockSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Quantity</label>
                  <input
                    type="number"
                    value={stockData.quantity}
                    onChange={(e) => setStockData({ quantity: e.target.value })}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter new quantity"
                  />
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    type="button"
                    onClick={handleCloseModals}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateStockMutation.isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    {updateStockMutation.isLoading ? 'Updating...' : 'Update Stock'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books; 