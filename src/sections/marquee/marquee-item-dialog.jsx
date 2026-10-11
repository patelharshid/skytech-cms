import React, { useState, useEffect } from 'react';
import { Modal } from 'src/components/modal';

export function MarqueeItemDialog({ isOpen, onClose, onSubmit, item }) {
  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setIsActive(typeof item.isActive !== 'undefined' ? item.isActive : true);
    } else {
      setTitle('');
      setIsActive(true);
    }
  }, [item, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      isActive,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Announcement' : 'New Header Marquee Announcement'}
      footer={
        <>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            id="modal-submit-marquee"
          >
            {item ? 'Save Changes' : 'Publish Announcement'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="marquee-title-input">
            Announcement Text / Headline
          </label>
          <textarea
            id="marquee-title-input"
            className="form-textarea"
            placeholder="e.g. ⚡ Special Offer: Free Antivirus & Laptop Bag on Refurbished Laptops!"
            rows={4}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <small className="form-hint">
            This message will roll across the top ticker header on the live store in real time.
          </small>
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label">Status on Public Website</label>
          <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="radio"
                name="marquee-status"
                checked={isActive === true}
                onChange={() => setIsActive(true)}
              />
              <span className="badge badge-success">Active (Visible)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="radio"
                name="marquee-status"
                checked={isActive === false}
                onChange={() => setIsActive(false)}
              />
              <span className="badge badge-inactive">Inactive (Hidden)</span>
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default MarqueeItemDialog;
