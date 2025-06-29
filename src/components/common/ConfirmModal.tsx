"use client"

import Modal from "./Modal"

interface ConfirmModalProps {
  isOpen: boolean
  message: string
  onConfirm: () => void
  onClose: () => void
  dataCy?: string
  isLoading?: boolean
}

export default function ConfirmModal({ isOpen, message, onConfirm, onClose, dataCy, isLoading = false }: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title="확인" dataCy={dataCy}>
      <div className="flex flex-col gap-4">
        <Modal.Text variant="body">{message}</Modal.Text>
        <div className="flex gap-4 justify-end">
          <Modal.Button variant="secondary" onClick={onClose} dataCy="cancel-button">
            취소
          </Modal.Button>
          <Modal.Button variant="primary" onClick={onConfirm} dataCy="confirm-button" isLoading={isLoading}>
            확인
          </Modal.Button>
        </div>
      </div>
    </Modal>
  )
}
