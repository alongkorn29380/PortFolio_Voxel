import { useState, useEffect } from 'react'
import '../MarkerModal.css'

const FULL_TEXT =
    'ระบบแขนกลหยิบจับวัดถุตามความประสงค์ของผู้ใช้งาน \n\n โดยการทำงานจะแบ่งเป็น 2 แบบ คือ \n\n 1. การคสบคุมด้วยมือ (Manual Control) : ผู้ใช้งานสามารถเลือกแทบองศาของ Servo Motor ได้ตามต้องการ โดยสามารถปรับแต่งได้มากถึง 6 DOF (Degrees of Freedom) ซึ่งจะช่วยให้สามารถควบคุมการเคลื่อนไหวของแขนกลได้อย่างแม่นยำและหลากหลายรูปแบบ \n\n 2. การหยิบจับสิ่งของ ( Object Detection ) : จะมีการเทรนรูปวัตถุตามความต้องการของผู้ใช้งาน จากนั้นนำ model AI มาใช้งานโดยแทรกสิ่งของเพื่อให้กล้องมองเห็นจากนั้นสามารถเลือกหยิบจับวัตถุได้ตามความต้องการของผู้ใช้งาน \n\n'
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
                    <button className="tab active">🦾</button>
                    <button className="tab tab-close" onClick={onClose}>❌</button>
                </div>

                <div className="modal-body">
                    <div className="modal-image">
                        <img src="../Images/Arm_Robotic.jpg" alt="Preview" />
                    </div>

                    <div className="modal-text">
                        <h1 className="modal-title">ARM ROBOTIC</h1>

                        <p className="modal-typewriter">
                            {FULL_TEXT.slice(0, revealed)}
                        </p>

                        {done && (
                            <a
                                className="modal-link"
                                href="https://project-final-gg.vercel.app/Dashboard"
                                target="_blank"
                                rel="noreferrer"
                            >
                                คลิ๊กที่นี่เพื่อรับชม Arm Robotic
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
