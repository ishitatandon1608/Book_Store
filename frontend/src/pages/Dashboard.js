import React from 'react';
import { useQuery } from 'react-query';
import { booksAPI, categoriesAPI } from '../services/api';
import {
  BookOpen,
  Grid3X3,
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  const { data: booksData, isLoading: booksLoading, error: booksError } = useQuery('books', () => booksAPI.getAll({ limit: 1000 }));
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useQuery('categories', () => categoriesAPI.getAll({ limit: 1000 }));
  const { data: lowStockData, isLoading: lowStockLoading, error: lowStockError } = useQuery('lowStock', () => booksAPI.getLowStock(10));

  // Fix data parsing - the API service now returns { success: true, data: { books: [...] } }
  const books = booksData?.data?.books || [];
  const categories = categoriesData?.data?.categories || [];
  const lowStockBooks = lowStockData?.data?.books || [];

  const totalBooks = books.length;
  const totalCategories = categories.length;
  const totalValue = books.reduce((sum, book) => sum + (book.price * book.quantity), 0);
  const lowStockCount = lowStockBooks.length;

  const recentBooks = books.slice(0, 5);

  const stats = [
    {
      name: 'Total Books',
      value: totalBooks,
      change: '+12%',
      changeType: 'increase',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Books in inventory'
    },
    {
      name: 'Categories',
      value: totalCategories,
      change: '+3%',
      changeType: 'increase',
      icon: Grid3X3,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'Book categories'
    },
    {
      name: 'Inventory Value',
      value: `$${totalValue.toFixed(2)}`,
      change: '+8.2%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'Total stock value'
    },
    {
      name: 'Low Stock Items',
      value: lowStockCount,
      change: lowStockCount > 0 ? '+2' : '0',
      changeType: lowStockCount > 0 ? 'increase' : 'neutral',
      icon: AlertTriangle,
      color: lowStockCount > 0 ? 'from-red-500 to-red-600' : 'from-yellow-500 to-yellow-600',
      bgColor: lowStockCount > 0 ? 'bg-red-50' : 'bg-yellow-50',
      iconColor: lowStockCount > 0 ? 'text-red-600' : 'text-yellow-600',
      description: 'Items need restocking'
    },
  ];

  // Show loading state
  if (booksLoading || categoriesLoading || lowStockLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (booksError || categoriesError || lowStockError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center py-12">
          <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading dashboard</h3>
          <p className="text-gray-600">
            {booksError?.message || categoriesError?.message || lowStockError?.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white shadow-sm border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Welcome back! Here's what's happening with your bookstore today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                      </div>
                      <div className="flex items-center space-x-2">
                        {stat.changeType === 'increase' ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : stat.changeType === 'decrease' ? (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        ) : null}
                        <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' :
                          stat.changeType === 'decrease' ? 'text-red-600' :
                            'text-gray-500'
                          }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {stat.description}
                    </p>
                  </div>
                </div>

                {/* Decorative gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -translate-y-16 translate-x-16`}></div>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Books */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Books
                </h3>
                <span className="text-sm text-gray-500">{recentBooks.length} books</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentBooks.length > 0 ? (
                recentBooks.map((book, index) => (
                  <div key={book.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <h4 className="text-sm font-semibold text-gray-900">{book.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            ${book.price}
                          </span>
                          <span className="flex items-center">
                            <Package className="h-3 w-3 mr-1" />
                            {book.quantity} in stock
                          </span>
                          <span className="flex items-center">
                            <Grid3X3 className="h-3 w-3 mr-1" />
                            {book.category_name}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${book.quantity <= 5 ? 'bg-red-100 text-red-800' :
                            book.quantity <= 10 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                          }`}>
                          {book.quantity <= 5 ? 'Low Stock' :
                            book.quantity <= 10 ? 'Medium' : 'In Stock'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">No books available</h3>
                  <p className="text-sm text-gray-500">Start by adding some books to your inventory</p>
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                  Low Stock Alert
                </h3>
                <span className="text-sm text-gray-500">{lowStockCount} items</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {lowStockBooks.length > 0 ? (
                lowStockBooks.map((book) => (
                  <div key={book.id} className="p-6 hover:bg-red-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <h4 className="text-sm font-semibold text-gray-900">{book.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Package className="h-3 w-3 mr-1" />
                            Only {book.quantity} left
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            ${book.price}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                          Critical
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">All good!</h3>
                  <p className="text-sm text-gray-500">No low stock items at the moment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 