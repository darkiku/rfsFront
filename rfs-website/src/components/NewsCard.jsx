import React from 'react';

const NewsCard = ({ newsItem, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">{newsItem.titleRu}</h3>
          <p className="text-gray-600 text-sm mb-2">{newsItem.shortDescriptionRu}</p>
          <p className="text-gray-400 text-xs">
            {new Date(newsItem.publishedDate).toLocaleDateString('ru-RU')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(newsItem)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Редактировать
          </button>
          <button
            onClick={() => onDelete(newsItem.id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;