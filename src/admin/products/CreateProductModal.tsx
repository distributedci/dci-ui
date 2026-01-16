import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from "@patternfly/react-core";
import ProductForm from "./ProductForm";
import type { IProduct } from "types";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Partial<IProduct>) => void;
}

export default function CreateProductModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateProductModalProps) {
  return (
    <Modal
      id="create_product_modal"
      aria-label="Create product modal"
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader title="Create a new product" />
      <ModalBody>
        <ProductForm
          id="create-product-form"
          onSubmit={(product) => {
            onClose();
            onSubmit(product);
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          key="create"
          variant="primary"
          type="submit"
          form="create-product-form"
        >
          Create
        </Button>
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
