import React, { Component } from "react";
import { connect } from "react-redux";
import FormModal from "../FormModal";
import { Button } from "@patternfly/react-core";
import Formsy from "formsy-react";
import { Input, Select, HiddenInput } from "../form";
import { getProducts } from "./productSelectors";
import { getTeams } from "../teams/teamsSelectors";
import { isEmpty } from "lodash";

export class ProductForm extends Component {
  constructor(props) {
    super(props);
    const initialProduct = { name: "" };
    this.state = {
      canSubmit: false,
      show: false,
      product: {
        ...initialProduct,
        ...this.props.product
      }
    };
  }

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  showModal = () => {
    this.setState({ show: true });
  };

  closeModal = () => {
    this.setState({ show: false });
  };

  render() {
    const {
      title,
      okButton,
      submit,
      className,
      showModalButton,
      teams
    } = this.props;
    const { canSubmit, show, product } = this.state;
    return (
      <React.Fragment>
        <FormModal
          title={title}
          okButton={okButton}
          formRef="product-form"
          canSubmit={canSubmit}
          show={show}
          close={this.closeModal}
        >
          <Formsy
            id="product-form"
            className="pf-c-form"
            onValidSubmit={product => {
              this.closeModal();
              submit(product);
            }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <HiddenInput
              id="product-form__etag"
              name="etag"
              value={product.etag}
            />
            <Input
              id="product-form__name"
              label="Name"
              name="name"
              value={product.name}
              required
            />
            <Input
              id="product-form__description"
              label="Description"
              name="description"
              value={product.description}
            />
            {isEmpty(teams) ? null : (
              <Select
                id="product-form__team"
                label="Team Owner"
                name="team_id"
                options={teams}
                value={product.team_id || teams[0].id}
                required
              />
            )}
          </Formsy>
        </FormModal>
        <Button
          variant="primary"
          className={className}
          onClick={this.showModal}
        >
          {showModalButton}
        </Button>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    products: getProducts(state),
    teams: getTeams(state)
  };
}

export default connect(mapStateToProps)(ProductForm);
