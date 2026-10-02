import { Button, Spinner } from "@quickadui/core";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@quickadui/overlays";
import { truncateWords } from "@/utils/format";
import type { HistoryItemDto } from "../types/History";

interface DeleteTextDialogProps {
  item: HistoryItemDto | null;
  isPending: boolean;
  onConfirm: (item: HistoryItemDto) => void;
  onCancel: () => void;
}

export const DeleteTextDialog = ({ item, isPending, onConfirm, onCancel }: DeleteTextDialogProps) => (
  <Modal open={item !== null} onOpenChange={(open) => !open && !isPending && onCancel()}>
    <ModalContent>
      <ModalHeader>
        <ModalTitle>Supprimer ce texte ?</ModalTitle>
        <ModalDescription>
          « {item ? truncateWords(item.original_text, 12) : ""} » et sa correction seront définitivement supprimés.
          Vos statistiques seront recalculées.
        </ModalDescription>
      </ModalHeader>
      <ModalFooter>
        <Button variant="outline" onClick={onCancel} disabled={isPending}>
          Annuler
        </Button>
        <Button variant="destructive" onClick={() => item && onConfirm(item)} disabled={isPending}>
          {isPending && <Spinner size="sm" label="Suppression en cours" />}
          Supprimer
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
