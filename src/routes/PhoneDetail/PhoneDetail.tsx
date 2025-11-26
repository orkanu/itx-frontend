import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { tanstackQueryClient } from '@/tanstackQueryClient.ts'
import { fetchPhoneById } from "@/services/phoneById.ts";
import { addToBasket } from "@/services/addToBasket.ts";
import useBasketStore from "@/store/basket.ts";
import './phoneDetail.css'

export async function phoneDetailsLoader({ params }: any) {
  const id = params.id
  if (!id) throw new Error('Missing id')
  return tanstackQueryClient.fetchQuery({ queryKey: ['phone', id], queryFn: () => fetchPhoneById(id) })
}

const PhoneDetail = (): React.JSX.Element => {
  const { id } = useParams()
  if (!id) return <div>Missing id</div>

  const { data, isLoading, error } = useQuery({ queryKey: ['phone', id], queryFn: () => fetchPhoneById(id) })
  const addToBasketCount = useBasketStore(state => state.add)
  const setCount = useBasketStore(state => state.set)
  const [selectedColor, setSelectedColor] = useState<number | null>(null)
  const [selectedStorage, setSelectedStorage] = useState<number | null>(null)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string>('')

  // Auto-select single available options for accessibility & convenience
  useEffect(() => {
    const colors = data?.options?.colors ?? []
    const storages = data?.options?.storages ?? []
    if (selectedColor === null && Array.isArray(colors) && colors.length === 1) {
      setSelectedColor(colors[0].code)
    }
    if (selectedStorage === null && Array.isArray(storages) && storages.length === 1) {
      setSelectedStorage(storages[0].code)
    }
    // Depend on data and selected states; effect is called every render but guards prevent unnecessary sets
  }, [data, selectedColor, selectedStorage])

  if (isLoading) return <div role="status" aria-live="polite">Loading…</div>
  if (error) return <div role="alert">Error loading phone</div>
  if (!data) return <div>No phone found</div>

  const phone = data

  const handleAdd = async () => {
    if (selectedColor === null || selectedStorage === null) {
      setAddError('Please select a color and a storage option before adding to basket.')
      return
    }
    // Clear any previous error before attempting to add
    setAddError('')
    setAdding(true)
    try {
      const resp = await addToBasket({ id: phone.id, colorCode: selectedColor, storageCode: selectedStorage })
      if (resp) {
        setCount(resp.count)
      } else {
        addToBasketCount(1)
      }
      // Ensure error is cleared after a successful add
      setAddError('')
    } catch (err) {
      setAddError('Failed to add to basket. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <>
      <div role="region" aria-labelledby="phone-details-heading">
        <h2 id="phone-details-heading">Details</h2>
      </div>
      <div className="details" aria-describedby={addError ? 'add-to-basket-error' : undefined}>
        <img src={phone.imgUrl} alt={`${phone.brand} ${phone.model}`} className="details-img" />
        <div className="details-meta">
          <h2>{phone.brand} {phone.model}</h2>

          <section className="specs">
            <h3>Specifications</h3>
            <ul>
              <li><strong>CPU:</strong> {phone.cpu}</li>
              <li><strong>RAM:</strong> {phone.ram}</li>
              <li><strong>OS:</strong> {phone.os}</li>
              <li><strong>Display:</strong> {phone.displaySize} • {phone.displayResolution}</li>
              <li><strong>Battery:</strong> {phone.battery}</li>
              <li><strong>Camera (primary):</strong> {phone.primaryCamera}</li>
              <li><strong>Camera (secondary):</strong> {phone.secondaryCmera}</li>
              <li><strong>Dimensions:</strong> {phone.dimentions}</li>
              <li><strong>Weight:</strong> {phone.weight}</li>
            </ul>
          </section>

          <div className="options">
            <div role="group" aria-labelledby="colors-heading">
              <h4 id="colors-heading">Colors</h4>
              <div className="option-list">
                {phone.options?.colors?.map((c: any) => (
                  <button
                    key={c.code}
                    className={`option ${selectedColor === c.code ? 'active' : ''}`}
                    aria-pressed={selectedColor === c.code}
                    aria-label={`Select color ${c.name}`}
                    onClick={() => {
                      setSelectedColor(c.code)
                      setAddError('')
                    }}
                  >{c.name}</button>
                ))}
              </div>
            </div>

            <div role="group" aria-labelledby="storages-heading">
              <h4 id="storages-heading">Storages</h4>
              <div className="option-list">
                {phone.options?.storages?.map((s: any) => (
                  <button
                    key={s.code}
                    className={`option ${selectedStorage === s.code ? 'active' : ''}`}
                    aria-pressed={selectedStorage === s.code}
                    aria-label={`Select storage ${s.name}`}
                    onClick={() => {
                      setSelectedStorage(s.code)
                      setAddError('')
                    }}
                  >{s.name}</button>
                ))}
              </div>
            </div>
          </div>

          <p className="price">€{phone.price}</p>

          <div>
            <button
              className="add-btn"
              onClick={handleAdd}
              disabled={adding}
              aria-describedby={addError ? 'add-to-basket-error' : undefined}
              aria-busy={adding || undefined}
            >
              {adding ? 'Adding…' : 'Add to basket'}
            </button>
            {addError && (
              <p id="add-to-basket-error" className="form-error" role="alert" aria-live="polite">{addError}</p>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

export default PhoneDetail;
