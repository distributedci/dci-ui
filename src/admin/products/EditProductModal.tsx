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

interface EditProductModalProps {
  product: IProduct;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: IProduct | Partial<IProduct>) => void;
}

export default function EditProductModal({
  product,
  isOpen,
  onClose,
  onSubmit,
}: EditProductModalProps) {
  return (
    <Modal
      id="edit_product_modal"
      aria-label="Edit product modal"
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader title={`Edit ${product.name}`} />
      <ModalBody>
        <ProductForm
          id="edit-product-form"
          product={product}
          onSubmit={(editedProduct) => {
            // why ? dci-control-server api doesnt accept extra field like from_now
            const { id, etag, name, description } =
              editedProduct as Partial<IProduct>;
            onClose();
            onSubmit({
              id,
              etag,
              name,
              description,
            });
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          key="edit"
          variant="primary"
          type="submit"
          form="edit-product-form"
        >
          Edit
        </Button>
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
