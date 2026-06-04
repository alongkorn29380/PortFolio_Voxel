import { useState, useEffect } from 'react'
import '../MarkerModal.css'

const FULL_TEXT =
        'ภูมิประเทศ \n\nจำลองการสร้างภูมิประเทศโดยการออกแบบตามสีของ RGB โดยจะแบ่งแยกลักษณะภูมิประเทศเป็นแต่ละสี โดยสีแดงจะเปรียบเสหมือนเป็นพื้นดิน สีฟ้าคือแม่น้ำ แล้วสีเขียนคือหญ้า จากนั้นมีระบบกลางันกลางคืน และพุ่มไม้'
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
                    <button className="tab active">⛰</button>
                    <button className="tab tab-close" onClick={onClose}>❌</button>
                </div>

                <div className="modal-body">
                    <div className="modal-image">
                        <img src="../Images/Old_Terrain.png" alt="Preview" />
                    </div>

                    <div className="modal-text">
                        <h1 className="modal-title">OLD TERRAIN</h1>

                        <p className="modal-typewriter">
                            {FULL_TEXT.slice(0, revealed)}
                        </p>

                        {done && (
                            <a
                                className="modal-link"
                                href="https://portfolio-terrain.netlify.app/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                คลิ๊กที่นี่เพื่อรับชม Old Terrain
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
