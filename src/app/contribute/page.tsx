'use client'

import { useState } from 'react'
import { PageShell } from '@/components/PageShell'
import { Upload } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Contribute() {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [barcode, setBarcode] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !barcode.trim()) {
      toast.error('Product name and barcode are required')
      return
    }
    if (!/^\d{8,13}$/.test(barcode.trim())) {
      toast.error('Barcode must be 8-13 digits')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/products/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, brand, barcode }),
      })
      if (res.ok) {
        toast.success('Product submitted!')
        setName('')
        setBrand('')
        setBarcode('')
      } else {
        toast.error('Submission failed')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageShell title="Contribute" showBack>
      <div className="empty-state__icon" style={{ margin: '0 auto 16px' }}><Upload size={24} /></div>
      <p className="text-sm" style={{ textAlign: 'center', color: 'var(--sand)', marginBottom: 24 }}>
        Help us grow our database by submitting a product we don&apos;t have yet.
      </p>
      <form onSubmit={handleSubmit} className="stack--md">
        <div className="input-group">
          <label className="input-label">Product Name *</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Maggi Noodles" />
        </div>
        <div className="input-group">
          <label className="input-label">Brand</label>
          <input className="input" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Nestlé" />
        </div>
        <div className="input-group">
          <label className="input-label">Barcode *</label>
          <input className="input" value={barcode} onChange={(e) => setBarcode(e.target.value)} inputMode="numeric" maxLength={13} placeholder="e.g. 8901234567890" />
        </div>
        <button type="submit" className="btn btn--primary btn--full" disabled={submitting} style={{ opacity: submitting ? 0.6 : 1 }}>
          {submitting ? 'Submitting...' : 'Submit Product'}
        </button>
      </form>
    </PageShell>
  )
}
