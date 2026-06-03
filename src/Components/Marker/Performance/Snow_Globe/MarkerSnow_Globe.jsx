import { useState, useEffect } from 'react'
import '../MarkerModal.css'

const FULL_TEXT =
        'Snow Globe  \n\nว็บไซต์จำลองการ์ดอวยพรในรูปแบบ 3 มิติเชิงปฏิสัมพันธ์ (Interactive 3D Greeting Card) ต้อนรับเทศกาลคริสต์มาส โดยตัวเว็บถูกออกแบบมาเพื่อสร้างประสบการณ์ดิจิทัลแนวใหม่ที่ผู้ใช้งานสามารถเข้ามามีส่วนร่วมกับชิ้นงานได้โดยตรง นอกเหนือจากความสวยงามของฉากจำลองแล้ว ระบบยังรองรับฟังก์ชันการปรับแต่งองค์ประกอบหลักแบบเรียลไทม์ โดยผู้ใช้สามารถเลือกสลับโทนสีของลูกบอลประดับ (Ornaments) รวมถึงปรับเปลี่ยนเฉดสีและความสว่างของไฟประดับบนต้นคริสต์มาสได้อย่างอิสระตามจินตนาการ \n\n'
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
                    <button className="tab active">🔮</button>
                    <button className="tab tab-close" onClick={onClose}>❌</button>
                </div>

                <div className="modal-body">
                    <div className="modal-image">
                        <img src="../Images/Snow_Globe.png" alt="Preview" />
                    </div>

                    <div className="modal-text">
                        <h1 className="modal-title">Snow Globe</h1>

                        <p className="modal-typewriter">
                            {FULL_TEXT.slice(0, revealed)}
                        </p>

                        {done && (
                            <a
                                className="modal-link"
                                href="https://christmas-2026.netlify.app/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                คลิ๊กที่นี่เพื่อรับชม Snow Globe 
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
