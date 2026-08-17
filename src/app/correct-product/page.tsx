'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageShell } from '@/components/PageShell'
import toast from 'react-hot-toast'

function CorrectForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const barcode = searchParams.get('barcode') ?? ''
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { toast.error('Product name is required'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/products/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode, name, brand }),
      })
      if (res.ok) {
        toast.success('Correction submitted')
        router.push('/scan')
      } else {
        toast.error('Failed')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="stack--md">
      <div className="input-group">
        <label className="input-label">Barcode</label>
        <input className="input" value={barcode} disabled />
      </div>
      <div className="input-group">
        <label className="input-label">Product Name *</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter correct name" />
      </div>
      <div className="input-group">
        <label className="input-label">Brand</label>
        <input className="input" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Enter correct brand" />
      </div>
      <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Correction'}
      </button>
    </form>
  )
}

export default function CorrectProduct() {
  return (
    <PageShell title="Correct Product" showBack>
      <p className="text-sm text-sand" style={{ marginBottom: 24 }}>
        We couldn&apos;t find this product. Help us improve the database by providing the correct details.
      </p>
      <Suspense fallback={null}>
        <CorrectForm />
      </Suspense>
    </PageShell>
  )
}
