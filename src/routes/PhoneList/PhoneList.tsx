import React, {useState, useEffect, useMemo } from 'react'
import { Link} from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchListPhones } from '@/services/phonesListService.ts'
import { tanstackQueryClient } from '@/tanstackQueryClient.ts'
import './phonesList.css'
import Controls from "@/routes/PhoneList/Controls.tsx";
import Card from "@/components/ui/card.tsx";

// React Router loader that primes the query cache
export async function phonesLoader() {
  // prime the cache using the shared tanstackQueryClient
  return tanstackQueryClient.fetchQuery({ queryKey: ['phones'], queryFn: fetchListPhones })
}

const PhonesList = () => {
  // useQuery reuses the data cached initially on the loader
  const { data, isLoading, isError, error, refetch } = useQuery({ queryKey: ['phones'], queryFn: fetchListPhones })
  const [filter, setFilter] = useState('')
  const [debounced, setDebounced] = useState('')

  // Debounce filter input
  useEffect(() => {
    const id = setTimeout(() => setDebounced(filter), 300)
    return () => clearTimeout(id)
  }, [filter])

  const filtered = useMemo(() => {
    if (debounced.length < 3) return data ?? []
    const q = debounced.toLowerCase()
    return (data ?? []).filter((p: any) =>
      p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q)
    )
  }, [data, debounced])

  if (isLoading) {
    return (
      <>
        <Controls value={filter} setValue={setFilter} />
        <p role="status" aria-live="polite">Loading phones…</p>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <Controls value={filter} setValue={setFilter} />
        <div role="alert">
          <p>Failed to load phones{error instanceof Error && error.message ? `: ${error.message}` : ''}</p>
          <button onClick={() => refetch()} aria-label="Retry fetch">Retry</button>
        </div>
      </>
    )
  }
  return (
    <>
      <Controls value={filter} setValue={setFilter} />
      <div
        className="list"
        role="list"
        aria-describedby="phones-results-summary"
      >
        {Array.isArray(data) && data.length === 0 ? (
          <p role="status" aria-live="polite">No phones found.</p>
        ) : filtered.length === 0 && debounced.length >= 3 ? (
          <p role="status" aria-live="polite">No matches for "{debounced}".</p>
        ) : (
          <>
            <p
              id="phones-results-summary"
              style={{
                position: 'absolute',
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: 'hidden',
                clip: 'rect(0 0 0 0)',
                whiteSpace: 'nowrap',
                border: 0,
              }}
            >
              {filtered.length} phone{filtered.length === 1 ? '' : 's'} shown.
            </p>
            {filtered.map((phone: any) => (
              <Card key={phone.id} role="listitem" aria-label={`${phone.brand} ${phone.model}`}>
                <img src={phone.imgUrl} alt={`${phone.brand} ${phone.model}`} className="phone__img" />
                <div className="meta">
                  <div className="brand__model">
                    <p>{phone.brand}</p>
                    <p>{phone.model}</p>
                  </div>
                  <p className="price">€{phone.price || '-' }</p>
                  <Link
                    to={`/phone/${phone.id}`}
                    className="details-link"
                    aria-label={`View details for ${phone.brand} ${phone.model}`}
                  >
                    View details
                  </Link>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default PhonesList
