import { useState, useEffect } from 'react'
import '../MarkerModal.css'

const FULL_TEXT =
        'การ์ดวันคริสต์มาส  \n\nเว็บไซด์ที่ออกแบบมาสำหรับ 2 โหมดการทำงานคือ  \n\n1.Marry Christmas : ที่ให้โทนสีขาวเหมือนกับหิมะขาวสะอาดดูง่าย และมีองค์ประกอบที่เหมาะกับวันคริสต์มาส \n\n2.Happy New Year : ออกแบบให้อยู่ในโทนสีน้ำตาลให้ดูเข้มตัดกับสีขาวเหมือนกับซองจดหมายอวยพรปีใหม่'
export default function MarkerModal({ onClose }) {
    const [revealed, setRevealed] = useState(0)
    const done = revealed >= FULL_TEXT.length

    useEffect(() => {
        if (done) return
        const id = setInterval(() =>
            setRevealed((r) => Math.min(r + 2, FULL_TEXT.length))
        , 20)
        return () => clearInterval(id)
    }, [done])

    useEffect(() => {
        const onKey = (e) => {
            if (e.code !== 'Enter') return
            e.stopImmediatePropagation()
            if (!done) setRevealed(FULL_TEXT.length)
            else onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [done, onClose])

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-panel" onClick={(e) => e.stopPropagation()}>

                <div className="modal-tabs">
                    <button className="tab active">🎄</button>
                    <button className="tab tab-close" onClick={onClose}>❌</button>
                </div>

                <div className="modal-body">
                    <div className="modal-image">
                        <img src="../Images/Christmas.png" alt="Preview" />
                    </div>

                    <div className="modal-text">
                        <h1 className="modal-title">CHRISTMAS CARD</h1>

                        <p className="modal-typewriter">
                            {FULL_TEXT.slice(0, revealed)}
                        </p>

                        {done && (
                            <a
                                className="modal-link"
                                href="https://card-christmas-pi.vercel.app/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                คลิ๊กที่นี่เพื่อรับชม Christmas Card
                            </a>
                        )}

                        {done
                            ? <p className="modal-enter-prompt">Press Enter to close</p>
                            : <p className="modal-enter-skip">Press Enter to skip</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
