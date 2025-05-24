"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import Loader from './Loader';

const Service = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editMode, setEditMode] = useState(null); // 'service', 'card', 'detail', 'newService'
  const [editForm, setEditForm] = useState({});
  
  const user = useUser();
  const isAdmin = user?.isAdmin || false;
  const pathname = usePathname();

  useEffect(() => {
    fetchService();
  }, []);

  useEffect(() => {
    if (data?.cards?.length > 0 && !selectedCard) {
      setSelectedCard(data.cards[0]);
    }
  }, [data, selectedCard]);

  async function fetchService() {
    setLoading(true);
    try {
      const res = await fetch('/api/service');
      const response = await res.json();
      setData(response.service);
    } catch (err) {
      console.error('Failed to fetch service', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        await fetchService();
        setEditMode(null);
        setEditForm({});
      } else {
        alert('Failed to update');
      }
    } catch (err) {
      alert('Failed to update service');
    }
  }

  function openServiceEdit() {
    setEditMode('service');
    setEditForm({
      imageLink: data.imageLink || '',
      para: {
        content: data.para?.content || '',
        link: data.para?.link || '',
      },
      cards: data.cards || [],
    });
  }

  function openCardEdit(cardIndex) {
    setEditMode('card');
    setEditForm({
      ...data,
      cardIndex,
      cardText: data.cards[cardIndex]?.text || '',
    });
  }

  function openDetailEdit(cardIndex, detailIndex) {
    setEditMode('detail');
    setEditForm({
      ...data,
      cardIndex,
      detailIndex,
      heading: data.cards[cardIndex]?.detail[detailIndex]?.heading || '',
      para: data.cards[cardIndex]?.detail[detailIndex]?.para || '',
      link: data.cards[cardIndex]?.detail[detailIndex]?.link || '',
    });
  }

  function openNewServiceModal() {
    setEditMode('newService');
    setEditForm({
      cardText: '',
      details: [{
        heading: '',
        para: '',
        link: ''
      }]
    });
  }

  function addDetailToNewService() {
    setEditForm({
      ...editForm,
      details: [...editForm.details, {
        heading: '',
        para: '',
        link: ''
      }]
    });
  }

  function removeDetailFromNewService(index) {
    if (editForm.details.length > 1) {
      const newDetails = editForm.details.filter((_, i) => i !== index);
      setEditForm({
        ...editForm,
        details: newDetails
      });
    }
  }

  function updateNewServiceDetail(index, field, value) {
    const newDetails = [...editForm.details];
    newDetails[index][field] = value;
    setEditForm({
      ...editForm,
      details: newDetails
    });
  }

  async function handleCreateNewService(e) {
    e.preventDefault();
    
    if (!editForm.cardText.trim()) {
      alert('Please enter a service name');
      return;
    }

    const hasValidDetails = editForm.details.some(detail => 
      detail.heading.trim() && detail.para.trim() && detail.link.trim()
    );

    if (!hasValidDetails) {
      alert('Please fill in at least one complete detail (heading, description, and link)');
      return;
    }

    const validDetails = editForm.details.filter(detail => 
      detail.heading.trim() && detail.para.trim() && detail.link.trim()
    );

    const newCard = {
      text: editForm.cardText.trim(),
      detail: validDetails
    };

    const updatedData = {
      ...data,
      cards: [...(data.cards || []), newCard]
    };

    try {
      const res = await fetch('/api/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        await fetchService();
        setEditMode(null);
        setEditForm({});
      } else {
        alert('Failed to create new service');
      }
    } catch (err) {
      alert('Failed to create new service');
    }
  }

  function addNewDetail(cardIndex) {
    const updatedData = { ...data };
    updatedData.cards[cardIndex].detail.push({
      heading: 'New Detail',
      para: 'New detail description',
      link: 'example.com'
    });
    setEditForm(updatedData);
    handleUpdateData(updatedData);
  }

  function deleteCard(cardIndex) {
    if (confirm('Are you sure you want to delete this card?')) {
      const updatedData = { ...data };
      updatedData.cards.splice(cardIndex, 1);
      setEditForm(updatedData);
      handleUpdateData(updatedData);
      if (selectedCard === data.cards[cardIndex] && updatedData.cards.length > 0) {
        setSelectedCard(updatedData.cards[0]);
      }
    }
  }

  function deleteDetail(cardIndex, detailIndex) {
    if (confirm('Are you sure you want to delete this detail?')) {
      const updatedData = { ...data };
      updatedData.cards[cardIndex].detail.splice(detailIndex, 1);
      setEditForm(updatedData);
      handleUpdateData(updatedData);
    }
  }

  async function handleUpdateData(updatedData) {
    try {
      const res = await fetch('/api/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        await fetchService();
      }
    } catch (err) {
      console.error('Failed to update');
    }
  }

  function closeEdit() {
    setEditMode(null);
    setEditForm({});
  }

  if (loading) {
    return <Loader />;
  }

  function normalizeExternalUrl(url) {
    return /^https?:\/\//.test(url) ? url : `https://${url}`;
  }

  if (!data) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">No service data found</p>
        {isAdmin && pathname.startsWith('/admin') && (
          <button
            onClick={() => {
              setEditMode('service');
              setEditForm({
                imageLink: '',
                para: { content: '', link: '' },
                cards: []
              });
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Create Service
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-[90%] md:w-[80%]">
      {/* Main Service Section */}
      <div className="flex gap-4 mb-10 relative">
        {isAdmin && pathname.startsWith('/admin') && (
          <button
            onClick={openServiceEdit}
            className="absolute -top-2 -right-2 text-xs text-gray-400 hover:text-purple-500 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm border z-10"
          >
            ✎
          </button>
        )}
        
        <a href={normalizeExternalUrl(data.imageLink)}>
          <Image
            src="/button.png"
            width={150}
            height={100}
            className="h-[100px]"
            alt="Header"
          />
        </a>

        <a
          href={normalizeExternalUrl(data.para?.link)}
          className="w-[80%] flex items-center px-4 py-3 text-white rounded-[4px] text-sm sm:text-base h-[100px] bg-[#9f379d] hover:bg-[#820486] transition"
        >
          {data.para?.content}
        </a>
      </div>

      {/* Cards Section */}
      <div className="flex items-center flex-wrap gap-2 md:gap-6 relative">
        {isAdmin && pathname.startsWith('/admin') && (
          <button
            onClick={openNewServiceModal}
            className="absolute -top-2 -right-2 text-xs text-gray-400 hover:text-green-500 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm border z-10"
            title="Add New Service"
          >
            +
          </button>
        )}
        
        {data.cards?.map((card, i) => {
          const isSelected = selectedCard?.text === card.text;
          return (
            <div key={i} className="relative">
              <button
                onClick={() => setSelectedCard(card)}
                style={{
                  backgroundColor: isSelected ? "white" : "rgb(130, 4, 134)",
                  color: isSelected ? "rgb(130, 4, 134)" : "white",
                  border: "2px solid rgb(130, 4, 134)",
                }}
                className="relative px-2 py-1 md:px-4 md:py-2 rounded-[4px] font-semibold transition-colors hover:bg-[#9f379d]"
              >
                {card.text}
              </button>
              
              {isAdmin && pathname.startsWith('/admin') && (
                <div className="absolute -top-2 -right-2 flex gap-1">
                  <button
                    onClick={() => openCardEdit(i)}
                    className="text-xs text-gray-400 hover:text-purple-500 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm border"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => deleteCard(i)}
                    className="text-xs text-gray-400 hover:text-red-500 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm border"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Card Display */}
      {selectedCard && (
        <div className="my-5 md:my-20 flex justify-center items-center">
          <button
            style={{
              backgroundColor: "white",
              color: "black",
              border: "2px solid black",
            }}
            className="relative px-2 py-1 md:px-4 md:py-2 rounded-[4px] font-semibold transition-colors hover:bg-[#9f379d]"
          >
            {selectedCard.text}
          </button>
        </div>
      )}

      {/* Details Section */}
      {selectedCard && (
        <div className="mb-20 space-y-4 relative">
          {isAdmin && pathname.startsWith('/admin') && (
            <button
              onClick={() => addNewDetail(data.cards.findIndex(c => c.text === selectedCard.text))}
              className="absolute -top-2 -right-2 text-xs text-gray-400 hover:text-green-500 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm border z-10"
            >
              +
            </button>
          )}
          
          {selectedCard.detail?.map((detail, i) => (
            <div key={i} className="relative">
              <div className="flex flex-col w-full gap-[25px] sm:flex-row justify-between items-center p-2 border border-[#ff00a8] rounded-[6px] bg-white shadow-[0_2px_5px_#ff00a8] hover:shadow-[0_4px_7px_#ff00a8]">
                <span className="text-sm sm:text-base font-medium text-black text-center sm:text-left">
                  <span className="text-xl font-bold">{detail.heading}</span> - {detail.para}
                </span>
                <a
                  href={normalizeExternalUrl(detail.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 sm:mt-0"
                >
                  <button className="flex items-center gap-2 min-w-[30px] px-2 py-1 border text-pink-500 border-pink-500 rounded-[4px] font-semibold text-sm drop-shadow-[0_0_4px_rgba(255,0,150,0.7)] transition hover:bg-pink-500 hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-8 h-8"
                    >
                      <path d="M9.036 12.33l-.61 3.446c.873 0 1.253-.375 1.735-.823l2.348 1.73c.43.237.732.114.847-.398l1.537-7.26c.157-.693-.265-.967-.7-.798L6.81 11.09c-.687.267-.68.64.118.865l2.108.64 4.89-3.07-3.032 3.787-.858-.226z"></path>
                    </svg>
                    LINK
                  </button>
                </a>
              </div>
              
              {isAdmin && pathname.startsWith('/admin') && (
                <div className="absolute -top-2 -right-2 flex gap-1">
                  <button
                    onClick={() => openDetailEdit(data.cards.findIndex(c => c.text === selectedCard.text), i)}
                    className="text-xs text-gray-400 hover:text-purple-500 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm border"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => deleteDetail(data.cards.findIndex(c => c.text === selectedCard.text), i)}
                    className="text-xs text-gray-400 hover:text-red-500 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm border"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New Service Modal */}
      {editMode === 'newService' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Service</h2>
            <form onSubmit={handleCreateNewService} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name:</label>
                <input
                  type="text"
                  value={editForm.cardText || ''}
                  onChange={e => setEditForm({ ...editForm, cardText: e.target.value })}
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter service name"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">Service Details:</label>
                  <button
                    type="button"
                    onClick={addDetailToNewService}
                    className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                  >
                    + Add Detail
                  </button>
                </div>
                
                {editForm.details?.map((detail, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
                    {editForm.details.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDetailFromNewService(index)}
                        className="absolute -top-2 -right-2 text-xs text-gray-400 hover:text-red-500 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm border"
                      >
                        ×
                      </button>
                    )}
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Heading:</label>
                        <input
                          type="text"
                          value={detail.heading}
                          onChange={e => updateNewServiceDetail(index, 'heading', e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter heading"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description:</label>
                        <textarea
                          value={detail.para}
                          onChange={e => updateNewServiceDetail(index, 'para', e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          rows={2}
                          placeholder="Enter description"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Link:</label>
                        <input
                          type="text"
                          value={detail.link}
                          onChange={e => updateNewServiceDetail(index, 'link', e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter link URL"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 font-medium"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modals (existing ones remain the same) */}
      {editMode === 'service' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Service</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Link:</label>
                <input
                  type="text"
                  value={editForm.imageLink || ''}
                  onChange={e => setEditForm({ ...editForm, imageLink: e.target.value })}
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Para Content:</label>
                <textarea
                  value={editForm.para?.content || ''}
                  onChange={e => setEditForm({ 
                    ...editForm, 
                    para: { ...editForm.para, content: e.target.value }
                  })}
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Para Link:</label>
                <input
                  type="text"
                  value={editForm.para?.link || ''}
                  onChange={e => setEditForm({ 
                    ...editForm, 
                    para: { ...editForm.para, link: e.target.value }
                  })}
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editMode === 'card' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Card</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Text:</label>
                <input
                  type="text"
                  value={editForm.cardText || ''}
                  onChange={e => {
                    const updatedData = { ...editForm };
                    updatedData.cards[editForm.cardIndex].text = e.target.value;
                    setEditForm({ ...updatedData, cardText: e.target.value });
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editMode === 'detail' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Detail</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading:</label>
                <input
                  type="text"
                  value={editForm.heading || ''}
                  onChange={e => {
                    const updatedData = { ...editForm };
                    updatedData.cards[editForm.cardIndex].detail[editForm.detailIndex].heading = e.target.value;
                    setEditForm({ ...updatedData, heading: e.target.value });
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description:</label>
                <textarea
                  value={editForm.para || ''}
                  onChange={e => {
                    const updatedData = { ...editForm };
                    updatedData.cards[editForm.cardIndex].detail[editForm.detailIndex].para = e.target.value;
                    setEditForm({ ...updatedData, para: e.target.value });
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link:</label>
                <input
                  type="text"
                  value={editForm.link || ''}
                  onChange={e => {
                    const updatedData = { ...editForm };
                    updatedData.cards[editForm.cardIndex].detail[editForm.detailIndex].link = e.target.value;
                    setEditForm({ ...updatedData, link: e.target.value });
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;