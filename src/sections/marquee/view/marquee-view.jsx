import React, { useState, useEffect, useCallback } from 'react';
import { Megaphone, Plus, Edit2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { apiService } from 'src/services/api-service';
import { MarqueeItemDialog } from '../marquee-item-dialog';

export function MarqueeView({
  items: propItems,
  onAdd: propOnAdd,
  onUpdate: propOnUpdate,
  loading: propLoading,
}) {
  const outletContext = useOutletContext();
  const showToast =
    outletContext && outletContext.showToast
      ? outletContext.showToast
      : (msg) => console.log(msg);
  const refreshBadge =
    outletContext && outletContext.refreshBadge
      ? outletContext.refreshBadge
      : () => { };

  const [items, setItems] = useState(propItems || []);
  const [loading, setLoading] = useState(typeof propLoading !== 'undefined' ? propLoading : true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Self load data if not provided via props
  const loadData = useCallback(async () => {
    if (propItems) return;
    setLoading(true);
    try {
      const res = await apiService.getTopMarquee();
      const data = res && res.data ? res.data : [];
      setItems(data);
    } catch (err) {
      console.error('Failed to load marquee data:', err);
      showToast('Error loading announcements', 'error');
    } finally {
      setLoading(false);
    }
  }, [propItems, showToast]);

  useEffect(() => {
    if (propItems) {
      setItems(propItems);
      if (typeof propLoading !== 'undefined') {
        setLoading(propLoading);
      }
    } else {
      loadData();
    }
  }, [propItems, propLoading, loadData]);

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDialogSubmit = async (formData) => {
    if (editingItem) {
      if (propOnUpdate) {
        propOnUpdate(editingItem.id, formData);
      } else {
        try {
          await apiService.updateMarquee(editingItem.id, formData);
          setItems((prev) =>
            prev.map((m) => (m.id === editingItem.id ? { ...m, ...formData } : m))
          );
          refreshBadge();
          showToast('Announcement updated successfully', 'success');
        } catch {
          showToast('Failed to update announcement', 'error');
        }
      }
    } else {
      if (propOnAdd) {
        propOnAdd(formData);
      } else {
        try {
          const res = await apiService.createMarquee(formData);
          const isLive = res && res.source === 'backend';
          setItems((prev) => [res.data, ...prev]);
          refreshBadge();
          showToast(
            isLive
              ? 'Published announcement to Spring Boot backend!'
              : 'Saved announcement to local storage',
            'success'
          );
        } catch {
          showToast('Failed to add announcement', 'error');
        }
      }
    }
    setIsModalOpen(false);
  };

  const handleToggleActive = async (item, checked) => {
    if (propOnUpdate) {
      propOnUpdate(item.id, { ...item, isActive: checked });
    } else {
      try {
        await apiService.updateMarquee(item.id, { ...item, isActive: checked });
        setItems((prev) =>
          prev.map((m) => (m.id === item.id ? { ...m, isActive: checked } : m))
        );
        refreshBadge();
        showToast('Updated announcement visibility', 'success');
      } catch {
        showToast('Failed to toggle status', 'error');
      }
    }
  };

  const activeItems = items.filter((i) => i.isActive);
  const tickerText =
    activeItems.map((m) => m.title).join('   •   ') || 'No active announcements right now.';

  return (
    <div id="view-marquee">
      <div className="cms-card">
        <div className="cms-card-header">
          <div>
            <h2 className="cms-card-title">Top Marquee Announcements</h2>
            <p className="cms-card-subtitle">
              Manage live announcement ticker on the header across the entire website
            </p>
          </div>
          <button
            id="btn-add-marquee"
            className="btn btn-primary"
            onClick={openAddModal}
            type="button"
          >
            <Plus size={16} />
            <span>Add Announcement</span>
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading announcements...
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <Megaphone size={36} style={{ marginBottom: '12px', opacity: 0.4 }} />
            <p>No marquee announcements found. Click "Add Announcement" to create one.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="cms-table" id="marquee-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#ID</th>
                  <th>Announcement Text</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Active Status</th>
                  <th style={{ width: '80px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id || index} id={`marquee-row-${item.id}`}>
                    <td style={{ fontWeight: '600', color: 'var(--text-muted)' }}>
                      #{item.id}
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                      {item.title}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={Boolean(item.isActive)}
                          onChange={(e) => handleToggleActive(item, e.target.checked)}
                          id={`toggle-active-${item.id}`}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm btn-icon"
                          onClick={() => openEditModal(item)}
                          title="Edit announcement"
                          id={`btn-edit-marquee-${item.id}`}
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MarqueeItemDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleDialogSubmit}
        item={editingItem}
      />
    </div>
  );
}

export default MarqueeView;
